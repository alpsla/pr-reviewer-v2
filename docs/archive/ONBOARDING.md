# PR Reviewer Onboarding Guide

## Getting Started

Welcome to the PR Reviewer project! This guide will help you set up your development environment and understand our workflows.

## Prerequisites
- Node.js 18+
- pnpm 8+
- GitHub account
- GitLab account (optional)
- Supabase account
- OpenAI API key (for LLM integration)

## Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/pr-reviewer-v2.git
cd pr-reviewer-v2
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITLAB_CLIENT_ID=your-gitlab-client-id
GITLAB_CLIENT_SECRET=your-gitlab-client-secret
OPENAI_API_KEY=your-openai-api-key
```

### 4. Database Setup
1. Create a new project in Supabase
2. Run the schema initialization script from `/database/schema.sql`
3. Set up the required policies and indexes

### 5. Run Development Server
```bash
pnpm run dev
```

## Current Project Status

### Completed Features ✅
- Authentication system integration
  - GitHub OAuth
  - GitLab OAuth
  - Email Magic Links
- VCS abstraction layer
  - GitHub API integration
  - GitLab API integration
  - Error handling and normalization
- Repository and PR service
  - Data fetching from GitHub/GitLab
  - Storage in Supabase
  - Caching with invalidation
- Basic UI framework with Tailwind and shadcn/ui
- Database schema design
- Cross-tab authentication sync
- TypeScript structure and type safety fixes

### In Progress 🚧
- Analysis queue implementation and processing
- LLM integration for code review
- Frontend interfaces for testing backend functionality
- Results visualization components

### Next Steps 📋
1. Complete manual testing of existing functionality
2. Implement LLM integration for AI-powered reviews
3. Build frontend visualization components
4. Develop user feedback mechanism

## Project Structure

### Key Directories
- `/apps/web` - Next.js frontend
  - `/src/components/auth` - Authentication components
  - `/src/components/repository` - Repository handling
  - `/src/app/dashboard` - Main application pages
  - `/src/lib` - Utility functions and services
- `/packages/core` - Core services and abstractions
  - `/src/auth` - Auth services
  - `/src/repository` - Repository and PR operations
  - `/src/vcs` - VCS abstraction layer
  - `/src/__tests__` - Test suites
- `/database` - Database schemas and migrations
- `/docs` - Project documentation

### Core Services
- `AuthService` - Handles authentication flows
- `RepositoryService` - Manages repository and PR data
- `DatabaseService` - Supabase database operations
- `AnalysisService` - PR analysis and queue management

## Development Workflow

### 1. Feature Development
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Implement changes with tests
3. Run TypeScript checks: `pnpm run typecheck`
4. Run linting: `pnpm run lint`
5. Submit PR with description

### 2. Testing
- Run automated tests: `pnpm test:simplified`
- Run specific tests: `npx jest --testPathPattern=pattern`
- Perform manual testing following test plan
- Document any issues or edge cases

### 3. Documentation
- Update relevant docs when adding features
- Include code examples
- Document any new environment variables
- Update status sections in documentation

## Common Tasks

### Testing Authentication
1. Configure OAuth providers in Supabase
2. Add test credentials to your .env file
3. Test sign-in flows for all providers
4. Verify session management and token refresh
5. Test cross-tab synchronization

### Working with Repository Services
1. Create mock VCS clients for testing
2. Implement platform-specific API calls
3. Handle rate limiting and error conditions
4. Use the abstraction layer for platform independence

### Working with PR Analysis
1. Fetch PR data using Repository service
2. Submit to analysis queue
3. Process with selected LLM provider
4. Store and display results

### Testing the Entire Flow
1. Submit a PR URL for analysis
2. Monitor queue status and processing
3. View generated feedback
4. Validate against expected results

## Debugging Tips

### TypeScript Issues
- Run `pnpm run typecheck` to catch type errors
- Use proper type definitions for all interfaces
- Add explicit type annotations for complex objects

### Jest Test Failures
- Check mock implementations for database services
- Verify VCS client mocking is configured correctly
- Use `--testPathPattern` to run specific tests

### LLM Integration Issues
- Verify API keys are configured correctly
- Check prompt templates for formatting issues
- Monitor token usage and rate limits

## Best Practices
- Follow TypeScript type definitions
- Use async/await for database operations
- Handle errors appropriately
- Keep services modular and testable
- Document new features
- Use the simplified testing approach for new features
