import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRepositoryFingerprint } from '@pr-reviewer/core';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

/**
 * Special API endpoint for handling cross-platform access
 * (e.g., GitLab-authenticated users accessing GitHub repos)
 */
export async function POST(request: Request) {
  try {
    const { platform, owner, repo } = await request.json();

    console.log('Cross-platform analysis request:', { platform, owner, repo });

    if (!platform || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters: platform, owner, repo' },
        { status: 400 }
      );
    }

    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session to determine their auth provider
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract provider information
    const provider = session.user?.app_metadata?.provider as string || '';
    
    // Check if this is indeed a cross-platform request
    const isCrossPlatform = (provider === 'gitlab' && platform === 'github') || 
                            (provider === 'github' && platform === 'gitlab');
    
    if (!isCrossPlatform) {
      return NextResponse.json(
        { 
          error: 'Not a cross-platform request', 
          details: { 
            authProvider: provider, 
            requestedPlatform: platform
          }
        },
        { status: 400 }
      );
    }
    
    console.log(`Cross-platform access: ${provider} auth attempting to access ${platform} repo`);
    
    // Generate a fingerprint for tracking
    const fingerprint = createRepositoryFingerprint(platform as any, owner, repo);
    console.log('Generated fingerprint:', fingerprint);
    
    // Check for existing repository in the database
    const { data: existingRepo } = await supabase
      .from('repositories')
      .select('id, analysis_count, free_tier_analysis_limit, fingerprint')
      .eq('fingerprint', fingerprint)
      .maybeSingle();
    
    const timestamp = new Date().toISOString();
    
    if (existingRepo) {
      console.log('Found existing repository by fingerprint:', {
        repoId: existingRepo.id,
        fingerprint: existingRepo.fingerprint,
        analysisCount: existingRepo.analysis_count || 0
      });
      
      // Increment the analysis count
      const currentCount = existingRepo.analysis_count || 0;
      const { data: updatedRepo, error } = await supabase
        .from('repositories')
        .update({
          analysis_count: currentCount + 1,
          last_analyzed_at: timestamp,
          updated_at: timestamp
        })
        .eq('id', existingRepo.id)
        .select('id, analysis_count, fingerprint')
        .single();
      
      if (error) {
        console.error('Error updating repository:', error);
        throw error;
      }
      
      return NextResponse.json({
        success: true,
        message: 'Cross-platform analysis count incremented',
        newCount: updatedRepo?.analysis_count || (currentCount + 1),
        fingerprint,
        crossPlatform: true
      });
    } else {
      // Create a new repository record
      const randomId = Math.floor(Math.random() * 10000000).toString();
      
      const { data: newRepo, error } = await supabase
        .from('repositories')
        .insert({
          owner: owner,
          name: repo,
          description: `${platform} repository ${owner}/${repo} (cross-platform access)`,
          is_private: false, // Assume public for cross-platform access
          default_branch: 'main',
          url: `https://${platform}.com/${owner}/${repo}`,
          created_at: timestamp,
          updated_at: timestamp,
          last_synced_at: timestamp,
          last_analyzed_at: timestamp,
          fingerprint: fingerprint,
          analysis_count: 1,
          free_tier_analysis_limit: 5,
          github_id: platform === 'github' ? randomId : null,
          gitlab_id: platform === 'gitlab' ? randomId : null,
          platform: platform
        })
        .select('id, analysis_count, fingerprint')
        .single();
      
      if (error) {
        console.error('Error creating repository:', error);
        throw error;
      }
      
      return NextResponse.json({
        success: true,
        message: 'New repository created for cross-platform access',
        newCount: newRepo?.analysis_count || 1,
        fingerprint,
        crossPlatform: true,
        isNew: true
      });
    }
  } catch (error) {
    console.error('Error in cross-platform analysis:', error);
    return NextResponse.json(
      { 
        error: 'Cross-platform analysis failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
