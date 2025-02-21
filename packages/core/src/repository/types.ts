import { VCSPlatform, 
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  VCSRepository, 
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  VCSPullRequest, 
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  VCSPullRequestFile, 
  VCSPullRequestCommit, VCSPullRequestComment, VCSPullRequestReview } from '../vcs/types';

// Repository types for our domain
export interface Repository {
  id: string;
  platform: VCSPlatform;
  externalId: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  defaultBranch: string;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt: Date | null;
  url: string;
  hasAdminAccess: boolean;
  hasWriteAccess: boolean;
  language?: string | null;
  topics?: string[];
  stargazersCount?: number;
  forksCount?: number;
}

export interface PullRequest {
  id: string;
  repositoryId: string;
  platform: VCSPlatform;
  externalId: string;
  number: number;
  title: string;
  description: string | null;
  state: 'open' | 'closed' | 'merged';
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  mergedAt: Date | null;
  isDraft: boolean;
  author: {
    id: string;
    login: string;
    name: string | null;
    avatarUrl: string | null;
  };
  headRef: string;
  baseRef: string;
  headSha: string;
  baseSha: string;
  labels: string[];
  url: string;
}

export interface PullRequestFile {
  sha: string;
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previousFilename?: string;
  rawUrl?: string;
}

export interface RepositoryListOptions {
  page?: number;
  perPage?: number;
  sort?: 'updated' | 'created' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  visibility?: 'all' | 'public' | 'private';
  includeStats?: boolean;
}

export interface PullRequestListOptions {
  page?: number;
  perPage?: number;
  state?: 'open' | 'closed' | 'merged' | 'all';
  sort?: 'created' | 'updated' | 'popularity' | 'long-running';
  direction?: 'asc' | 'desc';
  since?: Date;
  labels?: string[];
}

export interface PullRequestDetails {
  pullRequest: PullRequest;
  files?: PullRequestFile[];
  commits?: VCSPullRequestCommit[];
  reviews?: VCSPullRequestReview[];
  comments?: VCSPullRequestComment[];
}

export interface PullRequestAnalysis {
  id: string;
  pullRequestId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt: Date | null;
  model: string | null;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  } | null;
  summary: string | null;
  suggestions: Array<{
    id: string;
    file: string;
    line?: number;
    content: string;
    severity: 'critical' | 'major' | 'minor' | 'suggestion';
    category: string;
  }> | null;
  error: string | null;
}

// Pagination response for repository data matching VCSPaginatedResponse
export interface PaginatedResponse<T> {
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

// Error types
export type RepositoryErrorCode = 
  | 'REPOSITORY_NOT_FOUND'
  | 'PULL_REQUEST_NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'UNEXPECTED_ERROR';

// Database entity (for minimal-index.ts)
export class Database {}
