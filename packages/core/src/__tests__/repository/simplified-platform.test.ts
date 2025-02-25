/**
 * Simplified platform support tests
 */
import { RepositoryService } from '../../repository/repository-service';
import { MockDatabaseService } from './mock-database-service';
import { DatabaseService } from '../../supabase/database';
import { getVCSClient } from '../../vcs';
import { VCSPlatform } from '../../vcs/types';

// Mock the VCS module
jest.mock('../../vcs', () => ({
  getVCSClient: jest.fn()
}));

describe('Simplified Platform Support Tests', () => {
  let mockDb: MockDatabaseService;

  beforeEach(() => {
    mockDb = new MockDatabaseService();
    jest.clearAllMocks();
  });

  it('should initialize with GitHub token', () => {
    // Mock implementation for GitHub client
    (getVCSClient as jest.Mock).mockImplementationOnce(() => ({
      getPlatform: () => 'github'
    }));
    
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, { github: 'github-token' });
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledWith('github', 'github-token', undefined);
  });

  it('should initialize with GitLab token', () => {
    // Mock implementation for GitLab client
    (getVCSClient as jest.Mock).mockImplementationOnce(() => ({
      getPlatform: () => 'gitlab'
    }));
    
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, { gitlab: 'gitlab-token' });
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledWith('gitlab', 'gitlab-token', undefined);
  });

  it('should initialize with both tokens', () => {
    // Mock implementations for both clients
    (getVCSClient as jest.Mock)
      .mockImplementationOnce(() => ({
        getPlatform: () => 'github'
      }))
      .mockImplementationOnce(() => ({
        getPlatform: () => 'gitlab'
      }));
    
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, { 
      github: 'github-token',
      gitlab: 'gitlab-token'
    });
    
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledTimes(2);
  });

  it('should initialize with custom base URLs', () => {
    // Mock implementations for both clients
    (getVCSClient as jest.Mock)
      .mockImplementationOnce(() => ({
        getPlatform: () => 'github'
      }))
      .mockImplementationOnce(() => ({
        getPlatform: () => 'gitlab'
      }));
    
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, 
      { 
        github: 'github-token',
        gitlab: 'gitlab-token'
      },
      {
        github: 'https://github.enterprise.com',
        gitlab: 'https://gitlab.enterprise.com'
      }
    );
    
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledWith('github', 'github-token', 'https://github.enterprise.com');
    expect(getVCSClient).toHaveBeenCalledWith('gitlab', 'gitlab-token', 'https://gitlab.enterprise.com');
  });

  it('should fail when accessing platform without token', async () => {
    // Initialize with only GitHub token
    (getVCSClient as jest.Mock).mockImplementation((platform) => {
      if (platform === 'github') {
        return {
          getPlatform: () => 'github'
        };
      }
      // Don't return a client for gitlab
      throw new Error('No client available for platform: gitlab. Please check your authentication.');
    });
    
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, { github: 'github-token' });
    
    // Try to access GitLab
    try {
      await service.getRepository('gitlab', 'owner', 'repo');
      fail('Should have thrown an error');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      if (err instanceof Error) {
        expect(err.message).toContain('No client available for platform');
      }
    }
  });

  it('should fail with helpful message for unsupported platforms', async () => {
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, { github: 'github-token' });
    
    // Mock the implementation for the unsupported platform
    (getVCSClient as jest.Mock).mockImplementation((platform) => {
      if (platform === 'github') {
        return {
          getPlatform: () => 'github'
        };
      }
      // Don't return a client for unsupported platforms
      throw new Error('No client available for platform: bitbucket. Please check your authentication.');
    });
    
    try {
      // Use a platform that doesn't exist
      await service.getRepository('bitbucket' as VCSPlatform, 'owner', 'repo');
      fail('Should have thrown an error');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      if (err instanceof Error) {
        expect(err.message).toContain('No client available for platform');
      }
    }
  });
});
