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
import type {
  Repository,
  PullRequest,
  PullRequestFile,
  PullRequestDetails,
  PullRequestListOptions,
  IRepositoryService
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

  constructor(
    db: DatabaseService,
    tokens: { github?: string; gitlab?: string; } = {},
    baseUrls?: { github?: string; gitlab?: string; }
  ) {
    this.repoOps = new RepositoryOperations(db, tokens, baseUrls);
    this.prOps = new PullRequestOperations(db, tokens, baseUrls);
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
}
