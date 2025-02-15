import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

export class MockSupabaseClient {
  readonly supabaseUrl = "http://localhost:54321";
  readonly supabaseKey = "test-key";
  readonly auth = {
    signInWithOtp: jest.fn(),
    verifyOtp: jest.fn(),
    refreshSession: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
    signInWithOAuth: jest.fn(),
  };

  private mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  from = jest.fn(() => this.mockQueryBuilder);
  rpc = jest.fn();
}

export type MockClient = MockSupabaseClient & SupabaseClient<Database>;

export const createMockSupabaseClient = (): MockClient => {
  return new MockSupabaseClient() as MockClient;
};
