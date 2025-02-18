import type { DatabaseService } from '../supabase/database';

export const createMockDatabaseService = () => {
  const mockDb: jest.Mocked<DatabaseService> = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getUser: jest.fn(),
  };

  return mockDb;
};