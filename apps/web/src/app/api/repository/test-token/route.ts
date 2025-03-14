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

    console.log('Full session:', {
      user: session.user,
      access_token: !!session.access_token,
      provider_token: !!session.provider_token,
      provider_refresh_token: !!session.provider_refresh_token,
      app_metadata: session.user?.app_metadata,
      user_metadata: session.user?.user_metadata,
      auth_metadata: session.user?.identities?.[0]?.identity_data
    });

    // Try to find the token from multiple possible sources
    let githubToken = session.provider_token || '';
    let provider = session.user?.app_metadata?.provider as string || '';
    
    // Check if token is missing but might be in other places
    if (!githubToken) {
      // Try auth metadata
      const accessToken = session.user?.identities?.[0]?.identity_data?.access_token;
      if (accessToken) {
        console.log('Found token in identity_data');
        githubToken = accessToken;
      }
      
      // Try user metadata
      const userMetadataToken = session.user?.user_metadata?.provider_token;
      if (userMetadataToken) {
        console.log('Found token in user_metadata');
        githubToken = userMetadataToken;
      }
    }

    // Get provider tokens (GitHub, GitLab, etc.)
    const tokens: { github?: string; gitlab?: string } = {};
    
    if (githubToken) {
      if (provider === 'github') {
        tokens.github = githubToken;
      } else if (provider === 'gitlab') {
        tokens.gitlab = githubToken;
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      auth: {
        provider,
        hasGithubToken: !!tokens.github,
        hasGitlabToken: !!tokens.gitlab,
        tokenLength: githubToken ? githubToken.length : 0,
        tokenSources: {
          provider_token: !!session.provider_token,
          identity_data: !!session.user?.identities?.[0]?.identity_data?.access_token,
          user_metadata: !!session.user?.user_metadata?.provider_token
        }
      }
    });
  } catch (error) {
    console.error('Error testing token:', error);
    return NextResponse.json(
      { 
        error: 'Error testing token',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}