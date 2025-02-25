import type { Database } from '../../supabase/types';
import { DatabaseService } from '../../supabase/database';
import type { SupabaseClient } from '@supabase/supabase-js';

const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis()
} as unknown as SupabaseClient<Database>;

/**
 * Mock implementation of DatabaseService for testing
 */
export class MockDatabaseService extends DatabaseService {
  constructor() {
    super(mockSupabaseClient);
  }

  createUser = jest.fn(async (data: Database['public']['Tables']['users']['Insert']) => ({
    id: 'test-id',
    ...data,
    created_at: new Date().toISOString()
  }));

  getUser = jest.fn(async (id: string) => ({
    id,
    created_at: new Date().toISOString()
  }));

  getUserByGithubId = jest.fn(async (githubId: string) => ({
    id: 'test-id',
    github_id: githubId,
    created_at: new Date().toISOString()
  }));

  updateUser = jest.fn(async (id: string, data: Database['public']['Tables']['users']['Update']) => ({
    id,
    ...data,
    updated_at: new Date().toISOString()
  }));

  createRepository = jest.fn(async (data: Database['public']['Tables']['repositories']['Insert']) => ({
    id: 'test-repo-id',
    ...data,
    created_at: new Date().toISOString()
  }));

  getRepositoryByOwnerAndName = jest.fn(async (owner: string, name: string) => ({
    id: 'test-repo-id',
    owner,
    name,
    created_at: new Date().toISOString()
  }));

  createPullRequest = jest.fn(async (data: Database['public']['Tables']['pull_requests']['Insert']) => ({
    id: 'test-pr-id',
    ...data,
    created_at: new Date().toISOString()
  }));

  getPullRequest = jest.fn(async (id: string) => ({
    id,
    created_at: new Date().toISOString()
  }));

  getPullRequestByNumber = jest.fn(async (repositoryId: string, number: number) => ({
    id: 'test-pr-id',
    repository_id: repositoryId,
    number,
    created_at: new Date().toISOString()
  }));

  createAnalysisJob = jest.fn(async (data: Database['public']['Tables']['analysis_queue']['Insert']) => ({
    id: 'test-job-id',
    ...data,
    created_at: new Date().toISOString()
  }));

  getNextAnalysisJob = jest.fn(async () => ({
    id: 'test-job-id',
    created_at: new Date().toISOString(),
    status: 'pending' as const
  }));
}
