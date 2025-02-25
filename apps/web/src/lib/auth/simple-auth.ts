'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Simple auth service for client-side use only
export const clientAuth = {
  // Get the current session
  getSession: async () => {
    const supabase = createClientComponentClient();
    return supabase.auth.getSession();
  },
  
  // Get the current user
  getUser: async () => {
    const supabase = createClientComponentClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  
  // Sign in with OAuth provider
  signInWithOAuth: async (provider: 'github' | 'gitlab') => {
    const supabase = createClientComponentClient();
    
    const scopes = {
      github: ['read:user', 'repo'],
      gitlab: ['read_user']
    };
    
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: scopes[provider].join(' ')
      }
    });
  },
  
  // Sign out
  signOut: async () => {
    const supabase = createClientComponentClient();
    return supabase.auth.signOut();
  }
};
