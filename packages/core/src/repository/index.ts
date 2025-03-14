// Service exports

export { BaseRepositoryService } from './base-repository-service';
export { RepositoryOperations } from './repository-operations';
export { PullRequestOperations } from './pull-request-operations';
export { RepositoryService } from './repository-service';

// Fingerprinting exports
export { createRepositoryFingerprint, AnalysisLimitError } from './fingerprint';

// Type exports
export type {
  Repository,
  PullRequest,
  PullRequestFile,
  PullRequestDetails,
  PullRequestListOptions,
  PaginatedResponse,
  IRepositoryService
} from './types';

// Error exports
export {
  RepositoryError,
  createRepositoryNotFoundError,
  createPullRequestNotFoundError,
  createPermissionDeniedError,
  createRateLimitError,
  createNotImplementedError,
  createValidationError,
  createUnexpectedError
} from './repository-error';

// Converter exports
export {
  convertVCSRepository,
  convertVCSPullRequest,
  convertVCSPullRequestFile
} from './converters';
