# PR Reviewer Code Navigation

This directory contains key files and information to help you navigate the PR Reviewer codebase and continue development from where we left off.

## Project Structure

The PR Reviewer is organized as a monorepo with the following structure:

```
pr-reviewer-v2/
├── apps/              # User-facing applications
│   └── web/           # Next.js web application (UI focus area)
├── packages/          # Shared libraries and modules
│   └── core/          # Core functionality (Backend API focus area)
├── docs/              # Documentation
└── ...
```

## Current Focus

We've completed fixing the testing issues in the core package and are now shifting focus to:

1. The UI implementation in `apps/web`
2. Setting up manual testing workflows
3. Making sure the UI builds and passes lint checks

## Key Documentation

- **[TESTING_STATUS.md](../TESTING_STATUS.md)** - Current state of testing 
- **[UI_DEVELOPMENT.md](../UI_DEVELOPMENT.md)** - UI development plan
- **[MANUAL_TESTS.md](../MANUAL_TESTS.md)** - Manual testing scenarios
- **[TESTING_STRATEGY.md](../TESTING_STRATEGY.md)** - Overall testing approach

## Important Files

### Core Package (Fixed)

These files in `packages/core` have been fixed and now have passing tests:

- `src/__tests__/repository/simplified-tests.ts`
- `src/__tests__/repository/simplified-platform.test.ts`
- `src/__tests__/repository/simplified-error.test.ts`
- `src/__tests__/repository/basic-test.ts`
- `jest.config.simplified.js`

### Web App (Focus Area)

These files in `apps/web` need attention:

- `src/app/` - Next.js application routes
- `src/components/` - React components
- `src/lib/` - Helper functions and utilities

## Next Steps

1. Build the web app and check for any errors
2. Fix UI-related lint and build issues
3. Begin implementing the UI components needed for manual testing
4. Connect the UI to the core functionality
5. Run through manual testing scenarios

## Running the Project

```bash
# Install dependencies
pnpm install

# Run core tests
cd packages/core
pnpm test:simplified

# Build and run the web app
cd apps/web
pnpm dev
```
