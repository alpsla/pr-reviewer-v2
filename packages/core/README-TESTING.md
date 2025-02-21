# Testing and Linting Guidelines

## Overview

This document provides an overview of the testing strategy and linting configuration for the PR Reviewer Core package.

## Testing Strategy

As outlined in our manual testing plan (`/docs/MANUAL_TESTS.md`), we've adopted a balanced approach to testing:

1. **Simplified Automated Tests**: We maintain basic automated tests for core functionality
2. **Comprehensive Manual Testing**: Complex UI interactions and integrations are tested manually
3. **Type Safety**: We use TypeScript to prevent common errors

## Linting Configuration

### ESLint Configuration

We've updated our ESLint configuration to be more lenient in test files while maintaining good practices:

1. **Test-specific Rules**:
   - `no-explicit-any`: Disabled in tests to allow for flexible mocking
   - `no-unused-vars`: Configured to allow unused variables prefixed with underscore (`_`)
   - `ban-ts-comment`: Configured to require explanatory comments with `@ts-expect-error`

2. **Directory-specific Configuration**:
   - Test directories have their own `.eslintrc.json` files
   - Different rules apply to test code vs. production code

### Running Linting Checks

Use these commands to lint your code:

```bash
# Lint all files
npm run lint

# Lint and automatically fix test files
./scripts/test-lint.sh
```

## Best Practices

1. **Disable ESLint Rules Carefully**:
   - Use `// eslint-disable-next-line` for specific cases
   - Add comments explaining why the rule is disabled

2. **Type Safety in Tests**:
   - Use the provided test type definitions from `./types.ts`
   - Prefer explicit types over `any` when possible
   - Use prefixed underscores (e.g., `_name`) for intentionally unused parameters

3. **Test File Organization**:
   - Keep tests focused on specific scenarios
   - Use the simplified test versions for complex features

## Code Cleanup

If you see remaining linting errors related to tests:

1. Update the parameter names to use underscore prefix (e.g., `_owner` instead of `owner`)
2. Add explicit TypeScript types using the provided interfaces  
3. Disable specific ESLint rules as needed, with explanatory comments
