/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import { createMockGitHubClient } from '../../vcs/__mocks__/mock-vcs-clients';
import * as vcsModule from '../../vcs';
import { VCSError } from '../../vcs/errors';
import { RepositoryError } from '../../repository/repository-error';
import { createTestStorage, createMockDatabaseService } from './mock-database-service';

jest.mock('../../vcs', () => {
  const originalModule = jest.requireActual('../../vcs');
  return {
    ...originalModule,
    getVCSClient: jest.fn(),
    VCSError: originalModule.VCSError
  };
});

describe('Repository Service Error Handling Tests', () => {
  let service: RepositoryService;
  let mockGithubClient: ReturnType<typeof createMockGitHubClient>;
  let storage: ReturnType<typeof createTestStorage>;
  let mockDatabaseService: ReturnType<typeof createMockDatabaseService>;

  beforeEach(() => {
    // Create storage and mock database
    storage = createTestStorage();
    mockDatabaseService = createMockDatabaseService(storage);
    
    // Create a mock GitHub client
    mockGithubClient = createMockGitHubClient();
    
    // Configure getVCSClient mock
    (vcsModule.getVCSClient as jest.Mock).mockImplementation((platform) => {
      if (platform === 'github') return mockGithubClient;
      throw new Error(`Unknown platform: ${platform}`);
    });

    // Initialize repository service
    service = new RepositoryService(
      mockDatabaseService as any,
      { github: 'github-token' }
    );
  });

  it('should handle repository not found errors', async () => {
    // Set up the mock to throw a not found error
    mockGithubClient.getRepository.mockImplementationOnce(() => {
      return Promise.reject(new VCSError(
        'Repository not found: nonexistent/repo',
        'github',
        'RESOURCE_NOT_FOUND',
        { owner: 'nonexistent', repo: 'repo' }
      ));
    });
    
    // Act & Assert
    const errorPromise = service.getPullRequest('github', 'nonexistent', 'repo', 123);
    
    await expect(errorPromise).rejects.toThrow(RepositoryError);
    await expect(errorPromise).rejects.toThrow('Repository not found');
    
    try {
      await errorPromise;
    } catch (error) {
      expect(error instanceof RepositoryError).toBe(true);
      const repoError = error as RepositoryError;
      // The handleVCSError method in RepositoryService converts the code to REPOSITORY_NOT_FOUND
      expect(repoError.code).toBe('REPOSITORY_NOT_FOUND');
      expect(repoError.details).toEqual(expect.objectContaining({
        platform: 'github',
        owner: 'nonexistent',
        repo: 'repo'
      }));
      expect(repoError.isNotFoundError()).toBe(true);
    }
  });
  
  it('should handle pull request not found errors', async () => {
    // Set up repository mock to succeed
    mockGithubClient.getRepository.mockImplementationOnce(async (owner, name) => ({
      id: 'repo-123',
      platform: 'github',
      externalId: '12345678',
      name,
      owner,
      fullName: `${owner}/${name}`,
      description: 'Test repo',
      isPrivate: false,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        admin: true,
        push: true,
        pull: true
      },
      url: `https://github.com/${owner}/${name}`,
      language: 'TypeScript',
      topics: ['testing'],
      stargazersCount: 5,
      forksCount: 1,
      openIssuesCount: 2
    }));
    
    // Set up PR mock to throw not found error
    mockGithubClient.getPullRequest.mockImplementationOnce(() => {
      return Promise.reject(new VCSError(
        'Pull request not found: test-owner/test-repo#999',
        'github',
        'RESOURCE_NOT_FOUND',
        { owner: 'test-owner', repo: 'test-repo', pullNumber: 999 }
      ));
    });
    
    // Act & Assert
    const errorPromise = service.getPullRequest('github', 'test-owner', 'test-repo', 999);
    
    await expect(errorPromise).rejects.toThrow(RepositoryError);
    await expect(errorPromise).rejects.toThrow('Pull request not found');
    
    try {
      await errorPromise;
    } catch (error) {
      expect(error instanceof RepositoryError).toBe(true);
      const repoError = error as RepositoryError;
      // The handleVCSError method in RepositoryService converts the code to PULL_REQUEST_NOT_FOUND
      expect(repoError.code).toBe('PULL_REQUEST_NOT_FOUND');
      expect(repoError.details).toEqual(expect.objectContaining({
        platform: 'github',
        owner: 'test-owner',
        repo: 'test-repo',
        pullNumber: 999
      }));
      expect(repoError.isNotFoundError()).toBe(true);
    }
  });
  
  it('should handle rate limit errors', async () => {
    // Set up rate limit error
    const resetTime = new Date(Date.now() + 60 * 1000); // 1 minute from now
    mockGithubClient.getRepository.mockImplementationOnce(() => {
      return Promise.reject(new VCSError(
        'API rate limit exceeded',
        'github',
        'RATE_LIMIT_EXCEEDED',
        { 
          rateLimitRemaining: 0,
          rateLimitReset: resetTime.getTime(),
          retryAfter: 60000
        }
      ));
    });
    
    // Act & Assert
    const errorPromise = service.getPullRequest('github', 'test-owner', 'test-repo', 123);
    
    await expect(errorPromise).rejects.toThrow(RepositoryError);
    await expect(errorPromise).rejects.toThrow('Rate limit exceeded');
    
    try {
      await errorPromise;
    } catch (error) {
      expect(error instanceof RepositoryError).toBe(true);
      const repoError = error as RepositoryError;
      // The handleVCSError method in RepositoryService converts the code
      expect(repoError.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(repoError.details).toEqual(expect.objectContaining({
        platform: 'github',
      }));
      expect(repoError.isRateLimitError()).toBe(true);
      expect(repoError.retryAfter).toBeDefined();
      expect(repoError.reset).toBeDefined();
    }
  });
  
  it('should handle database errors gracefully', async () => {
    // Set up GitHub mock to succeed
    mockGithubClient.getRepository.mockImplementationOnce(async (owner, name) => ({
      id: 'repo-123',
      platform: 'github',
      externalId: '12345678',
      name,
      owner,
      fullName: `${owner}/${name}`,
      description: 'Test repo',
      isPrivate: false,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        admin: true,
        push: true,
        pull: true
      },
      url: `https://github.com/${owner}/${name}`,
      language: 'TypeScript',
      topics: ['testing'],
      stargazersCount: 5,
      forksCount: 1,
      openIssuesCount: 2
    }));
    
    // Make database throw an error
    mockDatabaseService.createRepository.mockImplementationOnce(() => {
      return Promise.reject(new Error('Database connection error'));
    });
    
    // Act & Assert
    await expect(
      service.getPullRequest('github', 'test-owner', 'test-repo', 123)
    ).rejects.toThrow('Database connection error');
  });
});
