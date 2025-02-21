/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import * as vcsModule from '../../vcs';

describe('Repository Service Cache Tests', () => {
  let service: RepositoryService;
  let mockDatabaseService: any;
  let mockClient: any;
  let repoFetchCount = 0;
  let prFetchCount = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    repoFetchCount = 0; 
    prFetchCount = 0;
    
    // Create mock database with working cache
    mockDatabaseService = {
      getRepositoryByOwnerAndName: jest.fn(async (platform, owner, name) => {
        // Return fresh data on first call
        const currentTime = new Date().toISOString();
        return {
          id: 'repo-123',
          platform: 'github',
          owner: 'test-owner',
          name: 'test-repo',
          description: 'Test repo description',
          is_private: false,
          default_branch: 'main',
          last_synced_at: currentTime,
          created_at: currentTime,
          updated_at: currentTime,
          metadata: {}
        };
      }),
      
      getPullRequestByNumber: jest.fn(async (repoId, number) => {
        // First call returns fresh data
        const currentTime = new Date().toISOString();
        return {
          id: 'pr-123',
          repository_id: 'repo-123',
          number: 123,
          title: 'Cached PR',
          description: 'This is a cached PR',
          state: 'open',
          created_at: currentTime,
          updated_at: currentTime,
          author: 'test-user',
          head_branch: 'feature',
          base_branch: 'main',
          author_id: '12345',
          author_login: 'test-user',
          author_name: 'Test User',
          author_avatar_url: 'https://example.com/avatar.png',
          head_ref: 'feature',
          base_ref: 'main',
          head_sha: 'abc123',
          base_sha: 'def456',
          labels: ['bug'],
          url: 'https://github.com/test-owner/test-repo/pull/123'
        };
      }),
      
      createRepository: jest.fn().mockResolvedValue({ id: 'repo-123' }),
      createPullRequest: jest.fn().mockImplementation(pr => ({
        ...pr,
        id: 'pr-123'
      }))
    };
    
    // Create mock VCS client
    mockClient = {
      getPlatform: jest.fn().mockReturnValue('github'),
      getRepository: jest.fn().mockImplementation(() => {
        repoFetchCount++;
        return {
          id: 'repo-123',
          platform: 'github',
          externalId: '12345',
          name: 'test-repo',
          owner: 'test-owner',
          fullName: 'test-owner/test-repo',
          description: 'Test repo',
          isPrivate: false,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: { admin: true, push: true, pull: true },
          url: 'https://github.com/test-owner/test-repo',
          language: 'TypeScript',
          topics: ['testing'],
          stargazersCount: 5,
          forksCount: 1,
          openIssuesCount: 2
        };
      }),
      getPullRequest: jest.fn().mockImplementation(() => {
        prFetchCount++;
        return {
          id: 'pr-123',
          platform: 'github',
          externalId: '987654',
          number: 123,
          title: 'API PR',
          description: 'This is a PR from the API',
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
            avatarUrl: 'https://example.com/avatar.png',
            url: 'https://github.com/test-user'
          },
          head: {
            ref: 'feature',
            sha: 'abc123',
            repo: {
              id: 'repo-123',
              platform: 'github',
              externalId: '12345',
              name: 'test-repo',
              owner: 'test-owner',
              fullName: 'test-owner/test-repo',
              url: 'https://github.com/test-owner/test-repo'
            }
          },
          base: {
            ref: 'main',
            sha: 'def456',
            repo: {
              id: 'repo-123',
              platform: 'github',
              externalId: '12345',
              name: 'test-repo',
              owner: 'test-owner',
              fullName: 'test-owner/test-repo',
              url: 'https://github.com/test-owner/test-repo'
            }
          },
          labels: []
        };
      })
    };
    
    // Mock VCS module
    jest.spyOn(vcsModule, 'getVCSClient').mockReturnValue(mockClient);
    
    // Create service
    service = new RepositoryService(
      mockDatabaseService,
      { github: 'test-token' }
    );
  });
  
  it('should return PR from cache when available', async () => {
    // Act
    const result = await service.getPullRequest('github', 'test-owner', 'test-repo', 123);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.title).toBe('Cached PR');
    expect(prFetchCount).toBe(0);
    expect(mockClient.getPullRequest).not.toHaveBeenCalled();
  });
  
  it('should update cache when stale', async () => {
    // Arrange - update database to return stale data
    const staleTime = new Date();
    staleTime.setDate(staleTime.getDate() - 1); // 1 day old
    const staleTimeStr = staleTime.toISOString();
    
    // Override the database methods once to return stale data
    mockDatabaseService.getRepositoryByOwnerAndName.mockReset();
    mockDatabaseService.getRepositoryByOwnerAndName.mockResolvedValueOnce({
      id: 'repo-123',
      platform: 'github',
      owner: 'test-owner',
      name: 'test-repo',
      description: 'Test repo description',
      is_private: false,
      default_branch: 'main',
      last_synced_at: staleTimeStr, // Stale timestamp
      created_at: staleTimeStr,
      updated_at: staleTimeStr,
      metadata: {}
    });
    
    mockDatabaseService.getPullRequestByNumber.mockReset();
    mockDatabaseService.getPullRequestByNumber.mockResolvedValueOnce({
      id: 'pr-123',
      repository_id: 'repo-123',
      number: 123,
      title: 'Stale PR',
      description: 'This is a stale PR',
      state: 'open',
      created_at: staleTimeStr,
      updated_at: staleTimeStr, // Stale timestamp
      author: 'test-user',
      head_branch: 'feature',
      base_branch: 'main'
    });
    
    // Act
    const result = await service.getPullRequest('github', 'test-owner', 'test-repo', 123);
    
    // Assert
    expect(result).toBeDefined();
    // Should get the API result when data is stale
    expect(prFetchCount).toBe(1);
    expect(result.title).toBe('API PR');
    expect(mockClient.getPullRequest).toHaveBeenCalledWith('test-owner', 'test-repo', 123);
    expect(mockDatabaseService.createPullRequest).toHaveBeenCalled();
  });
});
