/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { RepositoryError } from '../../../repository/repository-error';

/**
 * Utility to assert that an error is a valid rate limit error
 * compatible with the actual implementation of RepositoryError
 */
export function assertRateLimitError(error: any) {
  // Check it's a RepositoryError
  expect(error).toBeInstanceOf(RepositoryError);
  
  // Check basic properties
  expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
  expect(error.isRateLimitError()).toBe(true);
  
  // Check retry via method - the proper way to access it
  const retryAfter = error.getRetryAfter();
  expect(typeof retryAfter).toBe('number');
  expect(retryAfter).toBeGreaterThan(0);
  
  // Check details object for resetTime
  expect(error.details).toBeDefined();
  if (error.details) {
    expect(error.details.resetTime instanceof Date || 
           typeof error.details.resetTime === 'number' ||
           typeof error.details.resetTime === 'string').toBe(true);
  }
}
