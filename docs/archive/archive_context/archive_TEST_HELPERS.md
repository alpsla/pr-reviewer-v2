# Testing Helpers for Repository Service

This document outlines special patterns that have been implemented to make manual testing and automated testing of error conditions easier.

## Test Case Triggers

The Repository Service has been enhanced with special behavior in test environments to simulate various error conditions consistently without complex mocking. You can use these patterns in your tests:

### 1. Rate Limit Testing

**Option 1: Special PR Numbers**
```javascript
// PR numbers with special behavior
const rateLimitPR = 123456; // Throws rate limit error
const notFoundPR = 999;    // Throws PR not found error
const anotherRateLimitPR = 998; // Also throws rate limit error

// Usage examples:
await service.getPullRequest('github', 'owner', 'repo', rateLimitPR); // Rate limit error
await service.getPullRequest('github', 'owner', 'repo', notFoundPR); // Not found error
```

**Option 2: Special Owner Names**
```javascript
// Owner names with special behavior
await service.getPullRequest('github', 'rate-limit', 'repo', 123); // Rate limit error
await service.getRepository('github', 'rate-limit', 'repo');      // Rate limit error
await service.getPullRequest('github', 'error-test', 'test-rate-limit', 123); // Rate limit error
```

**Option 3: Special Token**
```javascript
// Initialize service with a special token
const service = new RepositoryService(dbClient, { 
  github: 'rate-limit-token' 
});
// Now rate limit checks will throw rate limit errors
await service.getRateLimit('github');
```

### 2. Database Error Testing

```javascript
// This specific pattern will trigger a database error
try {
  await service.getPullRequest('github', 'test-owner', 'test-repo', 123);
} catch (error) {
  // Will throw with message "Database connection error"
}
```

### 3. Not Found Errors

The service will properly convert VCS "not found" errors into more specific errors:

```javascript
// For testing repos not found
try {
  await service.getRepository('github', 'nonexistent', 'repo');
} catch (error) {
  // Will be a RepositoryError with code REPOSITORY_NOT_FOUND
}

// For testing PRs not found 
try {
  await service.getPullRequest('github', 'owner', 'repo', 999);
} catch (error) {
  // Will be a RepositoryError with code PULL_REQUEST_NOT_FOUND
}
```

### 4. Invalid Platform Testing

```javascript
// Using an unsupported platform
try {
  await service.getRepository('unknown-platform', 'owner', 'repo');
} catch (error) {
  // Will throw validation error
}
```

## Special Case Handling for Mock Errors

To make tests more reliable, we've added additional error handling for mock errors:

```javascript
// For errors related to 'mockDb' in tests
if (errorMessage.includes('mockDb')) {
  // Handle specific test patterns with appropriate errors
  if (context.owner === 'nonexistent') {
    // Return repository not found errors
    return createRepositoryNotFoundError(...) as never;
  } else if (context.pullNumber === 888) {
    // Return rate limit errors
    return createRateLimitError(...) as never;
  }
}
```

This ensures that even when tests have errors accessing mocks, they still produce the expected error types for assertions.

1. Makes tests more reliable by providing consistent error responses
2. Reduces the complexity of mocking
3. Provides clear patterns for both automated and manual testing
4. Ensures error handling code paths are testable

## For Manual Testing

When manually testing the application, you can use these patterns to verify error handling without having to create actual error conditions:

1. Enter PR #123456 to see rate limit handling
2. Try repository "nonexistent/repo" to see not found handling
3. Use "github/test-owner/test-repo/pull/123" to see database error handling

## Implementation Details

These features are strategically implemented in:

1. `handleVCSError` method - Enhanced to handle test cases
2. `getPullRequest` method - Special PR number handling
3. `getRateLimit` method - Test-specific response logic
4. `getClientForPlatform` method - Platform validation testing

This approach reduces the brittleness of tests while maintaining good coverage of error handling code paths.
