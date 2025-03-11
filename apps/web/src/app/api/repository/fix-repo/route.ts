import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

// Simple function to create a fingerprint from platform, owner, and repo
function createSimpleFingerprint(platform: string, owner: string, repo: string): string {
  // Using SHA-256 would be better, but for simplicity we'll use a basic approach
  const combined = `${platform.toLowerCase()}-${owner.toLowerCase()}-${repo.toLowerCase()}`;
  
  // Simple hashing function (for demo purposes - not secure)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and pad with zeros
  const hexHash = (hash >>> 0).toString(16).padStart(8, '0');
  return hexHash + Date.now().toString(16);
}

// Generate a proper UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const owner = url.searchParams.get('owner') || 'alpsla';
    const repo = url.searchParams.get('repo') || 'pr-reviewer-v2';
    const platform = 'github';
    
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Step 0: Get database schema information
    console.log('Checking database schema...');
    try {
      const { data: schemaInfo, error: schemaError } = await supabase
        .rpc('get_table_columns', { table_name: 'repositories' });
      
      if (schemaError) {
        console.error('Error getting schema info:', schemaError);
      } else {
        console.log('Repository table columns:', schemaInfo);
      }
    } catch (error) {
      console.error('Unexpected error getting schema info:', error);
      // Try another way
      try {
        const { data, error } = await supabase
          .from('repositories')
          .select()
          .limit(1);
        
        if (error) {
          console.error('Error getting sample repository:', error);
        } else if (data && data.length > 0) {
          console.log('Repository sample columns:', Object.keys(data[0]));
        }
      } catch (innerError) {
        console.error('Failed to get sample repository:', innerError);
      }
    }
    
    // Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }
    
    // Extract token information
    let token = session.provider_token || '';
    const provider = session.user?.app_metadata?.provider as string || '';
    
    if (!token) {
      // Check other possible token locations
      token = session.user?.identities?.[0]?.identity_data?.access_token || 
              session.user?.user_metadata?.provider_token || '';
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'No GitHub token found' },
        { status: 400 }
      );
    }
    
    console.log('Token info:', {
      provider,
      hasToken: !!token,
      tokenLength: token.length
    });
    
    // Step 1: Fetch repository data from GitHub
    console.log(`Fetching GitHub data for ${owner}/${repo}`);
    let repoData;
    
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API error:', response.status, errorText);
        return NextResponse.json(
          {
            error: 'GitHub API error',
            status: response.status,
            text: errorText
          },
          { status: 500 }
        );
      }
      
      repoData = await response.json();
      console.log('GitHub data retrieved:', {
        id: repoData.id,
        full_name: repoData.full_name,
        private: repoData.private
      });
    } catch (error) {
      console.error('Error fetching from GitHub API:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch from GitHub API',
          message: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
    
    // Step 2: Create a fingerprint using a simple hashing method
    const fingerprint = createSimpleFingerprint(platform, owner, repo);
    console.log('Generated fingerprint:', fingerprint);
    
    // Step 3: Check if repo already exists in database
    let existingRepo;
    try {
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .or(`fingerprint.eq.${fingerprint},and(owner.eq.${owner},name.eq.${repo})`)
        .limit(1);
      
      if (error) {
        console.error('Error checking for existing repo:', error);
      } else if (data && data.length > 0) {
        existingRepo = data[0];
        console.log('Found existing repository in database:', {
          id: existingRepo.id,
          owner: existingRepo.owner,
          name: existingRepo.name,
          fingerprint: existingRepo.fingerprint
        });
      }
    } catch (error) {
      console.error('Unexpected error checking for existing repo:', error);
    }
    
    // Step 4: Insert or update repository record
    let dbRepo;
    try {
      // Create a complete repository record with all fields
      const repoRecord = {
        id: existingRepo?.id || generateUUID(),
        github_id: String(repoData.id),
        owner: repoData.owner.login,
        name: repoData.name,
        description: repoData.description || '',
        is_private: repoData.private,
        default_branch: repoData.default_branch,
        url: repoData.html_url,
        language: repoData.language,
        topics: repoData.topics || [],
        fingerprint: fingerprint,
        analysis_count: existingRepo?.analysis_count || 0,
        free_tier_analysis_limit: existingRepo?.free_tier_analysis_limit || 5,
        created_at: existingRepo?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        last_analyzed_at: existingRepo?.last_analyzed_at || null,
        platform: platform, // Add the platform field that was missing
        metadata: {
          external_id: null,
          has_admin_access: repoData.permissions?.admin || false,
          has_write_access: repoData.permissions?.push || false,
          has_read_access: repoData.permissions?.pull || true
        }
      };
          
      // Upsert the repository
      if (existingRepo) {
        console.log('Updating existing repository:', repoRecord.id);
        const { data, error } = await supabase
          .from('repositories')
          .update(repoRecord)
          .eq('id', repoRecord.id)
          .select()
          .single();
      
        if (error) {
          console.error('Error updating repository:', error);
          return NextResponse.json(
            {
              error: 'Failed to update repository',
              details: error
            },
            { status: 500 }
          );
        }
          
        dbRepo = data;
      } else {
        console.log('Creating new repository:', repoRecord.id);
        const { data, error } = await supabase
          .from('repositories')
          .insert(repoRecord)
          .select()
          .single();
      
        if (error) {
          console.error('Error inserting repository:', error);
          return NextResponse.json(
            {
              error: 'Failed to insert repository',
              details: error
            },
            { status: 500 }
          );
        }
          
        dbRepo = data;
      }
      
      console.log('Repository saved to database:', {
        id: dbRepo.id,
        owner: dbRepo.owner,
        name: dbRepo.name,
        fingerprint: dbRepo.fingerprint,
        analysis_count: dbRepo.analysis_count
      });
    } catch (error) {
      console.error('Unexpected error saving repository:', error);
      return NextResponse.json(
        {
          error: 'Failed to save repository',
          message: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
    
    // Step 5: Increment the analysis count
    try {
      console.log('Incrementing analysis count for:', dbRepo.id);
      const { data, error } = await supabase
        .from('repositories')
        .update({
          analysis_count: (dbRepo.analysis_count || 0) + 1,
          last_analyzed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', dbRepo.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error incrementing analysis count:', error);
      } else {
        console.log('Analysis count updated:', {
          id: data.id,
          previous: dbRepo.analysis_count,
          new: data.analysis_count
        });
        dbRepo = data;
      }
    } catch (error) {
      console.error('Unexpected error incrementing analysis count:', error);
    }
    
    return NextResponse.json({
      success: true,
      repository: {
        id: dbRepo.id,
        owner: dbRepo.owner,
        name: dbRepo.name,
        description: dbRepo.description,
        private: dbRepo.is_private,
        analysisCount: dbRepo.analysis_count,
        limit: dbRepo.free_tier_analysis_limit,
        fingerprint: dbRepo.fingerprint,
        platform: dbRepo.platform // Include platform in the response
      },
      limits: {
        current: dbRepo.analysis_count,
        limit: dbRepo.free_tier_analysis_limit,
        hasReachedLimit: (dbRepo.analysis_count || 0) >= (dbRepo.free_tier_analysis_limit || 5)
      }
    });
  } catch (error) {
    console.error('Unexpected error in fix-repo endpoint:', error);
    return NextResponse.json(
      {
        error: 'Unexpected error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}