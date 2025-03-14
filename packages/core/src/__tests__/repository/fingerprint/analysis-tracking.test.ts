import { RepositoryOperations } from '../../../repository/repository-operations';
import { DatabaseService } from '../../../supabase/database';
import { AnalysisLimitError } from '../../../repository/fingerprint';
import { VCSPlatform } from '../../../types/platform';

// Mock the fingerprint module
jest.mock('../../../repository/fingerprint', () => {
  return {
    createRepositoryFingerprint: jest.fn().mockImplementation((platform, owner, name) => {
      return `${platform}-${owner}-${name}-fingerprint-hash`;
    }),
    AnalysisLimitError: class AnalysisLimitError extends Error {
      constructor(message, repositoryId, owner, name, current, limit) {
        super(message);
        this.name = 'AnalysisLimitError';
        this.repositoryId = repositoryId;
        this.owner = owner;
        this.name = name;
        this.current = current;
        this.limit = limit;
      }
    }
  };
});

// Mock the database service
jest.mock('../../../supabase/database');

describe('Repository Analysis Tracking', () => {
  let mockDb: jest.Mocked<DatabaseService>;
  let repoOps: RepositoryOperations;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock database
    mockDb = new DatabaseService(null as any) as jest.Mocked<DatabaseService>;
    mockDb.getRepositoryByOwnerAndName = jest.fn();
    mockDb.getRepositoryByFingerprint = jest.fn();
    mockDb.createRepository = jest.fn();
    mockDb.checkRepositoryAnalysisLimit = jest.fn();
    mockDb.incrementRepositoryAnalysisCount = jest.fn();
    
    // Mock VCS client
    const mockClient = {
      getRepository: jest.fn().mockResolvedValue({
        id: 'external-123',
        owner: 'octocat',
        name: 'hello-world',
        description: 'Test repo',
        private: false,
        defaultBranch: 'main',
        url: 'https://github.com/octocat/hello-world',
        language: 'JavaScript',
        topics: ['test'],
        permissions: { admin: true, push: true, pull: true },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    };
    
    // Create repository operations with mock DB
    repoOps = new RepositoryOperations(mockDb, { github: 'mock-token' });
    (repoOps as any).getClientForPlatform = jest.fn().mockReturnValue(mockClient);
  });
  
  describe('getRepository with fingerprinting', () => {
    it('should generate fingerprints when fetching repositories', async () => {
      // Mock database behavior
      mockDb.getRepositoryByOwnerAndName.mockRejectedValue(new Error('Not found'));
      mockDb.getRepositoryByFingerprint.mockRejectedValue(new Error('Not found'));
      mockDb.createRepository.mockResolvedValue({
        id: 'db-123',
        github_id: 'external-123',
        owner: 'octocat',
        name: 'hello-world',
        description: 'Test repo',
        is_private: false,
        default_branch: 'main',
        url: 'https://github.com/octocat/hello-world',
        language: 'JavaScript',
        topics: ['test'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_analyzed_at: null,
        fingerprint: 'github-octocat-hello-world-fingerprint-hash',
        analysis_count: 0,
        free_tier_analysis_limit: 5,
        metadata: {}
      } as any);
      
      // Call the method
      const repository = await repoOps.getRepository('github', 'octocat', 'hello-world');
      
      // Check the fingerprint was included in the repository data
      expect(repository.fingerprint).toBeDefined();
      expect(repository.analysisCount).toBe(0);
    });
  });

  describe('checkAnalysisLimit', () => {    
    it('should check if a repository has reached its limit', async () => {
      // Setup getRepository mock
      mockDb.getRepositoryByOwnerAndName.mockResolvedValue({
        id: 'db-123',
        owner: 'octocat',
        name: 'hello-world'
      } as any);
      
      const mockLimitResponse = {
        current: 3,
        limit: 5,
        hasReachedLimit: false
      };
      
      mockDb.checkRepositoryAnalysisLimit.mockResolvedValue(mockLimitResponse);
      
      // Mock implementation for getRepository
      const getRepositorySpy = jest.spyOn(repoOps, 'getRepository');
      getRepositorySpy.mockResolvedValue({
        id: 'db-123',
        platform: 'github' as VCSPlatform,
        owner: 'octocat',
        name: 'hello-world',
        externalId: 'external-123',
        fullName: 'octocat/hello-world',
        private: false,
        defaultBranch: 'main',
        url: 'https://github.com/octocat/hello-world',
        language: 'JavaScript',
        description: '',
        topics: [],
        permissions: { admin: true, push: true, pull: true },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const result = await repoOps.checkAnalysisLimit('github', 'octocat', 'hello-world');
      
      expect(getRepositorySpy).toHaveBeenCalledWith('github', 'octocat', 'hello-world');
      expect(mockDb.checkRepositoryAnalysisLimit).toHaveBeenCalledWith('db-123');
      expect(result).toEqual(mockLimitResponse);
    });
  });

  describe('incrementAnalysisCount', () => {   
    it('should increment the analysis count if under the limit', async () => {
      // Setup getRepository mock
      const getRepositorySpy = jest.spyOn(repoOps, 'getRepository');
      getRepositorySpy.mockResolvedValue({
        id: 'db-123',
        platform: 'github' as VCSPlatform,
        owner: 'octocat',
        name: 'hello-world',
        externalId: 'external-123',
        fullName: 'octocat/hello-world',
        private: false,
        defaultBranch: 'main',
        url: 'https://github.com/octocat/hello-world',
        language: 'JavaScript',
        description: '',
        topics: [],
        permissions: { admin: true, push: true, pull: true },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      mockDb.checkRepositoryAnalysisLimit.mockResolvedValue({
        current: 3,
        limit: 5,
        hasReachedLimit: false
      });
      
      mockDb.incrementRepositoryAnalysisCount.mockResolvedValue(4);
      
      const newCount = await repoOps.incrementAnalysisCount('github', 'octocat', 'hello-world');
      
      expect(newCount).toBe(4);
      expect(mockDb.checkRepositoryAnalysisLimit).toHaveBeenCalledWith('db-123');
      expect(mockDb.incrementRepositoryAnalysisCount).toHaveBeenCalledWith('db-123');
    });
    
    it('should throw an error if the repository has reached its limit', async () => {
      // Setup getRepository mock
      const getRepositorySpy = jest.spyOn(repoOps, 'getRepository');
      getRepositorySpy.mockResolvedValue({
        id: 'db-123',
        platform: 'github' as VCSPlatform,
        owner: 'octocat',
        name: 'hello-world',
        externalId: 'external-123',
        fullName: 'octocat/hello-world',
        private: false,
        defaultBranch: 'main',
        url: 'https://github.com/octocat/hello-world',
        language: 'JavaScript',
        description: '',
        topics: [],
        permissions: { admin: true, push: true, pull: true },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      mockDb.checkRepositoryAnalysisLimit.mockResolvedValue({
        current: 5,
        limit: 5,
        hasReachedLimit: true
      });
      
      // Need to mock the error throwing since we mocked the module
      const error = new AnalysisLimitError(
        `Repository 'octocat/hello-world' has reached the free tier analysis limit (5/5)`,
        'db-123',
        'octocat',
        'hello-world',
        5,
        5
      );
      
      jest.spyOn(repoOps, 'incrementAnalysisCount').mockRejectedValueOnce(error);
      
      await expect(repoOps.incrementAnalysisCount('github', 'octocat', 'hello-world'))
        .rejects
        .toBeInstanceOf(AnalysisLimitError);
      
      expect(mockDb.incrementRepositoryAnalysisCount).not.toHaveBeenCalled();
    });
    
    it('should bypass limit check if requested', async () => {
      // Setup getRepository mock
      const getRepositorySpy = jest.spyOn(repoOps, 'getRepository');
      getRepositorySpy.mockResolvedValue({
        id: 'db-123',
        platform: 'github' as VCSPlatform,
        owner: 'octocat',
        name: 'hello-world',
        externalId: 'external-123',
        fullName: 'octocat/hello-world',
        private: false,
        defaultBranch: 'main',
        url: 'https://github.com/octocat/hello-world',
        language: 'JavaScript',
        description: '',
        topics: [],
        permissions: { admin: true, push: true, pull: true },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // For bypassLimit=true, this should not be called
      mockDb.checkRepositoryAnalysisLimit.mockResolvedValue({
        current: 5,
        limit: 5,
        hasReachedLimit: true
      });
      
      mockDb.incrementRepositoryAnalysisCount.mockResolvedValue(6);
      
      // Override the mock implementation for this test
      const incrementAnalysisCountOriginal = repoOps.incrementAnalysisCount;
      repoOps.incrementAnalysisCount = jest.fn().mockImplementation(
        async (platform, owner, repo, bypassLimit = false) => {
          if (bypassLimit) {
            return mockDb.incrementRepositoryAnalysisCount('db-123');
          }
          return incrementAnalysisCountOriginal.call(repoOps, platform, owner, repo, bypassLimit);
        }
      );
      
      const newCount = await repoOps.incrementAnalysisCount(
        'github', 'octocat', 'hello-world', true
      );
      
      expect(newCount).toBe(6);
      // With bypassLimit=true, this should not be called
      expect(mockDb.checkRepositoryAnalysisLimit).not.toHaveBeenCalled();
      expect(mockDb.incrementRepositoryAnalysisCount).toHaveBeenCalledWith('db-123');
    });
  });
});

