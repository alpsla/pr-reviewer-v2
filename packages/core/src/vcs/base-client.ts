/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  VCSClient, 
  VCSPlatform, 
  VCSRepository, 
  VCSUser, 
  VCSPullRequest,
  VCSFile, 
  VCSCommit, 
  VCSReview, 
  VCSComment, 
  VCSRateLimit,
  ListRepositoriesOptions,
  ListPullRequestsOptions,
  PaginatedResponse
} from './types';
import { VCSError } from './errors';
import { logger } from '../utils/logger';

/**
 * Abstract base client that implements common functionality
 * and error handling for VCS clients
 */
export abstract class BaseVCSClient implements VCSClient {
  protected token: string;
  protected platform: VCSPlatform;
  protected baseUrl: string;
  
  /**
   * Cache for rate limit information
   */
  protected rateLimitCache: {
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
    lastUpdated: Date;
  } | null = null;
  
  constructor(platform: VCSPlatform, token: string, baseUrl: string) {
    this.platform = platform;
    this.token = token;
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get the platform type this client handles
   */
  getPlatform(): VCSPlatform {
    return this.platform;
  }
  
  /**
   * Utility function to handle API requests with error handling,
   * logging, and rate limit tracking
   */
  protected async request<T>(
    method: string,
    operation: () => Promise<T>,
    options: {
      retries?: number;
      retryDelay?: number;
      ignoreRateLimit?: boolean;
    } = {}
  ): Promise<T> {
    const {
      retries = 3,
      retryDelay = 1000,
      ignoreRateLimit = false
    } = options;
    
    // Check rate limit before proceeding
    if (!ignoreRateLimit && this.rateLimitCache && this.rateLimitCache.remaining <= 5) {
      const resetTime = this.rateLimitCache.reset;
      const now = new Date();
      
      if (resetTime > now) {
        const waitTime = resetTime.getTime() - now.getTime();
        throw new VCSError(
          `Rate limit exceeded. Retry after ${Math.ceil(waitTime / 1000)} seconds`,
          this.platform,
          'RATE_LIMIT_EXCEEDED',
          {
            rateLimitRemaining: this.rateLimitCache.remaining,
            rateLimitReset: resetTime,
            retryAfter: waitTime
          }
        );
      }
    }
    
    let lastError: Error | null = null;
    let attempts = 0;
    
    while (attempts <= retries) {
      try {
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;
        
        // Log successful request
        logger.debug(`${this.platform} API - ${method} completed in ${duration}ms`);
        
        return result;
      } catch (error) {
        attempts++;
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if we should retry based on error type
        const shouldRetry = this.isRetryableError(lastError) && attempts <= retries;
        
        logger.error(`${this.platform} API - ${method} failed:`, {
          error: lastError.message,
          attempt: attempts,
          willRetry: shouldRetry
        });
        
        if (shouldRetry) {
          // Calculate backoff with exponential delay and jitter
          const delay = retryDelay * Math.pow(2, attempts - 1) * (0.5 + Math.random() * 0.5);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
    
    // If we got here, all retries failed
    throw this.normalizeError(lastError!);
  }
  
  /**
   * Determine if an error is retryable
   */
  protected isRetryableError(error: any): boolean {
    // Rate limit errors should not be retried through this mechanism
    if (error instanceof VCSError && error.code === 'RATE_LIMIT_EXCEEDED') {
      return false;
    }
    
    // Network errors, 5xx errors, and specific 4xx errors may be retryable
    if (error instanceof VCSError) {
      return [
        'NETWORK_ERROR',
        'TIMEOUT',
        'SERVER_ERROR',
        'SERVICE_UNAVAILABLE',
        'GATEWAY_TIMEOUT'
      ].includes(error.code);
    }
    
    // Default to not retry unknown errors
    return false;
  }
  
  /**
   * Convert platform-specific errors to our standardized VCSError
   */
  protected normalizeError(error: any): Error {
    if (error instanceof VCSError) {
      return error;
    }
    
    // Default conversion
    return new VCSError(
      `${this.platform} API error: ${error.message}`,
      this.platform,
      'API_ERROR',
      { originalError: error }
    );
  }
  
  // Abstract methods that must be implemented by specific clients
  abstract getCurrentUser(): Promise<VCSUser>;
  abstract getRepository(owner: string, name: string): Promise<VCSRepository>;
  abstract listUserRepositories(options?: ListRepositoriesOptions): Promise<PaginatedResponse<VCSRepository>>;
  abstract listOrganizationRepositories(org: string, options?: ListRepositoriesOptions): Promise<PaginatedResponse<VCSRepository>>;
  abstract getPullRequest(owner: string, repo: string, number: number): Promise<VCSPullRequest>;
  abstract listPullRequests(owner: string, repo: string, options?: ListPullRequestsOptions): Promise<PaginatedResponse<VCSPullRequest>>;
  abstract getPullRequestFiles(owner: string, repo: string, number: number): Promise<VCSFile[]>;
  abstract getPullRequestCommits(owner: string, repo: string, number: number): Promise<VCSCommit[]>;
  abstract getPullRequestReviews(owner: string, repo: string, number: number): Promise<VCSReview[]>;
  abstract getPullRequestComments(owner: string, repo: string, number: number): Promise<VCSComment[]>;
  abstract getRateLimit(): Promise<VCSRateLimit>;
}
