/**
 * Version Control System module
 * Exports the VCS abstraction layer and implementations
 */

// Re-export all types
export * from './types';

// Export error handling with explicit naming to avoid conflicts
import { VCSError } from './errors';
import type { VCSErrorCode as ErrorCode } from './errors';
export { VCSError };
export type { ErrorCode };

// Export client factory
export { default as getVCSClient } from './client-factory';

// Export specific clients (for testing)
export { GitHubClient } from './github/github-client';

// URL parsers for repositories and pull requests
export const parseRepositoryUrl = (url: string): { platform: string; owner: string; repo: string } | null => {
  // GitHub format: https://github.com/owner/repo or github/owner/repo
  const githubPattern = /(?:https?:\/\/github\.com\/|github\/)([^/]+)\/([^/]+)/i;
  const githubMatch = url.match(githubPattern);
  if (githubMatch && githubMatch[1] && githubMatch[2]) {
    return {
      platform: 'github',
      owner: githubMatch[1],
      repo: githubMatch[2]
    };
  }

  // GitLab format: https://gitlab.com/owner/repo or gitlab/owner/repo
  const gitlabPattern = /(?:https?:\/\/gitlab\.com\/|gitlab\/)([^/]+)\/([^/]+)/i;
  const gitlabMatch = url.match(gitlabPattern);
  if (gitlabMatch && gitlabMatch[1] && gitlabMatch[2]) {
    return {
      platform: 'gitlab',
      owner: gitlabMatch[1],
      repo: gitlabMatch[2]
    };
  }

  return null;
};

export const parsePullRequestUrl = (url: string): { platform: string; owner: string; repo: string; number: number } | null => {
  // GitHub format: https://github.com/owner/repo/pull/123 or github/owner/repo/pull/123
  const githubPattern = /(?:https?:\/\/github\.com\/|github\/)([^/]+)\/([^/]+)\/pull\/(\d+)/i;
  const githubMatch = url.match(githubPattern);
  if (githubMatch && githubMatch[1] && githubMatch[2] && githubMatch[3]) {
    return {
      platform: 'github',
      owner: githubMatch[1],
      repo: githubMatch[2],
      number: parseInt(githubMatch[3], 10)
    };
  }

  // GitLab format: https://gitlab.com/owner/repo/-/merge_requests/123 or gitlab/owner/repo/merge_requests/123
  const gitlabPattern = /(?:https?:\/\/gitlab\.com\/|gitlab\/)([^/]+)\/([^/]+)(?:\/-)?\/merge_requests\/(\d+)/i;
  const gitlabMatch = url.match(gitlabPattern);
  if (gitlabMatch && gitlabMatch[1] && gitlabMatch[2] && gitlabMatch[3]) {
    return {
      platform: 'gitlab',
      owner: gitlabMatch[1],
      repo: gitlabMatch[2],
      number: parseInt(gitlabMatch[3], 10)
    };
  }

  return null;
};
