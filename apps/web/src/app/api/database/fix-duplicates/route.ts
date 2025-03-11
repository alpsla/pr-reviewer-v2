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

    // Step 1: Find duplicate owner/name combinations using a raw query
    console.log('Checking for duplicate owner/name combinations...');
    
    // Using a raw query since the Supabase client doesn't support group by directly
    const { data: duplicates, error: findError } = await supabase
      .from('repositories')
      .select()
      .eq('owner', 'alpsla')
      .eq('name', 'pr-reviewer-v2');

    if (findError) {
      console.error('Error finding duplicates:', findError);
      return NextResponse.json({
        success: false,
        error: 'Failed to find duplicate repositories',
        message: findError.message
      }, { status: 500 });
    }

    // For now, we'll just target the specific repository that's causing issues
    if (!duplicates || duplicates.length < 2) {
      return NextResponse.json({
        success: true,
        message: 'No duplicate repositories found for alpsla/pr-reviewer-v2',
        duplicates: duplicates || []
      });
    }

    console.log(`Found ${duplicates.length} instances of alpsla/pr-reviewer-v2`);
    
    // Step 2: Process the duplicates (specifically for alpsla/pr-reviewer-v2)
    const results = [];
    
    // Sort by creation date - keep the oldest record unchanged
    duplicates.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    // Keep the first record, update the rest
    const updatedRecords = [];
    for (let i = 1; i < duplicates.length; i++) {
      const record = duplicates[i];
      const newName = `${record.name}-${i}-${record.id.substring(0, 6)}`;
      
      console.log(`Updating record ${record.id}: changing name from ${record.name} to ${newName}`);
      
      // Update name to make it unique
      const { data: updatedRecord, error: updateError } = await supabase
        .from('repositories')
        .update({ name: newName })
        .eq('id', record.id)
        .select();
        
      if (updateError) {
        console.error(`Error updating record ${record.id}:`, updateError);
        updatedRecords.push({
          id: record.id,
          error: updateError.message
        });
      } else {
        console.log(`Successfully updated record ${record.id}`);
        updatedRecords.push({
          id: record.id,
          old_name: record.name,
          new_name: newName,
          success: true
        });
      }
    }
    
    results.push({
      owner: 'alpsla',
      name: 'pr-reviewer-v2',
      kept_record: duplicates[0].id,
      updated_records: updatedRecords
    });

    return NextResponse.json({
      success: true,
      message: `Fixed ${duplicates.length - 1} duplicate instances of alpsla/pr-reviewer-v2`,
      results
    });
  } catch (error) {
    console.error('Error fixing duplicates:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix duplicate repositories',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}