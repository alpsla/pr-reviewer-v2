import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { EnhancedRepositoryService } from '@/lib/enhanced-repository';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Get basic details for a pull request
 * 
 * This is part of the primary (immediate) tier of the two-tier data collection approach
 */
export async function GET(
  request: Request,
  { params }: { params: { owner: string; repo: string; number: string } }
) {
  // Define variables at the top level so they're accessible in both try and catch blocks
  let searchParams: URLSearchParams;
  let platform = 'unknown'; // Initialize with a default value
  let tokens: { github?: string; gitlab?: string } = {};
  
  try {
    const { owner, repo, number } = params;
    searchParams = new URL(request.url).searchParams;
    platform = searchParams.get('platform') || 'github';
    
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Log the full session for debugging (excluding sensitive parts)
    console.log('Session information:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasProviderToken: !!session?.provider_token,
      userMetadataKeys: session?.user?.user_metadata ? Object.keys(session.user.user_metadata) : [],
      sessionKeys: session ? Object.keys(session) : [],
      provider: (session as any)?.provider || 'unknown'
    });
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    
    // Extract tokens from user session for different providers
    const provider_token = session.provider_token;
    const user_metadata = session.user?.user_metadata || {};
    const access_token = session.access_token;
    
    // Get the appropriate token based on the provider and platform
    // (using our top-level tokens variable)
    
    // First try to get the token directly matched to the requested platform
    if (platform === 'github') {
      tokens.github = provider_token || 
                     access_token || 
                     user_metadata.provider_token || 
                     user_metadata.access_token || 
                     user_metadata.github_token || 
                     user_metadata.githubToken;
      console.log('Using GitHub token with length:', tokens.github?.length || 0);
    } else if (platform === 'gitlab') {
      tokens.gitlab = provider_token || 
                     access_token || 
                     user_metadata.provider_token || 
                     user_metadata.access_token || 
                     user_metadata.gitlab_token || 
                     user_metadata.gitlabToken;
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
      
      // Helper function to recursively search for tokens in nested objects
      const findTokens = (obj: any, parentKey = '') => {
        if (!obj || typeof obj !== 'object') return;
        
        Object.entries(obj).forEach(([key, value]) => {
          const fullKey = parentKey ? `${parentKey}.${key}` : key;
          
          if (typeof value === 'string' && 
              (key.toLowerCase().includes('token') || key.toLowerCase().includes('auth'))) {
            console.log(`Found potential token in ${fullKey}`);
            if (key.toLowerCase().includes('github') || 
                (!key.toLowerCase().includes('gitlab') && !tokens.github)) {
              tokens.github = value;
              console.log('Using this as GitHub token');
            } else if (key.toLowerCase().includes('gitlab') || 
                      (!key.toLowerCase().includes('github') && !tokens.gitlab)) {
              tokens.gitlab = value;
              console.log('Using this as GitLab token');
            }
          } else if (typeof value === 'object' && value !== null) {
            // Recursively search nested objects
            findTokens(value, fullKey);
          }
        });
      };
      
      // Search through user metadata
      findTokens(user_metadata);
      // Also search through session object itself
      findTokens(session);
    }
    
    // CRITICAL FIX: If there's only a GitHub token available, use it as both GitHub AND GitLab token
    // This is necessary for cross-platform access when only one auth is available
    if (tokens.github && !tokens.gitlab) {
      tokens.gitlab = tokens.github;
      console.log('Using GitHub token as GitLab token for cross-platform support');
    } else if (tokens.gitlab && !tokens.github) {
      // FIXME: This does NOT actually work as expected currently - GitLab tokens cannot be used for GitHub
      // Keep this log to make it clear this is expected to fail
      console.warn('Using GitLab token as GitHub token - THIS IS EXPECTED TO FAIL');
      console.warn('GitHub requires its own authentication and cannot use GitLab tokens');
      // For now, we set the token for completeness but expect it to fail
      tokens.github = tokens.gitlab;
    }
    
    // Log whether we're attempting cross-platform auth
    const isCrossPlatformAttempt = (
      (platform === 'github' && (!tokens.github || tokens.github === tokens.gitlab) && tokens.gitlab) ||
      (platform === 'gitlab' && (!tokens.gitlab || tokens.gitlab === tokens.github) && tokens.github)
    );
    if (isCrossPlatformAttempt) {
      console.warn(`Cross-platform authentication attempt detected: ${platform} using tokens from ${platform === 'github' ? 'gitlab' : 'github'}`);
    }
    
    // Log token status
    console.log(`Final tokens status - GitHub: ${!!tokens.github}, GitLab: ${!!tokens.gitlab}`);
    
    // Create database service
    const db = new DatabaseService(supabase);
    
    // Create repository service with enhanced typing
    const repositoryService = new EnhancedRepositoryService(db, tokens);
    
    // Add detailed logging for debugging
    console.log('Repository service created successfully');
    
    // Log token status
    console.log(`Using tokens - GitHub: ${!!tokens.github}, GitLab: ${!!tokens.gitlab}`);
    
    // Get basic PR details - fast response for UI rendering
    console.log(`Fetching basic PR details for ${platform}/${owner}/${repo}#${number}...`);
    const basicDetails = await repositoryService.getPullRequestBasicDetails(
      platform as any,
      owner, 
      repo, 
      parseInt(number)
    );
    
    // Check if any background data collection is in progress
    console.log(`Fetching data collection status for repository ID: ${basicDetails.repositoryId}...`);
    const dataCollectionStatus = await repositoryService.getDataCollectionStatus(
      basicDetails.repositoryId
    );
    
    console.log('Successfully retrieved PR details and data collection status');
    
    return NextResponse.json({
      success: true,
      details: basicDetails,
      dataCollectionStatus
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Error fetching PR details:', {
      url: request.url,
      platform,
      owner: params.owner,
      repo: params.repo,
      number: params.number,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : String(error),
      hasGithubToken: !!tokens?.github,
      hasGitlabToken: !!tokens?.gitlab
    });
    
    // Determine if this is an authentication error or cross-platform auth error
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for cross-platform authentication error
    const isCrossPlatformError = 
      errorMessage.includes('Cross-platform authentication') ||
      (error instanceof Object && 'details' in error && 
       error.details && typeof error.details === 'object' && 
       'crossPlatformAttempt' in error.details);
    
    // Check for regular auth error
    const isAuthError = 
      !isCrossPlatformError && (
      errorMessage.includes('No GitHub token') || 
      errorMessage.includes('token') || 
      errorMessage.includes('authentication') || 
      errorMessage.includes('Authentication') || 
      errorMessage.includes('sign in'));
    
    let errorCode = 'PR_FETCH_ERROR';
    let statusCode = 500;
    let message = errorMessage;
    
    if (isCrossPlatformError) {
      errorCode = 'CROSS_PLATFORM_AUTH_ERROR';
      statusCode = 403;
      message = 'Cross-platform authentication not supported. Please sign in with the appropriate platform.';
    } else if (isAuthError) {
      errorCode = 'AUTH_ERROR';
      statusCode = 401;
      message = 'Authentication required. Please sign in with the appropriate platform.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message,
        errorCode
      },
      { status: statusCode }
    );
  }
}
