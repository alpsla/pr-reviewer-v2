/**
 * Minimal test for repository module exports
 */
import * as repositoryModule from '../../repository';
import { RepositoryService } from '../../repository/repository-service';
import { 
  RepositoryError,
  createRepositoryNotFoundError,
  createPullRequestNotFoundError,
  createPermissionDeniedError,
  createRateLimitError
} from '../../repository/repository-error';

describe('Repository Module Exports', () => {
  it('should export RepositoryService', () => {
    expect(repositoryModule.RepositoryService).toBeDefined();
    expect(repositoryModule.RepositoryService).toBe(RepositoryService);
  });

  it('should export error classes and factory functions', () => {
    expect(repositoryModule.RepositoryError).toBeDefined();
    expect(repositoryModule.RepositoryError).toBe(RepositoryError);
    
    expect(repositoryModule.createRepositoryNotFoundError).toBeDefined();
    expect(repositoryModule.createRepositoryNotFoundError).toBe(createRepositoryNotFoundError);
    
    expect(repositoryModule.createPullRequestNotFoundError).toBeDefined();
    expect(repositoryModule.createPullRequestNotFoundError).toBe(createPullRequestNotFoundError);
    
    expect(repositoryModule.createPermissionDeniedError).toBeDefined();
    expect(repositoryModule.createPermissionDeniedError).toBe(createPermissionDeniedError);
    
    expect(repositoryModule.createRateLimitError).toBeDefined();
    expect(repositoryModule.createRateLimitError).toBe(createRateLimitError);
  });
  
  it('should export repository and PR types', () => {
    // Just verify the types are exported (can't check actual type definitions)
    expect(typeof repositoryModule).toBe('object');
    expect(Object.keys(repositoryModule).length).toBeGreaterThan(5);
  });
});
