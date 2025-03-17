/**
 * Data collection status information
 */
export interface DataCollectionStatusInfo {
  repositoryId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'unknown';
  completionPercentage: number;
  collectedDataTypes: Array<'structure' | 'dependencies' | 'security' | 'performance'>;
  pendingDataTypes: Array<'structure' | 'dependencies' | 'security' | 'performance'>;
  lastUpdated: Date;
  error?: string;
  message?: string;
  progress?: number;
}

/**
 * VCS (Version Control System) related types
 */

/**
 * VCS platform types
 */
export type VCSPlatform = 'github' | 'gitlab';

/**
 * Repository visibility types
 */
export enum RepositoryVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  UNKNOWN = "unknown"
}

/**
 * Basic repository interface
 */
export interface Repository {
  platform: VCSPlatform;
  owner: string;
  name: string;
  isPrivate?: boolean;
  fingerprint?: string;
}

/**
 * Pull request basic interface
 */
export interface PullRequest {
  id?: string;
  number: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  baseBranch: string;
  headBranch: string;
  repository: Repository;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
}
