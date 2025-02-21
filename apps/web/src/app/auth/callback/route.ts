import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { logger } from '@/lib/utils/logger';
import { authService } from '@/lib/auth/init';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    logger.log('Auth callback route triggered');
    const requestUrl = new URL(request.url);
    
    // Get all potential authentication parameters
    const code = requestUrl.searchParams.get('code');
    const token = requestUrl.searchParams.get('token');
    const tokenHash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');
    const provider = requestUrl.searchParams.get('provider');

    logger.log('Auth callback parameters:', {
      url: requestUrl.toString(),
      hasCode: !!code,
      hasToken: !!token,
      hasTokenHash: !!tokenHash,
      type,
      provider,
      allParams: Array.from(requestUrl.searchParams).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>)
    });
    
    // Handle email magic link authentication with either token or token_hash
    if ((provider === 'email' && token) || (type === 'magiclink' && tokenHash)) {
      try {
        logger.log('Processing email magic link token');
        // Use token_hash if available, otherwise use token
        const authToken = tokenHash || token;
        if (!authToken) {
          throw new Error('No valid token found for email authentication');
        }
        
        await authService.verifyEmailLink(authToken);
        
        // Redirect to dashboard after successful email verification
        const dashboardUrl = new URL('/dashboard', requestUrl.origin);
        dashboardUrl.searchParams.set('auth', 'success');
        dashboardUrl.searchParams.set('provider', 'email');
        dashboardUrl.searchParams.set('t', Date.now().toString());
        
        const response = NextResponse.redirect(dashboardUrl);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('x-auth-redirect', 'true');
        
        logger.log('Email verification successful, redirecting to dashboard');
        return response;
      } catch (err) {
        logger.error('Error verifying email token:', err);
        return NextResponse.redirect(
          new URL(`/?error=${encodeURIComponent('Invalid or expired magic link')}`, requestUrl.origin)
        );
      }
    }

    // Handle OAuth code exchange
    if (!code) {
      logger.error('No code found in URL');
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    logger.log('Exchanging code for session...');
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }

    logger.log('Session exchange successful, preparing dashboard redirect');

    // Construct dashboard URL with useful debug parameters
    const dashboardUrl = new URL('/dashboard', requestUrl.origin);
    dashboardUrl.searchParams.set('auth', 'success');
    dashboardUrl.searchParams.set('provider', 'github');
    dashboardUrl.searchParams.set('t', Date.now().toString());
    
    // Set cache control and other useful headers
    const response = NextResponse.redirect(dashboardUrl);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('x-auth-redirect', 'true');
    
    logger.log('Redirecting to dashboard with URL:', dashboardUrl.toString());
    return response;
  } catch (error) {
    logger.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/?error=Unexpected%20error', request.url)
    );
  }
}