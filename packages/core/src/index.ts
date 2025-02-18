import { AuthService } from './auth/auth-service';
import { EmailAuthService, type EmailAuthConfig, type EmailTemplate } from './auth/email-auth';
import { DatabaseService } from './supabase/database';
import type { Database } from './types/database/types';
import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  AuthProvider,
  AuthProviderConfig,
  AuthOptions,
  GitHubAuthScopes,
  GitLabAuthScopes,
  MicrosoftAuthScopes,
  GoogleAuthScopes,
} from './auth/types';
import { AuthError } from './errors';

export {
  AuthService,
  EmailAuthService,
  DatabaseService,
  AuthError,
};

export type {
  Database,
  AuthResponse,
  AuthSession,
  AuthUser,
  AuthProvider,
  AuthProviderConfig,
  AuthOptions,
  GitHubAuthScopes,
  GitLabAuthScopes,
  MicrosoftAuthScopes,
  GoogleAuthScopes,
  EmailAuthConfig,
  EmailTemplate,
};