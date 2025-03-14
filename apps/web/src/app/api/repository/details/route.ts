import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository';
import { DatabaseService } from '@/lib/database';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const platform = url.searchParams.get('platform');
    const owner = url.searchParams.get('owner');
    const repo = url.searchParams.get('repo');

    console.log('Repository details request:', { platform, owner, repo });

    if (!platform || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters: platform, owner, repo' },
        { status: 400 }
      );
    }

    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's tokens with more detailed error handling
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session retrieval error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error', details: sessionError.message },
        { status: 401 }
      );
    }
    
    if (!session) {
      console.log('No active session found');
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }
    
    // Extract and log all possible token locations for debugging
    console.log('Token debugging:');
    console.log('- provider_token:', !!session.provider_token);
    console.log('- access_token:', !!session.access_token);
    
    if (session.user?.identities && session.user.identities.length > 0) {
      console.log('- identity_data token:', !!session.user.identities[0].identity_data?.access_token);
    }
    
    console.log('- user_metadata token:', !!session.user?.user_metadata?.provider_token);
    console.log('- app_metadata token:', !!session.user?.app_metadata?.provider_token);

    // Extract provider and token information
    let provider = session.user?.app_metadata?.provider as string || '';
    let providerToken = session.provider_token || '';
    
    // Check if token is missing but might be in other places
    if (!providerToken) {
      // Try identity data
      const accessToken = session.user?.identities?.[0]?.identity_data?.access_token;
      if (accessToken) {
        console.log('Found token in identity_data');
        providerToken = accessToken;
      }
      
      // Try user metadata
      const userMetadataToken = session.user?.user_metadata?.provider_token;
      if (userMetadataToken) {
        console.log('Found token in user_metadata');
        providerToken = userMetadataToken;
      }
    }
    
    console.log('Auth info:', { 
      provider,
      hasToken: !!providerToken,
      tokenLength: providerToken?.length || 0
    });
    
    // Get provider tokens (GitHub, GitLab, etc.)
    const tokens: { github?: string; gitlab?: string } = {};
    
    if (providerToken) {
      if (provider === 'github') {
        tokens.github = providerToken;
      } else if (provider === 'gitlab') {
        tokens.gitlab = providerToken;
      }
    }

    // Initialize database and repository services
    const dbService = new DatabaseService(supabase);
    const repoService = new RepositoryService(dbService, tokens);

    console.log('Services initialized, tokens available:', {
      githubToken: !!tokens.github,
      gitlabToken: !!tokens.gitlab
    });

    // Get repository details
    console.log('Fetching repository details...');
    const repository = await repoService.getRepository(
      platform as any, // Using 'any' temporarily for the VCSPlatform type
      owner,
      repo
    );

    console.log('Repository details retrieved:', {
      id: repository.id,
      platform: repository.platform,
      owner: repository.owner,
      name: repository.name,
      fingerprint: repository.fingerprint,
      analysisCount: repository.analysisCount
    });

    // Get analysis limits
    console.log('Checking analysis limits...');
    const limits = await repoService.checkAnalysisLimit(
      platform as any,
      owner,
      repo
    );

    console.log('Analysis limits checked:', limits);

    return NextResponse.json({
      success: true,
      repository,
      limits
    });
  } catch (error) {
    console.error('Error fetching repository details:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch repository details',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
