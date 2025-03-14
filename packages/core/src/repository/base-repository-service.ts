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
    protected readonly tokens: { 
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
      try {
        logger.debug('Initializing GitHub client with token starting with:', tokens.github.substring(0, 5));
        this.githubClient = getVCSClient('github', tokens.github, baseUrls?.github);
        logger.debug('GitHub client initialized successfully');
      } catch (error) {
        logger.error('Error initializing GitHub client:', error);
      }
    } else {
      logger.debug('No GitHub token provided');
    }
    
    if (tokens.gitlab) {
      try {
        logger.debug('Initializing GitLab client with token starting with:', tokens.gitlab.substring(0, 5));
        this.gitlabClient = getVCSClient('gitlab', tokens.gitlab, baseUrls?.gitlab);
        logger.debug('GitLab client initialized successfully');
      } catch (error) {
        logger.error('Error initializing GitLab client:', error);
      }
    } else {
      logger.debug('No GitLab token provided');
    }
  }
  
  protected getClientForPlatform(platform: VCSPlatform): VCSClient {
    // Check if we have clients first
    if (platform === 'github') {
      if (!this.tokens.github) {
        logger.error('No GitHub token available for authentication');
        throw createValidationError(
          `No GitHub token available. Please sign in with GitHub to access GitHub repositories.`,
          { platform }
        );
      }
      
      if (!this.githubClient) {
        // Try to initialize the client just-in-time if possible
        try {
          logger.debug('Just-in-time initialization of GitHub client');
          this.githubClient = getVCSClient('github', this.tokens.github);
        } catch (error) {
          logger.error('Failed to initialize GitHub client:', error);
          throw createValidationError(
            `Failed to initialize GitHub client: ${error instanceof Error ? error.message : String(error)}`,
            { platform }
          );
        }
      }
      
      // At this point, githubClient must be defined
      return this.githubClient!;
    }
    
    if (platform === 'gitlab') {
      if (!this.tokens.gitlab) {
        logger.error('No GitLab token available for authentication');
        throw createValidationError(
          `No GitLab token available. Please sign in with GitLab to access GitLab repositories.`,
          { platform }
        );
      }
      
      if (!this.gitlabClient) {
        // Try to initialize the client just-in-time if possible
        try {
          logger.debug('Just-in-time initialization of GitLab client');
          this.gitlabClient = getVCSClient('gitlab', this.tokens.gitlab);
        } catch (error) {
          logger.error('Failed to initialize GitLab client:', error);
          throw createValidationError(
            `Failed to initialize GitLab client: ${error instanceof Error ? error.message : String(error)}`,
            { platform }
          );
        }
      }
      
      // At this point, gitlabClient must be defined
      return this.gitlabClient!;
    }
    
    // Create a validation error for unsupported platforms
    logger.error(`Unsupported platform: ${platform}`);
    throw createValidationError(
      `Unsupported platform: ${platform}. Currently, only GitHub and GitLab are supported.`,
      { platform }
    );
  }
  
  protected handleVCSError(error: unknown, context: {
    platform: VCSPlatform;
    owner?: string;
    repo?: string;
    pullNumber?: number;
  }): never {
    // Log the error for debugging
    console.error('VCS Error:', {
      error,
      errorType: error?.constructor?.name, 
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      context
    });
    
    // Handle database errors
    if (error instanceof Error && error.message.includes('Database')) {
      throw error;
    }

    // Check for token-related errors first (often manifests as 401 Unauthorized)
    if (error instanceof Error && 
        (error.message.includes('401') || 
         error.message.includes('unauthorized') || 
         error.message.includes('Unauthorized') || 
         error.message.includes('authentication'))) {
      
      logger.error('Authentication error detected:', error.message);
      throw createValidationError(
        `Authentication failed for ${context.platform}. Your token may have expired or doesn't have sufficient permissions. Please sign out and sign in again.`,
        { platform: context.platform }
      );
    }
    
    // Handle VCS errors
    if (error && error instanceof Object && 'platform' in error && 'code' in error) {
      const vcsError = error as VCSError;
      logger.debug('VCS Error code:', (vcsError as any).code, 'Platform:', vcsError.platform);
      
      // Special handling for 404 errors to differentiate between "not found" and "no access"
      if (vcsError.isNotFoundError && vcsError.isNotFoundError()) {
        // If it includes private in the message, it's likely a permissions issue rather than not found
        if (error instanceof Error && 
            (error.message.includes('private') || error.message.toLowerCase().includes('access'))) {
          logger.debug('Private repository access denied detected');
          throw createPermissionDeniedError(
            context.platform,
            context.owner || '',
            context.repo || ''
          );
        }
        
        if (context.pullNumber) {
          throw createPullRequestNotFoundError(
            context.platform,
            context.owner || '',
            context.repo || '',
            context.pullNumber
          );
        }
        
        logger.debug('Repository not found');
        throw createRepositoryNotFoundError(
          context.platform,
          context.owner || '',
          context.repo || ''
        );
      }
      
      if (vcsError.isPermissionError && vcsError.isPermissionError()) {
        logger.debug('Permission denied error detected');
        throw createPermissionDeniedError(
          context.platform,
          context.owner || '',
          context.repo || ''
        );
      }
      
      if (vcsError.isRateLimitError && vcsError.isRateLimitError()) {
        logger.debug('Rate limit error detected');
        throw createRateLimitError(
          context.platform,
          new Date(vcsError.details?.rateLimitReset || Date.now() + 60000)
        );
      }
    }
    
    // Check for common error patterns in message strings
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('not found') || errorMsg.includes('404')) {
        logger.debug('Not found error detected from message');
        throw createRepositoryNotFoundError(
          context.platform,
          context.owner || '',
          context.repo || ''
        );
      }
      
      if (errorMsg.includes('forbidden') || 
          errorMsg.includes('permission') || 
          errorMsg.includes('access denied') || 
          errorMsg.includes('403')) {
        logger.debug('Permission error detected from message');
        throw createPermissionDeniedError(
          context.platform,
          context.owner || '',
          context.repo || ''
        );
      }
    }
    
    // Handle all other errors
    const errorDetail: Error = error instanceof Error ? 
      { name: error.name, message: error.message, stack: error.stack } : 
      { name: 'UnknownError', message: JSON.stringify(error), stack: '' };
    
    logger.error('Unhandled error:', errorDetail);
    throw createUnexpectedError(
      `Unexpected error: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      errorDetail
    );
  }
}