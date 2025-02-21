import { AuthService } from "../auth-service";
import { createMockDatabaseService, mockBaseUser } from "../../__tests__/utils/test-utils";
import { MockSupabaseClient, type MockClient } from "../../__mocks__/supabase";
import { GitHubAuthScopes } from "../types";
import type { DatabaseService } from "../../supabase/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database/types";

// Test helper function for logging that won't trigger ESLint warnings
// eslint-disable-next-line no-console
const testLog = (...args: unknown[]) => console.log(...args);

describe("AuthService", () => {
  let authService: AuthService;
  let mockSupabase: MockClient;
  let mockDb: jest.Mocked<DatabaseService>;

  const mockSession = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: mockBaseUser
  };
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    mockSupabase = new MockSupabaseClient();
    mockDb = createMockDatabaseService();
    authService = new AuthService(
      mockSupabase as unknown as SupabaseClient<Database>,
      mockDb,
      { 
        provider: 'github',
        defaultScopes: { github: ['read:user', 'repo'] },
        urlConfig: { redirectUrl: 'http://localhost:3000/auth/callback' }
      }
    );

    // Set up mock responses
    mockDb.createUser.mockResolvedValue({
      id: mockBaseUser.id,
      email: mockBaseUser.email,
      name: mockBaseUser.user_metadata.full_name,
      avatar_url: mockBaseUser.user_metadata.avatar_url,
      auth_provider: mockBaseUser.app_metadata.provider,
      status: 'active'
    });

    // Set up Supabase auth mock responses
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      data: {
        url: 'https://github.com/login/oauth/authorize',
        provider: 'github',
        session: null,
        user: null
      },
      error: null
    });

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockBaseUser },
      error: null
    });
  });

  describe("sign in", () => {
    it("should sign in with GitHub", async () => {
      // Configure OAuth mock with expected structure
      const mockOAuthResponse = {
        data: {
          url: 'https://github.com/login/oauth/authorize',
          provider: 'github',
          session: null,
          user: null
        },
        error: null
      };
      mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce(mockOAuthResponse);

      // Enable debugging
      testLog('Starting GitHub sign-in test');

      const response = await authService.signInWithGitHub({
        scopes: ['read:user', 'repo'] as GitHubAuthScopes[],
      });

      testLog('Mock OAuth Response:', mockOAuthResponse);
      testLog('Auth Service Response:', response);
      testLog('SignInWithOAuth calls:', mockSupabase.auth.signInWithOAuth.mock.calls);

      expect(response.user).toBeNull();
      expect(response.session).toBeNull();
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
          scopes: 'read:user repo',
          queryParams: {
            refresh_token: 'true'
          }
        }
      });
    });

    it("should handle sign in error", async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValueOnce({
        data: null,
        error: new Error("Sign in failed")
      });

      await expect(authService.signInWithGitHub()).rejects.toThrow("Failed to sign in with github");
    });
  });

  describe("session management", () => {
    beforeEach(() => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });
    });

    it("should get session", async () => {
      const response = await authService.getSession();
      expect(response.user).toBeDefined();
      expect(response.session).toBeDefined();
    });

    it("should return null for missing session", async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const response = await authService.getSession();
      expect(response.user).toBeNull();
      expect(response.session).toBeNull();
    });

    it("should handle session error", async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: new Error("Session error"),
      });

      await expect(authService.getSession()).rejects.toThrow("Failed to get session");
    });
  });

  describe("user management", () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockBaseUser },
        error: null
      });
    });

    it("should get user", async () => {
      const user = await authService.getUser();
      expect(user).toBeDefined();
      expect(user?.auth_provider).toBe('github');
    });

    it("should handle missing user", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const user = await authService.getUser();
      expect(user).toBeNull();
    });
  });

  describe("auth state changes", () => {
    it("should handle auth state changes", async () => {
      const callback = jest.fn();
      authService.onAuthStateChange(callback);

      // Get the callback function from the mock
      const authStateCallback = mockSupabase.auth.onAuthStateChange.mock.calls[0][0];

      // Call it directly with SIGNED_IN event
      await authStateCallback("SIGNED_IN", mockSession);
      expect(callback).toHaveBeenCalled();

      // Call it directly with SIGNED_OUT event
      await authStateCallback("SIGNED_OUT", null);
      expect(callback).toHaveBeenCalledWith(null);
    });
  });
});