import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// Instead of using uuid, generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's tokens
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    // Test creating a repository record directly
    console.log('Testing repository creation in database...');
    
    const testRepo = {
      id: generateId(),
      github_id: '123456789',
      owner: 'test-owner',
      name: 'test-repo',
      description: 'Test repository for debugging',
      is_private: false,
      default_branch: 'main',
      url: 'https://github.com/test-owner/test-repo',
      language: 'TypeScript',
      topics: ['test', 'debug'],
      fingerprint: `github-test-owner-test-repo-${Date.now()}`,
      analysis_count: 0,
      free_tier_analysis_limit: 5,
      platform: 'github', // Add the platform field that was missing
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_synced_at: new Date().toISOString(),
      metadata: {
        external_id: null,
        has_admin_access: true,
        has_write_access: true,
        has_read_access: true
      }
    };

    try {
      console.log('Inserting test repository...');
      
      const { data: repo, error } = await supabase
        .from('repositories')
        .insert(testRepo)
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting repository:', error);
        return NextResponse.json(
          { 
            error: 'Error inserting test repository',
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        repository: repo
      });
    } catch (dbError) {
      console.error('Unexpected error during repository insert:', dbError);
      return NextResponse.json(
        { 
          error: 'Unexpected error during repository insert',
          message: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing repository creation:', error);
    return NextResponse.json(
      { 
        error: 'Error testing repository creation',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}