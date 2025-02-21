import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // eslint-disable-next-line no-console
  console.log('Middleware: Accessing path', request.nextUrl.pathname);

  try {
    // Clone the request to avoid modifying the original
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session if expired
    const { data: { session: refreshedSession } } = await supabase.auth.getSession();
    
    // Add debug headers for session state
    res.headers.set('x-middleware-cache', 'no-cache');
    res.headers.set('x-middleware-timestamp', Date.now().toString());
    
    // eslint-disable-next-line no-console
    console.log('Middleware: Session check result', { 
      path: request.nextUrl.pathname,
      hasSession: !!refreshedSession,
    });

    // Check for direct parameter indicating intentional navigation
    // If present, skip protection checks for this request
    const url = request.nextUrl;
    const isDirect = url.searchParams.has('direct');
    
    if (isDirect) {
      // eslint-disable-next-line no-console
      console.log('Middleware: Direct navigation requested, bypassing checks');
      return res;
    }

    // Only protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      // eslint-disable-next-line no-console
      console.log('Middleware: Checking dashboard access');
      
      // If direct param or referrer includes dashboard, allow access to prevent loops
      const referer = request.headers.get('referer') || '';
      if (referer.includes('/dashboard') || referer.includes('direct=true')) {
        // eslint-disable-next-line no-console
        console.log('Middleware: Coming from dashboard, allowing access');
        return res;
      }
      
      if (!refreshedSession) {
        // eslint-disable-next-line no-console
        console.log('Middleware: No session, redirecting to home');
        
        // Check for redirect loop
        if (referer.includes('/?auth=required')) {
          // eslint-disable-next-line no-console
          console.log('Middleware: Detected potential redirect loop, allowing access');
          return res;
        }
        
        return NextResponse.redirect(new URL('/?auth=required', request.url));
      }
      
      // eslint-disable-next-line no-console
      console.log('Middleware: Session valid, allowing dashboard access');
    }

    return res;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Middleware error:', error);
    // Continue anyway but log the error
    return NextResponse.next();
  }
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}