import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../supabase/types";
import { DatabaseService } from '../../supabase/database';

/**
 * Creates in-memory storage for testing
 */
export function createTestStorage() {
  return {
    repositories: new Map<string, Record<string, unknown>>(),
    pullRequests: new Map<string, Record<string, unknown>>(),
    users: new Map<string, Record<string, unknown>>(),
    analysisJobs: new Map<string, Record<string, unknown>>()
  };
}

/**
 * Creates a mock database service using the provided storage
 */
export function createMockDatabaseService(storage: ReturnType<typeof createTestStorage>) {
  const mockDb = new MockDatabaseService();
  
  // Override the internal storage with the provided one
  (mockDb as any).repositories = storage.repositories;
  (mockDb as any).pullRequests = storage.pullRequests;
  
  return mockDb;
}

/**
 * Mock implementation of DatabaseService for testing
 * This provides type-safe mocking of the DatabaseService methods
 */
export class MockDatabaseService extends DatabaseService {
  constructor() {
    // Create mock supabase client
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: {}, error: null }),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis()
    } as unknown as SupabaseClient<Database>;
    
    super(mockSupabase);
    
    // Mock all methods
    this.overrideMethods();
  }
  
  // Keep a repository store to enable basic functionality
  private repositories = new Map<string, Record<string, unknown>>();
  private pullRequests = new Map<string, Record<string, unknown>>();
  
  private overrideMethods() {
    // Override all methods with Jest mocks
    this.createRepository = jest.fn().mockImplementation((data: Record<string, unknown>) => {
      const id = data.id || `repo-${Date.now()}`;
      const repo = { ...data, id };
      const repoId = String(id);
      this.repositories.set(`${data.owner}/${data.name}`, repo);
      this.repositories.set(repoId, repo);
      return Promise.resolve(repo);
    });
    
    this.getRepositoryByOwnerAndName = jest.fn().mockImplementation((owner: string, name: string) => {
      const key = `${owner}/${name}`;
      const repo = this.repositories.get(key);
      if (!repo) return Promise.reject(new Error('Repository not found'));
      return Promise.resolve(repo);
    });
    
    this.createPullRequest = jest.fn().mockImplementation((data: Record<string, unknown>) => {
      const id = data.id || `pr-${Date.now()}`;
      const pr = { ...data, id };
      const prId = String(id);
      const key = `${data.repository_id}:${data.number}`;
      this.pullRequests.set(key, pr);
      this.pullRequests.set(prId, pr);
      return Promise.resolve(pr);
    });
    
    this.getPullRequestByNumber = jest.fn().mockImplementation((repoId: string, number: number) => {
      const key = `${repoId}:${number}`;
      const pr = this.pullRequests.get(key);
      if (!pr) return Promise.reject(new Error('Pull request not found'));
      return Promise.resolve(pr);
    });
    
    this.getUser = jest.fn().mockResolvedValue({ id: 'user-1', name: 'Test User' });
    this.createUser = jest.fn().mockImplementation((data: Record<string, unknown>) => Promise.resolve({ ...data, id: 'user-1' }));
    this.getUserByGithubId = jest.fn().mockResolvedValue({ id: 'user-1', name: 'Test User' });
    this.updateUser = jest.fn().mockImplementation((id: string, data: Record<string, unknown>) => Promise.resolve({ ...data, id }));
    this.getPullRequest = jest.fn().mockImplementation((id: string) => Promise.resolve(this.pullRequests.get(id)));
    this.createAnalysisJob = jest.fn().mockImplementation((data: Record<string, unknown>) => Promise.resolve({ ...data, id: 'job-1' }));
    this.getNextAnalysisJob = jest.fn().mockResolvedValue(null);
  }
  
  // Add a clear method for test cleanup
  clearMocks() {
    this.repositories.clear();
    this.pullRequests.clear();
    
    // Reset all mock counts
    (this.createRepository as jest.Mock).mockClear();
    (this.getRepositoryByOwnerAndName as jest.Mock).mockClear();
    (this.createPullRequest as jest.Mock).mockClear();
    (this.getPullRequestByNumber as jest.Mock).mockClear();
    (this.getUser as jest.Mock).mockClear();
    (this.createUser as jest.Mock).mockClear();
    (this.getUserByGithubId as jest.Mock).mockClear();
    (this.updateUser as jest.Mock).mockClear();
    (this.getPullRequest as jest.Mock).mockClear();
    (this.createAnalysisJob as jest.Mock).mockClear();
    (this.getNextAnalysisJob as jest.Mock).mockClear();
  }
}
