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

    // Check if the user has admin rights
    const { data: user } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();
      
    // Allow execution only for admins or in development environment
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && !user?.is_admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // First, check if the platform column already exists
    let columnExists = false;
    try {
      // Try a query that would fail if the column doesn't exist
      const { data, error } = await supabase
        .from('repositories')
        .select('platform')
        .limit(1);
      
      if (!error) {
        columnExists = true;
      }
    } catch (error) {
      console.log('Platform column does not exist yet:', error);
    }

    if (columnExists) {
      return NextResponse.json({
        success: true,
        message: 'Platform column already exists in the repositories table'
      });
    }

    // Execute a raw SQL query to add the platform column
    // Using Supabase's rpc feature to execute SQL statements
    // Note: This requires appropriate database permissions
    console.log('Adding platform column to repositories table...');
    
    // For Supabase, we need to create a postgres function to execute the ALTER TABLE statement
    // First, create the function
    const createFunctionQuery = `
    CREATE OR REPLACE FUNCTION add_platform_column()
    RETURNS text AS $$
    BEGIN
      ALTER TABLE "repositories" ADD COLUMN IF NOT EXISTS "platform" text DEFAULT 'github';
      RETURN 'Platform column added to repositories table';
    EXCEPTION
      WHEN others THEN
        RETURN 'Error: ' || SQLERRM;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Execute the function creation
    const { error: createFuncError } = await supabase.rpc('add_platform_column', {});
    
    // If the function doesn't exist yet, we need to create it first
    if (createFuncError && createFuncError.message.includes('does not exist')) {
      // Try direct SQL through special Supabase admin functions or a custom API
      console.log('Using fallback method to add platform column...');
      
      // For demo/dev purposes, we can use a simple PATCH to a table record
      // with a platform field to see if Supabase will auto-add the column
      // This isn't recommended for production but might work for development
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
        }
      }
    }
    
    // Now check again if the column exists
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select('platform')
        .limit(1);
      
      if (!error) {
        return NextResponse.json({
          success: true,
          message: 'Successfully added platform column to repositories table'
        });
      } else {
        console.error('Error checking if platform column exists:', error);
        throw new Error(`Error checking if platform column exists: ${error.message}`);
      }
    } catch (error) {
      console.error('Error checking platform column:', error);
      throw new Error('Failed to confirm if platform column was added');
    }
  } catch (error) {
    console.error('Error adding platform column:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add platform column',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}