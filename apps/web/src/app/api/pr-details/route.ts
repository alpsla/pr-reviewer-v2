import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isPublicRepository, getAuthHeaders } from '@/lib/repository-utils';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * PR Details API
 * 
 * Fetches pull request details with proper handling for both public and private repositories.
 */
export async function GET(request: Request) {
  try {
    // Parse request parameters
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const prNumber = searchParams.get('prNumber');
    
    // Validate required parameters
    if (!platform || !owner || !repo || !prNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    console.log(`PR details request for ${platform}/${owner}/${repo}#${prNumber}`);
    
    // Check if the repository is public (this is the key step)
    const isPublic = await isPublicRepository(platform, owner, repo);
    console.log(`Repository ${owner}/${repo} is ${isPublic ? 'public' : 'private'}`);
    
    // Get authentication tokens from session (if available)
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const session = await supabase.auth.getSession();
    
    // Extract tokens from user session for different providers
    const tokens: { github?: string; gitlab?: string } = {};
    if (session.data.session) {
      const provider_token = session.data.session.provider_token;
      const user_metadata = session.data.session.user?.user_metadata || {};
      
      // First try to get the token directly matched to the requested platform
      if (platform === 'github') {
        tokens.github = provider_token || user_metadata.provider_token || user_metadata.access_token || user_metadata.github_token;
      } else if (platform === 'gitlab') {
        tokens.gitlab = provider_token || user_metadata.provider_token || user_metadata.access_token || user_metadata.gitlab_token;
      }
    }
    
    // If private repository but no matching token, return error
    if (!isPublic && !((platform === 'github' && tokens.github) || (platform === 'gitlab' && tokens.gitlab))) {
      return NextResponse.json({
        success: false,
        error: 'AUTHENTICATION_REQUIRED',
        message: `This is a private repository. Please sign in with a ${platform} account that has access.`
      }, { status: 401 });
    }
    
    // Get appropriate auth headers based on public/private status
    const authHeaders = getAuthHeaders(platform, isPublic, tokens);
    
    // Fetch PR details from platform API
    try {
      // For GitHub, we can use their REST API
      if (platform === 'github') {
        // First fetch basic PR info
        const prResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
          { headers: authHeaders }
        );
        
        if (!prResponse.ok) {
          // If 404, the PR doesn't exist
          if (prResponse.status === 404) {
            return NextResponse.json({
              success: false,
              error: 'PR_NOT_FOUND',
              message: `Pull request #${prNumber} not found in ${owner}/${repo}`
            }, { status: 404 });
          }
          
          // If 403, it might be a private repo or rate limit issue
          if (prResponse.status === 403) {
            const errorData = await prResponse.json();
            const errorMessage = errorData.message || 'Access forbidden';
            
            // Check if it's a rate limit issue
            if (errorMessage.includes('rate limit')) {
              return NextResponse.json({
                success: false,
                error: 'RATE_LIMIT',
                message: `GitHub API rate limit exceeded. Please try again later.`
              }, { status: 429 });
            }
            
            return NextResponse.json({
              success: false,
              error: 'ACCESS_DENIED',
              message: `Access denied to repository ${owner}/${repo}: ${errorMessage}`
            }, { status: 403 });
          }
          
          // Generic error for other status codes
          return NextResponse.json({
            success: false,
            error: 'API_ERROR',
            message: `Error fetching PR from GitHub: ${prResponse.statusText}`
          }, { status: prResponse.status });
        }
        
        const prData = await prResponse.json();
        
        // Then fetch PR files to get stats
        const filesResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
          { headers: authHeaders }
        );
        
        let filesData = [];
        let filesChanged = 0;
        let linesAdded = 0;
        let linesRemoved = 0;
        
        if (filesResponse.ok) {
          filesData = await filesResponse.json();
          filesChanged = filesData.length;
          
          // Calculate lines added/removed
          filesData.forEach((file: any) => {
            linesAdded += file.additions || 0;
            linesRemoved += file.deletions || 0;
          });
        } else {
          console.warn(`Could not fetch PR files: ${filesResponse.statusText}`);
        }
        
        // Format the PR details for response
        return NextResponse.json({
          success: true,
          prDetails: {
            title: prData.title,
            repository: `${owner}/${repo}`,
            author: prData.user?.login || owner,
            createdAt: prData.created_at,
            updatedAt: prData.updated_at,
            filesChanged,
            linesAdded,
            linesRemoved,
            branches: {
              source: prData.head?.ref || 'unknown',
              target: prData.base?.ref || 'main'
            },
            state: prData.state,
            isPrivate: !isPublic
          }
        });
      }
      
      // For GitLab, use their API
      if (platform === 'gitlab') {
        // GitLab implementation follows same pattern
        // The endpoint URLs and response structure will be different
        
        // For now, return a mock response for GitLab
        return NextResponse.json({
          success: true,
          prDetails: {
            title: `Merge Request #${prNumber}`,
            repository: `${owner}/${repo}`,
            author: owner,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            filesChanged: 0,
            linesAdded: 0,
            linesRemoved: 0,
            branches: {
              source: 'feature',
              target: 'main'
            },
            state: 'open',
            isPrivate: !isPublic
          }
        });
      }
      
      // Unsupported platform
      return NextResponse.json({
        success: false,
        error: 'UNSUPPORTED_PLATFORM',
        message: `Platform "${platform}" is not supported`
      }, { status: 400 });
      
    } catch (apiError) {
      console.error('Error fetching from platform API:', apiError);
      return NextResponse.json({
        success: false,
        error: 'API_ERROR',
        message: `Error fetching PR details: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Unhandled error in PR details API:', error);
    return NextResponse.json({
      success: false,
      error: 'SERVER_ERROR',
      message: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}