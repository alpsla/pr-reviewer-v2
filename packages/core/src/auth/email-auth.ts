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
      // Simplify the OTP request to reduce potential config issues
      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: this.config.redirectTo,
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
      // First, try token_hash verification (Supabase magic link format)
      const { data, error } = await this.supabase.auth.verifyOtp({
        token_hash: token,
        type: "magiclink",
      });

      // If magic link verification fails, try regular OTP verification
      if (error) {
        const otpResult = await this.supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        });
        
        if (otpResult.error || !otpResult.data.session || !otpResult.data.user) {
          throw new AuthError("Invalid or expired magic link", otpResult.error || error);
        }
        
        // Use the OTP result data
        return this.processAuthData(otpResult.data);
      }

      if (!data.session || !data.user) {
        throw new AuthError("No session created");
      }

      return this.processAuthData(data);
    } catch (error) {
      throw new AuthError("Invalid or expired magic link", error);
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private async processAuthData(data: { session: any, user: any }): Promise<AuthResponse> {
    // Create or update user in our database
    if (!data.user || !data.session) {
      throw new AuthError("Invalid authentication data");
    }
    
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


}