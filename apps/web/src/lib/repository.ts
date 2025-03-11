// Re-export repository components from the core package
import { 
  RepositoryService, 
  AnalysisLimitError,
  RepositoryOperations,
  PullRequestOperations,
  BaseRepositoryService,
  createRepositoryFingerprint,
  createRepositoryNotFoundError,
  createPullRequestNotFoundError,
  createPermissionDeniedError,
  createRateLimitError,
  createValidationError,
  createUnexpectedError,
  convertVCSRepository,
  convertVCSPullRequest,
  convertVCSPullRequestFile,
  RepositoryError
} from '@pr-reviewer/core';

// Import types from the core package
import type {
  Repository,
  PullRequest,
  PullRequestFile,
  PullRequestDetails,
  PullRequestListOptions,
  PaginatedResponse,
  IRepositoryService
} from '@pr-reviewer/core/src/repository/types';

export {
  RepositoryService,
  AnalysisLimitError,
  RepositoryOperations,
  PullRequestOperations,
  BaseRepositoryService,
  createRepositoryFingerprint,
  createRepositoryNotFoundError,
  createPullRequestNotFoundError,
  createPermissionDeniedError,
  createRateLimitError,
  createValidationError,
  createUnexpectedError,
  convertVCSRepository,
  convertVCSPullRequest,
  convertVCSPullRequestFile,
  RepositoryError
};

// Re-export types
export type {
  Repository,
  PullRequest,
  PullRequestFile,
  PullRequestDetails,
  PullRequestListOptions,
  PaginatedResponse,
  IRepositoryService
};
