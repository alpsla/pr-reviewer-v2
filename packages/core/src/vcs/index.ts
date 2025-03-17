/**
 * VCS module exports
 */
// Re-export factory methods
// Don't export * to avoid duplication
export { getVcsClient, createBasicClient, getClientForPlatform } from './client-factory';

// Alias for compatibility with existing code
export { getVcsClient as getVCSClient } from './client-factory';

// Re-export types
export * from './types';

// Explicitly re-export errors to avoid conflicts
export { VCSError } from './errors';

// Re-export clients
export { GitHubClient } from './github/github-client';
export { GitLabClient } from './gitlab/gitlab-client';
