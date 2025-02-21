import { RepositoryService } from '../../repository/repository-service';
import { DatabaseService } from '../../supabase/database';
import * as vcsModule from '../../vcs';
import { MockDatabase } from './types';

/**
 * Basic test suite that checks fundamental behavior without relying on
 * problematic properties or complex mocking.
 */
describe('Basic Repository Service Tests', () => {
  it('should create instance of RepositoryService', () => {
    // Simplest test - just verify we can create the service
    const mockDb: MockDatabase = { 
      getRepositoryByOwnerAndName: jest.fn(),
      createRepository: jest.fn(),
      getPullRequestByNumber: jest.fn(),
      createPullRequest: jest.fn(),
      createUser: jest.fn(),
      getUser: jest.fn(),
      getUserByGithubId: jest.fn(),
      updateUser: jest.fn(),
      getPullRequest: jest.fn(),
      createAnalysisJob: jest.fn(),
      getNextAnalysisJob: jest.fn()
    };
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as unknown as DatabaseService, {});
    expect(service).toBeInstanceOf(RepositoryService);
  });

  it('should verify basic error handling', async () => {
    // Create minimal service
    // Define the client but we don't need to use it since we're mocking getVCSClient
    const mockDb: MockDatabase = { 
      getRepositoryByOwnerAndName: jest.fn(),
      createRepository: jest.fn(),
      getPullRequestByNumber: jest.fn(),
      createPullRequest: jest.fn(),
      createUser: jest.fn(),
      getUser: jest.fn(),
      getUserByGithubId: jest.fn(),
      updateUser: jest.fn(),
      getPullRequest: jest.fn(),
      createAnalysisJob: jest.fn(),
      getNextAnalysisJob: jest.fn()
    };
    
    // Mock the VCS client getter instead of the protected method
    jest.spyOn(vcsModule, 'getVCSClient').mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // Cast to unknown first, then to DatabaseService to satisfy the type checker
    const service = new RepositoryService(mockDb as unknown as DatabaseService, { github: 'token' });
    
    // Test basic error propagation
    try {
      await service.getRepository('github', 'owner', 'repo');
      fail('Should have thrown');
    } catch (error) {
      // Only verify it's an Error
      expect(error instanceof Error).toBe(true);
      if (error instanceof Error) {
        expect(error.message).toContain('Test error');
      }
    }
  });
});
