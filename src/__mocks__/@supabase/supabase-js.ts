import { jest } from '@jest/globals';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { mockData } from '../mockData';

interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export function createClient(config: SupabaseConfig): SupabaseClient<Database> {
  const mockClient = {
    from: jest.fn(() => ({
      insert: (data: Record<string, unknown>) => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data,
            error: null 
          })
        })
      }),
      select: () => ({
        eq: (field: string, value: unknown) => ({
          single: () => {
            // Use field and value to filter the mock data
            if (field === 'github_id' && typeof value === 'string') {
              return Promise.resolve({ 
                data: { ...mockData.users, github_id: value }, 
                error: null 
              });
            }
            return Promise.resolve({ 
              data: mockData.users, 
              error: null 
            });
          }
        })
      })
    })),
    auth: {
      signInWithOAuth: jest.fn().mockImplementation(() => Promise.resolve({
        data: {
          session: {
            access_token: config.supabaseKey,
            refresh_token: 'test-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockData.users
          }
        },
        error: null
      })),
      signOut: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
      getSession: jest.fn().mockImplementation(() => Promise.resolve({
        data: { session: null },
        error: null
      })),
      getUser: jest.fn().mockImplementation(() => Promise.resolve({
        data: { user: mockData.users },
        error: null
      })),
      onAuthStateChange: jest.fn()
    }
  } as unknown as SupabaseClient<Database>;

  return mockClient;
}