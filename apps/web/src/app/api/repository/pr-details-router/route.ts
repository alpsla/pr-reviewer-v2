import { NextResponse } from 'next/server';
import { isPublicRepository } from '@/lib/repository-access';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * PR Details Router Endpoint
 * 
 * This endpoint serves as a router that redirects to either the public or private
 * PR details endpoint based on repository accessibility.
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
    
    console.log(`[ROUTER] Routing PR details request for ${platform}/${owner}/${repo}#${prNumber}`);
    
    // Check if the repository is public
    const isPublic = await isPublicRepository(platform, owner, repo);
    console.log(`Repository ${owner}/${repo} is ${isPublic ? 'public' : 'not publicly accessible'}`);
    
    // Redirect to the appropriate endpoint
    const targetEndpoint = isPublic
      ? `/api/repository/public/pr-details?platform=${platform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`
      : `/api/repository/private/pr-details?platform=${platform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
    
    console.log(`Routing to ${isPublic ? 'public' : 'private'} endpoint`);
    
    return Response.redirect(new URL(targetEndpoint, request.url));
  } catch (error) {
    console.error('Error in PR details router:', error);
    
    // Default to private endpoint if routing fails
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const prNumber = searchParams.get('prNumber');
    
    const privateEndpoint = `/api/repository/private/pr-details?platform=${platform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
    return Response.redirect(new URL(privateEndpoint, request.url));
  }
}