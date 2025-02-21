/**
 * Simplified test file that uses the MockDatabaseService
 * This replaces complex tests with simpler ones that are easier to maintain
 */
import { RepositoryService } from '../../repository/repository-service';
import { MockDatabaseService } from './mock-database-service';
import { DatabaseService } from '../../supabase/database';
import { getVCSClient } from '../../vcs';
import { RepositoryError } from '../../repository/repository-error';

// Mock the VCS module
jest.mock('../../vcs', () => ({
  getVCSClient: jest.fn().mockImplementation((platform) => ({
    getPlatform: () => platform,
    getCurrentUser: jest.fn().mockResolvedValue({
      id: 'user-1',
      login: 'testuser',
      name: 'Test User',
      avatarUrl: 'https://example.com/avatar.png'
    }),
    getRepository: jest.fn().mockResolvedValue({
      platform,
      externalId: 'repo-1',
      owner: 'testowner',
      name: 'test-repo',
      fullName: 'testowner/test-repo',
      description: 'Test repository',
      isPrivate: false,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: { admin: true, push: true, pull: true },
      url: 'https://example.com/testowner/test-repo',
      language: 'TypeScript',
      topics: ['testing'],
      stargazersCount: 10,
      forksCount: 5
    }),
    getPullRequest: jest.fn().mockResolvedValue({
      platform,
      externalId: 'pr-1',
      number: 1,
      title: 'Test PR',
      description: 'Test description',
      state: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
      mergedAt: null,
      isDraft: false,
      user: {
        id: 'user-1',
        login: 'testuser',
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.png'
      },
      head: {
        ref: 'test-branch',
        sha: 'abc123',
        repo: {
          platform,
          externalId: 'repo-1',
          owner: 'testowner',
          name: 'test-repo',
          fullName: 'testowner/test-repo',
          url: 'https://example.com/testowner/test-repo'
        }
      },
      base: {
        ref: 'main',
        sha: 'def456',
        repo: {
          platform,
          externalId: 'repo-1',
          owner: 'testowner',
          name: 'test-repo',
          fullName: 'testowner/test-repo',
          url: 'https://example.com/testowner/test-repo'
        }
      },
      labels: ['bug'],
      url: 'https://example.com/testowner/test-repo/pull/1'
    }),
    getRateLimit: jest.fn().mockResolvedValue({
      limit: 5000,
      remaining: 4500,
      reset: new Date(Date.now() + 3600 * 1000),
      used: 500
    })
  }))
}));

describe('Simplified Repository Service Tests', () => {
  let mockDb: MockDatabaseService;
  let service: RepositoryService;

  beforeEach(() => {
    mockDb = new MockDatabaseService();
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    service = new RepositoryService(mockDb as unknown as DatabaseService, { github: 'test-token' });
  });

  afterEach(() => {
    mockDb.clearMocks();
    jest.clearAllMocks();
  });

  it('should initialize successfully', () => {
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledWith('github', 'test-token', undefined);
  });

  it('should get a repository', async () => {
    const repo = await service.getRepository('github', 'testowner', 'test-repo');
    
    expect(repo).toBeDefined();
    expect(repo.platform).toBe('github');
    expect(repo.owner).toBe('testowner');
    expect(repo.name).toBe('test-repo');
    
    // Verify database was called
    expect(mockDb.createRepository).toHaveBeenCalled();
  });

  it('should get a pull request', async () => {
    const pr = await service.getPullRequest('github', 'testowner', 'test-repo', 1);
    
    expect(pr).toBeDefined();
    expect(pr.platform).toBe('github');
    expect(pr.number).toBe(1);
    expect(pr.title).toBe('Test PR');
    
    // Verify database was called
    expect(mockDb.createPullRequest).toHaveBeenCalled();
  });

  it('should handle repository not found', async () => {
    // Override the mock to throw a not found error
    (getVCSClient as jest.Mock).mockImplementationOnce(() => ({
      getPlatform: () => 'github',
      getRepository: jest.fn().mockRejectedValue(new Error('Not Found'))
    }));
    
    try {
      await service.getRepository('github', 'nonexistent', 'repo');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(RepositoryError);
      if (error instanceof RepositoryError) {
        expect(error.message).toContain('not found');
      }
    }
  });

  it('should handle rate limits', async () => {
    // Override the mock to throw a rate limit error
    (getVCSClient as jest.Mock).mockImplementationOnce(() => ({
      getPlatform: () => 'github',
      getRepository: jest.fn().mockRejectedValue({
        message: 'API rate limit exceeded',
        details: { rateLimitReset: Date.now() + 60 * 1000 }
      })
    }));
    
    try {
      await service.getRepository('github', 'rate-limit', 'repo');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(RepositoryError);
      if (error instanceof RepositoryError) {
        expect(error.message).toContain('rate limit');
      }
    }
  });

  it('should get rate limit information', async () => {
    const rateLimit = await service.getRateLimit('github');
    
    expect(rateLimit).toBeDefined();
    expect(rateLimit.limit).toBe(5000);
    expect(rateLimit.remaining).toBe(4500);
    expect(rateLimit.reset).toBeInstanceOf(Date);
  });
});
