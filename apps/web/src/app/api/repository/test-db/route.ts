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
    
    // Get the authenticated user's tokens
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    // Initialize database service
    const dbService = new DatabaseService(supabase);

    // Test database connection by checking the schema
    const { data: tables, error: tablesError } = await supabase
      .from('repositories')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.error('Database error:', tablesError);
      return NextResponse.json(
        { 
          error: 'Database query error',
          message: tablesError.message
        },
        { status: 500 }
      );
    }

    // Check schema details
    const { data: repoColumns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'repositories' });

    return NextResponse.json({
      success: true,
      tables: {
        hasRepositoriesTable: true,
        repositoryCount: tables.length,
        columns: repoColumns || []
      }
    });
  } catch (error) {
    console.error('Error testing database:', error);
    return NextResponse.json(
      { 
        error: 'Error testing database',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}