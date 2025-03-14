import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// List of routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard-new',
  '/dashboard',
  '/analyze',
  '/results',
  '/settings',
  '/account'
];

// List of routes that should redirect to dashboard if user is authenticated
const PUBLIC_ONLY_ROUTES = [
  '/'
];

// Middleware function to protect routes
export async function middleware(req: NextRequest) {
  // Create a Supabase client for the middleware
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the pathname from the URL
  const { pathname } = req.nextUrl;
  
  // Get the session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if the user is authenticated
  const isAuthenticated = !!session;
  
  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route) || pathname === route
  );
  
  // Check if the route should redirect when authenticated
  const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some(route => 
    pathname === route
  );
  
  // Redirect unauthenticated users from protected routes to the home page
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('redirect_to', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect authenticated users from public-only routes to the dashboard
  if (isPublicOnlyRoute && isAuthenticated) {
    const redirectUrl = new URL('/dashboard-new', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Allow the request to continue
  return res;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all paths except static files, api routes, and next.js specific routes
    '/((?!_next/static|_next/image|favicon.ico|images|api|auth/callback).*)',
  ],
};
