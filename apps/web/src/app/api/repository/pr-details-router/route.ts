import { NextResponse } from 'next/server';
import { isPublicRepository } from '@/lib/repository-access';
import { VCSPlatform } from '@/lib/repository-utils';

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
    
    // Validate platform and ensure it's a valid VCSPlatform type
    const validatedPlatform: VCSPlatform = platform === 'gitlab' ? 'gitlab' : 'github';
    
    console.log(`[ROUTER] Routing PR details request for ${validatedPlatform}/${owner}/${repo}#${prNumber}`);
    
    // Check if the repository is public
    const isPublic = await isPublicRepository(validatedPlatform, owner, repo);
    console.log(`Repository ${owner}/${repo} is ${isPublic ? 'public' : 'not publicly accessible'}`);
    
    // Redirect to the appropriate endpoint
    const targetEndpoint = isPublic
      ? `/api/repository/public/pr-details?platform=${validatedPlatform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`
      : `/api/repository/private/pr-details?platform=${validatedPlatform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
    
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
    
    // Use a default platform if none is provided
    const validatedPlatform = platform === 'gitlab' ? 'gitlab' : 'github';
    
    const privateEndpoint = `/api/repository/private/pr-details?platform=${validatedPlatform}&owner=${owner}&repo=${repo}&prNumber=${prNumber}`;
    return Response.redirect(new URL(privateEndpoint, request.url));
  }
}