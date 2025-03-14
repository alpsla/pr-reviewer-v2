import { DatabaseService } from '../database-service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('DatabaseService', () => {
  let mockSupabaseClient: jest.Mocked<SupabaseClient>;
  let databaseService: DatabaseService;
  
  beforeEach(() => {
    // Create a mock Supabase client with proper mock data for tests
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnValue({
        data: null,
        error: new Error('Not found')
      }),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      auth: {
        getUser: jest.fn(),
        getSession: jest.fn()
      }
    } as unknown as jest.Mocked<SupabaseClient>;
    
    // Create database service
    databaseService = new DatabaseService(mockSupabaseClient);
  });
  
  describe('getRepositoryByOwnerAndName', () => {
    it('returns a repository with expected properties', async () => {
      const repo = await databaseService.getRepositoryByOwnerAndName('test-owner', 'test-repo');
      
      expect(repo).toHaveProperty('id');
      expect(repo).toHaveProperty('owner', 'test-owner');
      expect(repo).toHaveProperty('name', 'test-repo');
      expect(repo).toHaveProperty('description');
      expect(repo).toHaveProperty('is_private');
      expect(repo).toHaveProperty('default_branch');
      expect(repo).toHaveProperty('created_at');
      expect(repo).toHaveProperty('updated_at');
      expect(repo).toHaveProperty('last_synced_at');
      expect(repo).toHaveProperty('platform');
      expect(repo).toHaveProperty('url');
    });
  });
  
  describe('getPullRequestByNumber', () => {
    it('returns a pull request with expected properties', async () => {
      const pr = await databaseService.getPullRequestByNumber('mock-repo-id', 123);
      
      expect(pr).toHaveProperty('id');
      expect(pr).toHaveProperty('repository_id', 'mock-repo-id');
      expect(pr).toHaveProperty('number', 123);
      expect(pr).toHaveProperty('title');
      expect(pr).toHaveProperty('description');
      expect(pr).toHaveProperty('state');
      expect(pr).toHaveProperty('created_at');
      expect(pr).toHaveProperty('updated_at');
      expect(pr).toHaveProperty('author_id');
      expect(pr).toHaveProperty('author_login');
      expect(pr).toHaveProperty('head_branch');
      expect(pr).toHaveProperty('base_branch');
      expect(pr).toHaveProperty('labels');
      expect(pr).toHaveProperty('url');
    });
  });
  
  describe('getAnalysisResults', () => {
    it('returns analysis results with expected structure', async () => {
      const results = await databaseService.getAnalysisResults('mock-pr-id');
      
      expect(results).toHaveProperty('id');
      expect(results).toHaveProperty('pull_request_id', 'mock-pr-id');
      expect(results).toHaveProperty('status');
      expect(results).toHaveProperty('summary');
      expect(results).toHaveProperty('details');
      expect(results.details).toHaveProperty('issues');
      expect(Array.isArray(results.details.issues)).toBe(true);
      expect(results.details).toHaveProperty('suggestions');
      expect(Array.isArray(results.details.suggestions)).toBe(true);
      expect(results.details).toHaveProperty('metrics');
    });
  });
  
  describe('getAnalysisRequestsByPullRequestId', () => {
    it('returns an array of analysis requests', async () => {
      const requests = await databaseService.getAnalysisRequestsByPullRequestId('mock-pr-id');
      
      expect(Array.isArray(requests)).toBe(true);
      expect(requests.length).toBeGreaterThan(0);
      
      const request = requests[0];
      expect(request).toHaveProperty('id');
      expect(request).toHaveProperty('pull_request_id');
      expect(request).toHaveProperty('status');
      expect(request).toHaveProperty('created_at');
      expect(request).toHaveProperty('updated_at');
    });
  });
  
  describe('getSettings', () => {
    it('returns settings with expected properties', async () => {
      const settings = await databaseService.getSettings();
      
      expect(settings).toHaveProperty('id');
      expect(settings).toHaveProperty('github_token');
      expect(settings).toHaveProperty('openai_api_key');
      expect(settings).toHaveProperty('anthropic_api_key');
      expect(settings).toHaveProperty('default_model');
      expect(settings).toHaveProperty('default_language');
      expect(settings).toHaveProperty('created_at');
      expect(settings).toHaveProperty('updated_at');
    });
  });
});
