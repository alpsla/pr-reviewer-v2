import { createMockDatabaseService } from '../../__mocks__/database';
import { MockSupabaseClient } from '../../__mocks__/supabase';

export { createMockDatabaseService };
export type { MockSupabaseClient };

export const mockBaseUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.png'
  },
  app_metadata: {
    provider: 'github',
    provider_token: 'token-123',
    scopes: 'read:user repo'
  },
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: null,
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};