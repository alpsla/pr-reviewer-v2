/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gitlab as GitlabOriginal } from '@gitbeaker/rest';
import { mapGitLabProject, mapGitLabUser, mapGitLabMergeRequest } from './mappers';
import { mapVisibility, mapMergeRequestState, Gitlab } from './gitlab-client-patch';
import { 
  VCSClient, 
  VCSUser, 
  VCSRepository,
  VCSPlatform, 
  VCSPullRequest, 
  VCSPaginationParams,
  VCSPaginatedResponse,
  VCSPullRequestFile,
  VCSPullRequestCommit,
  VCSPullRequestReview,
  VCSPullRequestComment
} from '../types';
import { VCSError } from '../errors';

/**
 * GitLab client implementation
 */
export class GitLabClient implements VCSClient {
  private gitlab: Gitlab;
  
  constructor(token: string, options: { baseUrl?: string } = {}) {
    // Cast to our extended Gitlab interface
    this.gitlab = new GitlabOriginal({
      token,
      host: options.baseUrl || 'https://gitlab.com',
    }) as unknown as Gitlab;
  }
  
  /**
   * Set a new base URL for the client
   */
  setBaseUrl(baseUrl: string): void {
    try {
      // Re-create the GitLab client with the new base URL
      this.gitlab = new GitlabOriginal({
        token: (this.gitlab as any)._token,
        host: baseUrl
      }) as unknown as Gitlab;
      console.log(`GitLab client base URL set to: ${baseUrl}`);
    } catch (error) {
      console.error('Error setting GitLab client base URL:', error);
      throw error;
    }
  }

  /**
   * Get the platform identifier
   */
  getPlatform(): VCSPlatform {
    return 'gitlab';
  }

  /**
   * Get the authenticated user
   */
  async getCurrentUser(): Promise<VCSUser> {
    try {
      const user = await this.gitlab.Users.current();
      return mapGitLabUser(user);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Get a repository by owner and name
   */
  async getRepository(owner: string, name: string): Promise<VCSRepository> {
    try {
      const repo = await this.gitlab.Projects.show(`${owner}/${name}`);
      return mapGitLabProject(repo);
    } catch (error) {
      return this.handleError(error, { owner, repo: name });
    }
  }
  
  /**
   * List repositories for the authenticated user
   */
  async listUserRepositories(params?: VCSPaginationParams): Promise<VCSPaginatedResponse<VCSRepository>> {
    try {
      const page = params?.page || 1;
      const perPage = params?.perPage || 30;
      const visibility = mapVisibility(params?.visibility);
      
      const repositories = await this.gitlab.Projects.all({
        page,
        per_page: perPage,
        min_access_level: 20, // Reporter or higher
        visibility,
        order_by: params?.sort || 'updated_at',
        sort: params?.direction || 'desc',
        membership: true,
      });
      
      return {
        data: repositories.map(repo => mapGitLabProject(repo)),
        pagination: {
          currentPage: page,
          perPage: perPage,
          hasNextPage: repositories.length === perPage,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * List repositories for an organization/group
   */
  async listOrganizationRepositories(org: string, params?: VCSPaginationParams): Promise<VCSPaginatedResponse<VCSRepository>> {
    try {
      const page = params?.page || 1;
      const perPage = params?.perPage || 30;
      const visibility = mapVisibility(params?.visibility);
      
      const repositories = await this.gitlab.Groups.projects(org, {
        page,
        per_page: perPage,
        min_access_level: 20, // Reporter or higher
        visibility,
        order_by: params?.sort || 'updated_at',
        sort: params?.direction || 'desc',
        include_subgroups: true,
      });
      
      return {
        data: repositories.map(repo => mapGitLabProject(repo)),
        pagination: {
          currentPage: page,
          perPage: perPage,
          hasNextPage: repositories.length === perPage,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      return this.handleError(error, { owner: org });
    }
  }
  
  /**
   * Get a pull request
   */
  async getPullRequest(owner: string, repo: string, number: number): Promise<VCSPullRequest> {
    try {
      const mr = await this.gitlab.MergeRequests.show(`${owner}/${repo}`, number);
      const project = await this.gitlab.Projects.show(`${owner}/${repo}`);
      return mapGitLabMergeRequest(mr, project);
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber: number });
    }
  }
  
  /**
   * List pull requests
   */
  async listPullRequests(owner: string, repo: string, params?: VCSPaginationParams): Promise<VCSPaginatedResponse<VCSPullRequest>> {
    try {
      const page = params?.page || 1;
      const perPage = params?.perPage || 30;
      const state = mapMergeRequestState(params?.state);
      
      const project = await this.gitlab.Projects.show(`${owner}/${repo}`);
      const projectId = project.id;
      
      const mrs = await this.gitlab.MergeRequests.all({
        projectId,
        page,
        per_page: perPage,
        state,
        order_by: params?.sort || 'updated_at',
        sort: params?.direction || 'desc',
      });
      
      return {
        data: mrs.map(mr => mapGitLabMergeRequest(mr, project)),
        pagination: {
          currentPage: page,
          perPage: perPage,
          hasNextPage: mrs.length === perPage,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      return this.handleError(error, { owner, repo });
    }
  }
  
  /**
   * Get pull request files
   */
  async getPullRequestFiles(owner: string, repo: string, number: number): Promise<VCSPullRequestFile[]> {
    try {
      const changes = await this.gitlab.MergeRequests.changes(`${owner}/${repo}`, number);
      
      return changes.changes.map((change: any) => {
        let status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied' = 'modified';
        if (change.new_file) status = 'added';
        else if (change.deleted_file) status = 'removed';
        else if (change.renamed_file) status = 'renamed';
        
        return {
          filename: change.new_path,
          status,
          additions: change.additions,
          deletions: change.deletions,
          changes: change.additions + change.deletions,
          patch: change.diff,
          previousFilename: change.renamed_file ? change.old_path : undefined
        };
      });
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber: number });
    }
  }
  
  /**
   * Get pull request commits
   */
  async getPullRequestCommits(owner: string, repo: string, number: number): Promise<VCSPullRequestCommit[]> {
    try {
      const commits = await this.gitlab.MergeRequests.commits(`${owner}/${repo}`, number);
      
      return commits.map((commit: any) => ({
        sha: commit.id,
        message: commit.message,
        author: {
          name: commit.author_name,
          email: commit.author_email,
          date: new Date(commit.created_at)
        },
        committer: {
          name: commit.committer_name || commit.author_name,
          email: commit.committer_email || commit.author_email,
          date: new Date(commit.committed_date || commit.created_at)
        },
        url: commit.web_url || ''
      }));
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber: number });
    }
  }
  
  /**
   * Get pull request reviews
   * Note: GitLab has approvals rather than traditional reviews
   */
  async getPullRequestReviews(owner: string, repo: string, number: number): Promise<VCSPullRequestReview[]> {
    try {
      const approvals = await this.gitlab.MergeRequests.approvals(`${owner}/${repo}`, number);
      
      if (!approvals.approved_by || !Array.isArray(approvals.approved_by)) {
        return [];
      }
      
      return approvals.approved_by.map((approval: any) => ({
        id: `approval-${approval.user.id}`,
        user: mapGitLabUser(approval.user),
        body: 'Approved',
        state: 'APPROVED',
        submittedAt: approval.created_at ? new Date(approval.created_at) : null,
        commitId: approvals.merge_status?.sha || ''
      }));
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber: number });
    }
  }
  
  /**
   * Get pull request comments
   */
  async getPullRequestComments(owner: string, repo: string, number: number): Promise<VCSPullRequestComment[]> {
    try {
      const discussions = await this.gitlab.MergeRequestDiscussions.all(`${owner}/${repo}`, number);
      const comments: VCSPullRequestComment[] = [];
      
      discussions.forEach((discussion: any) => {
        if (!discussion.notes || !Array.isArray(discussion.notes)) return;
        
        discussion.notes.forEach((note: any) => {
          // Skip system notes
          if (note.system) return;
          
          comments.push({
            id: note.id.toString(),
            user: mapGitLabUser(note.author),
            body: note.body || '',
            createdAt: new Date(note.created_at),
            updatedAt: new Date(note.updated_at),
            path: note.position?.new_path,
            diffHunk: note.position ? `@@ ... @@` : undefined,
            position: note.position?.new_line,
            originalPosition: note.position?.old_line,
            commitId: note.position?.head_sha || '',
            originalCommitId: note.position?.start_sha
          });
        });
      });
      
      return comments;
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber: number });
    }
  }

  /**
   * Get the rate limit status
   */
  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }> {
    try {
      // Make a lightweight request to get headers
      await this.gitlab.Users.current();
      
      // GitLab defaults if we can't determine actual values
      return {
        limit: 2000,
        remaining: 1999,
        reset: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        used: 1
      };
    } catch (error) {
      // Check for rate limit error
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response;
        if (response?.status === 429) {
          const resetHeader = response.headers?.['retry-after'] || response.headers?.['ratelimit-reset'];
          const resetTime = resetHeader
            ? new Date(parseInt(resetHeader, 10) * 1000)
            : new Date(Date.now() + 60 * 1000); // Default 1 minute
            
          throw new VCSError(
            'GitLab API rate limit exceeded',
            'gitlab',
            'RATE_LIMIT_EXCEEDED',
            {
              rateLimitReset: resetTime.getTime(),
              retryAfter: resetTime.getTime() - Date.now(),
              platform: 'gitlab'
            }
          );
        }
      }
      
      return this.handleError(error);
    }
  }

  /**
   * Generic error handler
   */
  private handleError(error: unknown, context?: {
    owner?: string;
    repo?: string;
    pullNumber?: number;
  }): never {
    if (error && typeof error === 'object') {
      const err = error as any;
      
      // Not found errors
      if (err.response?.status === 404 || err.description?.includes('404')) {
        let errorCode = 'RESOURCE_NOT_FOUND';
        if (context?.pullNumber) {
          errorCode = 'PULL_REQUEST_NOT_FOUND';
        } else if (context?.repo) {
          errorCode = 'REPOSITORY_NOT_FOUND';
        }
                                      
        throw new VCSError(
          `Resource not found: ${context?.owner ? `${context.owner}/` : ''}${context?.repo || ''} ${context?.pullNumber ? `#${context?.pullNumber}` : ''}`,
          'gitlab',
          errorCode as any,
          { 
            owner: context?.owner,
            repo: context?.repo,
            pullNumber: context?.pullNumber,
            statusCode: 404
          }
        );
      }

      // Rate limit errors
      if (err.response?.status === 429) {
        const resetHeader = err.response.headers?.['retry-after'] || err.response.headers?.['ratelimit-reset'];
        const resetTime = resetHeader
          ? new Date(parseInt(resetHeader, 10) * 1000)
          : new Date(Date.now() + 60 * 1000); // Default 1 minute
          
        throw new VCSError(
          'GitLab API rate limit exceeded',
          'gitlab',
          'RATE_LIMIT_EXCEEDED',
          {
            rateLimitReset: resetTime.getTime(),
            retryAfter: resetTime.getTime() - Date.now(),
            platform: 'gitlab'
          }
        );
      }

      // Authentication errors
      if (err.response?.status === 401) {
        throw new VCSError(
          'Authentication failed. Please check your token.',
          'gitlab',
          'UNAUTHORIZED' as any,
          { statusCode: 401 }
        );
      }

      // Permission errors
      if (err.response?.status === 403) {
        throw new VCSError(
          'Permission denied. You do not have access to this resource.',
          'gitlab',
          'PERMISSION_DENIED' as any,
          { 
            statusCode: 403,
            owner: context?.owner,
            repo: context?.repo
          }
        );
      }

      // Generic API errors
      throw new VCSError(
        `GitLab API error: ${err.message || err.description || 'Unknown error'}`,
        'gitlab',
        'API_ERROR',
        { 
          statusCode: err.response?.status || 500,
          path: err.response?.url || '',
          message: err.message || err.description || 'Unknown error'
        }
      );
    }

    // Network or other errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new VCSError(
      `Unexpected error: ${errorMessage}`,
      'gitlab',
      'NETWORK_ERROR',
      { originalError: errorMessage }
    );
  }
}
