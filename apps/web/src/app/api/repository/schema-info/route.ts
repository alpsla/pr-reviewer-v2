import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    // Fetch a sample repository to understand the schema
    const { data: sampleRepo, error: sampleError } = await supabase
      .from('repositories')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('Error fetching sample repository:', sampleError);
      return NextResponse.json(
        { error: 'Failed to fetch sample repository', message: sampleError.message },
        { status: 500 }
      );
    }
    
    // Get schema info directly
    const { data: schemaInfo, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'repositories' });
      
    if (schemaError) {
      console.error('Error fetching schema info:', schemaError);
      // This is ok, not all databases have this function
    }
    
    // Get all repositories with fingerprints
    const { data: reposWithFingerprints, error: fingerprintError } = await supabase
      .from('repositories')
      .select('id, owner, name, fingerprint, analysis_count, github_id')
      .not('fingerprint', 'is', null);
      
    if (fingerprintError) {
      console.error('Error fetching repositories with fingerprints:', fingerprintError);
      return NextResponse.json(
        { error: 'Failed to fetch fingerprinted repositories', message: fingerprintError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      sampleRepo: sampleRepo?.[0] || null,
      schemaInfo: schemaInfo || null,
      reposWithFingerprints: reposWithFingerprints || []
    });
  } catch (error) {
    console.error('Error getting schema info:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get schema info',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}