import { RepositoryService } from '../../repository/repository-service';
import { VCSError } from '../../vcs/errors';
import { RepositoryError } from '../../repository/repository-error';
import { VCSPlatform } from '../../vcs/types';
import * as vcsModule from '../../vcs';
import { MockDatabase, SimplifiedVCSClient } from './types';

/**
 * Simplified error handling tests focused on critical error scenarios.
 * Complex error conditions are covered by manual testing.
 */
describe('Repository Service Error Handling', () => {
  let mockClient: SimplifiedVCSClient;
  let mockDb: MockDatabase;
  let service: RepositoryService;
  
  beforeEach(() => {
    jest.resetAllMocks();
    
    // Create simple mocks
    mockClient = {
      getPlatform: jest.fn().mockReturnValue('github'),
      getRepository: jest.fn(),
      getRateLimit: jest.fn().mockResolvedValue({
        limit: 5000,
        remaining: 4900,
        reset: new Date(Date.now() + 3600 * 1000),
        used: 100
      })
    };
    
    mockDb = {
      getRepositoryByOwnerAndName: jest.fn().mockResolvedValue(null),
      createRepository: jest.fn().mockResolvedValue({ id: 'test-repo-id' })
    };
    
    // Mock VCS client factory
    jest.spyOn(vcsModule, 'getVCSClient').mockReturnValue(mockClient);
    
    // Create service
    service = new RepositoryService(mockDb, { github: 'github-token' });
  });
  
  it('should convert rate limit errors with proper retry information', async () => {
    // Setup rate limit error
    const resetTime = new Date(Date.now() + 3600 * 1000);
    mockClient.getRepository.mockImplementationOnce(() => {
      throw new VCSError(
        'API rate limit exceeded',
        'github',
        'RATE_LIMIT_EXCEEDED',
        {
          rateLimitReset: resetTime.getTime(),
          retryAfter: 3600000,
          platform: 'github'
        }
      );
    });
    
    // Test error handling
    try {
      await service.getRepository('github', 'test-owner', 'test-repo');
      fail('Should have thrown rate limit error');
    } catch (error) {
      expect(error).toBeInstanceOf(RepositoryError);
      if (error instanceof RepositoryError) {
        expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
        expect(error.retryAfter).toBeGreaterThan(0);
        expect(error.reset).toBeInstanceOf(Date);
        expect(error.platform).toBe('github');
      }
    }
  });
  
  it('should convert not found errors with repository context', async () => {
    // Setup not found error
    mockClient.getRepository.mockImplementationOnce(() => {
      throw new VCSError(
        'Repository not found',
        'github',
        'REPOSITORY_NOT_FOUND',
        { owner: 'nonexistent', repo: 'repo' }
      );
    });
    
    // Test error handling
    try {
      await service.getRepository('github', 'nonexistent', 'repo');
      fail('Should have thrown not found error');
    } catch (error) {
      expect(error).toBeInstanceOf(RepositoryError);
      if (error instanceof RepositoryError) {
        expect(error.code).toBe('REPOSITORY_NOT_FOUND');
        expect(error.owner).toBe('nonexistent');
        expect(error.repo).toBe('repo');
        expect(error.platform).toBe('github');
      }
    }
  });
  
  it('should pass through database errors directly', async () => {
    // Setup database error
    mockDb.createRepository.mockImplementationOnce(() => {
      throw new Error('Database connection error');
    });
    
    // Test error propagation
    await expect(
      service.getRepository('github', 'test-owner', 'test-repo')
    ).rejects.toThrow('Database connection error');
  });
  
  it('should throw appropriate error for invalid platform', async () => {
    await expect(
      service.getRepository('invalid-platform' as VCSPlatform, 'owner', 'repo')
    ).rejects.toThrow(/No client available for platform/);
  });
});
