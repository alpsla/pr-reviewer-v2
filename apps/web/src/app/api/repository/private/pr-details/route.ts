import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository';
import { DatabaseService } from '@/lib/database';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Private PR Details Endpoint
 * 
 * This endpoint handles PR details for private repositories or
 * for public repositories where the user wants authenticated access.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const prNumber = searchParams.get('prNumber');
    
    if (!platform || !owner || !repo || !prNumber) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    console.log(`[PRIVATE] Fetching PR details for ${platform}/${owner}/${repo}#${prNumber}`);
    
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const session = await supabase.auth.getSession();
    
    if (!session.data.session) {
      console.log('No authenticated session found - redirecting to public endpoint');
      
      // Redirect to public endpoint if not authenticated
      const publicEndpoint = `/api/repository/public/pr-details?platform=${platform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
      return Response.redirect(new URL(publicEndpoint, request.url));
    }
    
    console.log('Authenticated session found, proceeding with token extraction');
    
    // Add detailed session logging
    console.log('Session provider:', session.data.session.user?.app_metadata?.provider);
    console.log('Requested platform:', platform);
    console.log('Is same platform:', session.data.session.user?.app_metadata?.provider === platform);
    
    // Extract tokens from user session for different providers
    const provider_token = session.data.session.provider_token;
    const user_metadata = session.data.session.user?.user_metadata || {};
    
    // Auth details for logging
    const authDetails = {
      provider: session.data.session.user?.app_metadata?.provider || '',
      hasProviderToken: !!provider_token,
      tokenLength: provider_token?.length || 0,
      hasUserMetadataToken: !!(user_metadata.provider_token || user_metadata.access_token),
      identityData: !!(user_metadata.github_id || user_metadata.gitlab_id),
    };
    
    console.log('Auth details:', authDetails);
    
    // Get the appropriate token based on the provider and platform
    const tokens: { github?: string; gitlab?: string } = {};
    
    // First try to get the token directly matched to the requested platform
    if (platform === 'github') {
      tokens.github = provider_token || user_metadata.provider_token || user_metadata.access_token || user_metadata.github_token;
      console.log('Using GitHub token with length:', tokens.github?.length || 0);
    } else if (platform === 'gitlab') {
      tokens.gitlab = provider_token || user_metadata.provider_token || user_metadata.access_token || user_metadata.gitlab_token;
      console.log('Using GitLab token with length:', tokens.gitlab?.length || 0);
    }
    
    // If we don't have a token for the requested platform, try to get any available token as fallback
    if (platform === 'github' && !tokens.github && tokens.gitlab) {
      console.log('No GitHub token available, but using GitLab auth (cross-platform access)');
    } else if (platform === 'gitlab' && !tokens.gitlab && tokens.github) {
      console.log('No GitLab token available, but using GitHub auth (cross-platform access)');
    }
    
    // If we still don't have any tokens, try to find them in other places in the user metadata
    if (!tokens.github && !tokens.gitlab) {
      console.log('No direct tokens found, searching deeper in user metadata...');
      
      // Try to find any token in user metadata that might help
      Object.entries(user_metadata).forEach(([key, value]) => {
        if (typeof value === 'string' && key.includes('token')) {
          console.log(`Found potential token in user_metadata.${key}`);
          if (key.includes('github') || (!key.includes('gitlab') && !tokens.github)) {
            tokens.github = value;
            console.log('Using this as GitHub token');
          } else if (key.includes('gitlab') || (!key.includes('github') && !tokens.gitlab)) {
            tokens.gitlab = value;
            console.log('Using this as GitLab token');
          }
        }
      });
    }
    
    // If we still don't have matching tokens, redirect to the public endpoint
    const hasMatchingToken = (platform === 'github' && tokens.github) || (platform === 'gitlab' && tokens.gitlab);
    
    if (!hasMatchingToken) {
      console.log('No matching token found for platform, redirecting to public endpoint');
      const publicEndpoint = `/api/repository/public/pr-details?platform=${platform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
      return Response.redirect(new URL(publicEndpoint, request.url));
    }
    
    // Create database service
    const db = new DatabaseService(supabase);
    
    // Create repository service
    const repositoryService = new RepositoryService(db, tokens);
    
    // Try to construct PR details mock based on repository info
    const prNumberInt = parseInt(prNumber, 10);
    
    try {
      // Try to get real repository info first
      console.log(`Attempting to fetch repository details for ${platform}/${owner}/${repo}`);
      let repository;
      try {
        // Getting repository info might fail due to cross-platform access
        // We'll catch the error and continue with mocked data
        repository = await repositoryService.getRepository(
          platform as any, 
          owner, 
          repo
        );
        console.log('Successfully retrieved repository details');
      } catch (repoError) {
        console.error('Error fetching repository:', repoError);
        console.log('Continuing with partial info from params');
      }
      
      // Check if the repository is private
      let isPrivate = false;
      try {
        // First, check if we're dealing with a private repository
        console.log('Checking repository access and privacy status...');
        const accessCheck = await repositoryService.checkRepositoryAccess(
          platform as any,
          owner,
          repo
        );
        
        console.log('Access check results:', {
          hasAccess: accessCheck.hasAccess,
          isPrivate: accessCheck.private,
          permissions: accessCheck.permissions
        });
        
        isPrivate = accessCheck.private;
        
        // Special handling for public repositories
        if (!isPrivate) {
          console.log('Repository is PUBLIC - proceeding with regular PR fetching');
          // Continue with the code to fetch PR details
        } 
        // Special handling for private repositories with cross-platform access
        else if (isPrivate && session.data.session.user?.app_metadata?.provider !== platform) {
          console.log('SECURITY BLOCK: Cross-platform access to private repo not allowed');
          return NextResponse.json({
            success: false,
            error: 'PRIVATE_REPOSITORY_ACCESS_DENIED',
            message: `Cannot access private ${platform} repositories with ${session.data.session.user?.app_metadata?.provider} credentials.`
          }, { status: 403 });
        } 
        // Special handling for private repositories without access
        else if (isPrivate && !accessCheck.hasAccess) {
          console.log('ACCESS DENIED: No access to private repository');
          return NextResponse.json({
            success: false,
            error: 'REPOSITORY_ACCESS_DENIED',
            message: `You don't have access to the private repository ${owner}/${repo}.`
          }, { status: 403 });
        }
        
        // Now try to get the basic PR info
        console.log('Fetching basic PR information...');
        const prBasic = await repositoryService.getPullRequest(
          platform as any,
          owner,
          repo,
          prNumberInt
        );
        
        console.log('Successfully retrieved basic PR details:', { 
          title: prBasic.title,
          author: prBasic.author?.login,
          created: prBasic.createdAt,
          updated: prBasic.updatedAt
        });
        
        // Then get complete PR details with better error handling
        console.log('Fetching detailed PR information including files...');
        let filesChanged = 0;
        let linesAdded = 0;
        let linesRemoved = 0;
        let branches = {
          source: prBasic.headRef || 'unknown',
          target: prBasic.baseRef || 'main'
        };
        
        // First, make a direct API call to get the most accurate PR information
        try {
          console.log('Making direct API calls for accurate PR stats...');
          
          if (platform === 'github' && tokens.github) {
            // Use GitHub's API directly to get accurate file stats
            const githubFilesUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumberInt}/files`;
            console.log(`Fetching GitHub PR files: ${githubFilesUrl}`);
            
            // Use OAuth token for better rate limits and private repo access
            const fileResponse = await fetch(githubFilesUrl, {
              headers: { 'Authorization': `token ${tokens.github}` }
            });
            
            if (fileResponse.ok) {
              const files = await fileResponse.json();
              filesChanged = files.length;
              
              // Calculate lines added/removed
              files.forEach((file: any) => {
                linesAdded += file.additions || 0;
                linesRemoved += file.deletions || 0;
              });
              
              console.log(`Directly fetched ${filesChanged} files with ${linesAdded} lines added and ${linesRemoved} removed`);
            } else {
              console.warn(`Failed to fetch PR files: ${fileResponse.status}`);
              // Will fall back to the next method if this fails
            }
          }
        } catch (directApiError) {
          console.warn('Error fetching PR files directly:', directApiError);
        }
        
        // If direct API call failed, fall back to our standard method
        if (filesChanged === 0 && linesAdded === 0 && linesRemoved === 0) {
          try {
            console.log('Falling back to standard PR files fetching');
            const files = await repositoryService.getPullRequestFiles(
              platform as any,
              owner,
              repo,
              prNumberInt
            );
            
            filesChanged = files.length;
            files.forEach(file => {
              linesAdded += file.additions || 0;
              linesRemoved += file.deletions || 0;
            });
            
            console.log(`Fetched ${filesChanged} files with ${linesAdded} lines added and ${linesRemoved} removed`);
          } catch (filesError) {
            console.error('Error getting PR files:', filesError);
            // We'll use any values we can get from the basic PR info
          }
        }
        
        // Return with the best information we have
        return NextResponse.json({
          success: true,
          prDetails: {
            title: prBasic.title,
            repository: `${owner}/${repo}`,
            author: prBasic.author?.login || owner,
            createdAt: prBasic.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: prBasic.updatedAt?.toISOString() || new Date().toISOString(),
            filesChanged,
            linesAdded,
            linesRemoved,
            branches,
            state: prBasic.state || 'open',
            isPrivate: accessCheck.private
          }
        });
      } catch (accessError) {
        console.error('Error checking repository access:', accessError);
        
        // If we can't check access but the repository exists, try to continue
        if (repository) {
          console.log('Repository exists but access check failed - trying to continue');
          isPrivate = repository.private;
        } else {
          // If we can't check access and the repository doesn't exist, redirect to public endpoint
          console.log('Access check failed and repository not found - redirecting to public endpoint');
          const publicEndpoint = `/api/repository/public/pr-details?platform=${platform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
          return Response.redirect(new URL(publicEndpoint, request.url));
        }
      }
    } catch (allError) {
      console.error('All PR fetch approaches failed:', allError);
      
      // Redirect to public endpoint as a last resort
      console.log('All approaches failed - redirecting to public endpoint as last resort');
      const publicEndpoint = `/api/repository/public/pr-details?platform=${platform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
      return Response.redirect(new URL(publicEndpoint, request.url));
    }
  } catch (error) {
    console.error('Unhandled error in private PR details endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}