'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { authService } from '@/lib/auth/init';
import { logger } from '@/lib/utils/logger';

import type { User, Session } from '@supabase/auth-helpers-nextjs';

interface SupabaseContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextValue>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logger.log('Starting auth initialization...');
        const result = await authService.getSession();
        logger.log('Session result:', result.session ? 'Has session' : 'No session');
        
        if (result.session) {
          setSession(result.session);
          setUser(result.session.user);
          logger.log('Found existing session, but not auto-redirecting');
          // Don't auto-redirect to dashboard - let middleware handle this
        }

        logger.log('Setting up auth state change listener...');
        authService.onAuthStateChange((authUser) => {
          logger.log('Auth state changed:', authUser ? 'User authenticated' : 'No user');
          if (authUser) {
            setUser(authUser as User);
            logger.log('User authenticated, state updated');
            // Don't auto-redirect - let the individual pages decide
          } else {
            setUser(null);
            logger.log('No user detected');
            // Don't force redirect to home
          }
        });
      } catch (error) {
        logger.error('Error in auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const signOutHandler = async () => {
    try {
      if (!user) {
        logger.warn('No user found during sign out');
        return;
      }
      logger.log('Signing out user:', user.id);
      await authService.signOut(user.id);
      setUser(null);
      setSession(null);
      // Use window.location to ensure a full page reload
      window.location.href = '/?signedout=true';
    } catch (error) {
      logger.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut: signOutHandler,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};