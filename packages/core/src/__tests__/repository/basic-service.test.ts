/**
 * Basic service tests focused on initialization without complex mocking
 */
import { RepositoryService } from '../../repository/repository-service';
import { DatabaseService } from '../../supabase/database';
import { MockDatabaseService } from './mock-database-service';
import { getVCSClient } from '../../vcs';

// Mock the VCS module
jest.mock('../../vcs', () => ({
  getVCSClient: jest.fn().mockImplementation((platform) => ({
    getPlatform: () => platform
  }))
}));

describe('Basic Repository Service Tests', () => {
  let mockDb: MockDatabaseService;

  beforeEach(() => {
    mockDb = new MockDatabaseService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockDb.clearMocks();
  });

  it('should construct with empty token object', () => {
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as unknown as DatabaseService, {});
    
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).not.toHaveBeenCalled();
  });

  it('should construct with GitHub token', () => {
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as unknown as DatabaseService, { 
      github: 'github-token' 
    });
    
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledWith('github', 'github-token', undefined);
  });

  it('should construct with GitLab token', () => {
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as unknown as DatabaseService, { 
      gitlab: 'gitlab-token' 
    });
    
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledWith('gitlab', 'gitlab-token', undefined);
  });

  it('should construct with both tokens', () => {
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as unknown as DatabaseService, {
      github: 'github-token',
      gitlab: 'gitlab-token'
    });
    
    expect(service).toBeInstanceOf(RepositoryService);
    expect(getVCSClient).toHaveBeenCalledTimes(2);
    expect(getVCSClient).toHaveBeenCalledWith('github', 'github-token', undefined);
    expect(getVCSClient).toHaveBeenCalledWith('gitlab', 'gitlab-token', undefined);
  });

  it('should construct with custom base URLs', () => {
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as unknown as DatabaseService, 
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
});
