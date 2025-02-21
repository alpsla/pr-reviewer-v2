import type { DatabaseService } from '../supabase/database';

export const createMockDatabaseService = () => {
  const mockDb = {
    // User methods
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getUser: jest.fn(),
    getUserByGithubId: jest.fn(),
    getUserByGitlabId: jest.fn(),
    getUserByEmail: jest.fn(),
    
    // Repository methods
    createRepository: jest.fn(),
    updateRepository: jest.fn(),
    getRepository: jest.fn(),
    getRepositoryByOwnerAndName: jest.fn(),
    listUserRepositories: jest.fn(),
    
    // Pull request methods
    createPullRequest: jest.fn(),
    updatePullRequest: jest.fn(),
    getPullRequest: jest.fn(),
    getPullRequestByNumber: jest.fn(),
    listPullRequests: jest.fn(),
    
    // Analysis methods
    createAnalysis: jest.fn(),
    updateAnalysis: jest.fn(),
    getAnalysis: jest.fn(),
    getAnalysisByPullRequest: jest.fn(),
    getNextAnalysisJob: jest.fn()
  } as unknown as jest.Mocked<DatabaseService>;

  return mockDb;
};