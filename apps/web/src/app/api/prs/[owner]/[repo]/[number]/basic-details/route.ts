import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { EnhancedRepositoryService } from '@/lib/enhanced-repository';
import { analyzePullRequest, RepositoryVisibility } from '@/lib/visibility-helpers';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Get basic details for a pull request using the smart PR analysis service
 * 
 * This implements the proactive approach that checks repository visibility first,
 * then handles authentication requirements appropriately.
 */
export async function GET(
  request: Request,
  { params }: { params: { owner: string; repo: string; number: string } }
) {
  try {
    const { owner, repo, number } = params;
    const searchParams = new URL(request.url).searchParams;
    const platform = searchParams.get('platform') || 'github';
    
    console.log(`Smart PR details request for ${platform}/${owner}/${repo}#${number}`);
    
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Log session information (excluding sensitive data)
    console.log('Session information:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasProviderToken: !!session?.provider_token,
      provider: session?.user?.app_metadata?.provider || 'unknown'
    });
    
    // Extract authentication token for the appropriate platform
    let accessToken = null;
    
    if (session) {
      // First check the most common token locations
      const provider_token = session.provider_token;
      const user_metadata = session.user?.user_metadata || {};
      
      if (platform === 'github') {
        accessToken = provider_token || 
                     user_metadata.provider_token || 
                     user_metadata.github_token || 
                     user_metadata.access_token;
      } else if (platform === 'gitlab') {
        accessToken = provider_token || 
                     user_metadata.provider_token || 
                     user_metadata.gitlab_token || 
                     user_metadata.access_token;
      }
      
      // If token still not found, check identity_data
      if (!accessToken && session.user?.identities && session.user.identities.length > 0) {
        const identity = session.user.identities[0];
        if (identity.identity_data && typeof identity.identity_data === 'object') {
          accessToken = identity.identity_data.access_token;
        }
      }
      
      // Log token availability (without exposing the actual token)
      console.log(`${platform} token available:`, !!accessToken);
    }
    
    // Use the Smart PR Analysis Service to check visibility and fetch appropriate data
    const result = await analyzePullRequest(
      platform as 'github' | 'gitlab',
      owner,
      repo,
      parseInt(number),
      accessToken
    );
    
    // Handle different result scenarios
    if (!result.success) {
      // Determine the appropriate status code based on the error
      let statusCode = 400;
      
      switch(result.errorCode) {
        case 'REPOSITORY_NOT_FOUND':
          statusCode = 404;
          break;
        case 'AUTHENTICATION_REQUIRED':
        case 'AUTHENTICATION_FAILED':
        case 'PERMISSION_DENIED':
          statusCode = 403;
          break;
        case 'PR_NOT_FOUND':
          statusCode = 404;
          break;
        default:
          statusCode = 500;
      }
      
      // Create appropriate message for the UI
      let userMessage = result.error;
      
      // Add more context for private repositories
      if (result.visibility === RepositoryVisibility.PRIVATE && result.requiresAuth) {
        userMessage = `This is a private ${platform} repository. Please sign in with an account that has proper permissions.`;
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: userMessage,
          errorCode: result.errorCode,
          visibility: result.visibility,
          requiresAuth: result.requiresAuth
        },
        { status: statusCode }
      );
    }
    
    // If we got here, we have successful PR details
    console.log('Successfully retrieved PR details using smart analysis');
    
    // Create database service to check data collection status if needed
    let dataCollectionStatus = null;
    
    if (result.details && result.details.repositoryId) {
      try {
        const db = new DatabaseService(supabase);
        const repositoryService = new EnhancedRepositoryService(db, {
          github: platform === 'github' ? accessToken : undefined,
          gitlab: platform === 'gitlab' ? accessToken : undefined
        });
        
        console.log(`Fetching data collection status for repository ID: ${result.details.repositoryId}...`);
        dataCollectionStatus = await repositoryService.getDataCollectionStatus(
          result.details.repositoryId
        );
      } catch (error) {
        console.warn('Error fetching data collection status:', error);
        // Continue anyway - data collection status is not critical
      }
    }
    
    // Return the successful result with PR details and optional data collection status
    return NextResponse.json({
      success: true,
      details: result.details,
      visibility: result.visibility,
      dataCollectionStatus
    });
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in smart PR details route:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        errorCode: 'UNEXPECTED_ERROR'
      },
      { status: 500 }
    );
  }
}