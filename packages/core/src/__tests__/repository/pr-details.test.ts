/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import { createMockGitHubClient } from '../../vcs/__mocks__/mock-vcs-clients';
import * as vcsModule from '../../vcs';
import { createTestStorage, createMockDatabaseService } from './mock-database-service';

jest.mock('../../vcs', () => {
  const originalModule = jest.requireActual('../../vcs');
  return {
    ...originalModule,
    getVCSClient: jest.fn()
  };
});

describe('Repository Service PR Details Tests', () => {
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

    // Set up mock implementations
    mockGithubClient.getPullRequestFiles.mockResolvedValue([
      {
        sha: 'file-sha-1',
        filename: 'src/index.ts',
        status: 'modified',
        additions: 10,
        deletions: 5,
        changes: 15,
        patch: '@@ -1,5 +1,10 @@\n+// New code\n-// Old code'
      }
    ]);
    
    mockGithubClient.getPullRequestCommits.mockResolvedValue([
      {
        sha: 'commit-sha-1',
        message: 'Fix bug',
        author: {
          name: 'Test User',
          email: 'test@example.com',
          date: new Date()
        },
        committer: {
          name: 'Test User',
          email: 'test@example.com',
          date: new Date()
        },
        parents: ['parent-sha-1'],
        url: 'https://github.com/example/commit/commit-sha-1'
      }
    ]);
    
    mockGithubClient.getPullRequestReviews.mockResolvedValue([
      {
        id: 'review-1',
        user: {
          id: 'user-456',
          login: 'reviewer',
          name: 'Reviewer',
          email: null,
          avatarUrl: 'https://github.com/reviewer.png',
          url: 'https://github.com/reviewer',
          platform: 'github',
          externalId: 'user-456'
        },
        state: 'APPROVED',
        body: 'LGTM!',
        commitId: 'commit-sha-1',
        submittedAt: new Date()
      }
    ]);
    
    mockGithubClient.getPullRequestComments.mockResolvedValue([
      {
        id: 'comment-1',
        user: {
          id: 'user-789',
          login: 'commenter',
          name: 'Commenter',
          email: null,
          avatarUrl: 'https://github.com/commenter.png',
          url: 'https://github.com/commenter',
          platform: 'github',
          externalId: 'user-789'
        },
        body: 'Needs improvement',
        createdAt: new Date(),
        updatedAt: new Date(),
        path: 'src/index.ts',
        position: 3
      }
    ]);

    // Initialize repository service
    service = new RepositoryService(
      mockDatabaseService as any,
      { github: 'github-token' }
    );
  });

  it('should fetch PR details including files, commits, reviews, and comments', async () => {
    // Arrange
    const platform = 'github';
    const owner = 'test-owner';
    const repo = 'test-repo';
    const prNumber = 123;
    
    // Act
    const result = await service.getPullRequestDetails(platform, owner, repo, prNumber);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.pullRequest).toBeDefined();
    expect(result.pullRequest.number).toBe(prNumber);
    
    // Verify files were fetched
    expect(result.files).toBeDefined();
    expect(result.files.length).toBeGreaterThan(0);
    expect(result.files[0].filename).toBe('src/index.ts');
    
    // Verify commits were fetched
    expect(result.commits).toBeDefined();
    expect(result.commits.length).toBeGreaterThan(0);
    expect(result.commits[0].sha).toBe('commit-sha-1');
    
    // Verify reviews were fetched
    expect(result.reviews).toBeDefined();
    expect(result.reviews.length).toBeGreaterThan(0);
    expect(result.reviews[0].state).toBe('APPROVED');
    
    // Verify comments were fetched
    expect(result.comments).toBeDefined();
    expect(result.comments.length).toBeGreaterThan(0);
    expect(result.comments[0].body).toBe('Needs improvement');
    
    // Verify all methods were called
    expect(mockGithubClient.getPullRequest).toHaveBeenCalledWith(owner, repo, prNumber);
    expect(mockGithubClient.getPullRequestFiles).toHaveBeenCalledWith(owner, repo, prNumber);
    expect(mockGithubClient.getPullRequestCommits).toHaveBeenCalledWith(owner, repo, prNumber);
    expect(mockGithubClient.getPullRequestReviews).toHaveBeenCalledWith(owner, repo, prNumber);
    expect(mockGithubClient.getPullRequestComments).toHaveBeenCalledWith(owner, repo, prNumber);
  });
  
  it('should fetch PR files only when requested', async () => {
    // Arrange
    const platform = 'github';
    const owner = 'test-owner';
    const repo = 'test-repo';
    const prNumber = 123;
    
    // Act
    const result = await service.getPullRequestFiles(platform, owner, repo, prNumber);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].filename).toBe('src/index.ts');
    
    // Verify only getPullRequest and getPullRequestFiles were called
    expect(mockGithubClient.getPullRequest).toHaveBeenCalledWith(owner, repo, prNumber);
    expect(mockGithubClient.getPullRequestFiles).toHaveBeenCalledWith(owner, repo, prNumber);
    expect(mockGithubClient.getPullRequestCommits).not.toHaveBeenCalled();
    expect(mockGithubClient.getPullRequestReviews).not.toHaveBeenCalled();
    expect(mockGithubClient.getPullRequestComments).not.toHaveBeenCalled();
  });
  
  it('should handle empty PR details gracefully', async () => {
    // Arrange
    const platform = 'github';
    const owner = 'test-owner';
    const repo = 'test-repo';
    const prNumber = 123;
    
    // Set up mocks to return empty arrays
    mockGithubClient.getPullRequestFiles.mockResolvedValueOnce([]);
    mockGithubClient.getPullRequestCommits.mockResolvedValueOnce([]);
    mockGithubClient.getPullRequestReviews.mockResolvedValueOnce([]);
    mockGithubClient.getPullRequestComments.mockResolvedValueOnce([]);
    
    // Act
    const result = await service.getPullRequestDetails(platform, owner, repo, prNumber);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.pullRequest).toBeDefined();
    expect(result.files).toEqual([]);
    expect(result.commits).toEqual([]);
    expect(result.reviews).toEqual([]);
    expect(result.comments).toEqual([]);
  });
  
  it('should verify repository access before fetching PR files', async () => {
    // Arrange
    const platform = 'github';
    const owner = 'test-owner';
    const repo = 'test-repo';
    const prNumber = 123;
    
    // Act
    await service.getPullRequestFiles(platform, owner, repo, prNumber);
    
    // Assert - verify getRepository was called to check access
    expect(mockGithubClient.getRepository).toHaveBeenCalledWith(owner, repo);
  });
});
