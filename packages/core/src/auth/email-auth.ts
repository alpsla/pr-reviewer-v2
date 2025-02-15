import { AuthResponse, AuthSession, AuthUser } from "./types";
import { DatabaseService } from "../supabase/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { AuthError } from "../errors";
import type { Database } from "../types/database";

export interface EmailAuthConfig {
  redirectTo: string;
  emailTemplate?: EmailTemplate;
  tokenExpiryMinutes?: number;
}

export interface EmailTemplate {
  subject: string;
  from: string;
  replyTo?: string;
  template: "magic-link" | "welcome" | "password-reset";
  buttonText?: string;
  expiryHours?: number;
}

export class EmailAuthService {
  private readonly defaultTokenExpiry = 60; // 60 minutes

  constructor(
    private supabase: SupabaseClient<Database>,
    private db: DatabaseService,
    private config: EmailAuthConfig,
  ) {}

  async sendMagicLink(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: this.config.redirectTo,
          data: {
            emailTemplate: this.config.emailTemplate,
          },
        },
      });

      if (error) {
        throw new AuthError("Failed to send magic link", error);
      }
    } catch (error) {
      throw new AuthError("Failed to send magic link", error);
    }
  }

  async verifyMagicLink(token: string): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        token_hash: token,
        type: "magiclink",
      });

      if (error || !data.session || !data.user) {
        throw new AuthError("Invalid or expired magic link", error);
      }

      // Create or update user in our database
      const user = await this.db.createUser({
        id: data.user.id,
        email: data.user.email!,
        name:
          data.user.user_metadata.full_name ??
          data.user.email?.split("@")[0] ??
          "Unknown User",
        auth_provider: "email",
        status: "active",
      });

      if (!data.session) {
        throw new AuthError("No session created");
      }

      // Create session
      const session: AuthSession = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: 3600,
        expires_at:
          Math.floor(Date.now() / 1000) +
          (this.config.tokenExpiryMinutes || this.defaultTokenExpiry) * 60,
        token_type: "bearer",
        user: data.user as AuthUser,
      };

      return {
        user,
        session,
      };
    } catch (error) {
      throw new AuthError("Invalid or expired magic link", error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthSession> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        throw new AuthError("Failed to refresh token", error);
      }

      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: 3600,
        expires_at:
          Math.floor(Date.now() / 1000) +
          (this.config.tokenExpiryMinutes || this.defaultTokenExpiry) * 60,
        token_type: "bearer",
        user: data.user!,
      };
    } catch (error) {
      throw new AuthError("Failed to refresh token", error);
    }
  }

  async signOut(sessionId: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        throw new AuthError("Failed to sign out", error);
      }

      // Update user status in database
      await this.db.updateUser(sessionId, {
        status: "inactive",
        last_sign_in: undefined,
      });
    } catch (error) {
      throw new AuthError("Failed to sign out", error);
    }
  }
}
