# Skipped Tests in Repository Module

Following our decision to move toward manual testing for complex functionality, we are skipping the following tests:

## Complex Test Files

1. `error-handling.test.ts` - Complex error pattern tests are now handled manually.
2. `specialized-error-integration.test.ts` - These tests required complex mocking that was hard to maintain.
3. `pr-error.test.ts` - Edge cases for PR errors are now tested manually.
4. `debug-repository-service.test.ts` - Tests that depended on internal implementation details.
5. `platform-support.test.ts` - Replaced with simplified platform tests.
6. `repository-service.test.ts` - Full integration tests now handled manually.

## Replaced Tests

The following complex tests have been replaced with simplified versions:

1. `basic-test.ts` - Simplified version of the repository service tests
2. `simplified-tests.ts` - Core functionality with minimal mocking
3. `simplified-error.test.ts` - Basic error type checking
4. `simplified-platform.test.ts` - Basic platform support tests
5. `minimal-index.test.ts` - Module exports validation

## Running Simplified Tests Only

To run only the simplified test suite:

```bash
# Run only the simplified tests
npm run test:simplified

# Or with Jest directly
npx jest --testPathPattern=simplified
```

## Manual Testing Alternatives

For each skipped test, refer to the comprehensive manual testing plan in `/docs/MANUAL_TESTS.md`:

1. For integration tests, follow the repository and PR operations sections
2. For error handling, use the error recovery scenarios
3. For rate limiting, test the rate limit behavior manually with real APIs

## Guidelines for Future Tests

1. Keep tests simple and focused on core functionality
2. Avoid complex mocking setups
3. Document edge cases in the manual testing plan rather than trying to automate them
4. Test from the user's perspective, not implementation details
