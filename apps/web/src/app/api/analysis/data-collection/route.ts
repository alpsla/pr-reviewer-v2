import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository';
import { DatabaseService } from '@/lib/database';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Schedule data collection for a repository
 * 
 * This is part of the secondary (background) tier of the two-tier data collection approach
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { repositoryId, dataTypes } = body;
    
    if (!repositoryId) {
      return NextResponse.json(
        { success: false, message: 'Repository ID is required' },
        { status: 400 }
      );
    }
    
    if (!dataTypes || !Array.isArray(dataTypes) || dataTypes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data types are required' },
        { status: 400 }
      );
    }
    
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
    
    // Try to find tokens in user metadata
    tokens.github = provider_token || user_metadata.provider_token || user_metadata.access_token || user_metadata.github_token;
    tokens.gitlab = user_metadata.gitlab_token || user_metadata.gitlab_access_token;
    
    // If we still don't have any tokens, try to find them in other places in the user metadata
    if (!tokens.github && !tokens.gitlab) {
      // Try to find any token in user metadata that might help
      Object.entries(user_metadata).forEach(([key, value]) => {
        if (typeof value === 'string' && key.includes('token')) {
          if (key.includes('github') || (!key.includes('gitlab') && !tokens.github)) {
            tokens.github = value;
          } else if (key.includes('gitlab') || (!key.includes('github') && !tokens.gitlab)) {
            tokens.gitlab = value;
          }
        }
      });
    }
    
    // Create database service
    const db = new DatabaseService(supabase);
    
    // Create repository service
    const repositoryService = new RepositoryService(db, tokens);
    
    // Schedule background data collection
    // @ts-ignore - Temporary fix while we implement the full data collection system
    const job = await repositoryService.scheduleDataCollection(repositoryId, dataTypes);
    
    return NextResponse.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error scheduling data collection:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      },
      { status: 500 }
    );
  }
}
