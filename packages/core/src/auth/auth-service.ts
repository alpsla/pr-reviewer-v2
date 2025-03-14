import { SupabaseClient, User, Provider } from "@supabase/supabase-js";
import {
  AuthOptions,
  AuthProvider,
  AuthResponse,
  AuthUser,
  GitHubAuthScopes,
  GitLabAuthScopes,
  MicrosoftAuthScopes,
  GoogleAuthScopes,
  AuthProviderConfig,
  AuthSession,
} from "./types";
import { DatabaseService } from "../supabase/database";
import { AuthError } from "../errors";
import { getDefaultAuthConfig } from './config';
import { EmailAuthService, EmailAuthConfig } from "./email-auth";
import { logger } from "../utils/logger";
import type { Database } from "../types/database/types";

export class AuthService {
  constructor(
    private supabase: SupabaseClient<Database>,
    private db: DatabaseService,
    private config: AuthProviderConfig,
    private emailConfig?: EmailAuthConfig,
  ) {}

  async signInWithGitHub(
    options: Omit<AuthOptions, "scopes"> & { scopes?: GitHubAuthScopes[] } = {},
  ): Promise<AuthResponse> {
    logger.log('Starting GitHub sign-in');
    
    // Explicitly include repo, read:user, and user:email scopes to ensure access to private repositories
    const defaultScopes =
      this.config.defaultScopes?.github ??
      (["read:user", "repo", "user:email"] as GitHubAuthScopes[]);
    
    logger.log('GitHub scopes:', defaultScopes);
    
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider<GitHubAuthScopes>(
      "github",
      {
        ...options,
        // Ensure token refresh is enabled
        refreshToken: options.refreshToken !== false
      },
      scopesToUse
    );
  }

  async signInWithGitLab(
    options: Omit<AuthOptions, "scopes"> & { scopes?: GitLabAuthScopes[] } = {},
  ): Promise<AuthResponse> {
    logger.log('Starting GitLab sign-in');
    const defaultScopes =
      this.config.defaultScopes?.gitlab ??
      (["read_api", "read_user", "profile"] as GitLabAuthScopes[]);
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider<GitLabAuthScopes>(
      "gitlab",
      options,
      scopesToUse
    );
  }

  async signInWithMicrosoft(
    options: Omit<AuthOptions, "scopes"> & { scopes?: MicrosoftAuthScopes[] } = {},
  ): Promise<AuthResponse> {
    const defaultScopes =
      this.config.defaultScopes?.microsoft ??
      (["openid", "email", "profile"] as MicrosoftAuthScopes[]);
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider<MicrosoftAuthScopes>(
      "azure",
      options,
      scopesToUse
    );
  }

  async signInWithGoogle(
    options: Omit<AuthOptions, "scopes"> & { scopes?: GoogleAuthScopes[] } = {},
  ): Promise<AuthResponse> {
    const defaultScopes =
      this.config.defaultScopes?.google ??
      (["openid", "email", "profile"] as GoogleAuthScopes[]);
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider<GoogleAuthScopes>(
      "google",
      options,
      scopesToUse
    );
  }

  async signInWithEmail(email: string): Promise<void> {
    if (!this.emailConfig) {
      throw new AuthError("Email authentication not configured");
    }
    const emailAuth = new EmailAuthService(
      this.supabase,
      this.db,
      this.emailConfig,
    );
    return emailAuth.sendMagicLink(email);
  }

  async verifyEmailLink(token: string): Promise<AuthResponse> {
    if (!this.emailConfig) {
      throw new AuthError("Email authentication not configured");
    }
    const emailAuth = new EmailAuthService(
      this.supabase,
      this.db,
      this.emailConfig,
    );
    return emailAuth.verifyMagicLink(token);
  }

  async signOut(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new AuthError("Failed to sign out", error);
      }

      await this.db.updateUser(userId, {
        status: "inactive",
      });
    } catch (error) {
      logger.error("Sign out error:", error);
      throw new AuthError("Failed to sign out", error);
    }
  }

  async getSession(): Promise<AuthResponse> {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();
      if (error) throw error;

      if (!session) {
        return {
          user: null,
          session: null,
        };
      }

      const enhancedUser = await this.enhanceUser(session.user);
      return {
        user: enhancedUser,
        session,
      };
    } catch (error) {
      logger.error("Get session error:", error);
      throw new AuthError("Failed to get session", error);
    }
  }

  async getUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser();
      if (error) throw error;
      if (!user) return null;

      return this.enhanceUser(user);
    } catch (error) {
      logger.error("Get user error:", error);
      return null;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = await this.enhanceUser(session.user);
        callback(user);
      } else if (event === "SIGNED_OUT") {
        callback(null);
      }
    });
  }

  private async signInWithProvider<T extends string>(
    provider: Provider,
    options: Omit<AuthOptions, "scopes">,
    scopes: T[],
  ): Promise<AuthResponse> {
    try {
      logger.log('SignInWithProvider:', { provider, options, scopesRequested: scopes });

      const { refreshToken = true } = options;
      const redirectTo = options.redirectTo || (
        this.config.urlConfig 
          ? this.config.urlConfig.redirectUrl
          : getDefaultAuthConfig().redirectUrl
      );

      logger.log('Configured options:', { redirectTo, refreshToken });

      // Add special query parameters based on provider
      const queryParams: Record<string, string> = {
        refresh_token: refreshToken ? "true" : "false",
      };
      
      // For GitHub, explicitly add parameters for private repo access
      if (provider === 'github') {
        queryParams.allow_signup = 'true';
      }

      const oauthOptions = {
        provider,
        options: {
          redirectTo,
          scopes: scopes.join(" "),
          queryParams
        },
      };

      logger.log('OAuth request config:', oauthOptions);

      // Make the OAuth sign-in request
      const result = await this.supabase.auth.signInWithOAuth(oauthOptions);

      logger.log('OAuth result received:', {
        hasData: !!result?.data,
        hasError: !!result?.error,
        dataType: result?.data ? (typeof result.data === 'object' ? 'object' : typeof result.data) : 'none'
      });

      if (!result) {
        logger.error('No result from OAuth provider');
        throw new Error(`No response from ${provider} OAuth provider`);
      }

      const { data, error } = result;

      if (error) {
        logger.error('OAuth error:', error);
        throw error;
      }

      if (!data) {
        logger.error('No data in OAuth response');
        throw new Error("No data returned from OAuth provider");
      }

      // Check if it's a URL response (most common during redirect flow)
      if ('url' in data && data.url) {
        logger.log('Redirecting to OAuth URL:', data.url);
        return {
          session: null,
          user: null,
        };
      }

      // Check if it's a session response
      if ('session' in data && data.session && 'user' in data && data.user) {
        logger.log('Got session from OAuth');
        const sessionData = data.session as AuthSession;
        const userData = data.user as User;
        
        // Log token info for debugging
        logger.debug('Token info:', {
          hasProviderToken: !!sessionData.provider_token,
          hasAccessToken: !!sessionData.access_token,
          providerTokenLength: sessionData.provider_token?.length || 0,
          expiresAt: sessionData.expires_at,
          tokenType: sessionData.token_type,
          provider: userData.app_metadata?.provider,
          hasMetadataToken: !!userData.user_metadata?.provider_token
        });
        
        // Store provider token in user metadata for easier access later
        if (sessionData.provider_token && !userData.user_metadata?.provider_token) {
          try {
            await this.supabase.auth.updateUser({
              data: {
                provider_token: sessionData.provider_token,
                scopes: scopes.join(' ')
              }
            });
            logger.debug('Updated user metadata with provider token');
          } catch (updateError) {
            logger.error('Failed to update user with provider token:', updateError);
            // Continue anyway - this is not critical
          }
        }
        
        await this.updateUserProfile(userData);
        const user = await this.enhanceUser(userData);
        
        // Ensure the provider token is available
        if (sessionData.provider_token) {
          user.providerToken = sessionData.provider_token;
        }
        
        return {
          user,
          session: sessionData,
        };
      }

      logger.log('No URL or session in OAuth response');
      return {
        session: null,
        user: null,
      };
    } catch (error) {
      logger.error('Sign in error:', error);
      throw new AuthError(`Failed to sign in with ${provider}`, error as Error);
    }
  }

  private async enhanceUser(user: User): Promise<AuthUser> {
    const provider = user.app_metadata.provider as AuthProvider;
    
    // Extract OAuth scopes - check both app_metadata and user_metadata
    const scopesString = user.app_metadata.scopes || user.user_metadata.scopes;
    const scopes = scopesString
      ? typeof scopesString === 'string'
        ? scopesString.split(" ")
        : scopesString
      : [];
    
    // Check for tokens in multiple locations
    let providerToken = user.app_metadata.provider_token;
    
    // If no token in app_metadata, check user_metadata
    if (!providerToken && user.user_metadata?.provider_token) {
      providerToken = user.user_metadata.provider_token;
      logger.debug('Found provider token in user_metadata');
    }
    
    // Log the token information for debugging
    logger.debug('User tokens:', { 
      hasAppMetadataToken: !!user.app_metadata.provider_token,
      hasUserMetadataToken: !!user.user_metadata?.provider_token,
      finalTokenLength: providerToken?.length || 0,
      scopes
    });
    
    const enhancedUser: AuthUser = {
      ...user,
      provider,
      providerUserId: user.id,
      name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Unknown User',
      avatarUrl: user.user_metadata.avatar_url,
      providerToken: providerToken,
      providerScopes: scopes,
      auth_provider: provider,
      status: "active",
    };

    // Store whether user has repo scope for GitHub
    if (provider === 'github') {
      const hasRepoScope = scopes.includes('repo');
      const hasReadUserScope = scopes.includes('read:user');
      logger.debug('GitHub scopes check:', { hasRepoScope, hasReadUserScope, allScopes: scopes });
    }

    return enhancedUser;
  }

  private async updateUserProfile(user: User) {
    if (!user?.user_metadata) return;

    const { full_name, avatar_url } = user.user_metadata;

    if (full_name || avatar_url) {
      await this.db.createUser({
        id: user.id,
        email: user.email ?? "",
        name: full_name ?? user.email?.split("@")[0] ?? "Unknown User",
        avatar_url: avatar_url,
        github_id: user.id,
        auth_provider: "github",
        status: "active",
      });
    }
  }
}