'use client';

/*
 * This client-side callback page has been temporarily disabled in favor of using
 * the server-side route handler at /auth/callback/route.ts
 * 
 * After testing confirms the server-side handler works correctly, this file can be removed.
 * If any issues are encountered, remove the comments to revert to the client-side approach.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get current session to verify successful auth
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Successfully authenticated - notify other tabs immediately
          const timestamp = Date.now().toString();
          
          // Use multiple methods to ensure the message gets through
          localStorage.setItem('auth_complete_time', timestamp);
          
          if (window.opener) {
            window.opener.postMessage('auth_complete', window.location.origin);
          }

          const bc = new BroadcastChannel('auth_channel');
          bc.postMessage('auth_complete');
          bc.close();

          // Close this tab if it's a magic link authentication
          const isEmailAuth = window.location.hash.includes('type=magiclink');
          if (isEmailAuth && window.opener) {
            window.opener.focus();
            window.close();
          } else {
            // If we can't close the tab, redirect to dashboard
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/auth/error');
      }
    };

    handleCallback();
  }, [router, supabase.auth]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">You'll be redirected automatically.</p>
      </div>
    </div>
  );
}