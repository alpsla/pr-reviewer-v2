import { RepositoryService } from '../../repository/repository-service';
import { createMockDatabaseService } from '../../__mocks__/database';
import { createMockGitHubClient } from '../../vcs/__mocks__/mock-vcs-clients';
import { DatabaseService } from '../../supabase/database';

// Import the module once for mocking
import * as vcsModule from '../../vcs';

// Mock the VCS module that contains getVCSClient
jest.mock('../../vcs', () => {
  // Create a minimal implementation
  return {
    getVCSClient: jest.fn((platform) => {
      if (platform === 'github') return createMockGitHubClient();
      if (platform === 'gitlab') return createMockGitHubClient(); // Use GitHub client for both for simplicity
      throw new Error(`Unknown platform: ${platform}`);
    })
  };
});

// Create a simpler test that doesn't involve VCSError
describe('RepositoryService', () => {
  let service: RepositoryService;
  let mockDb: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = createMockDatabaseService();
    
    service = new RepositoryService(
      mockDb,
      { github: 'github-token', gitlab: 'gitlab-token' }
    );
  });

  // Simple test for initialization
  describe('initialization', () => {
    it('should initialize with correct tokens', () => {
      expect(service).toBeDefined();
      expect(vcsModule.getVCSClient).toHaveBeenCalledWith(
        'github', 
        'github-token', 
        undefined
      );
      expect(vcsModule.getVCSClient).toHaveBeenCalledWith(
        'gitlab', 
        'gitlab-token', 
        undefined
      );
    });
  });
});
