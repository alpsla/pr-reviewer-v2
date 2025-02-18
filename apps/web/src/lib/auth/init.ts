import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { AuthService, DatabaseService, type AuthProviderConfig, type Database } from '@pr-reviewer/core';

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

const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

const db = new DatabaseService(supabase);

// Get the callback URL from environment or use the window location
const getCallbackUrl = () => {
  // For local development, always use localhost callback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/auth/callback';
  }
  
  // In production, use the configured URL
  return process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || 'https://codequal.dev/auth/callback';
};

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