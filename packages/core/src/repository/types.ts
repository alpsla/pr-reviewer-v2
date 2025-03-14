import { PlatformErrorCode } from '../types/platform';
import type { VCSPlatform } from '../types/platform';

// Import data collection types
import {
  PullRequestBasicDetails,
  AnalysisEligibility,
  DataCollectionJob,
  DataCollectionStatusInfo,
  RepositoryStructure,
  Dependencies,
  SecurityInfo,
  PerformanceIndicators,
  DataType
} from './types/data-collection';
import type {
  VCSRepository,
  VCSPullRequest,
  VCSPullRequestFile,
  VCSPullRequestCommit,
  VCSPullRequestReview,
  VCSPullRequestComment,
  VCSPaginatedResponse
} from '../vcs/types';

/**
 * Repository service interface
 */
export interface IRepositoryService {
  // Original methods
  getRepository(platform: VCSPlatform, owner: string, name: string): Promise<Repository>;
  getPullRequest(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequest>;
  listPullRequests(platform: VCSPlatform, owner: string, repo: string, options?: PullRequestListOptions): Promise<VCSPaginatedResponse<PullRequest>>;
  getPullRequestFiles(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequestFile[]>;
  getPullRequestDetails(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequestDetails>;
  checkRepositoryAccess(platform: VCSPlatform, owner: string, repo: string): Promise<{
    hasAccess: boolean;
    private: boolean;
    permissions: {
      admin: boolean;
      push: boolean;
      pull: boolean;
    };
  }>;
  getRateLimit(platform: VCSPlatform): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }>;
  checkAnalysisLimit(platform: VCSPlatform, owner: string, repo: string): Promise<{
    current: number;
    limit: number;
    hasReachedLimit: boolean;
  }>;
  incrementAnalysisCount(platform: VCSPlatform, owner: string, repo: string, bypassLimit?: boolean): Promise<number>;
  
  // Two-tier data collection - Primary (Immediate)
  getPullRequestBasicDetails(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequestBasicDetails>;
  checkAnalysisEligibility(repositoryId: string): Promise<AnalysisEligibility>;
  
  // Two-tier data collection - Secondary (Background)
  scheduleDataCollection(repositoryId: string, dataTypes: DataType[]): Promise<DataCollectionJob>;
  getDataCollectionStatus(repositoryId: string): Promise<DataCollectionStatusInfo>;
  getRepositoryStructure(repositoryId: string): Promise<RepositoryStructure | null>;
  getDependencyInfo(repositoryId: string): Promise<Dependencies | null>;
  getSecurityInfo(repositoryId: string): Promise<SecurityInfo | null>;
  getPerformanceIndicators(repositoryId: string): Promise<PerformanceIndicators | null>;
}

/**
 * Core repository interface
 */
export interface Repository {
  id: string;
  platform: VCSPlatform;
  externalId: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  private: boolean;
  defaultBranch: string;
  url: string;
  language: string | null;
  topics: string[];
  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  analysisCount?: number;
  freeTierLimit?: number;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt?: Date;
  lastAnalyzedAt?: Date;
  fingerprint?: string;
}

/**
 * Pull request interface
 */
export interface PullRequest {
  id: string;
  platform: VCSPlatform;
  externalId: string;
  number: number;
  title: string;
  body?: string | null;
  state: 'open' | 'closed' | 'merged';
  draft: boolean;
  url: string;
  repository: {
    id: string;
    owner: string;
    name: string;
  };
  baseRef: string;
  baseSha: string;
  headRef: string;
  headSha: string;
  author: {
    id: string;
    login: string;
    name?: string;
    avatarUrl?: string;
  };
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date | null;
  mergedAt?: Date | null;
}

/**
 * Pull request file changes
 */
export interface PullRequestFile {
  path: string;
  status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previousPath?: string;
}

/**
 * Pull request details including files, commits, etc.
 */
export interface PullRequestDetails {
  pullRequest: PullRequest;
  files: PullRequestFile[];
  commits: VCSPullRequestCommit[];
  reviews: VCSPullRequestReview[];
  comments: VCSPullRequestComment[];
}

/**
 * Options for listing repositories
 */
export interface RepositoryListOptions {
  page?: number;
  perPage?: number;
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  visibility?: 'all' | 'public' | 'private';
  affiliation?: 'owner' | 'collaborator' | 'organization_member';
}

/**
 * Options for listing pull requests
 */
export interface PullRequestListOptions {
  state?: 'open' | 'closed' | 'all' | 'merged';
  sort?: 'created' | 'updated';
  direction?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

/**
 * Re-export common types
 */
export type { VCSPaginatedResponse as PaginatedResponse };

/**
 * Re-export data collection types
 */
export type {
  PullRequestBasicDetails,
  AnalysisEligibility,
  DataCollectionJob,
  DataCollectionStatusInfo,
  RepositoryStructure,
  Dependencies,
  SecurityInfo,
  PerformanceIndicators,
  DataType
};
