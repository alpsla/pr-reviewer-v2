import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Server-side auth callback handler
 * 
 * This route handler processes the authentication callback from Supabase.
 * Client-side UI for the authentication process is at /auth/callback-ui.
 */

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('Auth callback route triggered');
    const requestUrl = new URL(request.url);
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the auth code from the URL
    const code = requestUrl.searchParams.get('code');
    
    if (code) {
      console.log('Found code in URL, exchanging for session...');
      // Exchange the code for a session
      const { error, data } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(
          new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }
      
      // Verify that we actually got a valid session
      if (!data || !data.session) {
        console.error('No session returned after code exchange');
        return NextResponse.redirect(
          new URL('/?error=Authentication%20failed', requestUrl.origin)
        );
      }
      
      console.log('Session exchange successful, redirecting to dashboard');
      
      // First ensure the user's email is verified
      if (!data.session.user.email_confirmed_at) {
        return NextResponse.redirect(
          new URL('/?error=Please%20verify%20your%20email', requestUrl.origin)
        );
      }
      
      // Instead of redirecting directly, show instructions to return to original tab
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Successful</title>
            <script>
              window.onload = function() {
                // Try to notify the opener window
                if (window.opener) {
                  try {
                    window.opener.postMessage('auth_complete', window.location.origin);
                    // Close this tab after sending the message
                    window.close();
                  } catch (e) {
                    console.error('Could not communicate with opener:', e);
                  }
                }
                // If we couldn't close the tab, redirect to dashboard or callback UI
                setTimeout(() => {
                  window.location.href = '/auth/callback-ui';
                }, 1000);
              };
            </script>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: #f9fafb;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 400px;
              }
              h1 { color: #1a56db; margin-bottom: 1rem; }
              p { color: #374151; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Authentication Successful!</h1>
              <p>You can now close this tab and return to the PR Reviewer.</p>
            </div>
          </body>
        </html>
      `;
      
      const response = new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        },
      });
      
      return response;
    }
    
    // If no code is found, redirect to home
    console.error('No authentication code found in URL');
    return NextResponse.redirect(new URL('/auth/callback-ui', requestUrl.origin));
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/?error=Unexpected%20error', request.url)
    );
  }
}