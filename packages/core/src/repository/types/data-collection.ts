/**
 * Types for the two-tier data collection system
 */

/**
 * Types of data that can be collected
 */
enum DataType {
  BASIC = 'basic',
  FILES = 'files',
  COMMITS = 'commits',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  DEPENDENCIES = 'dependencies',
  STRUCTURE = 'structure'
}

/**
 * Data collection job status
 */
export type DataCollectionStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Data collection job
 */
export interface DataCollectionJob {
  id: string;
  repositoryId: string;
  dataTypes: DataType[];
  status: DataCollectionStatus;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  retryCount: number;
}

/**
 * Data collection status information
 */
export interface DataCollectionStatusInfo {
  repositoryId: string;
  status: DataCollectionStatus | 'unknown';
  completionPercentage: number;
  collectedDataTypes: DataType[];
  pendingDataTypes: DataType[];
  lastUpdated: Date;
  error?: string;
  message?: string;
  progress?: number;
}

/**
 * Pull request basic details (primary tier data)
 */
export interface PullRequestBasicDetails {
  repositoryId: string;
  owner: string;
  repo: string;
  number: number;
  title: string;
  author: string;
  branch: string;
  baseBranch: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

/**
 * Repository access status
 */
export interface AccessStatus {
  hasAccess: boolean;
  isPrivate: boolean;
  repositoryId?: string;
}

/**
 * Analysis eligibility status
 */
export interface AnalysisEligibility {
  eligible: boolean;
  reason?: string;
}

/**
 * Directory node in repository structure
 */
export interface DirectoryNode {
  name: string;
  path: string;
  type: 'directory' | 'file';
  size?: number;
  children?: DirectoryNode[];
}

/**
 * Repository structure information
 */
export interface RepositoryStructure {
  id: string;
  repositoryId: string;
  rootDirectories: DirectoryNode[];
  fileTypes: Record<string, number>;
  specialDirectories?: Record<string, string>;
  lastUpdated: Date;
}

/**
 * Dependency information
 */
export interface Dependency {
  name: string;
  version: string;
  latest?: string;
  outdated?: boolean;
  license?: string;
}

/**
 * Dependency vulnerability information
 */
export interface DependencyVulnerability {
  id: string;
  dependencyName: string;
  dependencyVersion: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fixedInVersion?: string;
}

/**
 * Repository dependencies information
 */
export interface Dependencies {
  id: string;
  repositoryId: string;
  packageManagers: string[];
  directDependencies: Dependency[];
  devDependencies: Dependency[];
  transitiveDependencies?: Dependency[];
  vulnerabilities: DependencyVulnerability[];
  lastUpdated: Date;
}

/**
 * Security finding information
 */
export interface SecurityFinding {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation?: string;
  detectedAt: Date;
}

/**
 * Repository security information
 */
export interface SecurityInfo {
  id: string;
  repositoryId: string;
  findings: SecurityFinding[];
  lastUpdated: Date;
}

/**
 * Performance indicator information
 */
export interface PerformanceIndicator {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation?: string;
}

/**
 * Repository performance indicators
 */
export interface PerformanceIndicators {
  id: string;
  repositoryId: string;
  indicators: PerformanceIndicator[];
  lastUpdated: Date;
}
