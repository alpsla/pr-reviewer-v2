'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { 
  User, 
  Session,
  createClientComponentClient
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (provider: 'github' | 'gitlab' | 'email', email?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create an AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Function to fetch the current session
  const fetchSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
        return null;
      }
      
      return data.session;
    } catch (error) {
      console.error('Unexpected error fetching session:', error);
      return null;
    }
  };

  // Function to refresh the session
  const refreshSession = async () => {
    setIsLoading(true);
    const currentSession = await fetchSession();
    setSession(currentSession);
    setUser(currentSession?.user || null);
    setIsLoading(false);
  };

  // Initialize auth state
  useEffect(() => {
    setIsLoading(true);
    
    // Initial session fetch
    const initializeAuth = async () => {
      const currentSession = await fetchSession();
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setIsLoading(false);
    };
    
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        setUser(newSession?.user || null);
        setIsLoading(false);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          router.push('/');
          router.refresh();
        }
      }
    );
    
    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Function to sign in with a provider
  const signIn = async (provider: 'github' | 'gitlab' | 'email', email?: string) => {
    try {
      setIsLoading(true);
      
      if (provider === 'email' && email) {
        // Magic link sign in with email
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser: true
          }
        });
        
        if (error) throw error;
        
        // Return early as we'll wait for user to click the email link
        setIsLoading(false);
        return;
      }
      
      // OAuth sign in (GitHub or GitLab)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'github' ? 'read:user repo' : 'read_user'
        }
      });
      
      if (error) throw error;
      
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Call our sign-out endpoint for server-side handling
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Sign out request failed');
      }
      
      // Also trigger client-side signout
      await supabase.auth.signOut();
      
      // Clear any local auth data
      localStorage.removeItem('auth_complete_time');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Set user and session to null
      setUser(null);
      setSession(null);
      
      // Redirect to home page
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Define the context value
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
