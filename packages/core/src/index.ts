// Export repository visibility services
// Export with explicit re-exports to avoid naming conflicts
export { analyzePullRequest } from './repository/visibility';
export type { SmartPrAnalysisResult } from './repository/visibility';
export { RepositoryVisibility, checkRepositoryVisibility } from './repository/visibility/visibility-service';
export type { VisibilityCheckResult } from './repository/visibility/visibility-service';

// Export platform types
export * from './types/platform';

// Export repository module
export * from './repository';

// Export database module
export * from './supabase/database';

// Export VCS types with explicit naming to avoid conflicts
export { VCSError, GitHubClient } from './vcs';
export { getVcsClient as getVCSClient } from './vcs/client-factory';
export type { VCSErrorCode, VCSPlatform } from './vcs';
