# PR Reviewer Tests

## About Our Testing Approach

This project follows a specific testing approach outlined in the `TESTING_STRATEGY.md` file, prioritizing manual testing for complex scenarios while maintaining simple automated tests for core functionality.

## Current Test Status

Many of the tests in this directory are intentionally skipped as part of our testing strategy. The PR Reviewer application has evolved to focus more on real-world, manual testing rather than maintaining complex automated test suites.

## Test Organization

The tests are organized as follows:

1. **Basic Tests** - Simple tests that verify core functionality and module structure
   - `basic-test.ts` - Basic functionality tests
   - `minimal-index.test.ts` - Module export verification

2. **Auth Tests** - Tests for authentication functionality
   - `auth-service*.test.ts` - Auth service tests
   - `email-auth.test.ts` - Email authentication tests

3. **Complex Tests** (Most are skipped)
   - Repository service tests
   - Platform-specific tests
   - Error handling tests
   - Integration tests

## Running Tests

To run the basic test suite:

```bash
npm run test:simplified
```

To run all tests (not recommended):

```bash
npm test
```

## Test Mocks

Many of the tests use mocks to avoid external dependencies:

1. `jest-setup.js` - Global test setup and mocks
2. `mock-database-service.ts` - Mock implementation of DatabaseService

## Adding New Tests

When adding new tests, please follow these guidelines:

1. Focus on testing basic functionality and exports
2. Avoid complex tests that would be brittle or difficult to maintain
3. For complex scenarios, create a manual test case in `MANUAL_TESTS.md`
4. Use the existing mock implementations where possible

## Documentation

For more information about our testing approach, please refer to:

- `TESTING_STRATEGY.md` - Our overall testing strategy
- `SKIP_TESTS.md` - Information about skipped tests
- `MANUAL_TESTS.md` - Manual test scenarios

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
