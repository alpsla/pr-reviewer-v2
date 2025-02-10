import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Supabase Client', () => {
  // Save original env vars
  const originalEnv = process.env;
  let createClientMock: jest.Mock;

  beforeEach(() => {
    // Reset modules and environment
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

    // Create a fresh mock for each test
    createClientMock = jest.fn().mockReturnValue({
      from: jest.fn(),
      auth: {
        signInWithOAuth: jest.fn(),
        signOut: jest.fn(),
        getSession: jest.fn(),
        getUser: jest.fn()
      }
    });

    // Mock the module
    jest.mock('@supabase/supabase-js', () => ({
      createClient: createClientMock
    }));
  });

  afterEach(() => {
    // Restore env vars
    process.env = originalEnv;
    jest.resetModules();
  });

  describe('Public Client', () => {
    it('should create a public client with correct configuration', async () => {
      // Import the module after setting up the mock
      const { supabase } = await import('../client');
      
      expect(supabase).toBeDefined();
      expect(createClientMock).toHaveBeenCalledWith(
        'http://localhost:54321',
        'test-anon-key'
      );
    });
  });

  describe('Admin Client', () => {
    it('should create an admin client with correct configuration', async () => {
      const { createAdminClient } = await import('../client');
      const adminClient = createAdminClient();
      
      expect(adminClient).toBeDefined();
      expect(createClientMock).toHaveBeenCalledWith(
        'http://localhost:54321',
        'test-service-role-key',
        {
          auth: {
            persistSession: false
          }
        }
      );
    });

    it('should throw error if service role key is missing', async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = '';
      const { createAdminClient } = await import('../client');
      
      expect(() => createAdminClient()).toThrow('Missing env.SUPABASE_SERVICE_ROLE_KEY');
    });
  });
});