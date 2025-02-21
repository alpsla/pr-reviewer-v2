/* eslint-disable @typescript-eslint/no-explicit-any */
import { VCSPlatform } from '../vcs/types';
import { RepositoryErrorCode } from './types';

/**
 * Custom error class for repository-related errors
 */
export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;
  readonly platform?: VCSPlatform;
  readonly owner?: string;
  readonly repo?: string;
  readonly pullNumber?: number;
  readonly details?: Record<string, any>;
  readonly originalError?: Error | unknown;
  readonly retryAfter?: number;
  readonly reset?: Date;
  
  constructor(
    message: string,
    code: RepositoryErrorCode,
    options?: {
      platform?: VCSPlatform;
      owner?: string;
      repo?: string;
      pullNumber?: number;
      details?: Record<string, any>;
      originalError?: Error | unknown;
    }
  ) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
    this.platform = options?.platform;
    this.owner = options?.owner;
    this.repo = options?.repo;
    this.pullNumber = options?.pullNumber;
    this.details = options?.details;
    this.originalError = options?.originalError;
    
    // Set rate limit properties if present in details
    if (this.code === 'RATE_LIMIT_EXCEEDED' && this.details) {
      this.retryAfter = this.details.retryAfter;
      this.reset = this.details.resetTime;
    }
    
    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
  
  /**
   * Check if error is related to an item not being found
   */
  isNotFoundError(): boolean {
    return [
      'REPOSITORY_NOT_FOUND',
      'PULL_REQUEST_NOT_FOUND'
    ].includes(this.code);
  }
  
  /**
   * Check if error is related to permissions
   */
  isPermissionError(): boolean {
    return this.code === 'PERMISSION_DENIED';
  }
  
  /**
   * Check if error is related to rate limiting
   */
  isRateLimitError(): boolean {
    return this.code === 'RATE_LIMIT_EXCEEDED';
  }
  
  /**
   * Check if error is related to network issues
   */
  isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR';
  }
  
  /**
   * Get human-readable error message with context
   */
  getDisplayMessage(): string {
    switch (this.code) {
      case 'REPOSITORY_NOT_FOUND':
        return `Repository not found: ${this.owner}/${this.repo}`;
      case 'PULL_REQUEST_NOT_FOUND':
        return `Pull request not found: ${this.owner}/${this.repo}#${this.pullNumber}`;
      case 'PERMISSION_DENIED':
        return `You don't have permission to access ${this.owner}/${this.repo}${this.pullNumber ? `#${this.pullNumber}` : ''}`;
      case 'RATE_LIMIT_EXCEEDED':
        return `Rate limit exceeded for ${this.platform}. Please try again later.`;
      case 'NOT_IMPLEMENTED':
        return `This feature is not yet implemented for ${this.platform}.`;
      default:
        return this.message;
    }
  }
  
  /**
   * Get retry after time in milliseconds if applicable
   */
  getRetryAfter(): number | null {
    if (this.isRateLimitError()) {
      return this.retryAfter || null;
    }
    return null;
  }
}

/**
 * Create repository not found error
 */
export function createRepositoryNotFoundError(
  platform: VCSPlatform,
  owner: string,
  repo: string
): RepositoryError {
  return new RepositoryError(
    `Repository not found: ${owner}/${repo}`,
    'REPOSITORY_NOT_FOUND',
    { 
      platform, 
      owner, 
      repo, 
      details: { platform, owner, repo },
      originalError: undefined
    }
  );
}

/**
 * Create pull request not found error
 */
export function createPullRequestNotFoundError(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  pullNumber: number
): RepositoryError {
  return new RepositoryError(
    `Pull request not found: ${owner}/${repo}#${pullNumber}`,
    'PULL_REQUEST_NOT_FOUND',
    { 
      platform, 
      owner, 
      repo, 
      pullNumber,
      details: { platform, owner, repo, pullNumber },
      originalError: undefined
    }
  );
}

/**
 * Create permission denied error
 */
export function createPermissionDeniedError(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  pullNumber?: number
): RepositoryError {
  const resource = pullNumber 
    ? `${owner}/${repo}#${pullNumber}` 
    : `${owner}/${repo}`;
  
  return new RepositoryError(
    `Permission denied for ${resource}`,
    'PERMISSION_DENIED',
    { 
      platform, 
      owner, 
      repo, 
      pullNumber,
      details: { platform, owner, repo, pullNumber, resource },
      originalError: undefined
    }
  );
}

/**
 * Create rate limit exceeded error
 */
export function createRateLimitError(
  platform: VCSPlatform,
  resetTime: Date
): RepositoryError {
  const waitTimeSec = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
  const retryAfter = resetTime.getTime() - Date.now();
  
  return new RepositoryError(
    `Rate limit exceeded. Retry after ${waitTimeSec} seconds`,
    'RATE_LIMIT_EXCEEDED',
    {
      platform,
      details: {
        retryAfter,
        resetTime,
        platform
      },
      originalError: undefined
    }
  );
}

/**
 * Create not implemented error
 */
export function createNotImplementedError(
  platform: VCSPlatform,
  feature: string
): RepositoryError {
  return new RepositoryError(
    `Feature "${feature}" is not implemented for ${platform}`,
    'NOT_IMPLEMENTED',
    { 
      platform,
      details: { platform, feature },
      originalError: undefined
    }
  );
}
