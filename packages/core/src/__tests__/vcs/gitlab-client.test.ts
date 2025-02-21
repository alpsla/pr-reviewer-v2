import { GitLabClient } from '../../vcs/gitlab/gitlab-client';

// Simple mock for Gitlab
jest.mock('@gitbeaker/rest', () => {
  return {
    Gitlab: jest.fn(() => ({
      Users: {
        current: jest.fn()
      }
    }))
  };
});

describe('GitLabClient', () => {
  let client: GitLabClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new GitLabClient('test-token');
  });

  describe('getPlatform', () => {
    it('should return gitlab as the platform', () => {
      expect(client.getPlatform()).toBe('gitlab');
    });
  });
});
