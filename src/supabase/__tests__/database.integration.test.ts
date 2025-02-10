import { describe, it, expect, beforeAll } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';
import { DatabaseService } from '../database';
import { config } from './test-config';

// Mock the Supabase createClient function
jest.mock('@supabase/supabase-js', () => {
  const mockDb = new Map<string, Record<string, unknown>>();

  const createQueryBuilder = (table: string) => {
    const whereConditions: Array<[string, unknown]> = [];
    
    const builder = {
      insert: (data: Record<string, unknown>) => ({
        select: () => ({
          single: () => {
            const newItem = { ...data };
            const key = `${table}-${String(data.github_id || data.id)}`;
            mockDb.set(key, newItem);
            return Promise.resolve({ data: newItem, error: null });
          }
        })
      }),
      select: () => builder,
      eq: (field: string, value: unknown) => {
        whereConditions.push([field, value]);
        return builder;
      },
      single: () => {
        for (const [, item] of mockDb.entries()) {
          if (whereConditions.every(([field, value]) => item[field] === value)) {
            return Promise.resolve({ data: item, error: null });
          }
        }
        return Promise.resolve({ data: null, error: null });
      }
    };
    
    return builder;
  };

  return {
    createClient: () => ({
      from: (table: string) => createQueryBuilder(table)
    })
  };
});

describe('Database Integration', () => {
  const supabase = createClient<Database>(
    config.supabaseUrl,
    config.supabaseKey
  );
  
  const db = new DatabaseService(supabase);

  beforeAll(async () => {
    expect(supabase).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should successfully query the database', async () => {
    const testUser = {
      github_id: 'test-github-id',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.png'
    };

    const user = await db.createUser(testUser);
    expect(user).toBeDefined();
    expect(user.github_id).toBe(testUser.github_id);
    expect(user.name).toBe(testUser.name);
  });

  it('should handle user operations', async () => {
    const testUser = {
      github_id: 'test-github-id-2',
      name: 'Test User 2',
      avatar_url: 'https://example.com/avatar2.png'
    };

    const user = await db.createUser(testUser);
    expect(user).toBeDefined();
    expect(user.github_id).toBe(testUser.github_id);
    expect(user.name).toBe(testUser.name);

    const fetchedUser = await db.getUserByGithubId(testUser.github_id);
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.name).toBe(testUser.name);
  });

  it('should handle repository operations', async () => {
    const testRepo = {
      id: 'test-repo-id',
      owner: 'test-owner',
      name: 'test-repo',
      full_name: 'test-owner/test-repo',
      description: 'Test repository'
    };

    const repo = await db.createRepository(testRepo);
    expect(repo).toBeDefined();
    expect(repo.full_name).toBe(testRepo.full_name);
    expect(repo.owner).toBe(testRepo.owner);
    expect(repo.name).toBe(testRepo.name);

    const fetchedRepo = await db.getRepositoryByOwnerAndName(testRepo.owner, testRepo.name);
    expect(fetchedRepo).toBeDefined();
    expect(fetchedRepo.id).toBe(testRepo.id);
    expect(fetchedRepo.full_name).toBe(testRepo.full_name);
  });
});