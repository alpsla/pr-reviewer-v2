# PR Reviewer Project Overview

## Project Description
PR Reviewer is a web application that provides AI-powered code review for pull requests. It integrates with GitHub and GitLab to fetch PR data, analyzes code changes using AI, and provides helpful feedback to developers.

## Current Status
- ✅ Authentication system (GitHub, GitLab, Email)
- ✅ VCS abstraction layer (GitHub, GitLab clients)
- ✅ Repository service for fetching repos and PRs
- ✅ Dashboard UI with PR fetching capability
- ✅ Manual testing plan implemented
- ✅ Build/Lint issues resolved
- 🚧 Analysis pipeline (next phase)

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (auth, database)
- **APIs**: GitHub API (Octokit), GitLab API (Gitbeaker)
- **Testing**: Jest, Manual Testing
- **Deployment**: Vercel (planned)

## Project Structure
```
/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── src/
│       │   ├── app/         # Next.js app router
│       │   │   ├── auth/    # Authentication pages
│       │   │   └── dashboard/
│       │   │       └── pr-analyzer/ # PR analysis pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utility functions
├── packages/
│   └── core/                # Core business logic and services
│       ├── auth/            # Authentication services
│       ├── vcs/             # Version Control System abstraction
│       ├── repository/      # Repository management services
│       └── tests/           # Simplified test suite
└── docs/                    # Documentation
    ├── content/             # Project context (this directory)
    └── MANUAL_TESTS.md      # Comprehensive manual testing plan
```

## Architecture Overview
The application follows a modular, service-oriented architecture:

1. **Authentication System**
   - Multi-provider auth (GitHub, GitLab, Email)
   - Token management via Supabase

2. **VCS Abstraction Layer**
   - Common interface for GitHub and GitLab
   - Error normalization and handling
   - Mock clients for testing

3. **Repository Service**
   - High-level repo and PR operations
   - Database caching for API responses
   - Error handling and normalization

4. **Testing Strategy**
   - Simplified automated tests for core functionality
   - Comprehensive manual testing for complex scenarios

## Development Status & Roadmap
1. **Phase 1: Authentication & Repository Access** (COMPLETED)
   - GitHub/GitLab OAuth ✅
   - Repository/PR fetching ✅
   - Testing infrastructure ✅

2. **Phase 2: Analysis Pipeline** (CURRENT)
   - PR Analyzer UI ✅
   - Language detection 🚧
   - LLM integration 🚧
   - Result storage 🚧

3. **Phase 3: User Interface Refinement**
   - Advanced repository browser
   - Analysis configuration
   - Results visualization

## How to Use This Documentation
- **First-time setup**: Follow the onboarding steps in ONBOARDING.md
- **Manual testing**: Reference MANUAL_TESTS.md for testing procedures
- **Contributing**: Follow the simplified testing strategy in TESTING_STRATEGY.md
