/**
 * Consolidated VCS types
 */

// Platform types
export type VCSPlatform = 'github' | 'gitlab';

// Error codes
export enum VCSErrorCode {
  // Generic errors
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  REPOSITORY_NOT_FOUND = 'REPOSITORY_NOT_FOUND',
  PULL_REQUEST_NOT_FOUND = 'PULL_REQUEST_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  
  // Auth/Permission errors
  AUTH_ERROR = 'AUTH_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  ABUSE_DETECTION_TRIGGERED = 'ABUSE_DETECTION_TRIGGERED',
  
  // Other
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  TIMEOUT = 'TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR'
}

// Repository types
export interface Repository {
  id: string;
  platform: VCSPlatform;
  externalId: string;
  name: string;
  owner: string;
  fullName: string;
  description?: string;
  private: boolean;
  defaultBranch: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  url: string;
  language?: string;
  topics?: string[];
  stats?: {
    stars: number;
    forks: number;
    issues?: number;
    watchers?: number;
  };
}

// Pull request types
export interface PullRequest {
  id: string;
  platform: VCSPlatform;
  repository: {
    id: string;
    owner: string;
    name: string;
  };
  number: number;
  title: string;
  body?: string;
  state: 'open' | 'closed' | 'merged';
  draft: boolean;
  url: string;
  author: {
    id: string;
    login: string;
    name?: string;
    avatarUrl?: string;
  };
  base: {
    ref: string;
    sha: string;
    repo: Repository;
  };
  head: {
    ref: string;
    sha: string;
    repo: Repository;
  };
  stats?: {
    commits?: number;
    additions?: number;
    deletions?: number;
    changedFiles?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  mergedAt?: Date;
  labels?: string[];
}

export interface PullRequestFile {
  path: string;
  status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied';
  stats: {
    additions: number;
    deletions: number;
    changes: number;
  };
  patch?: string;
  previousPath?: string;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasNextPage: boolean;
  nextPage?: number;
}