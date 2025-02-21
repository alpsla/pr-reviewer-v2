/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import * as vcsModule from '../../vcs';
import { VCSClient, VCSPlatform } from '../../vcs/types';

/**
 * Simplified platform support tests focused on basic platform compatibility.
 * Detailed platform-specific features are covered by manual testing.
 */
describe('Repository Service Platform Support', () => {
  let mockGithubClient: any;
  let mockGitlabClient: any;
  let mockDb: any;
  let service: RepositoryService;
  
  beforeEach(() => {
    jest.resetAllMocks();
    
    // Create platform-specific mocks
    mockGithubClient = {
      getPlatform: jest.fn().mockReturnValue('github'),
      getRateLimit: jest.fn().mockResolvedValue({
        limit: 5000,
        remaining: 4900,
        reset: new Date(Date.now() + 3600 * 1000),
        used: 100
      })
    };
    
    mockGitlabClient = {
      getPlatform: jest.fn().mockReturnValue('gitlab'),
      getRateLimit: jest.fn().mockResolvedValue({
        limit: 2000,
        remaining: 1900,
        reset: new Date(Date.now() + 3600 * 1000),
        used: 100
      })
    };
    
    mockDb = {
      getRepositoryByOwnerAndName: jest.fn().mockResolvedValue(null),
      createRepository: jest.fn().mockResolvedValue({ id: 'test-repo-id' })
    };
    
    // Mock VCS client factory
    jest.spyOn(vcsModule, 'getVCSClient').mockImplementation((platform) => {
      if (platform === 'github') return mockGithubClient as VCSClient;
      if (platform === 'gitlab') return mockGitlabClient as VCSClient;
      throw new Error(`Unsupported platform: ${platform}`);
    });
    
    // Create service with both platform tokens
    service = new RepositoryService(
      mockDb as any,
      { github: 'github-token', gitlab: 'gitlab-token' }
    );
  });
  
  it('should use GitHub client for GitHub operations', async () => {
    const result = await service.getRateLimit('github');
    expect(result).toBeDefined();
    expect(result.limit).toBe(5000);
  });
  
  it('should use GitLab client for GitLab operations', async () => {
    const result = await service.getRateLimit('gitlab');
    expect(result).toBeDefined();
    expect(result.limit).toBe(2000);
  });
  
  it('should throw error for unsupported platforms', async () => {
    try {
      await service.getRateLimit('bitbucket' as VCSPlatform);
      // Should not reach here
      expect('unreachable').toBe('should have thrown');
    } catch (error) {
      expect(error.message).toContain('bitbucket');
    }
  });
  
  it('should initialize only available clients', async () => {
    // Create service with only GitHub token
    const githubOnlyService = new RepositoryService(
      mockDb as any,
      { github: 'github-token' }
    );
    
    // Verify GitHub works but GitLab fails
    const githubResult = await githubOnlyService.getRateLimit('github');
    expect(githubResult).toBeDefined();
    expect(githubResult.limit).toBe(5000);
    
    try {
      await githubOnlyService.getRateLimit('gitlab');
      // Should not reach here
      expect('unreachable').toBe('should have thrown');
    } catch (error) {
      expect(error.message).toMatch(/No client available.*gitlab/i);
    }
    
    // Create service with only GitLab token
    const gitlabOnlyService = new RepositoryService(
      mockDb as any,
      { gitlab: 'gitlab-token' }
    );
    
    // Verify GitLab works but GitHub fails
    const gitlabResult = await gitlabOnlyService.getRateLimit('gitlab');
    expect(gitlabResult).toBeDefined();
    expect(gitlabResult.limit).toBe(2000);
    
    try {
      await gitlabOnlyService.getRateLimit('github');
      // Should not reach here
      expect('unreachable').toBe('should have thrown');
    } catch (error) {
      expect(error.message).toMatch(/No client available.*github/i);
    }
  });
});
