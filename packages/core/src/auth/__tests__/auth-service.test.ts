import { AuthService } from "../auth-service";
import { TestDatabaseService } from "../../__tests__/utils/test-utils";
import { MockSupabaseClient, type MockClient } from "../../__mocks__/supabase";
import { GitHubAuthScopes } from "../types";

const defaultAuthConfig = {
  provider: "github" as const,
  defaultScopes: {
    github: ["read:user", "repo"] as GitHubAuthScopes[],
  },
};

describe("AuthService", () => {
  let authService: AuthService;
  let mockSupabase: MockClient;
  let mockDb: TestDatabaseService;

  const mockBaseUser = {
    id: "test-id",
    email: "test@example.com",
    name: "Test User",
    auth_provider: "github",
    status: "active" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {
      provider: "github",
      providers: ["github"],
    },
    user_metadata: {
      full_name: "Test User",
      avatar_url: "https://example.com/avatar.png",
    },
  };

  const mockEnhancedUser = {
    ...mockBaseUser,
    provider: "github",
    providerUserId: mockBaseUser.id,
    name: mockBaseUser.user_metadata.full_name,
    avatarUrl: mockBaseUser.user_metadata.avatar_url,
    providerToken: undefined,
    providerScopes: [],
  };

  const mockSession = {
    access_token: "test-token",
    refresh_token: "test-refresh",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: mockBaseUser,
  };

  beforeEach(() => {
    mockSupabase = new MockSupabaseClient() as MockClient;
    mockDb = new TestDatabaseService();
    authService = new AuthService(mockSupabase, mockDb, defaultAuthConfig);

    // Set up mock responses
    mockDb.createUser.mockResolvedValue(mockEnhancedUser);
    mockDb.getUser.mockResolvedValue(mockEnhancedUser);

    // Set up Supabase auth mock responses
    (mockSupabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
      data: { url: null, session: mockSession, user: mockBaseUser },
      error: null,
    });

    (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockBaseUser },
      error: null,
    });
  });

  describe("sign in", () => {
    it("should sign in with GitHub", async () => {
      const result = await authService.signInWithGitHub();

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "github",
        options: {
          scopes: "read:user repo",
          queryParams: {
            refresh_token: "true",
          },
        },
      });

      expect(result).toEqual({
        user: mockEnhancedUser,
        session: mockSession,
      });
    });

    it("should handle sign in error", async () => {
      const error = new Error("Sign in failed");
      (mockSupabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        data: null,
        error,
      });

      await expect(authService.signInWithGitHub()).rejects.toThrow(
        "Failed to sign in with github",
      );
    });
  });

  describe("sign out", () => {
    it("should sign out successfully", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await expect(authService.signOut()).resolves.not.toThrow();
    });

    it("should handle sign out error", async () => {
      const error = new Error("Sign out failed");
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error,
      });

      await expect(authService.signOut()).rejects.toThrow("Failed to sign out");
    });
  });

  describe("session management", () => {
    it("should get session", async () => {
      const result = await authService.getSession();

      expect(result).toEqual({
        user: mockEnhancedUser,
        session: mockSession,
      });
    });

    it("should return null for missing session", async () => {
      (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await authService.getSession();

      expect(result).toEqual({
        user: null,
        session: null,
      });
    });

    it("should handle session error", async () => {
      const error = new Error("Session error");
      (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error,
      });

      await expect(authService.getSession()).rejects.toThrow(
        "Failed to get session",
      );
    });
  });

  describe("user management", () => {
    it("should get user", async () => {
      const result = await authService.getUser();
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockEnhancedUser.id);
    });

    it("should handle missing user", async () => {
      (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authService.getUser();
      expect(result).toBeNull();
    });
  });

  describe("auth state changes", () => {
    it("should handle auth state changes", (done) => {
      const callback = jest.fn();
      const subscription = {
        data: { subscription: { unsubscribe: jest.fn() } },
      };

      (mockSupabase.auth.onAuthStateChange as jest.Mock).mockImplementation(
        (cb) => {
          // Use setTimeout to ensure this runs after the test assertion
          setTimeout(() => {
            cb("SIGNED_IN", { user: mockBaseUser });
          }, 0);
          return subscription;
        },
      );

      authService.onAuthStateChange(callback);

      // Wait for the next tick when callback should be executed
      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining({
            id: mockEnhancedUser.id,
          }),
        );
        done();
      }, 10);
    });
  });
});
