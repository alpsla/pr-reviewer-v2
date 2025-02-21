# Simplified Repository Tests

This directory contains the simplified test suite for the repository module. These tests are designed to be more maintainable while still providing good coverage of core functionality.

## Test Files

### Core Tests

- `basic-test.ts`: Simple initialization tests with minimal dependencies
- `simplified-tests.ts`: Core functionality tests with lightweight mocking
- `simplified-platform.test.ts`: Platform support tests (GitHub/GitLab)
- `simplified-error.test.ts`: Error handling and creation tests
- `minimal-index.test.ts`: Tests for module exports and API structure

### Support Files

- `mock-database-service.ts`: A robust mock implementation of DatabaseService
- `types.ts`: TypeScript type definitions for testing

## Running Tests

To run only the simplified tests:

```bash
# Run all simplified tests
pnpm test:simplified

# Run specific test files
npx jest --testPathPattern=simplified
```

## Test Design Principles

1. **Minimal Mocking**: Use the simplest mocking approach that works
2. **Type Safety**: Use proper TypeScript types instead of 'any'
3. **Test Isolation**: Each test should be independent and not rely on global state
4. **Focused Scope**: Test one thing at a time with clear assertions

## Implementation Notes

1. When using `MockDatabaseService` with `RepositoryService`, always use the two-step type casting approach:
   ```typescript
   const service = new RepositoryService(mockDb as unknown as DatabaseService, { github: 'token' });
   ```

2. The `MockDatabaseService` maintains in-memory maps for repositories and pull requests, enabling basic stateful testing.

3. All Map keys are properly converted to strings to avoid TypeScript errors:
   ```typescript
   const repoId = String(id);
   this.repositories.set(repoId, repo);
   ```

## Skipped Tests

Complex tests that are difficult to maintain have been moved to manual testing. See `/docs/SKIPPING_TESTS.md` for details about which tests are skipped and why.

## Manual Testing

For complex scenarios not covered by these simplified tests, please refer to the comprehensive manual testing plan in `/docs/MANUAL_TESTS.md`.
