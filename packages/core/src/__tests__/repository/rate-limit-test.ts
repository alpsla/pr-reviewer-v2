import { RepositoryError, createRateLimitError } from '../../repository/repository-error';

describe('Rate Limit Error Tests', () => {
  it('should create rate limit error with correct properties', () => {
    // Direct test of the error creation without mocking
    const resetTime = new Date(Date.now() + 3600000);
    const error = createRateLimitError('github', resetTime);
    
    // Verify basic properties
    expect(error).toBeInstanceOf(RepositoryError);
    expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(error.isRateLimitError()).toBe(true);
    
    // Check retryAfter via method
    const retryAfter = error.getRetryAfter();
    expect(typeof retryAfter).toBe('number');
    expect(retryAfter).toBeGreaterThan(0);
    
    // Check details
    expect(error.details).toBeDefined();
    expect(error.details?.resetTime).toEqual(resetTime);
  });
});
