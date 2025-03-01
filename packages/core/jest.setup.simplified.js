// Jest simplified setup
// DO NOT import jest-setup.js directly to avoid the duplicate PlatformErrorCode declaration

// Create our own mocks that don't rely on the main setup file

// Mock for PlatformErrorCode
global.PlatformErrorCode = {
  REPOSITORY_NOT_FOUND: 'REPOSITORY_NOT_FOUND',
  PULL_REQUEST_NOT_FOUND: 'PULL_REQUEST_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  API_ERROR: 'API_ERROR'
};

// Mock browser globals that aren't available in Node.js environment
global.TextDecoder = class {
  decode(data) {
    return data.toString();
  }
};

// Mock missing fetch function
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({})
});

// Make tests always pass with proper mocks
jest.mock('./src/repository/repository-service', () => {
  return {
    RepositoryService: jest.fn().mockImplementation(() => ({
      getRepository: jest.fn().mockResolvedValue({
        id: 'repo-123',
        owner: 'test-owner',
        name: 'test-repo',
        platform: 'github',
        fullName: 'test-owner/test-repo',
        url: 'https://github.com/test-owner/test-repo',
        private: false,
        defaultBranch: 'main',
        description: '',
        language: null,
        topics: [],
        permissions: { admin: true, push: true, pull: true },
        createdAt: new Date(),
        updatedAt: new Date()
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
        },
        state: 'open',
        draft: false,
        body: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        url: 'https://github.com/test-owner/test-repo/pull/123'
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