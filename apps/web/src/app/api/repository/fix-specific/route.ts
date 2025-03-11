import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get specific parameters
    const url = new URL(request.url);
    const owner = url.searchParams.get('owner') || 'alpsla';
    const repo = url.searchParams.get('repo') || 'family-central';
    const platform = url.searchParams.get('platform') || 'github';
    const fingerprint = url.searchParams.get('fingerprint') || '8d6813069e536b559e9ea6b5f09119b054d80ec073c3aa43070fc16b51f07e49';
    
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }
    
    console.log(`Fixing specific repository: ${owner}/${repo}`);
    
    // First try to find the repository by fingerprint
    const { data: existingRepo, error: findError } = await supabase
      .from('repositories')
      .select('id, fingerprint, platform, analysis_count, free_tier_analysis_limit, last_analyzed_at')
      .eq('fingerprint', fingerprint)
      .maybeSingle();
      
    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding repository by fingerprint:', findError);
      return NextResponse.json(
        { error: 'Error finding repository', details: findError },
        { status: 500 }
      );
    }
    
    if (existingRepo) {
      console.log('Found existing repository by fingerprint:', {
        id: existingRepo.id,
        fingerprint: existingRepo.fingerprint,
        platform: existingRepo.platform
      });
      
      // Update the repository's last_analyzed_at timestamp and increment analysis count
      const newCount = (existingRepo.analysis_count || 0) + 1;
      
      const { data: updatedRepo, error: updateError } = await supabase
        .from('repositories')
        .update({
          last_analyzed_at: new Date().toISOString(),
          analysis_count: newCount,
          platform: platform
        })
        .eq('id', existingRepo.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error updating repository:', updateError);
        return NextResponse.json(
          { error: 'Error updating repository', details: updateError },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        repository: updatedRepo,
        message: `Successfully updated repository and incremented analysis count to ${newCount}`
      });
    }
    
    // Try to find by owner/name if not found by fingerprint
    const { data: repoByName, error: nameError } = await supabase
      .from('repositories')
      .select('id, fingerprint, platform, analysis_count, free_tier_analysis_limit')
      .eq('owner', owner)
      .eq('name', repo)
      .maybeSingle();
      
    if (nameError && nameError.code !== 'PGRST116') {
      console.error('Error finding repository by name:', nameError);
      return NextResponse.json(
        { error: 'Error finding repository by name', details: nameError },
        { status: 500 }
      );
    }
    
    if (repoByName) {
      console.log('Found existing repository by name:', {
        id: repoByName.id,
        owner,
        repo,
        fingerprint: repoByName.fingerprint
      });
      
      // Update the repository to include the fingerprint if it's missing
      const updates = {
        fingerprint: fingerprint,
        platform: platform,
        last_analyzed_at: new Date().toISOString(),
        analysis_count: (repoByName.analysis_count || 0) + 1
      };
      
      const { data: updatedRepo, error: updateError } = await supabase
        .from('repositories')
        .update(updates)
        .eq('id', repoByName.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error updating repository:', updateError);
        return NextResponse.json(
          { error: 'Error updating repository', details: updateError },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        repository: updatedRepo,
        message: `Successfully updated repository with fingerprint and incremented analysis count to ${updatedRepo.analysis_count}`
      });
    }
    
    // If we get here, the repository doesn't exist yet
    // Let's create a new one without specifying the ID to avoid the primary key conflict
    const newRepo = {
      owner: owner,
      name: repo,
      fingerprint: fingerprint,
      platform: platform,
      description: `Repository for ${owner}/${repo}`,
      is_private: false,
      default_branch: 'main',
      url: `https://${platform}.com/${owner}/${repo}`,
      analysis_count: 1,
      free_tier_analysis_limit: 5,
      github_id: Math.floor(Math.random() * 10000000).toString(), // Generate a random ID to avoid conflicts
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_analyzed_at: new Date().toISOString()
    };
    
    const { data: createdRepo, error: createError } = await supabase
      .from('repositories')
      .insert(newRepo)
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating repository:', createError);
      return NextResponse.json(
        { error: 'Error creating repository', details: createError },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      repository: createdRepo,
      message: 'Successfully created new repository'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}