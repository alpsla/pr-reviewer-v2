export * from './types/platform';
export * from './repository';
export * from './supabase/database';
// Export VCS types with explicit naming to avoid conflicts
export { VCSError, GitHubClient, getVCSClient } from './vcs';
export type { VCSErrorCode } from './vcs';
