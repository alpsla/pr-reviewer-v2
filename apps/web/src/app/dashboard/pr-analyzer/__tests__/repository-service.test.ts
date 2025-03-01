import { RepositoryService } from '../repository-service';
import { DatabaseService } from '../database-service';

// Mock the DatabaseService
jest.mock('../database-service');

describe('RepositoryService', () => {
  let mockDatabaseService: jest.Mocked<DatabaseService>;
  let repositoryService: RepositoryService;
  
  beforeEach(() => {
    // Create a mock database service
    mockDatabaseService = {
      getRepositoryByOwnerAndName: jest.fn().mockResolvedValue({
        id: 'mock-repo-id',
        owner: 'test-owner',
        name: 'test-repo'
      }),
      createRepository: jest.fn().mockResolvedValue({
        id: 'mock-repo-id'
      }),
      getPullRequestByNumber: jest.fn().mockResolvedValue({
        id: 'mock-pr-id',
        repository_id: 'mock-repo-id',
        number: 123
      })
    } as unknown as jest.Mocked<DatabaseService>;
    
    // Create repository service with mock tokens
    repositoryService = new RepositoryService(
      mockDatabaseService,
      {
        github: 'mock-github-token',
        gitlab: 'mock-gitlab-token'
      }
    );
  });
  
  describe('getRepository', () => {
    it('returns a repository with correct properties', async () => {
      const repo = await repositoryService.getRepository('github', 'test-owner', 'test-repo');
      
      expect(repo).toHaveProperty('id');
      expect(repo).toHaveProperty('platform', 'github');
      expect(repo).toHaveProperty('owner', 'test-owner');
      expect(repo).toHaveProperty('name', 'test-repo');
      expect(repo).toHaveProperty('url', 'https://github.com/test-owner/test-repo');
    });
    
    it('properly formats the repository URL based on platform', async () => {
      const githubRepo = await repositoryService.getRepository('github', 'test-owner', 'test-repo');
      expect(githubRepo.url).toBe('https://github.com/test-owner/test-repo');
      
      const gitlabRepo = await repositoryService.getRepository('gitlab', 'test-owner', 'test-repo');
      expect(gitlabRepo.url).toBe('https://gitlab.com/test-owner/test-repo');
    });
  });
  
  describe('getPullRequest', () => {
    it('returns a pull request with correct properties', async () => {
      const pr = await repositoryService.getPullRequest('github', 'test-owner', 'test-repo', 123);
      
      expect(pr).toHaveProperty('id');
      expect(pr).toHaveProperty('platform', 'github');
      expect(pr).toHaveProperty('number', 123);
      expect(pr).toHaveProperty('title');
      expect(pr).toHaveProperty('url', 'https://github.com/test-owner/test-repo/pull/123');
    });
    
    it('formats the PR URL correctly based on platform', async () => {
      const githubPR = await repositoryService.getPullRequest('github', 'test-owner', 'test-repo', 123);
      expect(githubPR.url).toBe('https://github.com/test-owner/test-repo/pull/123');
      
      const gitlabPR = await repositoryService.getPullRequest('gitlab', 'test-owner', 'test-repo', 456);
      expect(gitlabPR.url).toBe('https://gitlab.com/test-owner/test-repo/merge_requests/456');
    });
  });
  
  describe('getRateLimit', () => {
    it('returns a rate limit object', async () => {
      const rateLimit = await repositoryService.getRateLimit('github');
      
      expect(rateLimit).toHaveProperty('limit');
      expect(rateLimit).toHaveProperty('remaining');
      expect(rateLimit).toHaveProperty('reset');
      expect(rateLimit).toHaveProperty('used');
    });
  });
});
