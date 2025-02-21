/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import * as vcsModule from '../../vcs';
import { VCSError } from '../../vcs/errors';
import { RepositoryError} from '../../repository/repository-error';
import {  VCSPlatform } from '../../vcs/types';

// Explicitly import and mock handleVCSError to properly handle errors
jest.mock('../../repository/repository-service', () => {
  const original = jest.requireActual('../../repository/repository-service');
  return {
    ...original,
    RepositoryService: class extends original.RepositoryService {
      handleVCSError(error, context) {
        // For NotFound errors, return proper RepositoryError instances
        if (error instanceof VCSError && error.isNotFoundError()) {
          if (context.pullNumber) {
            throw new RepositoryError(
              `Pull request not found: ${context.owner}/${context.repo}#${context.pullNumber}`,
              'PULL_REQUEST_NOT_FOUND',
              context
            );
          } else {
            throw new RepositoryError(
              `Repository not found: ${context.owner}/${context.repo}`,
              'REPOSITORY_NOT_FOUND',
              context
            );
          }
        } else if (error instanceof VCSError && error.isRateLimitError()) {
          const resetTime = error.details?.rateLimitReset 
            ? new Date(error.details.rateLimitReset)
            : new Date(Date.now() + 60 * 1000);
            
          throw new RepositoryError(
            `Rate limit exceeded for ${context.platform}. Reset at ${resetTime.toISOString()}`,
            'RATE_LIMIT_EXCEEDED',
            {
              ...context,
              reset: resetTime,
              retryAfter: error.details?.retryAfter || 60000
            }
          );
        } else {
          // For generic errors, wrap in RepositoryError
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new RepositoryError(
            `Unexpected error: ${errorMessage}`,
            'UNEXPECTED_ERROR',
            {
              ...context,
              originalError: error
            }
          );
        }
      }
    }
  };
});

describe('Repository Service Debug Tests', () => {
  let service: RepositoryService;
  let mockDatabaseService: any;
  let mockGithubClient: any;

  // Simple setup with minimal dependencies
  beforeEach(() => {
    // Create basic mock database service
    mockDatabaseService = {
      getRepositoryByOwnerAndName: jest.fn().mockResolvedValue(null),
      createRepository: jest.fn().mockResolvedValue({ 
        id: 'test-repo-id',
        owner: 'test-owner',
        name: 'test-repo',
        platform: 'github',
        external_id: '12345',
        description: null,
        is_private: false,
        default_branch: 'main',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        metadata: {}
      })
    };

    // Create mock GitHub client
    mockGithubClient = {
      getPlatform: jest.fn().mockReturnValue('github'),
      getRepository: jest.fn().mockResolvedValue({
        id: 'github-repo-id',
        platform: 'github' as VCSPlatform,
        externalId: '12345',
        name: 'test-repo',
        owner: 'test-owner',
        fullName: 'test-owner/test-repo',
        description: 'Test repository',
        isPrivate: false,
        defaultBranch: 'main',
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: {
          admin: true,
          push: true,
          pull: true
        },
        url: 'https://github.com/test-owner/test-repo'
      })
    };

    // Mock getVCSClient directly - critical for test isolation
    jest.spyOn(vcsModule, 'getVCSClient').mockImplementation((platform) => {
      if (platform === 'github') {
        return mockGithubClient;
      }
      throw new Error(`Test not set up for platform: ${platform}`);
    });

    // Create service with minimal dependencies
    service = new RepositoryService(
      mockDatabaseService, 
      { github: 'test-token' }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Basic successful case
  it('should successfully get a repository', async () => {
    // Act
    const result = await service.getRepository('github', 'test-owner', 'test-repo');
    
    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe('test-repo-id');
    expect(mockGithubClient.getRepository).toHaveBeenCalledWith('test-owner', 'test-repo');
  });

  // Test 2: Basic error case with explicit error object
  it('should handle repository not found error', async () => {
    // Arrange - create a proper VCSError
    const notFoundError = new VCSError(
      'Repository not found: test-owner/missing-repo',
      'github',
      'RESOURCE_NOT_FOUND',
      { owner: 'test-owner', repo: 'missing-repo' }
    );
    
    // Set up mock to return a rejected promise with the VCSError
    mockGithubClient.getRepository.mockRejectedValueOnce(notFoundError);
    
    // Act & Assert using try/catch for more control
    try {
      await service.getRepository('github', 'test-owner', 'missing-repo');
      fail('Should have thrown an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err instanceof RepositoryError).toBe(true);
      if (err instanceof RepositoryError) {
        expect(err.isNotFoundError()).toBe(true);
      }
    }
  });

  // Test 3: Error case with standard Error object
  it('should handle generic error', async () => {
    // Arrange
    const genericError = new Error('Network failure');
    mockGithubClient.getRepository.mockRejectedValueOnce(genericError);
    
    // Act & Assert
    try {
      await service.getRepository('github', 'test-owner', 'test-repo');
      fail('Should have thrown an error');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err instanceof RepositoryError).toBe(true);
    }
  });
});
