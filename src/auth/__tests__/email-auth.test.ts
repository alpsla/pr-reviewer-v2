import { EmailAuthService } from '../email-auth';
import { MockSupabaseClient, type MockClient } from '../../__mocks__/supabase';
import { TestDatabaseService } from '../../__tests__/utils/test-utils';

describe('EmailAuthService', () => {
  let emailAuthService: EmailAuthService;
  let mockSupabase: MockClient;
  let mockDb: TestDatabaseService;

  const mockConfig = {
    redirectTo: 'http://localhost:3000/auth/callback',
    tokenExpiryMinutes: 60
  };

  const mockUser = {
    id: 'test-id',
    email: 'test@example.com',
    name: 'Test User',
    auth_provider: 'email',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {
      provider: 'email',
      providers: ['email']
    },
    user_metadata: {
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.png'
    }
  };

  const mockSession = {
    access_token: 'test-token',
    refresh_token: 'test-refresh',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer'
  };

  beforeEach(() => {
    mockSupabase = new MockSupabaseClient() as MockClient;
    mockDb = new TestDatabaseService();
    emailAuthService = new EmailAuthService(
      mockSupabase,
      mockDb,
      mockConfig
    );

    mockDb.createUser.mockResolvedValue(mockUser);
    mockDb.updateUser.mockResolvedValue(mockUser);
  });

  describe('sendMagicLink', () => {
    it('should send magic link successfully', async () => {
      const email = 'test@example.com';
      (mockSupabase.auth.signInWithOtp as jest.Mock).mockResolvedValue({
        data: {},
        error: null
      });

      await expect(emailAuthService.sendMagicLink(email)).resolves.not.toThrow();
      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email,
        options: {
          emailRedirectTo: mockConfig.redirectTo,
          data: {
            emailTemplate: undefined
          }
        }
      });
    });

    it('should throw when magic link sending fails', async () => {
      const email = 'test@example.com';
      (mockSupabase.auth.signInWithOtp as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error('Failed to send OTP')
      });

      await expect(emailAuthService.sendMagicLink(email)).rejects.toThrow('Failed to send magic link');
    });
  });

  describe('verifyMagicLink', () => {
    const mockToken = 'valid-token';

    it('should verify magic link and create session', async () => {
      (mockSupabase.auth.verifyOtp as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          session: mockSession
        },
        error: null
      });

      const result = await emailAuthService.verifyMagicLink(mockToken);

      expect(result).toEqual({
        user: mockUser,
        session: {
          ...mockSession,
          user: mockUser
        }
      });

      expect(mockDb.createUser).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        auth_provider: 'email',
        status: 'active'
      });
    });

    it('should throw when token verification fails', async () => {
      (mockSupabase.auth.verifyOtp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: new Error('Invalid token')
      });

      await expect(emailAuthService.verifyMagicLink(mockToken)).rejects.toThrow('Invalid or expired magic link');
    });
  });

  describe('refreshToken', () => {
    const mockRefreshToken = 'refresh-token';

    it('should refresh session successfully', async () => {
      (mockSupabase.auth.refreshSession as jest.Mock).mockResolvedValue({
        data: {
          user: mockUser,
          session: mockSession
        },
        error: null
      });

      const result = await emailAuthService.refreshToken(mockRefreshToken);

      expect(result).toEqual({
        ...mockSession,
        user: mockUser
      });
    });

    it('should throw when token refresh fails', async () => {
      (mockSupabase.auth.refreshSession as jest.Mock).mockResolvedValue({
        data: { session: null, user: null },
        error: new Error('Invalid refresh token')
      });

      await expect(emailAuthService.refreshToken(mockRefreshToken)).rejects.toThrow('Failed to refresh token');
    });
  });

  describe('signOut', () => {
    const mockSessionId = 'session-id';

    it('should sign out successfully', async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null
      });

      await expect(emailAuthService.signOut(mockSessionId)).resolves.not.toThrow();
      expect(mockDb.updateUser).toHaveBeenCalledWith(mockSessionId, {
        status: 'inactive',
        last_sign_in: undefined
      });
    });

    it('should throw when sign out fails', async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: new Error('Failed to sign out')
      });

      await expect(emailAuthService.signOut(mockSessionId)).rejects.toThrow('Failed to sign out');
    });

    it('should throw when database update fails', async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null
      });

      mockDb.updateUser.mockRejectedValue(new Error('Database error'));

      await expect(emailAuthService.signOut(mockSessionId)).rejects.toThrow('Failed to sign out');
    });
  });
});