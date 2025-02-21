/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import { createMockGitHubClient, createMockGitLabClient } from '../../vcs/__mocks__/mock-vcs-clients';
import * as vcsModule from '../../vcs';

describe('Repository Service Platform Support Tests', () => {
  let service: RepositoryService;
  let mockGithubClient: ReturnType<typeof createMockGitHubClient>;
  let mockGitlabClient: ReturnType<typeof createMockGitLabClient>;
  let mockDatabaseService: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock database
    mockDatabaseService = {
      getRepositoryByOwnerAndName: jest.fn().mockResolvedValue(null),
      getPullRequestByNumber: jest.fn().mockResolvedValue(null),
      createRepository: jest.fn().mockImplementation(repo => ({
        ...repo,
        id: `repo-${Date.now()}`
      })),
      createPullRequest: jest.fn().mockImplementation(pr => ({
        ...pr,
        id: `pr-${Date.now()}`
      }))
    };
    
    // Create mock clients
    mockGithubClient = createMockGitHubClient();
    mockGitlabClient = createMockGitLabClient();
    
    // Reset rate limit mocks to return good values
    mockGithubClient.getRateLimit.mockResolvedValue({
      limit: 5000,
      remaining: 4900,
      reset: new Date(Date.now() + 3600 * 1000),
      used: 100
    });
    
    mockGitlabClient.getRateLimit.mockResolvedValue({
      limit: 2000,
      remaining: 1900,
      reset: new Date(Date.now() + 3600 * 1000),
      used: 100
    });
    
    // Configure getVCSClient mock
    jest.spyOn(vcsModule, 'getVCSClient').mockImplementation((platform) => {
      if (platform === 'github') return mockGithubClient;
      if (platform === 'gitlab') return mockGitlabClient;
      throw new Error(`Unknown platform: ${platform}`);
    });

    // Initialize repository service with tokens for both platforms
    service = new RepositoryService(
      mockDatabaseService,
      { github: 'github-token', gitlab: 'gitlab-token' }
    );
  });

  it('should support GitHub PRs', async () => {
    // Act
    const result = await service.getRateLimit('github');
    
    // Assert
    expect(result).toBeDefined();
    expect(result.limit).toBe(5000);
  });
  
  it('should support GitLab PRs', async () => {
    // Act
    const result = await service.getRateLimit('gitlab');
    
    // Assert
    expect(result).toBeDefined();
    expect(result.limit).toBe(2000);
  });
  
  it('should throw error for unsupported platform', async () => {
    // Act & Assert
    await expect(
      service.getRateLimit('bitbucket' as any)
    ).rejects.toThrow('No client available for platform: bitbucket');
  });
  
  it('should support using platform-specific clients', async () => {
    // Act
    const githubClient = (service as any).getClientForPlatform('github');
    const gitlabClient = (service as any).getClientForPlatform('gitlab');
    
    // Assert
    expect(githubClient).toBe(mockGithubClient);
    expect(gitlabClient).toBe(mockGitlabClient);
    expect(githubClient.getPlatform()).toBe('github');
    expect(gitlabClient.getPlatform()).toBe('gitlab');
  });
});
