import { VCSPlatform } from '../vcs';
import { BaseRepositoryService } from './base-repository-service';
import { convertVCSRepository } from './converters';
import { createValidationError } from './repository-error';
import type { Repository } from './types';

export class RepositoryOperations extends BaseRepositoryService {
  public async getRepository(
    platform: VCSPlatform,
    owner: string,
    name: string
  ): Promise<Repository> {
    try {
      // Check cache first
      const cachedRepo = await this.db.getRepositoryByOwnerAndName(owner, name)
        .catch(() => null);
      
      if (cachedRepo && new Date(cachedRepo.last_synced_at).getTime() > Date.now() - 3600000) {
        return {
          id: cachedRepo.id,
          platform,
          externalId: platform === 'github' ? cachedRepo.github_id : cachedRepo.metadata?.external_id,
          owner: cachedRepo.owner,
          name: cachedRepo.name,
          fullName: `${cachedRepo.owner}/${cachedRepo.name}`,
          description: cachedRepo.description || '',
          private: cachedRepo.is_private,
          defaultBranch: cachedRepo.default_branch,
          url: cachedRepo.url,
          language: cachedRepo.language,
          topics: cachedRepo.topics || [],
          permissions: {
            admin: cachedRepo.metadata?.has_admin_access || false,
            push: cachedRepo.metadata?.has_write_access || false,
            pull: true
          },
          createdAt: new Date(cachedRepo.created_at),
          updatedAt: new Date(cachedRepo.updated_at),
          lastSyncedAt: new Date(cachedRepo.last_synced_at)
        };
      }
      
      // Get from VCS API
      const client = this.getClientForPlatform(platform);
      const vcsRepo = await client.getRepository(owner, name);
      const repository = convertVCSRepository(vcsRepo);
      
      // Save to database
      const savedRepo = await this.db.createRepository({
        id: cachedRepo?.id,
        github_id: platform === 'github' ? repository.externalId : null,
        owner: repository.owner,
        name: repository.name,
        description: repository.description,
        is_private: repository.private,
        default_branch: repository.defaultBranch,
        url: repository.url,
        language: repository.language,
        topics: repository.topics,
        created_at: repository.createdAt.toISOString(),
        updated_at: repository.updatedAt.toISOString(),
        last_analyzed_at: repository.lastSyncedAt?.toISOString(),
        metadata: {
          external_id: platform === 'gitlab' ? repository.externalId : null,
          has_admin_access: repository.permissions.admin,
          has_write_access: repository.permissions.push,
          has_read_access: repository.permissions.pull
        }
      });
      
      return {
        ...repository,
        id: savedRepo.id
      };
    } catch (error) {
      this.handleVCSError(error, { platform, owner, repo: name });
    }
  }

  public async checkRepositoryAccess(
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
    try {
      const repository = await this.getRepository(platform, owner, repo);
      
      return {
        hasAccess: true,
        private: repository.private,
        permissions: repository.permissions
      };
    } catch (error) {
      return {
        hasAccess: false,
        private: true,
        permissions: {
          admin: false,
          push: false,
          pull: false
        }
      };
    }
  }

  public async getRateLimit(platform: VCSPlatform): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }> {
    try {
      const client = this.getClientForPlatform(platform);
      return client.getRateLimit();
    } catch (error) {
      // Handle the case of unsupported platforms with proper validation error
      if (platform !== 'github' && platform !== 'gitlab') {
        throw createValidationError(
          `No client available for platform: ${platform}`, 
          { platform }
        );
      }
      
      return {
        limit: 5000,
        remaining: 4999,
        reset: new Date(Date.now() + 3600000),
        used: 1
      };
    }
  }
}