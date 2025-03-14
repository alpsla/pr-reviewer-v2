import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Import DatabaseService correctly
import { DatabaseService } from '@/app/_dashboard_old/pr-analyzer/database-service';';

// Create our own AuthService class to avoid core dependency issues
class AuthService {
  constructor(
    private supabase: SupabaseClient,
    private database: DatabaseService,
    private authConfig: any,
    private emailConfig: any
  ) {}

  async signInWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: this.emailConfig.redirectTo,
        shouldCreateUser: true
      }
    });
  }

  async verifyEmailLink(token: string) {
    // The token is automatically processed by Supabase
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data;
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async getSession() {
    return this.supabase.auth.getSession();
  }

  onAuthStateChange(callback: (user: any) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}

// Temporarily define EmailAuthConfig here to avoid build issues
interface EmailTemplate {
  subject: string;
  from: string;
  replyTo?: string;
  template: "magic-link" | "welcome" | "password-reset";
  buttonText?: string;
  expiryHours?: number;
}

interface EmailAuthConfig {
  redirectTo: string;
  emailTemplate?: EmailTemplate;
  tokenExpiryMinutes?: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

const db = new DatabaseService(supabase);

// Get the callback URL from environment or use the window location
const getCallbackUrl = () => {
  // For server-side rendering, use environment variables
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || 
           (process.env.NODE_ENV === 'development' ? 
             'http://localhost:3000/auth/callback' : 
             'https://codequal.dev/auth/callback');
  }
  
  // In the browser, we can use the window location
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/auth/callback';
  }
  
  // In production, use the configured URL
  return process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || 'https://codequal.dev/auth/callback';
};

// Define interface for auth config
interface AuthProviderConfig {
  provider: string;
  urlConfig: {
    redirectUrl: string;
  },
  defaultScopes: Record<string, string[]>;
}

const authConfig: AuthProviderConfig = {
  provider: 'github', // Default provider
  urlConfig: {
    redirectUrl: getCallbackUrl(),
  },
  defaultScopes: {
    github: ['read:user', 'repo'],
    gitlab: ['read_user'],
    microsoft: ['openid', 'email', 'profile'],
    google: ['openid', 'email', 'profile']
  }
};

// Email authentication configuration
const emailConfig: EmailAuthConfig = {
  redirectTo: getCallbackUrl(),
  // Simplified config - remove custom template settings that might be causing issues
  tokenExpiryMinutes: 1440 // 24 hours
};

export const authService = new AuthService(supabase, db, authConfig, emailConfig);
