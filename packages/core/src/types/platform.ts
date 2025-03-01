/**
 * Shared platform types for VCS implementations
 */

// Platform types
export type VCSPlatform = 'github' | 'gitlab';

// Error codes as enum for better type safety
export enum PlatformErrorCode {
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  REPOSITORY_NOT_FOUND = 'REPOSITORY_NOT_FOUND',
  PULL_REQUEST_NOT_FOUND = 'PULL_REQUEST_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  AUTH_ERROR = 'AUTH_ERROR',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TIMEOUT = 'TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',
  ABUSE_DETECTION_TRIGGERED = 'ABUSE_DETECTION_TRIGGERED'
}

// Analysis status
export enum AnalysisStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Common visibility types
export type RepositoryVisibility = 'public' | 'private' | 'internal';

// Common state types
export type PullRequestState = 'open' | 'closed' | 'merged';
export type ReviewState = 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';

// Common file status types
export type FileChangeStatus = 'added' | 'modified' | 'removed' | 'renamed' | 'copied';
