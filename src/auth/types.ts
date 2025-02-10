import { Session, User } from '@supabase/supabase-js';

export type AuthProvider = 'github' | 'azure';

export interface AuthUser extends User {
  provider?: AuthProvider;
  providerUserId?: string;
  name?: string;
  avatarUrl?: string;
  providerScopes?: string[];
  providerToken?: string;
}

export interface UserMetadata {
  provider_token?: string;
  provider?: AuthProvider;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthSession extends Session {
  provider?: AuthProvider;
}

export type GitLabAuthScopes = 
  | 'api' 
  | 'read_user' 
  | 'write_repository' 
  | 'read_repository' 
  | 'profile';

export type GitHubAuthScopes = 
  | 'repo' 
  | 'read:user' 
  | 'user:email' 
  | 'workflow';

export type MicrosoftAuthScopes = 
  | 'openid' 
  | 'email' 
  | 'profile' 
  | 'offline_access' 
  | 'User.Read';

  export interface DefaultScopes {
    github?: GitHubAuthScopes[];
    gitlab?: GitLabAuthScopes[];
    microsoft?: MicrosoftAuthScopes[];
  }
  
  export interface AuthProviderConfig {
    provider: AuthProvider;
    defaultScopes?: DefaultScopes; 
  }
  
  export type OAuthResponse = {
    data: { 
      url?: string;
      session?: Session;
      user?: User;
    };
    error: Error | null;
  };

export interface AuthOptions {
  redirectTo?: string;
  refreshToken?: string;
}

export interface MicrosoftAuthOptions extends AuthOptions {
  scopes?: MicrosoftAuthScopes[];
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
}

// Since we don't have specific fields for Microsoft/GitHub responses yet,
// we'll use type aliases instead of empty interfaces
export type MicrosoftAuthResponse = AuthResponse;
export type GithubAuthResponse = AuthResponse;

export interface GithubAuthOptions extends AuthOptions {
  scopes?: GitHubAuthScopes[];
}

// Add utility functions
export function scopesToArray(scopes: string[] | undefined): string[] {
  return scopes ?? [];
}

export function gitlabScopesToArray(scopes: GitLabAuthScopes[]): string[] {
  return scopesToArray(scopes);
}

export function microsoftScopesToArray(scopes: MicrosoftAuthScopes[]): string[] {
  return scopesToArray(scopes);
}
