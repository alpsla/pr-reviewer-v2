import type { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '../auth-service';
import { DatabaseService } from '../../supabase/database';
import type { Database } from '../../types/database';
import type { MicrosoftAuthScopes } from '../types';
import { 
  createMockSupabaseClient, 
  createMockDatabaseService, 
  defaultAuthConfig,
  mockAuthData 
} from '../../__tests__/utils/test-utils';

jest.mock('@supabase/supabase-js');
jest.mock('../../supabase/database');

describe('AuthService', () => {
  let authService: AuthService;
  let mockSupabaseClient: jest.Mocked<SupabaseClient<Database>>;
  let mockDatabaseService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';

    mockSupabaseClient = createMockSupabaseClient();
    mockDatabaseService = createMockDatabaseService();

    authService = new AuthService(
      mockSupabaseClient,
      mockDatabaseService,
      defaultAuthConfig
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signInWithMicrosoft', () => {
    beforeEach(() => {
      (mockSupabaseClient.auth.signInWithOAuth as jest.Mock).mockResolvedValue({
        data: { 
          user: mockAuthData.users, 
          session: mockAuthData.session 
        },
        error: null
      });
    });

    it('should sign in user with Microsoft successfully', async () => {
      const result = await authService.signInWithMicrosoft();

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'azure',
        options: {
          redirectTo: undefined,
          scopes: expect.stringContaining('openid'),
          queryParams: {
            refresh_token: 'true'
          }
        }
      });

      expect(result.user).toMatchObject({
        ...mockAuthData.users,
        provider: 'azure'
      });
      expect(result.session).toMatchObject(mockAuthData.session);
    });

    it('should sign in with custom scopes', async () => {
      const customScopes: MicrosoftAuthScopes[] = ['openid', 'email', 'User.Read'];
      await authService.signInWithMicrosoft({ scopes: customScopes });

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'azure',
        options: {
          redirectTo: undefined,
          scopes: customScopes.join(' '),
          queryParams: {
            refresh_token: 'true'
          }
        }
      });
    });

    it('should handle authentication errors', async () => {
      const error = new Error('Authentication failed');
      (mockSupabaseClient.auth.signInWithOAuth as jest.Mock).mockRejectedValue(error);

      await expect(authService.signInWithMicrosoft()).rejects.toThrow();
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      (mockSupabaseClient.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

      await authService.signOut();

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      const error = new Error('Sign out failed');
      (mockSupabaseClient.auth.signOut as jest.Mock).mockRejectedValue(error);

      await expect(authService.signOut()).rejects.toThrow();
    });
  });

  describe('getSession', () => {
    it('should return current session', async () => {
      (mockSupabaseClient.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockAuthData.session },
        error: null
      });

      const result = await authService.getSession();

      expect(result.session).toMatchObject(mockAuthData.session);
      expect(result.user).toBeTruthy();
    });

    it('should handle no session', async () => {
      (mockSupabaseClient.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null
      });

      const result = await authService.getSession();

      expect(result.session).toBeNull();
      expect(result.user).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return current user', async () => {
      (mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockAuthData.users },
        error: null
      });

      const user = await authService.getUser();

      expect(user).toMatchObject({
        ...mockAuthData.users,
        provider: expect.any(String)
      });
    });

    it('should handle no user', async () => {
      (mockSupabaseClient.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null
      });

      const user = await authService.getUser();

      expect(user).toBeNull();
    });
  });

  describe('onAuthStateChange', () => {
    it('should handle auth state changes', () => {
      const callback = jest.fn();
      authService.onAuthStateChange(callback);

      expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });
});