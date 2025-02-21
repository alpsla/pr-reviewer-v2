/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import { createMockGitHubClient } from '../../vcs/__mocks__/mock-vcs-clients';
import * as vcsModule from '../../vcs';

// Simplified integration test that focuses on core functionality
describe('Simplified Repository Service Tests', () => {
  let service: RepositoryService;
  let mockDatabaseService: any;
  let mockGithubClient: ReturnType<typeof createMockGitHubClient>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create minimal mock database with required functionality
    mockDatabaseService = {
      getRepositoryByOwnerAndName: jest.fn().mockResolvedValue(null),
      getPullRequestByNumber: jest.fn().mockResolvedValue(null),
      createRepository: jest.fn().mockImplementation(repo => ({
        ...repo,
        id: 'repo-123'
      })),
      createPullRequest: jest.fn().mockImplementation(pr => ({
        ...pr,
        id: 'pr-123'
      }))
    };
    
    // Create GitHub client with basic implementation
    mockGithubClient = createMockGitHubClient();
    
    // Mock the VCS module
    jest.spyOn(vcsModule, 'getVCSClient').mockReturnValue(mockGithubClient);
    
    // Create service
    service = new RepositoryService(
      mockDatabaseService,
      { github: 'github-token' }
    );
  });
  
  it('should fetch repository data', async () => {
    // Act
    const result = await service.getRepository('github', 'test-owner', 'test-repo');
    
    // Assert
    expect(result).toBeDefined();
    expect(result.owner).toBe('test-owner');
    expect(result.name).toBe('test-repo');
    expect(mockGithubClient.getRepository).toHaveBeenCalledWith('test-owner', 'test-repo');
    expect(mockDatabaseService.createRepository).toHaveBeenCalled();
  });
  
  it('should fetch pull request data', async () => {
    // Act
    const result = await service.getPullRequest('github', 'test-owner', 'test-repo', 123);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.number).toBe(123);
    expect(mockGithubClient.getRepository).toHaveBeenCalled();
    expect(mockGithubClient.getPullRequest).toHaveBeenCalledWith('test-owner', 'test-repo', 123);
    expect(mockDatabaseService.createPullRequest).toHaveBeenCalled();
  });
  
  it('should fetch pull request details', async () => {
    // Act
    const result = await service.getPullRequestDetails('github', 'test-owner', 'test-repo', 123);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.pullRequest).toBeDefined();
    expect(result.files).toBeDefined();
    expect(result.commits).toBeDefined();
    expect(result.reviews).toBeDefined();
    expect(result.comments).toBeDefined();
    expect(mockGithubClient.getPullRequestFiles).toHaveBeenCalled();
    expect(mockGithubClient.getPullRequestCommits).toHaveBeenCalled();
    expect(mockGithubClient.getPullRequestReviews).toHaveBeenCalled();
    expect(mockGithubClient.getPullRequestComments).toHaveBeenCalled();
  });
});
