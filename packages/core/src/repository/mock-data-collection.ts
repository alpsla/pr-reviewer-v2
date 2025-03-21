/**
 * Temporary mock implementations of data collection methods
 * 
 * These are temporary stubs to make the code compile while we work on the full implementation
 */

import { 
  PullRequestBasicDetails, 
  AnalysisEligibility,
  DataCollectionJob,
  DataCollectionStatusInfo,
  RepositoryStructure,
  Dependencies,
  SecurityInfo,
  PerformanceIndicators
} from './types';
import { DataType } from './data-collection-operations';

/**
 * Get basic PR details (primary tier data)
 */
export async function getPullRequestBasicDetailsMock(
  platform: any,
  owner: string,
  repo: string,
  number: number
): Promise<PullRequestBasicDetails> {
  // Generate a mock repository ID
  const repositoryId = `${platform}-${owner}-${repo}`;
  
  // Return mock data
  return {
    repositoryId,
    owner,
    repo,
    number,
    title: `Pull Request #${number}`,
    author: 'user',
    branch: 'feature-branch',
    baseBranch: 'main',
    filesChanged: 10,
    linesAdded: 100,
    linesRemoved: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
    url: `https://${platform}.com/${owner}/${repo}/pull/${number}`
  };
}

/**
 * Check if a repository is eligible for analysis
 */
export async function checkAnalysisEligibilityMock(
  repositoryId: string
): Promise<AnalysisEligibility> {
  // Always return eligible for now
  return {
    eligible: true
  };
}

/**
 * Schedule data collection for a repository
 */
export async function scheduleDataCollectionMock(
  repositoryId: string,
  dataTypes: DataType[]
): Promise<DataCollectionJob> {
  // Return a mock job
  return {
    id: `job-${Date.now()}`,
    repositoryId,
    dataTypes,
    status: 'pending',
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    retryCount: 0
  };
}

/**
 * Get data collection status for a repository
 */
export async function getDataCollectionStatusMock(
  repositoryId: string
): Promise<DataCollectionStatusInfo> {
  // Return a mock status
  return {
    repositoryId,
    status: 'processing',
    completionPercentage: 50,
    collectedDataTypes: [DataType.STRUCTURE],
    pendingDataTypes: [DataType.DEPENDENCIES, DataType.SECURITY, DataType.PERFORMANCE],
    lastUpdated: new Date()
  };
}

/**
 * Get repository structure
 */
export async function getRepositoryStructureMock(
  repositoryId: string
): Promise<RepositoryStructure | null> {
  // Return mock structure
  return {
    id: `structure-${repositoryId}`,
    repositoryId,
    rootDirectories: [
      {
        name: 'src',
        path: 'src',
        type: 'directory',
        children: []
      }
    ],
    fileTypes: {
      'js': 10,
      'ts': 20
    },
    lastUpdated: new Date()
  };
}

/**
 * Get dependency information
 */
export async function getDependencyInfoMock(
  repositoryId: string
): Promise<Dependencies | null> {
  // Return mock dependencies
  return {
    id: `deps-${repositoryId}`,
    repositoryId,
    packageManagers: ['npm'],
    directDependencies: [
      {
        name: 'react',
        version: '18.0.0'
      }
    ],
    devDependencies: [
      {
        name: 'typescript',
        version: '4.9.5'
      }
    ],
    vulnerabilities: [],
    lastUpdated: new Date()
  };
}

/**
 * Get security information
 */
export async function getSecurityInfoMock(
  repositoryId: string
): Promise<SecurityInfo | null> {
  // Return mock security info
  return {
    id: `security-${repositoryId}`,
    repositoryId,
    findings: [],
    lastUpdated: new Date()
  };
}

/**
 * Get performance indicators
 */
export async function getPerformanceIndicatorsMock(
  repositoryId: string
): Promise<PerformanceIndicators | null> {
  // Return mock performance indicators
  return {
    id: `perf-${repositoryId}`,
    repositoryId,
    indicators: [],
    lastUpdated: new Date()
  };
}
