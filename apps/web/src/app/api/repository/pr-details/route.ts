import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository';
import { DatabaseService } from '@/lib/database';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

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
    
    console.log(`Fetching PR details for ${platform}/${owner}/${repo}#${prNumber} - fixed version`);
    
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to access PR details.' },
        { status: 401 }
      );
    }
    
    console.log('Session found, fetching auth details...');
    
    // Extract tokens from user session for different providers
    const provider_token = session.provider_token;
    const user_metadata = session.user?.user_metadata || {};
    
    // Auth details for logging
    const authDetails = {
      provider: session.user?.app_metadata?.provider || '',
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
    // This helps with cross-platform access scenarios
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
      
      // Try to get real PR details from the API with improved error handling
      try {
        console.log(`Attempting to fetch complete PR details for ${platform}/${owner}/${repo}#${prNumber}`);
        // Check if we have the right token for this platform
        const hasMatchingToken = (platform === 'github' && tokens.github) || (platform === 'gitlab' && tokens.gitlab);
        
        // For private repositories, we need the matching platform token
        if (hasMatchingToken) {
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
            
            // Cross-platform access security check
            if (accessCheck.private && session.user?.app_metadata?.provider !== platform) {
              console.log('SECURITY BLOCK: Cross-platform access to private repo not allowed');
              return NextResponse.json({
                success: false,
                error: 'PRIVATE_REPOSITORY_ACCESS_DENIED',
                message: `Cannot access private ${platform} repositories with ${session.user?.app_metadata?.provider} credentials.`
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
            // This ensures we have the most accurate data for private repositories
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
          } catch (prError) {
            console.error('Error getting PR details:', prError);
            console.log('Falling back to partial info...');
            throw prError; // Let the outer catch handle this
          }
        }
      } catch (allError) {
        console.error('All PR fetch approaches failed:', allError);
        console.log('Falling back to mock PR details');
        
        // Create more realistic dates for mock data
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        // Use repository information if available to improve mock data
        const mockTitle = repository ? `PR in ${repository.name}` : `Pull Request #${prNumber}`;
        const mockAuthor = repository ? repository.owner : owner;
        const mockBranch = repository ? repository.defaultBranch : 'main';
        
        // Log what we're sending back
        console.log('Returning mock PR details with known repository information');
        
        return NextResponse.json({
          success: true,
          prDetails: {
            title: mockTitle,
            repository: `${owner}/${repo}`,
            author: mockAuthor,
            createdAt: oneMonthAgo.toISOString(),
            updatedAt: twoWeeksAgo.toISOString(),
            filesChanged: 0, // Unknown
            linesAdded: 0,   // Unknown
            linesRemoved: 0, // Unknown
            branches: {
              source: 'feature-branch', // Mocked source branch
              target: mockBranch
            },
            state: 'open',
            isMock: true // Flag to indicate this is mock data
          }
        });
      }
    } catch (error) {
      console.error('Error generating PR details:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to get PR details',
        message: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in PR details endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}