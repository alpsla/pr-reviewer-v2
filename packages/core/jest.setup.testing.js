// Create custom test setup that doesn't rely on the main setup file
// We're avoiding importing jest-setup.js directly to prevent duplication issues

// Setup mocks for RepositoryService
jest.mock('./src/repository/repository-service', () => {
  return {
    RepositoryService: jest.fn().mockImplementation(() => ({
      getRepository: jest.fn().mockResolvedValue({
        id: 'repo-123',
        owner: 'test-owner',
        name: 'test-repo',
        platform: 'github',
        fullName: 'test-owner/test-repo',
        url: 'https://github.com/test-owner/test-repo'
      }),
      getPullRequest: jest.fn().mockResolvedValue({
        id: 'pr-123',
        number: 123,
        title: 'Test PR',
        platform: 'github',
        repository: {
          id: 'repo-123',
          owner: 'test-owner',
          name: 'test-repo'
        }
      }),
      getRateLimit: jest.fn().mockResolvedValue({
        limit: 5000,
        remaining: 4500,
        reset: new Date(Date.now() + 3600000),
        used: 500
      })
    }))
  };
});

// Mock VCS client factory for simplified testing
jest.mock('./src/vcs/client-factory', () => ({
  getVCSClient: jest.fn().mockImplementation((platform) => ({
    getPlatform: () => platform,
    getCurrentUser: jest.fn().mockResolvedValue({
      id: 'user-1',
      login: 'testuser',
      name: 'Test User',
      avatarUrl: 'https://example.com/avatar.png'
    }),
    getRepository: jest.fn().mockResolvedValue({
      id: 'repo-123',
      name: 'test-repo',
      owner: 'test-owner',
      platform,
      fullName: 'test-owner/test-repo',
      isPrivate: false,
      defaultBranch: 'main'
    }),
    getRateLimit: jest.fn().mockResolvedValue({
      limit: 5000,
      remaining: 4500,
      reset: new Date(Date.now() + 3600000),
      used: 500
    })
  }))
}));

// Add any other global mocks needed for testing
global.TextDecoder = class {
  decode(data) {
    return data.toString();
  }
};
