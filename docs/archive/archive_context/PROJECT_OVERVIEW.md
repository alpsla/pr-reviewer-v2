# PR Reviewer Project Overview

## Project Description
PR Reviewer is a web application that provides AI-powered code review for pull requests. It integrates with GitHub and GitLab to fetch PR data, analyzes code changes using AI, and provides helpful feedback to developers.

## Current Status
- ✅ Authentication system (GitHub, GitLab)
- ✅ VCS abstraction layer (GitHub, GitLab clients)
- ✅ Repository service for fetching repos and PRs
- ✅ Dashboard UI with PR fetching capability
- ✅ Test infrastructure with mocking patterns
- ✅ Email auth (implemented but rate-limited)
- ✅ Build/Lint issues resolved
- 🔄 Test coverage expansion (in progress)
- 🚧 Analysis pipeline (next phase)

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (auth, database)
- **APIs**: GitHub API (Octokit), GitLab API (Gitbeaker)
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel (planned)

## Project Structure
```
/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── src/
│       │   ├── app/         # Next.js app router
│       │   │   ├── auth/    # Authentication pages
│       │   │   ├── dashboard/
│       │   │   │   └── pr-analyzer/ # PR analysis pages
│       │   │   └── ...
│       │   ├── components/  # React components
│       │   │   ├── auth/    # Auth components
│       │   │   ├── layout/  # Layout components
│       │   │   ├── repository/ # Repository components
│       │   │   └── ui/      # UI components (shadcn)
│       │   └── lib/         # Utility functions
│       └── ...
├── packages/
│   └── core/                # Core business logic and services
│       ├── auth/            # Authentication services
│       ├── vcs/             # Version Control System abstraction
│       │   ├── github/      # GitHub client implementation
│       │   ├── gitlab/      # GitLab client implementation
│       │   ├── __mocks__/   # Mock data and clients
│       │   ├── errors.ts    # Error handling
│       │   └── types.ts     # Common VCS types
│       ├── repository/      # Repository management services
│       ├── __tests__/       # Unit and integration tests
│       └── types/           # Shared type definitions  
├── supabase/                # Supabase configuration
└── docs/                    # Documentation
    ├── context/             # Project context
    └── sessions/            # Development session notes
```

## Development Status & Roadmap
1. **Phase 1: Authentication & Repository Access** (COMPLETED)
   - GitHub/GitLab OAuth ✅
   - Repository/PR fetching ✅
   - Caching & error handling ✅
   - Build fixes ✅
   - Unit tests ✅

2. **Phase 2: Analysis Pipeline** (CURRENT)
   - PR Analyzer UI ✅
   - Language detection 🚧
   - Job queue system 🚧
   - LLM integration 🚧
   - Result storage 🚧
   - Testing infrastructure ✅

3. **Phase 3: User Interface Refinement**
   - Advanced repository browser
   - Analysis configuration
   - Results visualization
   - E2E testing
