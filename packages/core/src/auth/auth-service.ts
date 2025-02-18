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
    const defaultScopes =
      this.config.defaultScopes?.github ??
      (["read:user", "repo"] as GitHubAuthScopes[]);
    const scopesToUse = options.scopes ?? defaultScopes;
    return this.signInWithProvider<GitHubAuthScopes>(
      "github",
      options,
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
      logger.log('SignInWithProvider:', { provider, options, scopes });

      const { refreshToken = true } = options;
      const redirectTo = options.redirectTo || (
        this.config.urlConfig 
          ? this.config.urlConfig.redirectUrl
          : getDefaultAuthConfig().redirectUrl
      );

      logger.log('Configured options:', { redirectTo, refreshToken });

      const oauthOptions = {
        provider,
        options: {
          redirectTo,
          scopes: scopes.join(" "),
          queryParams: {
            refresh_token: refreshToken ? "true" : "false",
          },
        },
      };

      logger.log('OAuth request:', oauthOptions);

      const result = await this.supabase.auth.signInWithOAuth(oauthOptions);

      logger.log('OAuth response:', result);

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
        await this.updateUserProfile(userData);
        const user = await this.enhanceUser(userData);
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
    const enhancedUser: AuthUser = {
      ...user,
      provider,
      providerUserId: user.id,
      name: user.user_metadata.full_name,
      avatarUrl: user.user_metadata.avatar_url,
      providerToken: user.app_metadata.provider_token,
      providerScopes: user.app_metadata.scopes
        ? user.app_metadata.scopes.split(" ")
        : [],
      auth_provider: provider,
      status: "active",
    };

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