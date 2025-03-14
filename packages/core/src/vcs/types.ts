/**
 * Core VCS types shared across implementations
 */

// Platform types
export type VCSPlatform = 'github' | 'gitlab';

// Error codes
export type VCSErrorCode =
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'RESOURCE_NOT_FOUND'
  | 'REPOSITORY_NOT_FOUND'
  | 'PULL_REQUEST_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'UNEXPECTED_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'AUTH_ERROR'
  | 'ACCESS_DENIED'
  | 'PERMISSION_DENIED'
  | 'UNAUTHORIZED'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'ABUSE_DETECTION_TRIGGERED';

// User types
export interface VCSUser {
  id: string;
  platform: VCSPlatform;
  externalId: string;
  login: string;
  name: string;
  email: string;
  avatarUrl: string;
  url: string;
}

// Repository types
export interface VCSRepository {
  id: string;
  platform: VCSPlatform;
  externalId: string;
  name: string;
  owner: string;
  fullName: string;
  description: string;
  isPrivate: boolean;
  defaultBranch: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  url: string;
  language: string | null;
  topics: string[];
  stargazersCount: number;
  forksCount: number;
  openIssuesCount?: number;
}

// Pull request types
export interface VCSPullRequest {
  id: string;
  platform: VCSPlatform;
  externalId: string;
  number: number;
  title: string;
  description: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  mergedAt: Date | null;
  isDraft: boolean;
  user: VCSUser;
  head: {
    ref: string;
    sha: string;
    repo: VCSRepository;
  };
  base: {
    ref: string;
    sha: string;
    repo: VCSRepository;
  };
  labels: string[];
  url: string;
  mergeable?: boolean;
  rebaseable?: boolean;
}

// Legacy types for backward compatibility
export type VCSFile = VCSPullRequestFile;
export type VCSCommit = VCSPullRequestCommit;
export type VCSReview = VCSPullRequestReview;
export type VCSComment = VCSPullRequestComment;
export type VCSRateLimit = {
  limit: number;
  remaining: number;
  reset: Date;
  used: number;
};

export type ListRepositoriesOptions = VCSPaginationParams;
export type ListPullRequestsOptions = VCSPaginationParams;
export type PaginatedResponse<T> = VCSPaginatedResponse<T>;

export interface VCSPermissions {
  admin: boolean;
  push: boolean;
  pull: boolean;
}

export interface VCSLabel {
  id: string;
  name: string;
  color: string;
  description: string;
  url: string;
}

// Pull request details
export interface VCSPullRequestFile {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previousFilename?: string;
  sha?: string;
}

export interface VCSPullRequestCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: Date;
  };
  committer: {
    name: string;
    email: string;
    date: Date;
  };
  url: string;
}

export interface VCSPullRequestReview {
  id: string;
  user: VCSUser;
  body: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING';
  submittedAt: Date | null;
  commitId: string;
}

export interface VCSPullRequestComment {
  id: string;
  user: VCSUser;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  path?: string;
  diffHunk?: string;
  position?: number;
  originalPosition?: number;
  commitId: string;
  originalCommitId?: string;
  inReplyToId?: string;
}

// Pagination types
export interface VCSPaginationParams {
  page?: number;
  perPage?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  state?: 'open' | 'closed' | 'merged' | 'all';
  visibility?: 'public' | 'private' | 'all';
}

export interface VCSPaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    perPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    page?: number;
    total?: number;
  };
}

// Client interface
export interface VCSClient {
  getPlatform(): VCSPlatform;
  getCurrentUser(): Promise<VCSUser>;
  getRepository(owner: string, name: string): Promise<VCSRepository>;
  listUserRepositories(params?: VCSPaginationParams): Promise<VCSPaginatedResponse<VCSRepository>>;
  listOrganizationRepositories(org: string, params?: VCSPaginationParams): Promise<VCSPaginatedResponse<VCSRepository>>;
  getPullRequest(owner: string, repo: string, number: number): Promise<VCSPullRequest>;
  listPullRequests(owner: string, repo: string, params?: VCSPaginationParams): Promise<VCSPaginatedResponse<VCSPullRequest>>;
  getPullRequestFiles(owner: string, repo: string, number: number): Promise<VCSPullRequestFile[]>;
  getPullRequestCommits(owner: string, repo: string, number: number): Promise<VCSPullRequestCommit[]>;
  getPullRequestReviews(owner: string, repo: string, number: number): Promise<VCSPullRequestReview[]>;
  getPullRequestComments(owner: string, repo: string, number: number): Promise<VCSPullRequestComment[]>;
  getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }>;
  
  // Extension methods for data collectors - required for data collection operations
  getRepositoryContents?: (owner: string, repo: string, path: string, ref?: string) => Promise<any[]>;
  getFileContent?: (owner: string, repo: string, path: string, ref?: string) => Promise<string>;
  getRepositoryTree?: (owner: string, repo: string, ref?: string, recursive?: boolean) => Promise<any>;
}
