import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Direct Fix for Public Repository Access
 * 
 * This endpoint provides a way to verify if a repository is public
 * and get basic PR details without requiring authentication.
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
    
    console.log(`[NO-AUTH-FIX] Checking repository ${platform}/${owner}/${repo}`);
    
    // STEP 1: Check if repository is accessible (public)
    try {
      // Basic check to see if repository is accessible
      const repoUrl = `https://${platform}.com/${owner}/${repo}`;
      const repoResponse = await fetch(repoUrl, { method: 'HEAD', cache: 'no-store' });
      
      if (repoResponse.status !== 200) {
        return NextResponse.json({
          success: false,
          message: `Repository ${owner}/${repo} is not publicly accessible.`,
          isPublic: false
        }, { status: 403 });
      }
      
      console.log(`Repository ${owner}/${repo} is publicly accessible`);
      
      // STEP 2: Try to get basic PR information from public API
      let prTitle = `Pull Request #${prNumber}`;
      let prAuthor = owner;
      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();
      
      // For GitHub, we can try to get some details from public API
      if (platform === 'github') {
        try {
          const prApiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
          const prResponse = await fetch(prApiUrl);
          
          if (prResponse.ok) {
            const prData = await prResponse.json();
            
            if (prData) {
              prTitle = prData.title || prTitle;
              prAuthor = prData.user?.login || prAuthor;
              createdAt = prData.created_at || createdAt;
              updatedAt = prData.updated_at || updatedAt;
            }
          }
        } catch (apiError) {
          console.error('Error fetching PR details from GitHub API:', apiError);
          // Continue with defaults
        }
      }
      
      // STEP 3: Return success with PR details
      return NextResponse.json({
        success: true,
        isPublic: true,
        prDetails: {
          title: prTitle,
          repository: `${owner}/${repo}`,
          author: prAuthor,
          createdAt: createdAt,
          updatedAt: updatedAt,
          filesChanged: 0, // Not available without auth
          linesAdded: 0,   // Not available without auth
          linesRemoved: 0, // Not available without auth
          branches: {
            source: 'unknown',
            target: 'main'
          },
          state: 'open',
          isPrivate: false,
          isNoAuthFix: true
        }
      });
    } catch (error) {
      console.error('Error checking repository accessibility:', error);
      return NextResponse.json({
        success: false,
        message: 'Error checking repository accessibility',
        error: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Unhandled error in no-auth fix endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}