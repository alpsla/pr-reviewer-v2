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

    // Generate a fingerprint (simplified version)
    const fingerprint = generateSimpleFingerprint(platform, owner, repo);

    // Check if there's an existing fingerprinted repo first
    const { data: existingRepo } = await supabase
      .from('repositories')
      .select('id, analysis_count, free_tier_analysis_limit, fingerprint')
      .eq('fingerprint', fingerprint)
      .maybeSingle();
      
    if (existingRepo) {
      console.log('Found existing test repository by fingerprint:', {
        id: existingRepo.id,
        fingerprint: existingRepo.fingerprint
      });
      
      // Update the existing repo's analysis count
      const { data: updatedRepo, error } = await supabase
        .from('repositories')
        .update({
          analysis_count: (existingRepo.analysis_count || 0) + 1,
          last_analyzed_at: new Date().toISOString()
        })
        .eq('id', existingRepo.id)
        .select('id, owner, name, fingerprint, analysis_count, free_tier_analysis_limit, platform')
        .single();
        
      if (error) {
        console.error('Error updating existing test repository:', error);
        return NextResponse.json(
          { error: 'Failed to update repository', message: error.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        repository: updatedRepo,
        message: 'Updated existing test repository'
      });
    }
    
    // Generate a random github_id to avoid unique constraint violations
    const randomId = Math.floor(Math.random() * 10000000).toString();
    
    // Create a minimal repository object with only essential fields
    const minimalRepo = {
      owner: owner,
      name: repo,
      description: `Test repository ${owner}/${repo}`,
      is_private: false,
      default_branch: 'main',
      github_id: randomId,
      fingerprint: fingerprint,
      analysis_count: 1,
      free_tier_analysis_limit: 5,
      platform: platform, // Add the platform field that was missing
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Create the new repository
    const { data: newRepo, error } = await supabase
      .from('repositories')
      .insert(minimalRepo)
      .select('id, owner, name, fingerprint, analysis_count, free_tier_analysis_limit, platform')
      .single();
      
    if (error) {
      console.error('Error creating test repository:', error);
      return NextResponse.json(
        { error: 'Failed to create repository', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      repository: newRepo,
      message: 'Created new test repository'
    });
  } catch (error) {
    console.error('Error creating test repository:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create test repository',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Simple fingerprint function for testing (same logic used in repository-fingerprint.ts)
function generateSimpleFingerprint(platform: string, owner: string, repo: string): string {
  // Normalize inputs (lowercase, trim spaces)
  const normalizedPlatform = platform.toLowerCase().trim();
  const normalizedOwner = owner.toLowerCase().trim();
  const normalizedName = repo.toLowerCase().trim();
  
  // Create fingerprint string and hash it using a simple algorithm
  const fingerprintString = `${normalizedPlatform}:${normalizedOwner}/${normalizedName}`;
  
  // Simple hash function for testing
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string
  const hexHash = (hash >>> 0).toString(16).padStart(8, '0');
  return hexHash + fingerprintString.replace(/[^a-z0-9]/g, '');
}