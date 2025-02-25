import { DatabaseService } from '../supabase/database';
import { VCSClient, VCSPlatform } from '../vcs/types';
import { PlatformErrorCode } from '../types/platform';
import { VCSError } from '../vcs/errors';
import { getVCSClient } from '../vcs';
import { logger } from '../utils/logger';
import {
  createRepositoryNotFoundError,
  createPullRequestNotFoundError,
  createPermissionDeniedError,
  createRateLimitError,
  createValidationError,
  createUnexpectedError
} from './repository-error';

export abstract class BaseRepositoryService {
  private githubClient?: VCSClient;
  private gitlabClient?: VCSClient;
  protected readonly db: DatabaseService;
  
  constructor(
    database: DatabaseService,
    private readonly tokens: { 
      github?: string;
      gitlab?: string;
    },
    private readonly baseUrls?: {
      github?: string;
      gitlab?: string;
    }
  ) {
    this.db = database;
    
    if (tokens.github) {
      this.githubClient = getVCSClient('github', tokens.github, baseUrls?.github);
      logger.debug('GitHub client initialized');
    }
    
    if (tokens.gitlab) {
      this.gitlabClient = getVCSClient('gitlab', tokens.gitlab, baseUrls?.gitlab);
      logger.debug('GitLab client initialized');
    }
  }
  
  protected getClientForPlatform(platform: VCSPlatform): VCSClient {
    if (platform === 'github' && this.githubClient) {
      return this.githubClient;
    }
    
    if (platform === 'gitlab' && this.gitlabClient) {
      return this.gitlabClient;
    }
    
    // Create a validation error with the correct error code
    throw createValidationError(
      `No client available for platform: ${platform}. Please check your authentication.`,
      { platform }
    );
  }
  
  protected handleVCSError(error: unknown, context: {
    platform: VCSPlatform;
    owner?: string;
    repo?: string;
    pullNumber?: number;
  }): never {
    // Handle database errors
    if (error instanceof Error && error.message.includes('Database')) {
      throw error;
    }

    // Handle VCS errors
    if (error && error instanceof Object && 'platform' in error && 'code' in error) {
      const vcsError = error as VCSError;
      
      if (vcsError.isNotFoundError && vcsError.isNotFoundError()) {
        if (context.pullNumber) {
          throw createPullRequestNotFoundError(
            context.platform,
            context.owner || '',
            context.repo || '',
            context.pullNumber
          );
        }
        throw createRepositoryNotFoundError(
          context.platform,
          context.owner || '',
          context.repo || ''
        );
      }
      
      if (vcsError.isPermissionError && vcsError.isPermissionError()) {
        throw createPermissionDeniedError(
          context.platform,
          context.owner || '',
          context.repo || ''
        );
      }
      
      if (vcsError.isRateLimitError && vcsError.isRateLimitError()) {
        throw createRateLimitError(
          context.platform,
          new Date(vcsError.details?.rateLimitReset || Date.now() + 60000)
        );
      }
    }
    
    // Handle all other errors
    throw createUnexpectedError(
      `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      error instanceof Error ? error : undefined
    );
  }
}