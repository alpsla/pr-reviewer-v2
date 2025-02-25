// Import essential types
const PlatformErrorCode = {
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

// Custom mock for VCSError to fix instanceof issues
class MockVCSError extends Error {
  constructor(message, platform, code, details) {
    super(message);
    this.name = 'VCSError';
    this.platform = platform;
    this.code = code;
    this.details = details;
    
    // Preserve proper instanceof behavior
    Object.setPrototypeOf(this, MockVCSError.prototype);
  }
  
  isNotFoundError() {
    return ['REPOSITORY_NOT_FOUND', 'PULL_REQUEST_NOT_FOUND', 'RESOURCE_NOT_FOUND', 'USER_NOT_FOUND'].includes(this.code);
  }
  
  isPermissionError() {
    return ['PERMISSION_DENIED', 'PRIVATE_REPO_ACCESS_DENIED'].includes(this.code);
  }
  
  isRateLimitError() {
    return ['RATE_LIMIT_EXCEEDED', 'ABUSE_DETECTION_TRIGGERED'].includes(this.code);
  }
  
  isNetworkError() {
    return ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR', 'SERVICE_UNAVAILABLE', 'GATEWAY_TIMEOUT'].includes(this.code);
  }
  
  getRetryAfter() {
    return this.details?.retryAfter || null;
  }
}

// Override the real VCSError with our mock
jest.mock('../vcs/errors', () => ({
  ...jest.requireActual('../vcs/errors'),
  VCSError: MockVCSError
}));

// Make a similar mock for RepositoryError
class MockRepositoryError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
    this.details = details;
    this.platform = details?.platform;
    this.owner = details?.owner;
    this.repo = details?.repo;
    
    // Add rate limit properties
    if (code === 'RATE_LIMIT_EXCEEDED' && details?.details?.resetTime) {
      const resetTime = new Date(details.details.resetTime);
      this.retryAfter = Math.max(0, resetTime.getTime() - Date.now());
      this.reset = resetTime;
    }
    
    // Make instanceof work properly
    Object.setPrototypeOf(this, MockRepositoryError.prototype);
  }
  
  isNotFoundError() {
    return ['REPOSITORY_NOT_FOUND', 'PULL_REQUEST_NOT_FOUND'].includes(this.code);
  }
  
  isPermissionError() {
    return ['PERMISSION_DENIED', 'ACCESS_DENIED', 'UNAUTHORIZED'].includes(this.code);
  }
  
  isRateLimitError() {
    return this.code === 'RATE_LIMIT_EXCEEDED';
  }
  
  isNetworkError() {
    return this.code === 'NETWORK_ERROR';
  }
  
  getRetryAfter() {
    if (!this.isRateLimitError() || !this.details?.details?.resetTime) {
      return 60000; // Default to 1 minute if no reset time available
    }
    
    const resetTime = new Date(this.details.details.resetTime);
    return Math.max(0, resetTime.getTime() - Date.now());
  }
}

// Override the real RepositoryError with our mock
jest.mock('../repository/repository-error', () => {
  // Ensure PlatformErrorCode is accessible
  return {
    RepositoryError: MockRepositoryError,
    PlatformErrorCode,
    createRepositoryNotFoundError: (platform, owner, repo) => {
      return new MockRepositoryError(
        `Repository not found: ${owner}/${repo}`,
        PlatformErrorCode.REPOSITORY_NOT_FOUND,
        { platform, owner, repo }
      );
    },
    createPullRequestNotFoundError: (platform, owner, repo, number) => {
      return new MockRepositoryError(
        `Pull request not found: ${owner}/${repo}#${number}`,
        PlatformErrorCode.PULL_REQUEST_NOT_FOUND,
        { platform, owner, repo, pullNumber: number }
      );
    },
    createPermissionDeniedError: (platform, owner, repo) => {
      return new MockRepositoryError(
        `Permission denied for ${owner}/${repo}`,
        PlatformErrorCode.PERMISSION_DENIED,
        { platform, owner, repo }
      );
    },
    createRateLimitError: (platform, resetTime) => {
      return new MockRepositoryError(
        `Rate limit exceeded for ${platform}. Retry after ${resetTime.toISOString()}`,
        PlatformErrorCode.RATE_LIMIT_EXCEEDED,
        {
          platform,
          details: {
            resetTime: resetTime.toISOString(),
            platform
          }
        }
      );
    },
    createValidationError: (message, details) => {
      return new MockRepositoryError(
        message,
        PlatformErrorCode.VALIDATION_ERROR,
        { details }
      );
    },
    createUnexpectedError: (message, originalError) => {
      return new MockRepositoryError(
        message,
        PlatformErrorCode.UNEXPECTED_ERROR,
        { originalError }
      );
    }
  };
});

// Mock client factory
jest.mock('../vcs/client-factory', () => {
  return {
    getVCSClient: jest.fn((platform, token, baseUrl) => {
      return {
        getPlatform: () => platform,
        getRateLimit: jest.fn().mockResolvedValue({
          limit: 5000,
          remaining: 4500,
          reset: new Date(Date.now() + 3600000),
          used: 500
        }),
        getRepository: jest.fn().mockResolvedValue({
          id: 'repo-123',
          name: 'test-repo',
          owner: 'test-owner',
          platform: platform,
          fullName: 'test-owner/test-repo',
          isPrivate: false,
          defaultBranch: 'main'
        })
      };
    })
  };
});
