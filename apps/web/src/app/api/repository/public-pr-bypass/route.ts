import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * This is a special API endpoint for public repositories only
 * It bypasses authentication and other checks for known public repositories
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
    
    console.log(`PUBLIC BYPASS: Fetching PR details for ${platform}/${owner}/${repo}#${prNumber}`);
    
    // Verify that this is actually a public repository by making a fetch request
    try {
      const publicRepoCheck = await fetch(`https://${platform}.com/${owner}/${repo}`);
      const isRepoAccessible = publicRepoCheck.status === 200;
      
      if (!isRepoAccessible) {
        return NextResponse.json({
          success: false,
          error: 'REPOSITORY_NOT_PUBLIC',
          message: `This endpoint is only for public repositories. Repository ${owner}/${repo} appears to be private or doesn't exist.`
        }, { status: 403 });
      }
      
      console.log('Confirmed this is a publicly accessible repository');
      
      // Create mock PR details for public repositories
      return NextResponse.json({
        success: true,
        prDetails: {
          title: `Pull Request #${prNumber} in ${owner}/${repo}`,
          repository: `${owner}/${repo}`,
          author: owner,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          filesChanged: 0, // Unknown without API access
          linesAdded: 0,
          linesRemoved: 0,
          branches: {
            source: 'unknown',
            target: 'main'
          },
          state: 'open',
          isPrivate: false,
          isPublicRepoBypass: true
        },
        message: 'Using public repository bypass - limited details available'
      });
    } catch (error) {
      console.error('Error in public repository check:', error);
      return NextResponse.json({
        success: false,
        error: 'PUBLIC_REPO_CHECK_FAILED',
        message: 'Could not verify if the repository is public'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in public PR bypass endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}