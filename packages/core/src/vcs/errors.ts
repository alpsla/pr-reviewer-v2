/* eslint-disable @typescript-eslint/no-explicit-any */
import { VCSPlatform } from './types';

/**
 * Error codes specific to VCS operations
 */
export type VCSErrorCode = 
  // Authentication errors
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED'
  | 'INSUFFICIENT_SCOPE'
  
  // Resource errors
  | 'RESOURCE_NOT_FOUND'
  | 'REPOSITORY_NOT_FOUND'
  | 'PULL_REQUEST_NOT_FOUND'
  | 'USER_NOT_FOUND'
  
  // Permission errors
  | 'PERMISSION_DENIED'
  | 'PRIVATE_REPO_ACCESS_DENIED'
  
  // Rate limiting
  | 'RATE_LIMIT_EXCEEDED'
  | 'ABUSE_DETECTION_TRIGGERED'
  
  // Network/service errors
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'GATEWAY_TIMEOUT'
  
  // Client errors
  | 'VALIDATION_ERROR'
  | 'MALFORMED_REQUEST'
  
  // Generic errors
  | 'API_ERROR'
  | 'UNEXPECTED_RESPONSE'
  | 'UNKNOWN_ERROR';

/**
 * Standardized error class for VCS operations
 */
export class VCSError extends Error {
  readonly platform: VCSPlatform;
  readonly code: VCSErrorCode;
  readonly details?: Record<string, any>;
  readonly originalError?: Error | unknown;
  
  constructor(
    message: string,
    platform: VCSPlatform,
    code: VCSErrorCode,
    details?: Record<string, any>,
    originalError?: Error | unknown
  ) {
    super(message);
    this.name = 'VCSError';
    this.platform = platform;
    this.code = code;
    this.details = details;
    this.originalError = originalError;
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, VCSError.prototype);
  }
  
  /**
   * Check if this error is related to rate limiting
   */
  isRateLimitError(): boolean {
    return this.code === 'RATE_LIMIT_EXCEEDED' || this.code === 'ABUSE_DETECTION_TRIGGERED';
  }
  
  /**
   * Check if this error is related to authentication
   */
  isAuthError(): boolean {
    return [
      'UNAUTHORIZED',
      'TOKEN_EXPIRED',
      'INSUFFICIENT_SCOPE'
    ].includes(this.code);
  }
  
  /**
   * Check if this error is related to permissions
   */
  isPermissionError(): boolean {
    return [
      'PERMISSION_DENIED',
      'PRIVATE_REPO_ACCESS_DENIED'
    ].includes(this.code);
  }
  
  /**
   * Check if this error is related to a resource not being found
   */
  isNotFoundError(): boolean {
    return [
      'RESOURCE_NOT_FOUND',
      'REPOSITORY_NOT_FOUND',
      'PULL_REQUEST_NOT_FOUND',
      'USER_NOT_FOUND'
    ].includes(this.code);
  }
  
  /**
   * Check if this error is related to network issues
   */
  isNetworkError(): boolean {
    return [
      'NETWORK_ERROR',
      'TIMEOUT',
      'SERVER_ERROR',
      'SERVICE_UNAVAILABLE',
      'GATEWAY_TIMEOUT'
    ].includes(this.code);
  }
  
  /**
   * Get retry delay if applicable
   */
  getRetryAfter(): number | null {
    if (this.isRateLimitError() && this.details?.retryAfter) {
      return this.details.retryAfter;
    }
    return null;
  }
}

/**
 * Factory functions to create common VCS errors
 */

export function createRepositoryNotFoundError(
  platform: VCSPlatform,
  owner: string,
  repo: string
): VCSError {
  return new VCSError(
    `Repository not found: ${owner}/${repo}`,
    platform,
    'REPOSITORY_NOT_FOUND',
    { owner, repo }
  );
}

export function createPullRequestNotFoundError(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  number: number
): VCSError {
  return new VCSError(
    `Pull request not found: ${owner}/${repo}#${number}`,
    platform,
    'PULL_REQUEST_NOT_FOUND',
    { owner, repo, number }
  );
}

export function createPermissionDeniedError(
  platform: VCSPlatform,
  resource: string,
  details?: Record<string, any>
): VCSError {
  return new VCSError(
    `Permission denied for ${resource}`,
    platform,
    'PERMISSION_DENIED',
    details
  );
}

export function createRateLimitError(
  platform: VCSPlatform,
  resetTime: Date,
  details?: Record<string, any>
): VCSError {
  const now = new Date();
  const waitTimeMs = Math.max(0, resetTime.getTime() - now.getTime());
  const waitTimeSec = Math.ceil(waitTimeMs / 1000);
  
  return new VCSError(
    `Rate limit exceeded. Retry after ${waitTimeSec} seconds`,
    platform,
    'RATE_LIMIT_EXCEEDED',
    {
      retryAfter: waitTimeMs,
      rateLimitReset: resetTime,
      ...details
    }
  );
}

export function createUnauthorizedError(
  platform: VCSPlatform,
  details?: Record<string, any>
): VCSError {
  return new VCSError(
    `Unauthorized. Please check your credentials`,
    platform,
    'UNAUTHORIZED',
    details
  );
}
