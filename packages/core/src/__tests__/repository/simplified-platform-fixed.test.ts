/**
 * Simplified platform support tests
 */
import { RepositoryService } from '../../repository/repository-service';
import { MockDatabaseService } from './mock-database-service';
import { DatabaseService } from '../../supabase/database';
import { getVCSClient } from '../../vcs';
import { RepositoryError } from '../../repository/repository-error';
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
    (getVCSClient as jest.Mock).mockImplementationOnce(() => ({
      getPlatform: () => 'github'
    }));
    
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, { github: 'github-token' });
    
    // Try to access GitLab
    try {
      await service.getRepository('gitlab', 'owner', 'repo');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(RepositoryError);
      if (error instanceof RepositoryError) {
        expect(error.message).toContain('No client available for platform');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    }
  });

  it('should fail with helpful message for unsupported platforms', async () => {
    // Cast to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as DatabaseService, { github: 'github-token' });
    
    try {
      // Use a platform that doesn't exist
      await service.getRepository('bitbucket' as VCSPlatform, 'owner', 'repo');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(RepositoryError);
      if (error instanceof RepositoryError) {
        expect(error.message).toContain('No client available for platform');
        expect(error.code).toBe('VALIDATION_ERROR');
      }
    }
  });
});
