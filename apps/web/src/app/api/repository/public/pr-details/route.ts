import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Public PR Details Endpoint
 * 
 * This endpoint handles PR details for public repositories.
 * It performs minimal authentication checks since the repository is public.
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
    
    console.log(`[PUBLIC] Fetching PR details for ${platform}/${owner}/${repo}#${prNumber}`);
    
    // Verify this is actually a public repository
    try {
      const publicRepoTest = await fetch(`https://${platform}.com/${owner}/${repo}`, {
        method: 'HEAD',
        cache: 'no-store',
      });
      
      if (publicRepoTest.status !== 200) {
        console.log(`Repository ${owner}/${repo} is not publicly accessible (status: ${publicRepoTest.status})`);
        return NextResponse.json({
          success: false,
          error: 'REPOSITORY_NOT_PUBLIC',
          message: 'This endpoint is only for public repositories. Use the private PR details endpoint for private repositories.'
        }, { status: 403 });
      }
      
      console.log(`Confirmed ${owner}/${repo} is publicly accessible`);
    } catch (error) {
      console.error('Error verifying public repository status:', error);
      return NextResponse.json({
        success: false,
        error: 'PUBLIC_CHECK_FAILED',
        message: 'Failed to verify if the repository is public'
      }, { status: 500 });
    }
    
    // For public repositories, we can provide some basic PR details without authentication
    try {
      // Try to fetch basic PR information from the public GitHub API
      let prTitle = `Pull Request #${prNumber}`;
      let prAuthor = owner;
      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();
      
      // For GitHub, we can try to fetch more accurate data from the public API
      if (platform === 'github') {
        try {
          const prApiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
          console.log(`Fetching public PR data from: ${prApiUrl}`);
          
          const prResponse = await fetch(prApiUrl);
          
          if (prResponse.ok) {
            const prData = await prResponse.json();
            prTitle = prData.title || prTitle;
            prAuthor = prData.user?.login || prAuthor;
            createdAt = prData.created_at || createdAt;
            updatedAt = prData.updated_at || updatedAt;
            
            console.log(`Successfully fetched public PR data for ${owner}/${repo}#${prNumber}`);
          } else {
            console.log(`Failed to fetch PR data from public API: ${prResponse.status}`);
          }
        } catch (apiError) {
          console.error('Error fetching public PR data:', apiError);
        }
      }
      
      // Return the PR details with whatever information we could gather
      return NextResponse.json({
        success: true,
        prDetails: {
          title: prTitle,
          repository: `${owner}/${repo}`,
          author: prAuthor,
          createdAt: createdAt,
          updatedAt: updatedAt,
          filesChanged: 0, // Unknown without authentication
          linesAdded: 0,   // Unknown without authentication
          linesRemoved: 0, // Unknown without authentication
          branches: {
            source: 'unknown',
            target: 'main'
          },
          state: 'open',
          isPrivate: false,
          isPublicApiData: true
        }
      });
    } catch (error) {
      console.error('Error fetching public PR details:', error);
      return NextResponse.json({
        success: false,
        error: 'PR_DETAILS_FAILED',
        message: 'Failed to fetch PR details'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Unhandled error in public PR details endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}