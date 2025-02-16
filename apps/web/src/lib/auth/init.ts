import { supabase } from '../supabase/client';

export async function initializeAuth() {
  try {
    // Check for access token in URL fragment
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          // If no session exists, try to set up the session from the URL
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        }
        // Clear the hash
        window.location.hash = '';
      }
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
}