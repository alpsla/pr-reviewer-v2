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
    const platform = url.searchParams.get('platform') || 'github';
    const repoUrl = url.searchParams.get('repo') || 'facebook/react';
    const [owner, repo] = repoUrl.split('/');

    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Log session details to help debug
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({
        error: 'No session found',
        details: sessionError?.message || 'Not authenticated'
      }, { status: 401 });
    }

    // Log authentication details
    const authDetails = {
      provider: session.user?.app_metadata?.provider,
      hasProviderToken: !!session.provider_token,
      tokenLength: session.provider_token?.length || 0,
      hasUserMetadataToken: !!session.user?.user_metadata?.provider_token,
      identityData: session.user?.identities && session.user.identities.length > 0
        ? !!session.user.identities[0].identity_data?.access_token
        : false
    };

    console.log('Auth details:', authDetails);
    
    // Get token with priority order
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
    }

    const tokens: { github?: string; gitlab?: string } = {};
    const provider = session.user?.app_metadata?.provider as string || '';
    
    if (providerToken) {
      if (provider === 'github') {
        tokens.github = providerToken;
        console.log('GitHub token available, first 5 chars:', providerToken.substring(0, 5));
      } else if (provider === 'gitlab') {
        tokens.gitlab = providerToken;
      }
    } else {
      console.warn('No provider token found!');
    }

    // Get repository details
    const dbService = new DatabaseService(supabase);
    const repoService = new RepositoryService(dbService, tokens);

    try {
      // Check repository access
      console.log(`Testing access to ${platform} repository: ${owner}/${repo}`);
      const accessResult = await repoService.checkRepositoryAccess(
        platform as any,
        owner,
        repo
      );
      
      console.log('Repository access check result:', accessResult);

      // Try to get full repository details
      console.log('Fetching repository details...');
      const repository = await repoService.getRepository(
        platform as any,
        owner,
        repo
      );

      console.log('Repository details retrieved successfully');

      return NextResponse.json({
        success: true,
        authDetails,
        accessResult,
        repository: {
          id: repository.id,
          name: repository.name,
          owner: repository.owner,
          private: repository.private,
          permissions: repository.permissions,
          fingerprint: repository.fingerprint,
          analysisCount: repository.analysisCount
        }
      });
    } catch (repoError) {
      console.error('Error with repository operations:', repoError);
      return NextResponse.json({
        success: false,
        authDetails,
        error: 'Repository operation failed',
        errorDetails: repoError instanceof Error ? {
          message: repoError.message,
          name: repoError.name,
          stack: repoError.stack
        } : String(repoError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
