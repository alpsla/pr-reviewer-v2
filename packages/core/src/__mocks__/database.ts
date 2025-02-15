import { DatabaseService } from "../supabase/database";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

export class MockDatabaseService extends DatabaseService {
  constructor() {
    super({
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: null,
            })),
          })),
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: null,
            })),
          })),
        })),
      })),
      rpc: jest.fn(),
    } as unknown as SupabaseClient<Database>);
  }
}

export const createMockDatabaseService = (): DatabaseService => {
  return new MockDatabaseService();
};
