import { NextResponse } from 'next/server';

/**
 * Redirect handler for the client-side callback path
 * 
 * This ensures that if anyone navigates to /auth/callback-client
 * (perhaps from a bookmark or manual entry), they will be redirected
 * to the proper /auth/callback path that handles the authentication.
 */

export function GET(request: Request) {
  // Extract the search parameters
  const url = new URL(request.url);
  const callbackUrl = new URL('/auth/callback', url.origin);
  
  // Copy all search parameters from the request URL to the callback URL
  url.searchParams.forEach((value, key) => {
    callbackUrl.searchParams.set(key, value);
  });
  
  // Perform the redirect
  return NextResponse.redirect(callbackUrl);
}
