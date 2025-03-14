/**
 * GitHub API client implementation
 */
import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';
import { 
  VCSClient,
  VCSRepository,
  VCSUser,
  VCSPullRequest,
  VCSPullRequestFile,
  VCSPullRequestCommit,
  VCSPullRequestReview,
  VCSPullRequestComment,
  VCSPaginationParams,
  VCSPaginatedResponse
} from '../types';
import { VCSError } from '../errors';
import { mapGitHubRepository, mapGitHubPR } from './mappers';

export class GitHubClient implements VCSClient {
  private octokit: Octokit;
  private platform = 'github' as const;

  constructor(token: string, options?: { baseUrl?: string }) {
    this.octokit = new Octokit({
      auth: token,
      baseUrl: options?.baseUrl || 'https://api.github.com'
    });
  }

  /**
   * Returns the platform identifier
   */
  getPlatform(): 'github' {
    return this.platform;
  }

  /**
   * Get the currently authenticated user
   */
  async getCurrentUser(): Promise<VCSUser> {
    try {
      const response = await this.octokit.users.getAuthenticated();
      return {
        id: response.data.id.toString(),
        platform: 'github',
        externalId: response.data.node_id,
        login: response.data.login,
        name: response.data.name || response.data.login,
        email: response.data.email || '',
        avatarUrl: response.data.avatar_url,
        url: response.data.html_url
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a repository by owner and name
   */
  async getRepository(owner: string, name: string): Promise<VCSRepository> {
    try {
      const response = await this.octokit.repos.get({ owner, repo: name });
      
      // Enhanced logging for debugging
      console.log('GitHub repository details:', { 
        id: response.data.id,
        fullName: response.data.full_name,
        private: response.data.private,
        visibility: response.data.visibility,
        permissions: response.data.permissions,
        hasAccess: true
      });
      
      // Special handling for public repositories incorrectly marked as private
      const mappedRepo = mapGitHubRepository(response.data);
      
      // For public repos, ensure we always have pull permission
      if (!mappedRepo.isPrivate) {
        mappedRepo.permissions.pull = true;
      }
      
      // If we have pull permission but the repo is marked private, it might be a public repo
      // with incorrect visibility
      if (mappedRepo.isPrivate && mappedRepo.permissions.pull) {
        console.log(`Repository ${owner}/${name} is marked as private but we have pull access. ` +
                    `This might be a public repository incorrectly reported as private.`);
      }
      
      return mappedRepo;
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
      
      // Convert sort param to valid value or undefined
      let sort: "full_name" | "created" | "updated" | "pushed" | undefined = undefined;
      if (params?.sort === "full_name" || params?.sort === "created" || 
          params?.sort === "updated" || params?.sort === "pushed") {
        sort = params.sort;
      }
      
      const response = await this.octokit.repos.listForAuthenticatedUser({
        page,
        per_page: perPage,
        sort,
        direction: params?.direction,
        visibility: params?.visibility
      });
      
      const data = response.data.map(repo => mapGitHubRepository(repo));
      
      return {
        data,
        pagination: {
          currentPage: page,
          perPage,
          hasNextPage: !!response.headers.link?.includes('rel="next"'),
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * List repositories for an organization
   */
  async listOrganizationRepositories(
    org: string,
    params?: VCSPaginationParams
  ): Promise<VCSPaginatedResponse<VCSRepository>> {
    try {
      const page = params?.page || 1;
      const perPage = params?.perPage || 30;
      
      // Convert sort param to valid value or undefined
      let sort: "full_name" | "created" | "updated" | "pushed" | undefined = undefined;
      if (params?.sort === "full_name" || params?.sort === "created" || 
          params?.sort === "updated" || params?.sort === "pushed") {
        sort = params.sort;
      }
      
      const response = await this.octokit.repos.listForOrg({
        org,
        page,
        per_page: perPage,
        sort,
        direction: params?.direction,
        type: params?.visibility === 'private' ? 'private' : 'all'
      });
      
      const data = response.data.map(repo => mapGitHubRepository(repo));
      
      return {
        data,
        pagination: {
          currentPage: page,
          perPage,
          hasNextPage: !!response.headers.link?.includes('rel="next"'),
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a pull request by number
   */
  async getPullRequest(owner: string, repo: string, number: number): Promise<VCSPullRequest> {
    try {
      const response = await this.octokit.pulls.get({
        owner,
        repo,
        pull_number: number
      });
      
      return mapGitHubPR(response.data);
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber: number });
    }
  }

  /**
   * List pull requests in a repository
   */
  async listPullRequests(
    owner: string,
    repo: string,
    params?: VCSPaginationParams
  ): Promise<VCSPaginatedResponse<VCSPullRequest>> {
    try {
      const page = params?.page || 1;
      const perPage = params?.perPage || 30;
      
      // Convert sort param to valid value or undefined
      let sort: "created" | "updated" | "popularity" | "long-running" | undefined = undefined;
      if (params?.sort === "created" || params?.sort === "updated" || 
          params?.sort === "popularity" || params?.sort === "long-running") {
        sort = params.sort;
      }
      
      const response = await this.octokit.pulls.list({
        owner,
        repo,
        page,
        per_page: perPage,
        state: params?.state === 'merged' ? 'closed' : params?.state || 'open',
        sort,
        direction: params?.direction
      });
      
      const data = await Promise.all(
        response.data.map(async (pr) => {
          try {
            // For merged PRs, we need to get the full PR details
            if (params?.state === 'merged') {
              const fullPr = await this.getPullRequest(owner, repo, pr.number);
              return fullPr.mergedAt ? fullPr : null;
            }
            return mapGitHubPR(pr);
          } catch (e) {
            console.error(`Error fetching PR details for ${owner}/${repo}#${pr.number}:`, e);
            return null;
          }
        })
      );
      
      // Filter out nulls (from merged filter)
      const pullRequests = data.filter(Boolean) as VCSPullRequest[];
      
      return {
        data: pullRequests,
        pagination: {
          currentPage: page,
          perPage: perPage,
          hasNextPage: !!response.headers.link?.includes('rel="next"'),
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      return this.handleError(error, { owner, repo });
    }
  }

  /**
   * List files changed in a pull request
   */
  async getPullRequestFiles(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<VCSPullRequestFile[]> {
    try {
      const response = await this.octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
        per_page: 100
      });
      
      return response.data.map(file => ({
        filename: file.filename,
        status: file.status as 'added' | 'modified' | 'removed' | 'renamed' | 'copied',
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch || '',
        previousFilename: file.previous_filename,
        sha: file.sha || '' // Add SHA to match PullRequestFile interface
      }));
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber });
    }
  }

  /**
   * List commits in a pull request
   */
  async getPullRequestCommits(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<VCSPullRequestCommit[]> {
    try {
      const response = await this.octokit.pulls.listCommits({
        owner,
        repo,
        pull_number: pullNumber,
        per_page: 100
      });
      
      return response.data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name || 'Unknown',
          email: commit.commit.author?.email || '',
          date: commit.commit.author?.date 
            ? new Date(commit.commit.author.date)
            : new Date()
        },
        committer: {
          name: commit.commit.committer?.name || 'Unknown',
          email: commit.commit.committer?.email || '',
          date: commit.commit.committer?.date 
            ? new Date(commit.commit.committer.date)
            : new Date()
        },
        url: commit.html_url
      }));
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber });
    }
  }

  /**
   * List pull request reviews
   */
  async getPullRequestReviews(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<VCSPullRequestReview[]> {
    try {
      const response = await this.octokit.pulls.listReviews({
        owner,
        repo,
        pull_number: pullNumber
      });
      
      return response.data.map(review => ({
        id: review.id.toString(),
        user: {
          id: review.user?.id?.toString() || '',
          platform: 'github',
          externalId: review.user?.node_id || '',
          login: review.user?.login || 'unknown',
          name: review.user?.name || review.user?.login || 'Unknown User',
          email: '',
          avatarUrl: review.user?.avatar_url || '',
          url: review.user?.html_url || ''
        },
        body: review.body || '',
        state: review.state as 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING',
        submittedAt: review.submitted_at ? new Date(review.submitted_at) : null,
        // Ensure commitId is never null - use empty string as fallback
        commitId: review.commit_id || ''
      }));
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber });
    }
  }

  /**
   * List pull request comments
   */
  async getPullRequestComments(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<VCSPullRequestComment[]> {
    try {
      const response = await this.octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: pullNumber,
        per_page: 100
      });
      
      return response.data.map(comment => ({
        id: comment.id.toString(),
        user: {
          id: comment.user?.id?.toString() || '',
          platform: 'github',
          externalId: comment.user?.node_id || '',
          login: comment.user?.login || 'unknown',
          name: comment.user?.name || comment.user?.login || 'Unknown User',
          email: '',
          avatarUrl: comment.user?.avatar_url || '',
          url: comment.user?.html_url || ''
        },
        body: comment.body || '',
        createdAt: new Date(comment.created_at),
        updatedAt: new Date(comment.updated_at),
        path: comment.path,
        diffHunk: comment.diff_hunk,
        position: comment.position,
        originalPosition: comment.original_position,
        commitId: comment.commit_id,
        originalCommitId: comment.original_commit_id,
        inReplyToId: comment.in_reply_to_id?.toString()
      }));
    } catch (error) {
      return this.handleError(error, { owner, repo, pullNumber });
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
      const response = await this.octokit.rateLimit.get();
      const { resources } = response.data;
      
      return {
        limit: resources.core.limit,
        remaining: resources.core.remaining,
        reset: new Date(resources.core.reset * 1000),
        used: resources.core.used
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle errors from the GitHub API
   */
  private handleError(error: unknown, context?: {
    owner?: string;
    repo?: string;
    pullNumber?: number;
  }): never {
    if (error instanceof RequestError) {
      if (error.status === 404) {
        throw new VCSError(
          `Resource not found: ${context?.owner ? `${context.owner}/` : ''}${context?.repo || ''} ${context?.pullNumber ? `#${context.pullNumber}` : ''}`,
          'github',
          'RESOURCE_NOT_FOUND',
          { 
            owner: context?.owner,
            repo: context?.repo,
            pullNumber: context?.pullNumber,
            statusCode: 404
          }
        );
      }
      
      if (error.status === 403 && error.message.includes('rate limit')) {
        const rateLimitReset = error.response?.headers?.['x-ratelimit-reset'];
        const resetTime = rateLimitReset 
          ? parseInt(rateLimitReset as string, 10) * 1000
          : Date.now() + 60 * 60 * 1000; // Default: 1 hour
        
        throw new VCSError(
          'API rate limit exceeded. Please try again later.',
          'github',
          'RATE_LIMIT_EXCEEDED',
          {
            rateLimitReset: resetTime,
            retryAfter: resetTime - Date.now(),
            platform: 'github'
          }
        );
      }
      
      if (error.status === 401) {
        throw new VCSError(
          'Authentication failed. Please check your token.',
          'github',
          'UNAUTHORIZED',
          { statusCode: 401 }
        );
      }
      
      if (error.status === 403) {
        throw new VCSError(
          'Permission denied. You do not have access to this resource.',
          'github',
          'PERMISSION_DENIED',
          { 
            statusCode: 403,
            owner: context?.owner,
            repo: context?.repo
          }
        );
      }
      
      throw new VCSError(
        `GitHub API error: ${error.message}`,
        'github',
        'API_ERROR',
        { 
          statusCode: error.status,
          path: error.request?.url || '',
          message: error.message
        }
      );
    }
    
    // Network errors or other unexpected errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new VCSError(
      `Unexpected error: ${errorMessage}`,
      'github',
      'NETWORK_ERROR',
      { originalError: errorMessage }
    );
  }
}
