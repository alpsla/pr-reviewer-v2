/**
 * Repository Service Interface
 * 
 * This is a compatibility layer to provide the interface expected by tests
 * after the refactoring of repository service into smaller files.
 */

import { VCSPlatform } from '../types/platform';
import { DatabaseService } from '../supabase/database';
import { RepositoryOperations } from './repository-operations';
import { PullRequestOperations } from './pull-request-operations';
import { DataCollectionOperations } from './data-collection-operations';
import type {
  Repository,
  PullRequest,
  PullRequestFile,
  PullRequestDetails,
  PullRequestListOptions,
  IRepositoryService,
  DataType,
  PullRequestBasicDetails,
  AnalysisEligibility,
  DataCollectionJob,
  DataCollectionStatusInfo,
  RepositoryStructure,
  Dependencies,
  SecurityInfo,
  PerformanceIndicators
} from './types';
import type { VCSPaginatedResponse } from '../vcs/types';

/**
 * Repository Service Implementation
 * 
 * After refactoring, this class acts as a facade that delegates
 * to the specialized operation classes.
 */
export class RepositoryService implements IRepositoryService {
  private repoOps: RepositoryOperations;
  private prOps: PullRequestOperations;
  private dataOps: DataCollectionOperations;

  constructor(
    db: DatabaseService,
    tokens: { github?: string; gitlab?: string; } = {},
    baseUrls?: { github?: string; gitlab?: string; }
  ) {
    this.repoOps = new RepositoryOperations(db, tokens, baseUrls);
    this.prOps = new PullRequestOperations(db, tokens, baseUrls);
    this.dataOps = new DataCollectionOperations(db, tokens, baseUrls);
    // Now all three operation classes are properly initialized
  }

  /**
   * Get repository details
   */
  async getRepository(platform: VCSPlatform, owner: string, name: string): Promise<Repository> {
    return this.repoOps.getRepository(platform, owner, name);
  }

  /**
   * Get pull request details
   */
  async getPullRequest(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequest> {
    return this.prOps.getPullRequest(platform, owner, repo, number);
  }

  /**
   * List pull requests for a repository
   */
  async listPullRequests(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    options?: PullRequestListOptions
  ): Promise<VCSPaginatedResponse<PullRequest>> {
    return this.prOps.listPullRequests(platform, owner, repo, options);
  }

  /**
   * Get pull request files
   */
  async getPullRequestFiles(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    number: number
  ): Promise<PullRequestFile[]> {
    return this.prOps.getPullRequestFiles(platform, owner, repo, number);
  }

  /**
   * Get comprehensive pull request details
   */
  async getPullRequestDetails(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    number: number
  ): Promise<PullRequestDetails> {
    return this.prOps.getPullRequestDetails(platform, owner, repo, number);
  }

  /**
   * Check repository access
   */
  async checkRepositoryAccess(
    platform: VCSPlatform,
    owner: string,
    repo: string
  ): Promise<{
    hasAccess: boolean;
    private: boolean;
    permissions: {
      admin: boolean;
      push: boolean;
      pull: boolean;
    };
  }> {
    return this.repoOps.checkRepositoryAccess(platform, owner, repo);
  }

  /**
   * Get rate limit information
   */
  async getRateLimit(platform: VCSPlatform): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }> {
    return this.repoOps.getRateLimit(platform);
  }
  
  /**
   * Check if a repository has reached its free tier analysis limit
   */
  async checkAnalysisLimit(
    platform: VCSPlatform,
    owner: string,
    repo: string
  ): Promise<{ current: number; limit: number; hasReachedLimit: boolean }> {
    return this.repoOps.checkAnalysisLimit(platform, owner, repo);
  }
  
  /**
   * Increment the analysis count for a repository
   * 
   * @throws AnalysisLimitError if the repository has reached its free tier limit
   */
  async incrementAnalysisCount(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    bypassLimit = false
  ): Promise<number> {
    return this.repoOps.incrementAnalysisCount(platform, owner, repo, bypassLimit);
  }

  /**
   * Two-tier Data Collection - Primary (Immediate)
   */
  
  /**
   * Get basic PR details (primary tier data)
   */
  async getPullRequestBasicDetails(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    number: number
  ): Promise<PullRequestBasicDetails> {
    try {
      // Use the DataCollectionOperations implementation
      return await this.dataOps.getPullRequestBasicDetails(platform, owner, repo, number);
    } catch (error) {
      console.error('Error in getPullRequestBasicDetails:', error);
      throw error;
    }
  }
  
  /**
   * Check if a repository is eligible for analysis
   */
  async checkAnalysisEligibility(repositoryId: string): Promise<AnalysisEligibility> {
    try {
      return await this.dataOps.checkAnalysisEligibility(repositoryId);
    } catch (error) {
      console.error('Error in checkAnalysisEligibility:', error);
      throw error;
    }
  }
  
  /**
   * Two-tier Data Collection - Secondary (Background)
   */
  
  /**
   * Schedule data collection for a repository
   */
  async scheduleDataCollection(
    repositoryId: string,
    dataTypes: DataType[]
  ): Promise<DataCollectionJob> {
    try {
      return await this.dataOps.scheduleDataCollection(repositoryId, dataTypes);
    } catch (error) {
      console.error('Error in scheduleDataCollection:', error);
      throw error;
    }
  }
  
  /**
   * Get data collection status for a repository
   */
  async getDataCollectionStatus(repositoryId: string): Promise<DataCollectionStatusInfo> {
    try {
      return await this.dataOps.getDataCollectionStatus(repositoryId);
    } catch (error) {
      console.error('Error in getDataCollectionStatus:', error);
      throw error;
    }
  }
  
  /**
   * Get repository structure
   */
  async getRepositoryStructure(repositoryId: string): Promise<RepositoryStructure | null> {
    try {
      return await this.dataOps.getRepositoryStructure(repositoryId);
    } catch (error) {
      console.error('Error in getRepositoryStructure:', error);
      throw error;
    }
  }
  
  /**
   * Get dependency information
   */
  async getDependencyInfo(repositoryId: string): Promise<Dependencies | null> {
    try {
      return await this.dataOps.getDependencyInfo(repositoryId);
    } catch (error) {
      console.error('Error in getDependencyInfo:', error);
      throw error;
    }
  }
  
  /**
   * Get security information
   */
  async getSecurityInfo(repositoryId: string): Promise<SecurityInfo | null> {
    try {
      return await this.dataOps.getSecurityInfo(repositoryId);
    } catch (error) {
      console.error('Error in getSecurityInfo:', error);
      throw error;
    }
  }
  
  /**
   * Get performance indicators
   */
  async getPerformanceIndicators(repositoryId: string): Promise<PerformanceIndicators | null> {
    try {
      return await this.dataOps.getPerformanceIndicators(repositoryId);
    } catch (error) {
      console.error('Error in getPerformanceIndicators:', error);
      throw error;
    }
  }
}
