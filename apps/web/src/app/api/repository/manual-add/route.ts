import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRepositoryFingerprint } from '@pr-reviewer/core';
import crypto from 'crypto';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { platform, owner, repo } = await request.json();

    if (!platform || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters: platform, owner, repo' },
        { status: 400 }
      );
    }

    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Generate a fingerprint for the repository
    const fingerprint = createRepositoryFingerprint(platform as any, owner, repo);
    console.log('Generated fingerprint:', fingerprint);
    
    // Check if repository already exists
    const { data: existingRepo } = await supabase
      .from('repositories')
      .select('id, analysis_count, fingerprint')
      .eq('fingerprint', fingerprint)
      .maybeSingle();
    
    if (existingRepo) {
      console.log('Repository already exists:', existingRepo);
      
      // Update the repository
      const { data: updatedRepo, error } = await supabase
        .from('repositories')
        .update({
          updated_at: new Date().toISOString(),
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
        message: 'Repository already exists',
        repository: updatedRepo,
        isNew: false
      });
    }
    
    // Generate a unique ID for the new repository
    const timestamp = new Date().toISOString();
    const randomId = Math.floor(Math.random() * 10000000).toString();
    
    // Create a new repository
    const { data: newRepo, error } = await supabase
      .from('repositories')
      .insert({
        owner: owner,
        name: repo,
        description: `Repository ${owner}/${repo}`,
        is_private: false, // Assume public
        default_branch: 'main',
        url: `https://${platform}.com/${owner}/${repo}`,
        created_at: timestamp,
        updated_at: timestamp,
        last_synced_at: timestamp,
        last_analyzed_at: timestamp,
        fingerprint: fingerprint,
        analysis_count: 0,
        free_tier_analysis_limit: 10, // Higher limit for testing
        github_id: randomId,
        platform: platform
      })
      .select('id, analysis_count, fingerprint, free_tier_analysis_limit')
      .single();
    
    if (error) {
      console.error('Error creating repository:', error);
      
      // Handle unique constraint violations
      if (error.code === '23505') {
        // Try to find the repository again
        const { data: existingRepo } = await supabase
          .from('repositories')
          .select('id, analysis_count, fingerprint')
          .eq('fingerprint', fingerprint)
          .maybeSingle();
        
        if (existingRepo) {
          return NextResponse.json({
            success: true,
            message: 'Repository found after constraint error',
            repository: existingRepo,
            isNew: false
          });
        }
      }
      
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Repository created',
      repository: newRepo,
      isNew: true
    });
  } catch (error) {
    console.error('Error in manual repository creation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create repository',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
