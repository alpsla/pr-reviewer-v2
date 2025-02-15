import { 
  SupabaseClient, 
  User, 
  Provider
} from '@supabase/supabase-js';
import { 
  AuthOptions, 
  AuthProvider, 
  AuthResponse, 
  AuthUser, 
  GitHubAuthScopes,
  GitLabAuthScopes,
  MicrosoftAuthScopes,
  AuthProviderConfig,
  scopesToArray,
  OAuthResponse
} from './types';
import { DatabaseService } from '../supabase/database';
import { AuthError } from '../errors';
import type { Database } from '../types/database';

export class AuthService {
  constructor(
    private supabase: SupabaseClient<Database>,
    private db: DatabaseService,
    private config: AuthProviderConfig
  ) {}

  async signInWithGitHub(options: Omit<AuthOptions, 'scopes'> & { scopes?: GitHubAuthScopes[] } = {}): Promise<AuthResponse> {
    const defaultScopes = this.config.defaultScopes?.github ?? ['read:user', 'repo'] as GitHubAuthScopes[];
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider('github', options, scopesToUse, scopesToArray);
  }

  async signInWithGitLab(options: Omit<AuthOptions, 'scopes'> & { scopes?: GitLabAuthScopes[] } = {}): Promise<AuthResponse> {
    const defaultScopes = this.config.defaultScopes?.gitlab ?? ['api', 'read_user'] as GitLabAuthScopes[];
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider('gitlab', options, scopesToUse, scopesToArray);
  }

  async signInWithMicrosoft(options: Omit<AuthOptions, 'scopes'> & { scopes?: MicrosoftAuthScopes[] } = {}): Promise<AuthResponse> {
    const defaultScopes = this.config.defaultScopes?.microsoft ?? ['openid', 'email', 'profile'] as MicrosoftAuthScopes[];
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider('azure', options, scopesToUse, scopesToArray);
  }

  private async signInWithProvider<T>(
    provider: Provider,
    options: Omit<AuthOptions, 'scopes'>,
    scopes: T[],
    scopeConverter: (scopes: T[]) => string[]
  ): Promise<AuthResponse> {
    try {
      const { refreshToken = true } = options;
      
      const result = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: options.redirectTo,
          scopes: scopes ? scopeConverter(scopes).join(' ') : undefined,
          queryParams: {
            refresh_token: refreshToken ? 'true' : 'false'
          }
        }
      }) as OAuthResponse;

      if (!result) {
        throw new Error(`No response from ${provider} OAuth provider`);
      }
      const { data, error } = result;

      if (error || !data) {
        throw error || new Error('No data returned from OAuth provider');
      }

      if (data.url) {
        return {
          session: null,
          user: null
        };
      }

      if (data.session) {
        await this.updateUserProfile(data.session.user);
        return {
          user: await this.enhanceUser(data.session.user),
          session: data.session
        };
      }

      return {
        session: null,
        user: null
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Sign in error:', error);
      }
      throw new AuthError(`Failed to sign in with ${provider}`, error);
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new AuthError('Failed to sign out', error);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Sign out error:', error);
      }
      throw new AuthError('Failed to sign out', error);
    }
  }

  async getSession(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;
  
      if (!session) {
        return {
          user: null,
          session: null
        };
      }
  
      const enhancedUser = await this.enhanceUser(session.user);
      return {
        user: enhancedUser,
        session: session
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Get session error:', error);
      }
      throw new AuthError('Failed to get session', error);
    }
  }

  async getUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      if (!user) return null;

      return this.enhanceUser(user);
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Get user error:', error);
      }
      return null;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await this.enhanceUser(session.user);
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  }

  private async enhanceUser(user: User): Promise<AuthUser> {
    const provider = user.app_metadata.provider as AuthProvider;
    const enhancedUser: AuthUser = {
      ...user,
      provider,
      providerUserId: user.id,
      name: user.user_metadata.full_name,
      avatarUrl: user.user_metadata.avatar_url,
      providerToken: user.app_metadata.provider_token,
      providerScopes: user.app_metadata.scopes ? user.app_metadata.scopes.split(' ') : []
    };
  
    return enhancedUser;
  }

  private async updateUserProfile(user: User) {
    if (!user?.user_metadata) return;

    const { full_name, avatar_url } = user.user_metadata;
    
    if (full_name || avatar_url) {
      const userData = {
        github_id: user.id,
        name: full_name ?? user.email?.split('@')[0] ?? 'Unknown User',
        avatar_url: avatar_url ?? '',
      };

      await this.db.createUser(userData);
    }
  }
}