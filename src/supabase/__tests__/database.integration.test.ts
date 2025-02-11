import { DatabaseService } from '../database';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

describe('DatabaseService', () => {
  let db: DatabaseService;
  let mockSupabase: jest.Mocked<SupabaseClient<Database>>;

  const mockQueryResponse = <T>(value: T) => ({
    data: value,
    error: null,
    count: null,
    status: 200,
    statusText: 'OK'
  });

  beforeEach(() => {
    const mockQuery = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    mockSupabase = {
      from: jest.fn(() => mockQuery),
      rpc: jest.fn()
    } as unknown as jest.Mocked<SupabaseClient<Database>>;

    db = new DatabaseService(mockSupabase);
  });

  describe('User operations', () => {
    const testUser = {
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
      auth_provider: 'github',
      status: 'active' as const
    };

    it('should create a user', async () => {
      const mockResponse = mockQueryResponse(testUser);
      const queryBuilder = mockSupabase.from('users');
      (queryBuilder.select().single as jest.Mock).mockResolvedValue(mockResponse);

      const user = await db.createUser(testUser);
      expect(user).toEqual(testUser);
      expect(mockSupabase.from).toHaveBeenCalledWith('users');
    });

    it('should get user by id', async () => {
      const mockResponse = mockQueryResponse(testUser);
      const queryBuilder = mockSupabase.from('users');
      (queryBuilder.select().single as jest.Mock).mockResolvedValue(mockResponse);

      const user = await db.getUser(testUser.id);
      expect(user).toEqual(testUser);
      expect(mockSupabase.from).toHaveBeenCalledWith('users');
    });
  });

  describe('Repository operations', () => {
    const testRepo = {
      id: 'test-repo-id',
      owner: 'test-owner',
      name: 'test-repo',
      full_name: 'test-owner/test-repo',
      description: 'Test repository',
      private: false
    };

    it('should create a repository', async () => {
      const mockResponse = mockQueryResponse(testRepo);
      const queryBuilder = mockSupabase.from('repositories');
      (queryBuilder.select().single as jest.Mock).mockResolvedValue(mockResponse);

      const repo = await db.createRepository(testRepo);
      expect(repo).toEqual(testRepo);
      expect(mockSupabase.from).toHaveBeenCalledWith('repositories');
    });

    it('should get repository by owner and name', async () => {
      const mockResponse = mockQueryResponse(testRepo);
      const queryBuilder = mockSupabase.from('repositories');
      (queryBuilder.select().single as jest.Mock).mockResolvedValue(mockResponse);

      const repo = await db.getRepositoryByOwnerAndName(testRepo.owner, testRepo.name);
      expect(repo).toEqual(testRepo);
      expect(mockSupabase.from).toHaveBeenCalledWith('repositories');
    });
  });
});