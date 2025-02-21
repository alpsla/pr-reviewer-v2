import { EmailAuthService } from "../email-auth";
import { createMockDatabaseService, mockBaseUser } from "../../__tests__/utils/test-utils";
import { MockSupabaseClient, type MockClient } from "../../__mocks__/supabase";
import type { DatabaseService } from "../../supabase/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database/types";

describe("EmailAuthService", () => {
  let emailAuthService: EmailAuthService;
  let mockSupabase: MockClient;
  let mockDb: jest.Mocked<DatabaseService>;
  
  const mockConfig = {
    redirectTo: 'http://localhost:3000/auth/callback',
    emailTemplate: {
      subject: 'Sign in to PR Reviewer',
      from: 'noreply@example.com',
      template: 'magic-link' as const,
    },
  };

  const mockSession = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: mockBaseUser
  };

  beforeEach(() => {
    mockSupabase = new MockSupabaseClient();
    mockDb = createMockDatabaseService();
    emailAuthService = new EmailAuthService(
      mockSupabase as unknown as SupabaseClient<Database>,
      mockDb,
      mockConfig
    );

    // Set up mock responses
    mockDb.createUser.mockResolvedValue({
      id: mockBaseUser.id,
      email: mockBaseUser.email,
      name: mockBaseUser.user_metadata.full_name,
      avatar_url: mockBaseUser.user_metadata.avatar_url,
      auth_provider: 'email',
      status: 'active'
    });

    mockSupabase.auth.signInWithOtp.mockResolvedValue({
      data: {},
      error: null
    });

    mockSupabase.auth.verifyOtp.mockResolvedValue({
      data: {
        session: mockSession,
        user: mockBaseUser
      },
      error: null
    });

    mockSupabase.auth.refreshSession.mockResolvedValue({
      data: {
        session: mockSession,
        user: mockBaseUser
      },
      error: null
    });
  });

  describe("sendMagicLink", () => {
    it("should send magic link successfully", async () => {
      await emailAuthService.sendMagicLink("test@example.com");
      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: "test@example.com",
        options: expect.any(Object)
      });
    });

    it("should throw when magic link sending fails", async () => {
      mockSupabase.auth.signInWithOtp.mockResolvedValue({
        data: null,
        error: new Error("Failed to send magic link")
      });

      await expect(emailAuthService.sendMagicLink("test@example.com"))
        .rejects.toThrow("Failed to send magic link");
    });
  });

  describe("verifyMagicLink", () => {
    it("should verify magic link and create session", async () => {
      const result = await emailAuthService.verifyMagicLink("valid-token");
      expect(result.user).toBeDefined();
      expect(result.session).toBeDefined();
      expect(mockDb.createUser).toHaveBeenCalled();
    });

    it("should throw when token verification fails", async () => {
      mockSupabase.auth.verifyOtp.mockResolvedValue({
        data: { session: null, user: null },
        error: new Error("Invalid token")
      });

      await expect(emailAuthService.verifyMagicLink("invalid-token"))
        .rejects.toThrow("Invalid or expired magic link");
    });
  });

  describe("refreshToken", () => {
    it("should refresh session successfully", async () => {
      const result = await emailAuthService.refreshToken("valid-refresh-token");
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });

    it("should throw when token refresh fails", async () => {
      mockSupabase.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: new Error("Invalid refresh token")
      });

      await expect(emailAuthService.refreshToken("invalid-token"))
        .rejects.toThrow("Failed to refresh token");
    });
  });
});