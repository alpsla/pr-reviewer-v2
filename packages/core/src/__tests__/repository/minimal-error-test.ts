/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryService } from '../../repository/repository-service';
import { VCSError } from '../../vcs/errors';
import { VCSRepository } from '../../vcs/types';
import { DatabaseService } from '../../supabase/database';

describe('Repository Service Minimal Error Tests', () => {
  let service: RepositoryService;
  let mockClient: { getRepository: jest.Mock, getPlatform: jest.Mock };
  let mockDb: Partial<DatabaseService>;

  beforeEach(() => {
    // Create mock VCS client
    mockClient = {
      getRepository: jest.fn(),
      getPlatform: jest.fn().mockReturnValue('github')
    };

    // Create mock database service
    mockDb = {
      getRepositoryByOwnerAndName: jest.fn().mockResolvedValue(null),
      createRepository: jest.fn().mockResolvedValue({ id: 'test-id' })
    };

    // Set up the repository service with mocks
    service = new RepositoryService(
      mockDb as DatabaseService,
      { github: 'mock-token' }
    );

    // Mock the client factory
    jest.spyOn(service as any, 'getClient').mockReturnValue(mockClient);
  });

  it('should handle not found errors correctly', async () => {
    // Configure mock to throw a not found error
    mockClient.getRepository.mockImplementation(async (owner: string, name: string) => {
      const mockRepo: VCSRepository = {
        id: 'github-repo-123',
        platform: 'github',
        externalId: '12345',
        name: 'mock-repo',
        owner: 'mock-owner',
        fullName: 'mock-owner/mock-repo',
        description: 'Mock repository',
        isPrivate: false,
        defaultBranch: 'main',
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: { admin: true, push: true, pull: true },
        url: 'https://github.com/mock-owner/mock-repo',
        language: null,
        topics: [],
        stargazersCount: 0,
        forksCount: 0
      };
      
      // Simulate a not found error for specific repository
      if (owner === 'nonexistent' || name === 'nonexistent') {
        throw new VCSError(
          `Repository not found: ${owner}/${name}`,
          'github',
          'REPOSITORY_NOT_FOUND',
          { owner, repo: name }
        );
      }
      
      return mockRepo;
    });

    // Should resolve with a repository
    await expect(service.getRepository('github', 'mock-owner', 'mock-repo')).resolves.toBeDefined();
    
    // Should reject with a not found error
    await expect(service.getRepository('github', 'nonexistent', 'repo')).rejects.toThrow('not found');
  });
});
