import { VCSPlatform, PlatformErrorCode } from '../types/platform';

interface ErrorDetails {
  platform?: VCSPlatform;
  owner?: string;
  repo?: string;
  pullNumber?: number;
  details?: {
    resetTime?: string;
    platform?: VCSPlatform;
    [key: string]: unknown;
  };
  originalError?: Error;
}

/**
 * Error class for repository operations
 */
export class RepositoryError extends Error {
  readonly code: PlatformErrorCode;
  readonly details?: ErrorDetails;
  readonly platform?: VCSPlatform;
  readonly owner?: string;
  readonly repo?: string;
  readonly retryAfter?: number;
  readonly reset?: Date;

  constructor(
    message: string,
    code: PlatformErrorCode,
    details?: ErrorDetails
  ) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
    this.details = details;
    
    // Set platform, owner, repo for convenience
    this.platform = details?.platform;
    this.owner = details?.owner;
    this.repo = details?.repo;
    
    // Add rate limit properties
    if (code === PlatformErrorCode.RATE_LIMIT_EXCEEDED && details?.details?.resetTime) {
      const resetTime = new Date(details.details.resetTime);
      this.retryAfter = Math.max(0, resetTime.getTime() - Date.now());
      this.reset = resetTime;
    }
    
    // Preserve instanceof checks in ES5
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }

  /**
   * Check if this is a not found error
   */
  isNotFoundError(): boolean {
    return this.code === PlatformErrorCode.REPOSITORY_NOT_FOUND ||
           this.code === PlatformErrorCode.PULL_REQUEST_NOT_FOUND;
  }

  /**
   * Check if this is a permission error
   */
  isPermissionError(): boolean {
    return this.code === PlatformErrorCode.PERMISSION_DENIED ||
           this.code === PlatformErrorCode.ACCESS_DENIED ||
           this.code === PlatformErrorCode.UNAUTHORIZED;
  }

  /**
   * Check if this is a rate limit error
   */
  isRateLimitError(): boolean {
    return this.code === PlatformErrorCode.RATE_LIMIT_EXCEEDED;
  }

  /**
   * Check if this is a network error
   */
  isNetworkError(): boolean {
    return this.code === PlatformErrorCode.NETWORK_ERROR;
  }

  /**
   * Get retry after duration in milliseconds for rate limit errors
   */
  getRetryAfter(): number {
    if (!this.isRateLimitError() || !this.details?.details?.resetTime) {
      return 60000; // Default to 1 minute if no reset time available
    }

    const resetTime = new Date(this.details.details.resetTime);
    return Math.max(0, resetTime.getTime() - Date.now());
  }

  /**
   * Get human readable error message
   */
  getDisplayMessage(): string {
    switch (this.code) {
      case PlatformErrorCode.REPOSITORY_NOT_FOUND:
        return 'Repository not found. Please check the repository exists and you have access to it.';
      
      case PlatformErrorCode.PULL_REQUEST_NOT_FOUND:
        return 'Pull request not found. Please check the pull request exists and you have access to it.';
      
      case PlatformErrorCode.PERMISSION_DENIED:
      case PlatformErrorCode.ACCESS_DENIED:
      case PlatformErrorCode.UNAUTHORIZED:
        return 'Permission denied. Please check your access rights to this repository.';
      
      case PlatformErrorCode.NOT_IMPLEMENTED:
        return 'This operation is not supported for the selected platform.';
      
      case PlatformErrorCode.RATE_LIMIT_EXCEEDED:
        const retryAfter = Math.ceil(this.getRetryAfter() / 1000);
        return `Rate limit exceeded. Please try again in ${retryAfter} seconds.`;
      
      default:
        return this.message;
    }
  }
}

/**
 * Create a repository not found error
 */
export function createRepositoryNotFoundError(
  platform: VCSPlatform,
  owner: string,
  repo: string
): RepositoryError {
  return new RepositoryError(
    `Repository not found: ${owner}/${repo}`,
    PlatformErrorCode.REPOSITORY_NOT_FOUND,
    { platform, owner, repo }
  );
}

/**
 * Create a pull request not found error
 */
export function createPullRequestNotFoundError(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  number: number
): RepositoryError {
  return new RepositoryError(
    `Pull request not found: ${owner}/${repo}#${number}`,
    PlatformErrorCode.PULL_REQUEST_NOT_FOUND,
    { platform, owner, repo, pullNumber: number }
  );
}

/**
 * Create a permission denied error
 */
export function createPermissionDeniedError(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  pullNumber?: number
): RepositoryError {
  const resource = pullNumber 
    ? `pull request #${pullNumber} in ${owner}/${repo}`
    : `repository ${owner}/${repo}`;
    
  return new RepositoryError(
    `Permission denied for ${resource}`,
    PlatformErrorCode.PERMISSION_DENIED,
    { platform, owner, repo, pullNumber }
  );
}

/**
 * Create a rate limit error
 */
export function createRateLimitError(
  platform: VCSPlatform,
  resetTime: Date
): RepositoryError {
  return new RepositoryError(
    `Rate limit exceeded for ${platform}. Retry after ${resetTime.toISOString()}`,
    PlatformErrorCode.RATE_LIMIT_EXCEEDED,
    {
      platform,
      details: {
        resetTime: resetTime.toISOString(),
        platform
      }
    }
  );
}

/**
 * Create a not implemented error
 */
export function createNotImplementedError(
  platform: VCSPlatform,
  feature: string
): RepositoryError {
  return new RepositoryError(
    `${feature} not implemented for ${platform}`,
    PlatformErrorCode.NOT_IMPLEMENTED,
    { platform, details: { feature } }
  );
}

/**
 * Create a validation error
 */
export function createValidationError(
  message: string,
  details?: Record<string, unknown>
): RepositoryError {
  return new RepositoryError(
    message,
    PlatformErrorCode.VALIDATION_ERROR,
    { details }
  );
}

/**
 * Create an unexpected error
 */
export function createUnexpectedError(
  message: string,
  originalError?: Error
): RepositoryError {
  return new RepositoryError(
    message,
    PlatformErrorCode.UNEXPECTED_ERROR,
    { originalError }
  );
}
