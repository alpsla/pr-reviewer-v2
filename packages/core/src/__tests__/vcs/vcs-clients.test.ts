import { createMockGitHubClient, createMockGitLabClient } from '../../vcs/__mocks__/mock-vcs-clients';
import { VCSError } from '../../vcs/errors';
import { getVCSClient } from '../../vcs';
import * as githubModule from '../../vcs/github/github-client';
import * as gitlabModule from '../../vcs/gitlab/gitlab-client';

// Mocking the client factories
jest.mock('../../vcs/github/github-client', () => ({
  createGitHubClient: jest.fn()
}));

jest.mock('../../vcs/gitlab/gitlab-client', () => ({
  createGitLabClient: jest.fn()
}));

describe('VCS Client Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (githubModule.createGitHubClient as jest.Mock).mockImplementation(() => createMockGitHubClient());
    (gitlabModule.createGitLabClient as jest.Mock).mockImplementation(() => createMockGitLabClient());
  });

  describe('getVCSClient', () => {
    it('should create a GitHub client with the correct token', () => {
      // Act
      const client = getVCSClient('github', 'github-token');
      
      // Assert
      expect(client.getPlatform()).toBe('github');
    });
    
    it('should create a GitLab client with the correct token', () => {
      // Act
      const client = getVCSClient('gitlab', 'gitlab-token');
      
      // Assert
      expect(client.getPlatform()).toBe('gitlab');
    });
    
    it('should throw an error for unsupported platforms', () => {
      // Act & Assert
      expect(() => {
        // @ts-expect-error Testing with invalid platform
        getVCSClient('bitbucket', 'token');
      }).toThrow('Unsupported VCS platform: bitbucket');
    });
    
    it('should pass custom base URL to GitHub client', () => {
      // Arrange
      const customUrl = 'https://github.enterprise.com/api/v3';
      
      // Act
      getVCSClient('github', 'token', customUrl);
      
      // Assert
      expect(githubModule.createGitHubClient)
        .toHaveBeenCalledWith('token', customUrl);
    });
    
    it('should pass custom base URL to GitLab client', () => {
      // Arrange
      const customUrl = 'https://gitlab.enterprise.com';
      
      // Act
      getVCSClient('gitlab', 'token', customUrl);
      
      // Assert
      expect(gitlabModule.createGitLabClient)
        .toHaveBeenCalledWith('token', customUrl);
    });
  });
});

describe('VCS Error Handling', () => {
  it('should create properly formatted VCS errors', () => {
    // Arrange & Act
    const error = new VCSError(
      'Something went wrong',
      'github',
      'API_ERROR',
      { resource: 'repo' }
    );
    
    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Something went wrong');
    expect(error.platform).toBe('github');
    expect(error.code).toBe('API_ERROR');
    expect(error.details).toEqual({ resource: 'repo' });
  });
  
  it('should include original error when passed', () => {
    // Arrange
    const originalError = new Error('Original message');
    
    // Act
    const error = new VCSError(
      'Wrapped error',
      'gitlab',
      'NETWORK_ERROR',
      { url: 'https://example.com' },
      originalError
    );
    
    // Assert
    expect(error.message).toBe('Wrapped error');
    expect(error.originalError).toBe(originalError);
  });
});
