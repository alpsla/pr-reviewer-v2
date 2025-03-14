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
  try {
    const { owner, repo, number } = params;
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'github';
    
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    
    // Extract tokens from user session for different providers
    const provider_token = session.provider_token;
    const user_metadata = session.user?.user_metadata || {};
    
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
    console.error('Error getting basic PR details:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      },
      { status: 500 }
    );
  }
}
