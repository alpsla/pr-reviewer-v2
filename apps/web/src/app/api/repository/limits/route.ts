import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RepositoryService } from '@/lib/repository';
import { DatabaseService } from '@/lib/database';
import { DEFAULT_FREE_TIER_ANALYSIS_LIMIT, getAnalysisLimit } from '@/config/limits';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const platform = url.searchParams.get('platform');
    const owner = url.searchParams.get('owner');
    const repo = url.searchParams.get('repo');

    if (!platform || !owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters: platform, owner, repo' },
        { status: 400 }
      );
    }

    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's tokens
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
    
    // Get provider tokens (GitHub, GitLab, etc.)
    const tokens: { github?: string; gitlab?: string } = {};
    
    if (providerToken) {
      if (provider === 'github') {
        tokens.github = providerToken;
      } else if (provider === 'gitlab') {
        tokens.gitlab = providerToken;
      }
    }

    // Special handling for test repositories
    const isTestRepo = (
      owner.toLowerCase().includes('test') || 
      repo.toLowerCase().includes('test')
    );
    
    if (isTestRepo) {
      console.log('Processing test repository limits:', { platform, owner, repo });
      
      try {
        // Generate a fingerprint
        const { createRepositoryFingerprint } = await import('@pr-reviewer/core');
        const fingerprint = createRepositoryFingerprint(platform as any, owner, repo);
        
        // Check if there's an existing fingerprinted repo first
        const { data: existingRepo } = await supabase
          .from('repositories')
          .select('id, analysis_count, free_tier_analysis_limit, fingerprint')
          .eq('fingerprint', fingerprint)
          .maybeSingle();
          
        if (existingRepo) {
          console.log('Found existing test repository by fingerprint:', {
            id: existingRepo.id,
            analysisCount: existingRepo.analysis_count,
            fingerprint: existingRepo.fingerprint
          });
          
          // Return the limits
          const current = existingRepo.analysis_count || 0;
          const limit = existingRepo.free_tier_analysis_limit || getAnalysisLimit(platform, owner, repo);
          
          return NextResponse.json({
            success: true,
            limits: {
              current,
              limit,
              hasReachedLimit: current >= limit
            }
          });
        } else {
          // No repository yet, return default limits
          const configuredLimit = getAnalysisLimit(platform, owner, repo);
          return NextResponse.json({
            success: true,
            limits: {
              current: 0,
              limit: configuredLimit,
              hasReachedLimit: false
            }
          });
        }
      } catch (error) {
        console.error('Error processing test repository limits:', error);
        // Return default limits even on error for test repositories
        const configuredLimit = getAnalysisLimit(platform, owner, repo);
        return NextResponse.json({
          success: true,
          limits: {
            current: 0,
            limit: configuredLimit,
            hasReachedLimit: false
          }
        });
      }
    }

    // Initialize database and repository services
    const dbService = new DatabaseService(supabase);
    const repoService = new RepositoryService(dbService, tokens);

    // Check repository analysis limits
    try {
      const limits = await repoService.checkAnalysisLimit(
        platform as any, // Using 'any' temporarily for the VCSPlatform type
        owner,
        repo
      );

      return NextResponse.json({
        success: true,
        limits
      });
    } catch (error) {
      console.error('Error in checkAnalysisLimit within route:', error);
      
      // Return default limits if there's an error
      console.log('Error in repository limits, returning default limits');
      const configuredLimit = getAnalysisLimit(platform, owner, repo);
      return NextResponse.json({
        success: true,
        limits: {
          current: 0,
          limit: configuredLimit,
          hasReachedLimit: false
        }
      });
    }
  } catch (error) {
    console.error('Error checking repository limits:', error);
    // Return default limits on any error for better user experience
    return NextResponse.json({
      success: true,
      limits: {
        current: 0,
        limit: DEFAULT_FREE_TIER_ANALYSIS_LIMIT,
        hasReachedLimit: false
      }
    });
  }
}