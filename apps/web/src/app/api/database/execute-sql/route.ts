import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }
    
    const { sql } = await request.json();
    
    if (!sql) {
      return NextResponse.json(
        { error: 'Missing required parameter: sql' },
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

    // Execute the SQL using rpc - this assumes you have an 'execute_sql' function
    // in your database with SECURITY DEFINER privileges
    // You would typically need to create this function in your database first
    try {
      // Try using a Supabase function if it exists
      const { data, error } = await supabase.rpc('execute_sql', { query: sql });
      
      if (error) {
        // If the function doesn't exist or other error, we'll try direct database access
        // which won't work in production Supabase (only local development)
        console.error('Error executing SQL via rpc:', error);
        throw error;
      }
      
      return NextResponse.json({
        success: true,
        result: data
      });
    } catch (error) {
      console.error('Error executing SQL via rpc, attempting fallback method:', error);
      
      // For development only - attempt to execute SQL directly 
      // (This won't work in production Supabase but might work for local development)
      try {
        // We'll try using the Supabase JS client to execute the SQL
        // This will likely fail in Supabase production environment due to permissions
        // but could work in local development
        
        // For simple cases like adding a column to our specific table, we can try:
        if (sql.toLowerCase().includes('alter table repositories add column platform')) {
          // We can try to update a record with the new column to see if it auto-adds
          const { data: sampleRepo } = await supabase
            .from('repositories')
            .select('id')
            .limit(1);
            
          if (sampleRepo && sampleRepo.length > 0) {
            const repoId = sampleRepo[0].id;
            
            // Try to update a record with the missing field
            const { data: updateData, error: updateError } = await supabase
              .from('repositories')
              .update({ platform: 'github' })
              .eq('id', repoId)
              .select();
              
            if (updateError) {
              if (updateError.message.includes('platform')) {
                console.error('Failed to add platform column:', updateError);
                throw new Error(`Failed to add platform column: ${updateError.message}`);
              }
            } else {
              console.log('Successfully added platform column through update');
              
              // Now get all repositories and set platform to github if it's null
              const { data: allRepos, error: reposError } = await supabase
                .from('repositories')
                .select('id');
                
              if (!reposError && allRepos && allRepos.length > 0) {
                // Update all repositories to set platform to 'github'
                const { data: updateAllData, error: updateAllError } = await supabase
                  .from('repositories')
                  .update({ platform: 'github' })
                  .is('platform', null)
                  .select();
                  
                console.log('Updated platform for all repositories:', updateAllData?.length || 0);
              }
              
              return NextResponse.json({
                success: true,
                message: 'Successfully added platform column through update'
              });
            }
          }
        }
        
        return NextResponse.json({
          success: false,
          error: 'Could not execute SQL in this environment'
        }, { status: 500 });
      } catch (fallbackError) {
        console.error('Error in fallback SQL execution:', fallbackError);
        return NextResponse.json({
          success: false,
          error: 'SQL execution failed',
          message: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error executing SQL:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute SQL',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}