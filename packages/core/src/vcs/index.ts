/**
 * VCS module exports
 */
// Re-export types
export * from './types';
// Explicitly re-export errors to avoid conflicts
export { VCSError } from './errors';

// Re-export clients
export { GitHubClient } from './github/github-client';
export { GitLabClient } from './gitlab/gitlab-client';

// Re-export factory
export { getVCSClient } from './client-factory';
export { default as getVCSClientDefault } from './client-factory';
