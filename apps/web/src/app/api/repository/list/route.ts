import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Initialize database service
    const dbService = new DatabaseService(supabase);
    
    // Get all repositories from the database
    // Note: This assumes we have the proper RLS policies set up in Supabase
    //       so users can only see repositories they have accessed
    const { data: repositories, error } = await supabase
      .from('repositories')
      .select('*')
      .order('last_analyzed_at', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('Error fetching repositories:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    // Format the repository data for the frontend
    const formattedRepos = repositories.map(repo => ({
      id: repo.id,
      name: `${repo.owner}/${repo.name}`,
      fullName: `${repo.owner}/${repo.name}`,
      platform: repo.platform || 'github',
      owner: repo.owner,
      repoName: repo.name,
      lastAccessed: repo.last_analyzed_at || repo.updated_at,
      isPrivate: repo.is_private,
      analysisCount: repo.analysis_count || 0,
      analysisLimit: repo.free_tier_analysis_limit || 5,
      fingerprint: repo.fingerprint,
      url: repo.url
    }));
    
    // Get recent repositories (those accessed in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRepos = formattedRepos.filter(repo => {
      const lastAccessed = new Date(repo.lastAccessed);
      return lastAccessed >= thirtyDaysAgo;
    });
    
    // Get other repositories (not recently accessed)
    const olderRepos = formattedRepos.filter(repo => {
      const lastAccessed = new Date(repo.lastAccessed);
      return lastAccessed < thirtyDaysAgo;
    });
    
    return NextResponse.json({
      success: true,
      repositories: formattedRepos,
      recentRepositories: recentRepos,
      olderRepositories: olderRepos
    });
  } catch (error) {
    console.error('Error listing repositories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to list repositories',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
