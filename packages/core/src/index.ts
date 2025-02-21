import { AuthService } from './auth/auth-service';
import { EmailAuthService, type EmailAuthConfig, type EmailTemplate } from './auth/email-auth';
import { DatabaseService } from './supabase/database';
import { 
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  RepositoryService 
} from './repository/repository-service';
import type { Database } from './types/database/types';
import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  AuthProvider,
  AuthProviderConfig,
  AuthOptions,
  GitHubAuthScopes,
  GitLabAuthScopes,
  MicrosoftAuthScopes,
  GoogleAuthScopes,
} from './auth/types';
import { AuthError } from './errors';

export {
  AuthService,
  EmailAuthService,
  DatabaseService,
  AuthError,
};

export type {
  Database,
  AuthResponse,
  AuthSession,
  AuthUser,
  AuthProvider,
  AuthProviderConfig,
  AuthOptions,
  GitHubAuthScopes,
  GitLabAuthScopes,
  MicrosoftAuthScopes,
  GoogleAuthScopes,
  EmailAuthConfig,
  EmailTemplate,
};

// Export VCS and Repository modules
// Export specific components from VCS layer
export { 
  getVCSClient,
  parseRepositoryUrl,
  parsePullRequestUrl
} from './vcs';

export type {
  VCSPlatform,
  VCSClient,
  VCSRepository,
  VCSPullRequest,
  VCSFile,
  VCSCommit,
  VCSReview,
  VCSComment,
  VCSRateLimit
} from './vcs/types';

// Export specific components from Repository layer
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export { RepositoryService } from './repository';
export type {
  Repository,
  PullRequest,
  PullRequestFile,
  PullRequestDetails,
  RepositoryListOptions,
  PullRequestListOptions
} from './repository/types';

// Re-export specific components to avoid naming conflicts
export type {
  Repository as RepoType,
  PaginatedResponse as RepoPaginatedResponse,
} from './repository/types';
