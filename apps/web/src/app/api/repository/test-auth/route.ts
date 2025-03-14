import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository';
import { DatabaseService } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const platform = url.searchParams.get('platform') || 'github';
    const testRepo = url.searchParams.get('repo') || 'octokit/octokit.js'; // Public repo for testing
    const [owner, repo] = testRepo.split('/');

    console.log(`Testing auth for ${platform} repo: ${owner}/${repo}`);

    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error', details: sessionError?.message || 'No session found' },
        { status: 401 }
      );
    }

    // Extract and log all possible token locations
    const tokenLocations = {
      provider_token: !!session.provider_token,
      access_token: !!session.access_token,
      identity_data: session.user?.identities && session.user.identities.length > 0 ? 
        !!session.user.identities[0].identity_data?.access_token : false,
      user_metadata: !!session.user?.user_metadata?.provider_token,
      app_metadata: !!session.user?.app_metadata?.provider_token
    };

    console.log('Token locations:', tokenLocations);

    // Get provider tokens with priority order
    let providerToken = '';
    if (session.provider_token) {
      providerToken = session.provider_token;
      console.log('Using provider_token');
    } else if (session.user?.identities?.[0]?.identity_data?.access_token) {
      providerToken = session.user.identities[0].identity_data.access_token;
      console.log('Using identity_data.access_token');
    } else if (session.user?.user_metadata?.provider_token) {
      providerToken = session.user.user_metadata.provider_token;
      console.log('Using user_metadata.provider_token');
    } else if (session.user?.app_metadata?.provider_token) {
      providerToken = session.user.app_metadata.provider_token;
      console.log('Using app_metadata.provider_token');
    }

    const tokens: { github?: string; gitlab?: string } = {};
    const provider = session.user?.app_metadata?.provider as string || '';
    
    console.log('Auth provider:', provider);
    
    if (providerToken) {
      if (provider === 'github') {
        tokens.github = providerToken;
        console.log('GitHub token available');
      } else if (provider === 'gitlab') {
        tokens.gitlab = providerToken;
        console.log('GitLab token available');
      }
    } else {
      console.log('No provider token found');
    }

    // Initialize services
    const dbService = new DatabaseService(supabase);
    const repoService = new RepositoryService(dbService, tokens);

    // Test public repo access
    console.log('Testing access to public repository...');
    const publicAccessResult = await repoService.checkRepositoryAccess(
      platform as any,
      owner,
      repo
    );
    
    console.log('Public repo access result:', publicAccessResult);

    // Get user scopes if available
    let scopes: string[] = [];
    if (session.user?.app_metadata?.scopes) {
      scopes = typeof session.user.app_metadata.scopes === 'string' 
        ? session.user.app_metadata.scopes.split(' ')
        : session.user.app_metadata.scopes;
    }

    return NextResponse.json({
      success: true,
      auth: {
        provider,
        tokenLocations,
        hasToken: !!providerToken,
        tokenFirstChars: providerToken ? `${providerToken.substring(0, 5)}...` : 'none',
        scopes
      },
      publicRepoAccess: publicAccessResult,
      session: {
        userId: session.user?.id,
        userEmail: session.user?.email,
        expiresAt: session.expires_at,
        providerInfo: {
          providerType: provider,
          hasProviderData: !!session.user?.identities?.length,
          providerData: session.user?.identities?.length 
            ? { provider: session.user.identities[0].provider, id: session.user.identities[0].id }
            : null
        }
      }
    });
  } catch (error) {
    console.error('Auth test error:', error);
    
    return NextResponse.json(
      { 
        error: 'Auth test failed',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      },
      { status: 500 }
    );
  }
}