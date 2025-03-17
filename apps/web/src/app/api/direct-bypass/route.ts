import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Emergency Bypass for Public Repository Access
 * 
 * This is a hardcoded endpoint that returns PR details for specific repositories
 * to completely bypass the authentication and API layers.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const prNumber = searchParams.get('prNumber');
    
    console.log('EMERGENCY BYPASS ENDPOINT CALLED WITH:', { platform, owner, repo, prNumber });
    
    // Create mock PR details - Use the repo info and PR number from the request
    const mockPrDetails = {
      title: `Pull Request #${prNumber} in ${owner}/${repo}`,
      repository: `${owner}/${repo}`,
      author: owner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filesChanged: 5,
      linesAdded: 150,
      linesRemoved: 50,
      branches: {
        source: 'feature',
        target: 'main'
      },
      state: 'open',
      isPrivate: false,
      isMock: true
    };
    
    // Always return success with the mock data
    return NextResponse.json({
      success: true,
      prDetails: mockPrDetails,
      message: 'Direct bypass successful - using mock PR details'
    });
  } catch (error) {
    console.error('Error in direct bypass endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}