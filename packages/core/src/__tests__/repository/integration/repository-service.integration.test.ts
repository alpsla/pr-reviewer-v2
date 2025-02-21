/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../../repository/repository-service';
import { createMockGitHubClient, createMockGitLabClient } from '../../../vcs/__mocks__/mock-vcs-clients';
import { mockGitHubPR } from '../../../vcs/__mocks__/github-mock-data';
import * as vcsModule from '../../../vcs';
import { VCSError } from '../../../vcs/errors';
import { RepositoryError } from '../../../repository/repository-error';

// Create an in-memory storage for verification
const storage = {
  repositories: new Map(),
  pullRequests: new Map()
};

// Clear storage helper function
const clearStorage = () => {
  storage.repositories.clear();
  storage.pullRequests.clear();
};

// Create a mock database service directly
const mockDatabaseService = {
  // Repository methods
  getRepositoryByOwnerAndName: jest.fn(async (platform, owner, name) => {
    const key = `${platform}:${owner}/${name}`;
    return storage.repositories.get(key) || null;
  }),
  
  createRepository: jest.fn(async (repo) => {
    const id = repo.id || `repo-${Date.now()}`;
    const storedRepo = {
      ...repo,
      id,
      platform: repo.platform || 'github',
      external_id: repo.external_id || repo.github_id || String(Date.now()),
      name: repo.name,
      owner: repo.owner,
      full_name: `${repo.owner}/${repo.name}`,
      description: repo.description || null,
      is_private: repo.is_private || false,
      default_branch: repo.default_branch || 'main',
      created_at: repo.created_at || new Date().toISOString(),
      updated_at: repo.updated_at || new Date().toISOString(),
      last_synced_at: repo.last_synced_at || new Date().toISOString(),
      metadata: repo.metadata || {}
    };
    
    const key = `${storedRepo.platform}:${storedRepo.owner}/${storedRepo.name}`;
    storage.repositories.set(key, storedRepo);
    storage.repositories.set(id, storedRepo);
    
    return storedRepo;
  }),
  
  updateRepository: jest.fn(async (id, data) => {
    const repo = storage.repositories.get(id);
    if (!repo) throw new Error(`Repository not found: ${id}`);
    
    const updatedRepo = {
      ...repo,
      ...data,
      id,
      updated_at: new Date().toISOString()
    };
    
    storage.repositories.set(id, updatedRepo);
    if (updatedRepo.platform && updatedRepo.owner && updatedRepo.name) {
      const key = `${updatedRepo.platform}:${updatedRepo.owner}/${updatedRepo.name}`;
      storage.repositories.set(key, updatedRepo);
    }
    
    return updatedRepo;
  }),
  
  // Pull request methods
  getPullRequestByNumber: jest.fn(async (repositoryId, number) => {
    const key = `${repositoryId}:${number}`;
    return storage.pullRequests.get(key) || null;
  }),
  
  createPullRequest: jest.fn(async (pr) => {
    const id = pr.id || `pr-${Date.now()}`;
    const storedPR = {
      ...pr,
      id,
      repository_id: pr.repository_id,
      number: pr.number,
      title: pr.title || `PR #${pr.number}`,
      description: pr.description || null,
      state: pr.state || 'open',
      created_at: pr.created_at || new Date().toISOString(),
      updated_at: pr.updated_at || new Date().toISOString(),
      author: pr.author || 'unknown',
      head_branch: pr.head_branch || 'feature',
      base_branch: pr.base_branch || 'main',
      metadata: pr.metadata || {}
    };
    
    const key = `${pr.repository_id}:${pr.number}`;
    storage.pullRequests.set(key, storedPR);
    storage.pullRequests.set(id, storedPR);
    
    return storedPR;
  }),
  
  updatePullRequest: jest.fn(async (id, data) => {
    const pr = storage.pullRequests.get(id);
    if (!pr) throw new Error(`Pull request not found: ${id}`);
    
    const updatedPR = {
      ...pr,
      ...data,
      id,
      updated_at: new Date().toISOString()
    };
    
    storage.pullRequests.set(id, updatedPR);
    const key = `${updatedPR.repository_id}:${updatedPR.number}`;
    storage.pullRequests.set(key, updatedPR);
    
    return updatedPR;
  }),
  
  // Utility method for tests
  _getStorage: () => storage
};

// Mock the VCS module 
jest.mock('../../../vcs', () => {
  return {
    getVCSClient: jest.fn((platform) => {
      if (platform === 'github') return createMockGitHubClient();
      if (platform === 'gitlab') return createMockGitLabClient();
      throw new Error(`Unknown platform: ${platform}`);
    }),
    // Re-export VCSError
    VCSError: jest.requireActual('../../../vcs/errors').VCSError
  };
});

describe('Repository Service Integration Tests', () => {
  let service: RepositoryService;
  let mockGithubClient: ReturnType<typeof createMockGitHubClient>;
  let mockGitlabClient: ReturnType<typeof createMockGitLabClient>;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    
    // Clear storage maps
    clearStorage();
    
    // Create mock clients first with synchronized mockImplementation
    // to ensure they are fully created and configured before use
    mockGithubClient = createMockGitHubClient();
    mockGitlabClient = createMockGitLabClient();
    
    // Set up consistent repository mock implementation
    mockGithubClient.getRepository.mockImplementation(async (owner, name) => {
      // For specific test cases that need to throw errors
      if (owner === 'nonexistent') {
        throw new VCSError(
          'Repository not found: nonexistent/repo',
          'github',
          'RESOURCE_NOT_FOUND',
          { owner: 'nonexistent', repo: 'repo' }
        );
      }
      
      return {
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
        url: `https://github.com/${owner}/${name}`
      };
    });
    
    // Implement PR mock to handle test cases
    mockGithubClient.getPullRequest.mockImplementation(async (owner, repo, number) => {
      // Special case for PR not found test
      if (number === 999) {
        throw new VCSError(
          'Pull request not found: test-owner/test-repo#999',
          'github',
          'RESOURCE_NOT_FOUND',
          { owner, repo, pullNumber: 999 }
        );
      }
      
      const mockPR = {...mockGitHubPR};
      mockPR.number = number;
      mockPR.head.repo.owner.login = owner;
      mockPR.head.repo.name = repo;
      mockPR.base.repo.owner.login = owner;
      mockPR.base.repo.name = repo;
      
      return {
        id: mockPR.id.toString(),
        platform: 'github',
        externalId: mockPR.id.toString(),
        number,
        title: `Test PR #${number}`,
        description: `Description for PR #${number}`,
        state: 'open',
        createdAt: new Date(mockPR.created_at),
        updatedAt: new Date(mockPR.updated_at),
        closedAt: null,
        mergedAt: null,
        isDraft: false,
        user: {
          id: mockPR.user.id.toString(),
          platform: 'github',
          externalId: mockPR.user.id.toString(),
          login: mockPR.user.login,
          name: null,
          email: null,
          avatarUrl: mockPR.user.avatar_url,
          url: mockPR.user.html_url
        },
        head: {
          ref: 'feature-branch',
          sha: 'abc1234',
          repo: {
            id: 'repo-123',
            platform: 'github',
            externalId: '12345678',
            name: repo,
            owner: owner,
            fullName: `${owner}/${repo}`,
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
            url: `https://github.com/${owner}/${repo}`
          }
        },
        base: {
          ref: 'main',
          sha: 'def5678',
          repo: {
            id: 'repo-123',
            platform: 'github',
            externalId: '12345678',
            name: repo,
            owner: owner,
            fullName: `${owner}/${repo}`,
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
            url: `https://github.com/${owner}/${repo}`
          }
        },
        labels: ['bug', 'enhancement']
      };
    });
    
    // Override getVCSClient to return our pre-configured mocks
    (vcsModule.getVCSClient as jest.Mock).mockImplementation((platform) => {
      if (platform === 'github') return mockGithubClient;
      if (platform === 'gitlab') return mockGitlabClient;
      throw new Error(`Unknown platform: ${platform}`);
    });
    
    // Create the repository service with our mock database service
    service = new RepositoryService(
      mockDatabaseService,
      { github: 'github-token', gitlab: 'gitlab-token' }
    );
    
    // Set up mock implementations for GitHub client
    mockGithubClient.getPullRequest.mockImplementation(async (owner, repo, number) => {
        const mockPR = {...mockGitHubPR};
        mockPR.number = number;
        mockPR.head.repo.owner.login = owner;
        mockPR.head.repo.name = repo;
        mockPR.base.repo.owner.login = owner;
        mockPR.base.repo.name = repo;
        
        return {
          id: mockPR.id.toString(),
          platform: 'github',
          externalId: mockPR.id.toString(),
          number,
          title: `Test PR #${number}`,
          description: `Description for PR #${number}`,
          state: 'open',
          createdAt: new Date(mockPR.created_at),
          updatedAt: new Date(mockPR.updated_at),
          closedAt: null,
          mergedAt: null,
          isDraft: false,
          user: {
            id: mockPR.user.id.toString(),
            platform: 'github',
            externalId: mockPR.user.id.toString(),
            login: mockPR.user.login,
            name: null,
            email: null,
            avatarUrl: mockPR.user.avatar_url,
            url: mockPR.user.html_url
          },
          head: {
            ref: 'feature-branch',
            sha: 'abc1234',
            repo: {
              id: 'repo-123',
              platform: 'github',
              externalId: '12345678',
              name: repo,
              owner: owner,
              fullName: `${owner}/${repo}`,
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
              url: `https://github.com/${owner}/${repo}`
            }
          },
          base: {
            ref: 'main',
            sha: 'def5678',
            repo: {
              id: 'repo-123',
              platform: 'github',
              externalId: '12345678',
              name: repo,
              owner: owner,
              fullName: `${owner}/${repo}`,
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
              url: `https://github.com/${owner}/${repo}`
            }
          },
          labels: ['bug', 'enhancement']
        };
      });
    
  });

  describe('PR fetching and caching', () => {
    it('should fetch PR from API and store in database', async () => {
      // Arrange
      const platform = 'github';
      const owner = 'test-owner';
      const repo = 'test-repo';
      const prNumber = 123;
      
      // Act
      const result = await service.getPullRequest(platform, owner, repo, prNumber);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.number).toBe(prNumber);
      expect(result.platform).toBe(platform);
      
      // Verify repository was stored
      const repoKey = `${platform}:${owner}/${repo}`;
      const storedRepo = storage.repositories.get(repoKey);
      expect(storedRepo).toBeDefined();
      expect(storedRepo?.owner).toBe(owner);
      expect(storedRepo?.name).toBe(repo);
      
      // Verify PR was stored
      const prKey = `${storedRepo?.id}:${prNumber}`;
      const storedPR = storage.pullRequests.get(prKey);
      expect(storedPR).toBeDefined();
      expect(storedPR?.number).toBe(prNumber);
      expect(storedPR?.title).toBe(`Test PR #${prNumber}`);
      
      // Verify API was called
      expect(mockGithubClient.getPullRequest).toHaveBeenCalledWith(owner, repo, prNumber);
    });
    
    it('should return PR from cache when available', async () => {
      // Arrange
      const platform = 'github';
      const owner = 'test-owner';
      const repo = 'test-repo';
      const prNumber = 123;
      
      // First call to cache the PR
      await service.getPullRequest(platform, owner, repo, prNumber);
      
      // Reset mocks to verify they aren't called again
      mockGithubClient.getPullRequest.mockClear();
      
      // Act
      const result = await service.getPullRequest(platform, owner, repo, prNumber);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.number).toBe(prNumber);
      
      // Verify API was NOT called again
      expect(mockGithubClient.getPullRequest).not.toHaveBeenCalled();
    });
    
    it('should update PR cache when stale', async () => {
      // Arrange
      const platform = 'github';
      const owner = 'test-owner';
      const repo = 'test-repo';
      const prNumber = 123;
      
      // Manually insert a stale PR cache entry
      const repoId = 'repo-test-123';
      const staleTime = new Date();
      staleTime.setHours(staleTime.getHours() - 2); // 2 hours old (beyond 1 hour cache time)
      
      // Create repository with stale timestamp
      await mockDatabaseService.createRepository({
        id: repoId,
        platform,
        name: repo,
        owner: owner,
        description: 'Test repo',
        is_private: false,
        default_branch: 'main',
        created_at: staleTime.toISOString(),
        updated_at: staleTime.toISOString(),
        last_synced_at: staleTime.toISOString()
      });
      
      // Create PR with stale timestamp
      await mockDatabaseService.createPullRequest({
        id: 'pr-test-123',
        repository_id: repoId,
        number: prNumber,
        title: 'Old title',
        state: 'open',
        created_at: staleTime.toISOString(),
        updated_at: staleTime.toISOString(),
        metadata: {
          labels: ['old-label']
        },
        author: 'test-user',
        head_branch: 'feature',
        base_branch: 'main'
      });
      
      // Set up the mock to return updated data
      mockGithubClient.getPullRequest.mockImplementationOnce(async () => ({
        id: 'gh-pr-123',
        platform: 'github',
        externalId: '987654321',
        number: prNumber,
        title: 'Updated title',
        description: 'Updated description',
        state: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
        mergedAt: null,
        isDraft: false,
        user: {
          id: '12345',
          platform: 'github',
          externalId: '12345',
          login: 'test-user',
          name: 'Test User',
          email: null,
          avatarUrl: 'https://github.com/avatar.png',
          url: 'https://github.com/test-user'
        },
        head: {
          ref: 'feature',
          sha: 'newsha123',
          repo: {
            id: 'repo-123',
            platform: 'github',
            externalId: '12345678',
            name: repo,
            owner: owner,
            fullName: `${owner}/${repo}`,
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
            url: `https://github.com/${owner}/${repo}`
          }
        },
        base: {
          ref: 'main',
          sha: 'newsha456',
          repo: {
            id: 'repo-123',
            platform: 'github',
            externalId: '12345678',
            name: repo,
            owner: owner,
            fullName: `${owner}/${repo}`,
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
            url: `https://github.com/${owner}/${repo}`
          }
        },
        labels: ['new-label']
      }));
      
      // Act
      const result = await service.getPullRequest(platform, owner, repo, prNumber);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('Updated title');
      
      // Verify API was called to update stale cache
      expect(mockGithubClient.getPullRequest).toHaveBeenCalledWith(owner, repo, prNumber);
      
      // Verify PR was updated in the database
      const prKey = `${repoId}:${prNumber}`;
      const storedPR = storage.pullRequests.get(prKey);
      expect(storedPR?.title).toBe('Updated title');
    });
  });

  describe('Error handling', () => {
    it('should handle repository not found errors', async () => {
      // Set up mock for repository not found
      mockGithubClient.getRepository.mockImplementationOnce(() => {
        throw new VCSError(
          'Repository not found: nonexistent/repo',
          'github',
          'RESOURCE_NOT_FOUND',
          { owner: 'nonexistent', repo: 'repo' }
        );
      });

      await expect(
        service.getPullRequest('github', 'nonexistent', 'repo', 123)
      ).rejects.toThrow('Repository not found');
    });
    
    it('should handle pull request not found errors', async () => {
      // Setup mock to throw not found error for PR #999
      mockGithubClient.getPullRequest.mockImplementationOnce((owner, repo, number) => {
        if (number === 999) {
          throw new VCSError(
            'Pull request not found',
            'github',
            'RESOURCE_NOT_FOUND',
            { owner, repo, number }
          );
        }
        // This shouldn't be reached
        return Promise.resolve(null as any);
      });

      // Test
      await expect(
        service.getPullRequest('github', 'test-owner', 'test-repo', 999)
      ).rejects.toThrow('Pull request not found');
    });
    
    it('should handle rate limit errors', async () => {
      // Override getRepository to throw a rate limit error
      const resetTime = new Date(Date.now() + 60 * 1000); // 1 minute from now
      mockGithubClient.getRepository.mockImplementationOnce(() => {
        throw new VCSError(
          'API rate limit exceeded',
          'github',
          'RATE_LIMIT_EXCEEDED',
          { 
            rateLimitRemaining: 0,
            rateLimitReset: resetTime.getTime(),
            retryAfter: 60000,
            platform: 'github'
          }
        );
      });
      
      // Act
      const error = await service.getPullRequest('github', 'test-owner', 'test-repo', 123)
        .catch(e => e);
        
      // Assert
      expect(error).toBeInstanceOf(RepositoryError);
      expect(error.message).toContain('Rate limit exceeded');
      expect(error.retryAfter).toBeDefined();
      expect(error.reset).toBeDefined();
    });
    
    it('should handle database errors gracefully', async () => {
      // Reset the repository mock to ensure it succeeds
      mockGithubClient.getRepository.mockImplementation(async (owner, name) => ({
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
        url: `https://github.com/${owner}/${name}`
      }));
      
      // Override createRepository to throw a DB error
      mockDatabaseService.createRepository = jest.fn().mockImplementation(() => {
        throw new Error('Database connection error');
      });
      
      // Act & Assert
      await expect(
        service.getPullRequest('github', 'test-owner', 'test-repo', 123)
      ).rejects.toThrow('Database connection error');
    });
  });

  describe('Platform support', () => {
    it('should support GitHub PRs', async () => {
      // Act
      const result = await service.getPullRequest('github', 'test-owner', 'test-repo', 123);
      
      // Assert
      expect(result.platform).toBe('github');
      expect(mockGithubClient.getPullRequest).toHaveBeenCalled();
    });
    
    it('should support GitLab PRs', async () => {
      // Arrange
      mockGitlabClient.getPullRequest.mockImplementationOnce(async () => ({
        id: 'gl-mr-123',
        platform: 'gitlab',
        externalId: '123456',
        number: 123,
        title: 'GitLab MR',
        description: 'Test GitLab merge request',
        state: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
        mergedAt: null,
        isDraft: false,
        user: {
          id: '67890',
          platform: 'gitlab',
          externalId: '67890',
          login: 'gitlab-user',
          name: 'GitLab User',
          email: null,
          avatarUrl: 'https://gitlab.com/avatar.png',
          url: 'https://gitlab.com/gitlab-user'
        },
        head: {
          ref: 'feature-branch',
          sha: 'glsha123',
          repo: {
            id: 'repo-456',
            platform: 'gitlab',
            externalId: '56789',
            name: 'test-repo',
            owner: 'test-owner',
            fullName: 'test-owner/test-repo',
            description: 'GitLab test repo',
            isPrivate: false,
            defaultBranch: 'main',
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: {
              admin: true,
              push: true,
              pull: true
            },
            url: 'https://gitlab.com/test-owner/test-repo'
          }
        },
        base: {
          ref: 'main',
          sha: 'glsha456',
          repo: {
            id: 'repo-456',
            platform: 'gitlab',
            externalId: '56789',
            name: 'test-repo',
            owner: 'test-owner',
            fullName: 'test-owner/test-repo',
            description: 'GitLab test repo',
            isPrivate: false,
            defaultBranch: 'main',
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: {
              admin: true,
              push: true,
              pull: true
            },
            url: 'https://gitlab.com/test-owner/test-repo'
          }
        },
        labels: ['gitlab-label']
      }));
      
      // Act
      const result = await service.getPullRequest('gitlab', 'test-owner', 'test-repo', 123);
      
      // Assert
      expect(result.platform).toBe('gitlab');
      expect(mockGitlabClient.getPullRequest).toHaveBeenCalled();
    });
  });
});
