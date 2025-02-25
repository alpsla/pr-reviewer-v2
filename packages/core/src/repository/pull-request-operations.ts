import { VCSPlatform } from '../vcs';
import { BaseRepositoryService } from './base-repository-service';
import { convertVCSPullRequest, convertVCSPullRequestFile } from './converters';
import { RepositoryOperations } from './repository-operations';
import { logger } from '../utils/logger';
import type {
  PullRequest,
  PullRequestFile,
  PullRequestDetails,
  PullRequestListOptions,
  PaginatedResponse
} from './types';

export class PullRequestOperations extends BaseRepositoryService {
  private repoOps: RepositoryOperations;

  constructor(
    db: any,
    tokens: { github?: string; gitlab?: string; } = {},
    baseUrls?: { github?: string; gitlab?: string; }
  ) {
    super(db, tokens, baseUrls);
    this.repoOps = new RepositoryOperations(db, tokens, baseUrls);
  }

  /**
   * Get repository from the repository operations service
   */
  private async getRepository(platform: VCSPlatform, owner: string, repo: string) {
    return this.repoOps.getRepository(platform, owner, repo);
  }
  public async getPullRequest(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    number: number
  ): Promise<PullRequest> {
    try {
      // Get repository first to ensure it exists
      const repository = await this.getRepository(platform, owner, repo);
      
      // Check cache first
      const cachedPR = await this.db.getPullRequestByNumber(repository.id, number)
        .catch(() => null);
      
      if (cachedPR && new Date(cachedPR.updated_at).getTime() > Date.now() - 3600000) {
        return {
          id: cachedPR.id,
          platform,
          externalId: cachedPR.external_id,
          number: cachedPR.number,
          repository: {
            id: repository.id,
            owner: repository.owner,
            name: repository.name
          },
          title: cachedPR.title,
          body: cachedPR.description,
          state: cachedPR.state as 'open' | 'closed' | 'merged',
          draft: cachedPR.is_draft,
          createdAt: new Date(cachedPR.created_at),
          updatedAt: new Date(cachedPR.updated_at),
          closedAt: cachedPR.metadata?.closed_at ? new Date(cachedPR.metadata.closed_at) : null,
          mergedAt: cachedPR.metadata?.merged_at ? new Date(cachedPR.metadata.merged_at) : null,
          url: cachedPR.url,
          baseRef: cachedPR.base_branch,
          baseSha: cachedPR.metadata?.base_sha,
          headRef: cachedPR.head_branch,
          headSha: cachedPR.metadata?.head_sha,
          author: {
            id: cachedPR.metadata?.author_id,
            login: cachedPR.author,
            name: cachedPR.metadata?.author_name,
            avatarUrl: cachedPR.metadata?.author_avatar_url
          },
          labels: cachedPR.metadata?.labels || []
        };
      }
      
      // Get from VCS API
      const client = this.getClientForPlatform(platform);
      const vcsPR = await client.getPullRequest(owner, repo, number);
      const pullRequest = convertVCSPullRequest(vcsPR);
      
      // Save to database
      const savedPR = await this.db.createPullRequest({
        id: cachedPR?.id,
        repository_id: repository.id,
        number: pullRequest.number,
        title: pullRequest.title,
        body: pullRequest.body,
        state: pullRequest.state,
        is_draft: pullRequest.draft,
        created_at: pullRequest.createdAt.toISOString(),
        updated_at: pullRequest.updatedAt.toISOString(),
        url: pullRequest.url,
        base_ref: pullRequest.baseRef,
        base_sha: pullRequest.baseSha,
        head_ref: pullRequest.headRef,
          head_sha: pullRequest.headSha,
        metadata: {
          closed_at: pullRequest.closedAt?.toISOString(),
          merged_at: pullRequest.mergedAt?.toISOString(),
          labels: pullRequest.labels,
          url: pullRequest.url,
          author_id: pullRequest.author.id,
          author_name: pullRequest.author.name,
          author_avatar_url: pullRequest.author.avatarUrl,
          base_sha: pullRequest.baseSha,
          head_sha: pullRequest.headSha
        }
      });
      
      return {
        ...pullRequest,
        id: savedPR.id
      };
    } catch (error) {
      this.handleVCSError(error, { platform, owner, repo, pullNumber: number });
    }
  }

  public async getPullRequestFiles(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    number: number
  ): Promise<PullRequestFile[]> {
    try {
      await this.getPullRequest(platform, owner, repo, number);
      const client = this.getClientForPlatform(platform);
      const files = await client.getPullRequestFiles(owner, repo, number);
      return files.map(file => convertVCSPullRequestFile(file));
    } catch (error) {
      this.handleVCSError(error, { platform, owner, repo, pullNumber: number });
    }
  }

  public async getPullRequestDetails(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    number: number
  ): Promise<PullRequestDetails> {
    try {
      const pullRequest = await this.getPullRequest(platform, owner, repo, number);
      const files = await this.getPullRequestFiles(platform, owner, repo, number);
      const client = this.getClientForPlatform(platform);
      
      const [commits, reviews, comments] = await Promise.all([
        client.getPullRequestCommits(owner, repo, number),
        client.getPullRequestReviews(owner, repo, number),
        client.getPullRequestComments(owner, repo, number)
      ]);
      
      return {
        pullRequest,
        files,
        commits,
        reviews,
        comments
      };
    } catch (error) {
      this.handleVCSError(error, { platform, owner, repo, pullNumber: number });
    }
  }

  public async listPullRequests(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    options?: PullRequestListOptions
  ): Promise<PaginatedResponse<PullRequest>> {
    try {
      const repository = await this.getRepository(platform, owner, repo);
      const client = this.getClientForPlatform(platform);
      
      const result = await client.listPullRequests(owner, repo, options);
      
      const pullRequests = await Promise.all(
        result.data.map(async vcsPR => {
          const pullRequest = convertVCSPullRequest(vcsPR);
          
          try {
            const existingPR = await this.db.getPullRequestByNumber(
              repository.id,
              pullRequest.number
            ).catch(() => null);
            
            const savedPR = await this.db.createPullRequest({
              id: existingPR?.id,
              repository_id: repository.id,
              number: pullRequest.number,
              title: pullRequest.title,
              body: pullRequest.body,
              state: pullRequest.state,
              is_draft: pullRequest.draft,
              created_at: pullRequest.createdAt.toISOString(),
              updated_at: pullRequest.updatedAt.toISOString(),
              url: pullRequest.url,
              base_ref: pullRequest.baseRef,
              base_sha: pullRequest.baseSha,
              head_ref: pullRequest.headRef,
              head_sha: pullRequest.headSha,
              metadata: {
                closed_at: pullRequest.closedAt?.toISOString(),
                merged_at: pullRequest.mergedAt?.toISOString(),
                labels: pullRequest.labels,
                url: pullRequest.url,
                author_id: pullRequest.author.id,
                author_name: pullRequest.author.name,
                author_avatar_url: pullRequest.author.avatarUrl,
                base_sha: pullRequest.baseSha,
                head_sha: pullRequest.headSha
              }
            });
            
            return {
              ...pullRequest,
              id: savedPR.id
            };
          } catch (err) {
            logger.error('Failed to save pull request to database:', err);
            return pullRequest;
          }
        })
      );
      
      return {
        data: pullRequests.filter(pr => pr !== null) as PullRequest[],
        pagination: result.pagination
      };
    } catch (error) {
      this.handleVCSError(error, { platform, owner, repo });
    }
  }
}