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
    
    // Get the authenticated user's tokens
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

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

    if (!providerToken) {
      return NextResponse.json(
        { error: 'No GitHub token found' },
        { status: 400 }
      );
    }

    // Try a direct GitHub API call using fetch
    // First, get user info
    console.log('Making direct GitHub API call...');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${providerToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { 
          error: 'GitHub API user request failed',
          status: userResponse.status,
          statusText: userResponse.statusText,
          headers: Object.fromEntries(userResponse.headers.entries())
        },
        { status: 500 }
      );
    }

    const userData = await userResponse.json();

    // Now, try to get a repository - use the URL params or defaults
    const url = new URL(request.url);
    const owner = url.searchParams.get('owner') || 'alpsla';
    const repo = url.searchParams.get('repo') || 'pr-reviewer-v2';

    console.log(`Fetching repo: ${owner}/${repo}`);
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${providerToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const repoHeaders = Object.fromEntries(repoResponse.headers.entries());
    console.log('GitHub API response headers:', repoHeaders);

    let repoData;
    let repoError;

    if (repoResponse.ok) {
      repoData = await repoResponse.json();
    } else {
      const errorText = await repoResponse.text();
      console.error('GitHub API error:', errorText);
      repoError = {
        status: repoResponse.status,
        statusText: repoResponse.statusText,
        body: errorText
      };
    }

    return NextResponse.json({
      success: true,
      githubUser: {
        login: userData.login,
        id: userData.id,
        name: userData.name,
        avatar_url: userData.avatar_url
      },
      repository: repoData || { error: repoError },
      rateLimit: {
        limit: repoHeaders['x-ratelimit-limit'],
        remaining: repoHeaders['x-ratelimit-remaining'],
        reset: repoHeaders['x-ratelimit-reset'],
        used: repoHeaders['x-ratelimit-used']
      }
    });
  } catch (error) {
    console.error('Error in direct GitHub test:', error);
    return NextResponse.json(
      { 
        error: 'Error testing GitHub API directly',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}