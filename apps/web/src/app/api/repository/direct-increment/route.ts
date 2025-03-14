import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate a fingerprint for this repository
    // This is a simple implementation to match what's in the core library
    const fingerprint = generateFingerprint(platform, owner, repo);
    
    console.log(`Direct increment for repository: ${platform}/${owner}/${repo} with fingerprint ${fingerprint}`);
    
    // First, try to find the repository by fingerprint
    const { data: existingRepo } = await supabase
      .from('repositories')
      .select('id, analysis_count, free_tier_analysis_limit')
      .eq('fingerprint', fingerprint)
      .maybeSingle();
      
    if (existingRepo) {
      console.log(`Found existing repository: ${existingRepo.id} with ${existingRepo.analysis_count} analyses`);
      
      // Increment the analysis count
      const newCount = (existingRepo.analysis_count || 0) + 1;
      
      // Update the repository with new count
      const { data: updatedRepo, error: updateError } = await supabase
        .from('repositories')
        .update({
          analysis_count: newCount,
          updated_at: new Date().toISOString(),
          last_analyzed_at: new Date().toISOString()
        })
        .eq('id', existingRepo.id)
        .select('id, analysis_count, free_tier_analysis_limit')
        .single();
        
      if (updateError) {
        console.error('Error updating repository analysis count:', updateError);
        throw updateError;
      }
      
      return NextResponse.json({
        success: true,
        repository: {
          id: updatedRepo.id,
          analysisCount: updatedRepo.analysis_count,
          limit: updatedRepo.free_tier_analysis_limit
        }
      });
    }
    
    // If we get here, we need to create a new record
    // Generate a unique ID to avoid conflicts
    const uuid = generateUUID();
    
    const { data: newRepo, error: createError } = await supabase
      .from('repositories')
      .insert({
        id: uuid,
        owner: owner,
        name: repo,
        fingerprint: fingerprint,
        platform: platform,
        is_private: false,
        github_id: '0',
        default_branch: 'main',
        url: `https://${platform}.com/${owner}/${repo}`,
        description: `Repository ${owner}/${repo}`,
        analysis_count: 1,
        free_tier_analysis_limit: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_analyzed_at: new Date().toISOString()
      })
      .select('id, analysis_count, free_tier_analysis_limit')
      .single();
      
    if (createError) {
      console.error('Error creating repository:', createError);
      
      // Special handling for duplicate key - try to find it by owner/repo
      if (createError.code === '23505') {
        console.log('Handling duplicate key error...');
        
        // Try to find by owner/repo instead
        const { data: foundRepo } = await supabase
          .from('repositories')
          .select('id, analysis_count, free_tier_analysis_limit')
          .eq('owner', owner)
          .eq('name', repo)
          .maybeSingle();
          
        if (foundRepo) {
          console.log(`Found repository by name: ${foundRepo.id}`);
          
          // Increment the analysis count
          const newCount = (foundRepo.analysis_count || 0) + 1;
          
          // Update the repository with new count
          const { data: updatedRepo, error: updateError } = await supabase
            .from('repositories')
            .update({
              analysis_count: newCount,
              updated_at: new Date().toISOString(),
              last_analyzed_at: new Date().toISOString(),
              fingerprint: fingerprint // Ensure fingerprint is set
            })
            .eq('id', foundRepo.id)
            .select('id, analysis_count, free_tier_analysis_limit')
            .single();
            
          if (updateError) {
            console.error('Error updating found repository:', updateError);
            throw updateError;
          }
          
          return NextResponse.json({
            success: true,
            repository: {
              id: updatedRepo.id,
              analysisCount: updatedRepo.analysis_count,
              limit: updatedRepo.free_tier_analysis_limit
            },
            message: 'Found and updated existing repository by name'
          });
        }
      }
      
      throw createError;
    }
    
    return NextResponse.json({
      success: true,
      repository: {
        id: newRepo.id,
        analysisCount: newRepo.analysis_count,
        limit: newRepo.free_tier_analysis_limit
      },
      message: 'Created new repository'
    });
    
  } catch (error) {
    console.error('Error in direct increment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to increment repository analysis count',
        message: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Simple implementation of fingerprint generation to match the core library
function generateFingerprint(platform: string, owner: string, repo: string): string {
  // Normalize inputs
  const normalizedPlatform = platform.toLowerCase().trim();
  const normalizedOwner = owner.toLowerCase().trim();
  const normalizedRepo = repo.toLowerCase().trim();
  
  // Create a string to hash
  const input = `${normalizedPlatform}:${normalizedOwner}/${normalizedRepo}`;
  
  // Use a crypto library if available, or a simple hash for testing
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(36);
}