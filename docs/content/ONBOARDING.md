# PR Reviewer Onboarding Guide

## Getting Started

Welcome to the PR Reviewer project! This guide will help you set up your development environment and understand our workflows.

## Prerequisites
- Node.js 18+
- npm 8+
- GitHub account
- GitLab account (optional)

## Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/pr-reviewer-v2.git
cd pr-reviewer-v2
```

### 2. Install Dependencies
```bash
npm install
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
```

### 4. Run Development Server
```bash
npm run dev
```

## Project Overview

For a complete project overview, see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).

## Key Directories
- `/apps/web` - Next.js frontend
- `/packages/core` - Core business logic
- `/docs` - Documentation

## Development Workflow

### 1. Creating a New Feature
1. Create a new branch from `main`: `git checkout -b feature/your-feature-name`
2. Implement your changes
3. Run the simplified test suite: `npm run test:simplified`
4. Perform manual testing according to [MANUAL_TESTS.md](../MANUAL_TESTS.md)
5. Submit a PR

### 2. Testing
We use a balanced approach with:
- Simplified automated tests for core functionality
- Manual testing for complex flows

To understand our testing strategy, see [TESTING_STRATEGY.md](./TESTING_STRATEGY.md).

### 3. Code Style
- We use ESLint and Prettier for code formatting
- Run `npm run lint` before committing

## Architecture

The application follows a service-oriented architecture:

1. **Authentication** - Handles user login via GitHub/GitLab
2. **VCS Abstraction** - Provides unified interface to GitHub/GitLab APIs
3. **Repository Service** - Manages repository and PR data
4. **Analysis Pipeline** - Processes code for AI review (in development)

## Common Tasks

### Adding a New VCS Provider
1. Create a new client in `/packages/core/vcs/`
2. Implement the VCSClient interface
3. Add provider to the auth system
4. Update the UI to show the new provider
5. Add comprehensive testing

### Modifying Repository Service
1. Update the service in `/packages/core/repository/`
2. Ensure proper error handling
3. Update caching logic if needed
4. Run simplified tests
5. Perform manual testing

## Getting Help
- Check existing documentation in `/docs`
- Review code comments and interfaces
- Ask the team in our Slack channel
