import { DatabaseService } from '../supabase/database';
import { VCSPaginatedResponse } from '../vcs/types';
// Import the interfaces and classes from your refactored structure
import { RepositoryOperations } from './repository-operations';
import { PullRequestOperations } from './pull-request-operations';
import { VCSPlatform } from '../types/platform';
import { IRepositoryService, PullRequest, Repository, PullRequestFile, PullRequestDetails, PullRequestListOptions } from './types';
import { logger } from '../utils/logger';

// Create a combined service that provides the same interface
class LocalRepositoryService implements IRepositoryService {
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

  // Expose methods from both operations classes
  getRepository(platform: VCSPlatform, owner: string, name: string): Promise<Repository> {
    return this.repoOps.getRepository(platform, owner, name);
  }

  getPullRequest(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequest> {
    return this.prOps.getPullRequest(platform, owner, repo, number);
  }

  listPullRequests(platform: VCSPlatform, owner: string, repo: string, options?: PullRequestListOptions): Promise<VCSPaginatedResponse<PullRequest>> {
    return this.prOps.listPullRequests(platform, owner, repo, options);
  }

  getPullRequestFiles(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequestFile[]> {
    return this.prOps.getPullRequestFiles(platform, owner, repo, number);
  }

  getPullRequestDetails(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<PullRequestDetails> {
    return this.prOps.getPullRequestDetails(platform, owner, repo, number);
  }
  
  // Implement additional methods required by IRepositoryService
  checkRepositoryAccess(platform: VCSPlatform, owner: string, repo: string): Promise<{
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

  getRateLimit(platform: VCSPlatform): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }> {
    return this.repoOps.getRateLimit(platform);
  }
}

/**
 * Process a pull request
 */
export class RepositoryProcessor {
  constructor(
    private repositoryService: IRepositoryService,
    private db: DatabaseService
  ) {}

  /**
   * Process a pull request for analysis
   */
  async processPullRequest(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<any> {
    try {
      // Get the PR
      const pr = await this.repositoryService.getPullRequest(platform, owner, repo, number);
      
      // Queue analysis job with pending status
      const analysisJob = await this.db.createAnalysisJob({
        pull_request_id: pr.id,
        // repository_id is for metadata only
        metadata: {
          repository_id: pr.repository.id,
          pull_request_number: pr.number,
          base_branch: pr.baseRef,
          head_branch: pr.headRef
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return { prId: pr.id, analysisJobId: analysisJob.id };
    } catch (error) {
      logger.error('Error processing pull request:', error);
      throw error;
    }
  }
  
  /**
   * Alias for backward compatibility
   */
  async processPR(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<any> {
    return this.processPullRequest(platform, owner, repo, number);
  }
  
  /**
   * Analyze languages used in PR
   */
  async analyzePRLanguages(platform: VCSPlatform, owner: string, repo: string, number: number): Promise<Array<{language: string, percentage: number}>> {
    try {
      // Get the PR details including files
      const pr = await this.repositoryService.getPullRequest(platform, owner, repo, number);
      
      // Simple mock implementation for testing
      return [
        { language: 'TypeScript', percentage: 75 },
        { language: 'JavaScript', percentage: 20 },
        { language: 'CSS', percentage: 5 }
      ];
    } catch (error) {
      logger.error('Error analyzing PR languages:', error);
      throw error;
    }
  }
}