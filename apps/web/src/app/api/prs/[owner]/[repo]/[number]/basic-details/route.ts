// src/app/api/prs/[owner]/[repo]/[number]/basic-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { EnhancedRepositoryService } from '../../../../../../../lib/enhanced-repository';
import { DatabaseService } from '../../../../../../../lib/database';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// In your API route file
export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string; number: string } }
) {
  console.log('API route called with params:', params);
  try {
    // Create database service directly
    console.log('Creating database service...');
    const supabase = createClientComponentClient();
    const db = new DatabaseService(supabase);
    console.log('Database service created');
    
    // Create enhanced repository service
    console.log('Creating enhanced repository service...');
    const repoService = new EnhancedRepositoryService(db, {});
    console.log('Enhanced repository service created');
    
    // Extract parameters
    const { owner, repo } = params;
    const prNumber = parseInt(params.number, 10);
    console.log('Parsed parameters:', { owner, repo, prNumber });
    
    // Determine platform
    const url = new URL(request.url);
    const platform = url.searchParams.get('platform') || 'github';
    console.log('Platform:', platform);
    
    // Get PR basic details
    console.log('Calling getPullRequestBasicDetails...');
    const prDetails = await repoService.getPullRequestBasicDetails(
      platform as 'github' | 'gitlab',
      owner,
      repo,
      prNumber
    );
    console.log('PR details returned:', JSON.stringify(prDetails, null, 2));
    
    // Get data collection status
    console.log('Calling getDataCollectionStatus...');
    let dataCollectionStatus = null;
    try {
      dataCollectionStatus = await repoService.getDataCollectionStatus(prDetails.repositoryId);
      console.log('Data collection status:', JSON.stringify(dataCollectionStatus, null, 2));
    } catch (statusError) {
      console.error('Error getting data collection status:', statusError);
    }
    
    // Prepare response
    const response = {
      prDetails,
      dataCollectionStatus
    };
    console.log('Sending response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get PR details',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

