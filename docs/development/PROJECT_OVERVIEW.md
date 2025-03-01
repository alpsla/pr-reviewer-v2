# PR Reviewer Project Overview

## Project Description
PR Reviewer is a web application that provides AI-powered code review for pull requests. It integrates with GitHub and GitLab to fetch PR data, analyzes code changes using AI, and provides helpful feedback to developers.

## Current Status
- ✅ Authentication system with all providers
  - GitHub OAuth
  - GitLab OAuth
  - Email Magic Links with cross-tab sync
- ✅ VCS abstraction layer
  - GitHub client (Octokit)
  - GitLab client (Gitbeaker)
- ✅ Basic UI framework
  - Next.js App Router
  - Tailwind CSS
  - shadcn/ui components
- ✅ Database schema design
- ✅ PR data fetching and storage
- ✅ Error handling and recovery system
- 🚧 Analysis queue implementation
- 🚧 LLM integration implementation
- 🚧 Frontend testing interfaces

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (auth, database)
- **APIs**: GitHub API (Octokit), GitLab API (Gitbeaker)
- **AI**: OpenAI API for code analysis
- **Testing**: Jest, Manual Testing
- **Deployment**: Vercel (planned)

## Project Structure

### Web Application Structure
```
apps/web/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── auth/              # Authentication routes
│   │   ├── dashboard/         # Main application
│   │   │   └── pr-analyzer/   # PR analysis features
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── auth/             # Auth components
│   │   ├── repository/       # Repo handling
│   │   ├── pr/              # PR components
│   │   └── ui/              # Shared UI components
│   └── lib/                  # Utilities & services
│       ├── auth/            # Auth services
│       ├── repository/      # Repo services
│       └── database/        # Database services
└── public/                  # Static assets
```

### Core Services Structure
```
packages/core/
├── auth/                    # Authentication services
├── vcs/                    # VCS abstraction layer
├── repository/             # Repository management
└── tests/                  # Test suite
```

## Architecture Overview

### 1. Authentication System
- Multi-provider support
  - GitHub OAuth flow
  - GitLab OAuth flow
  - Email magic links
- Token management via Supabase
- Cross-tab session sync
- Automatic token refresh

### 2. VCS Abstraction Layer
- Common interface for all VCS providers
- Provider-specific implementations
  - GitHub client using Octokit
  - GitLab client using Gitbeaker
- Error normalization
- Rate limit handling
- Mock clients for testing

### 3. Repository Service
- High-level repository operations
- PR data fetching and caching
- Database integration
- Error handling and recovery

### 4. Analysis Pipeline
- PR content extraction
- Analysis queue management
- LLM integration (planned)
- Results storage and presentation

### 5. UI Components
- Authentication flows
  - Platform-specific login
  - Session management
  - Profile handling
- Repository management
  - Repository browser
  - PR listing and filtering
  - Analysis request UI
- PR Analysis
  - Code diff viewer
  - Analysis results display
  - Suggestion management

## Development Status & Roadmap

### Phase 1: Core Infrastructure (COMPLETED)
- ✅ Authentication system
- ✅ VCS abstraction layer
- ✅ Basic UI framework
- ✅ Database schema
- ✅ Error handling system
- ✅ TypeScript structure and type safety

### Phase 2: Data Management (COMPLETED)
- ✅ PR data fetching
- ✅ Database integration
- ✅ Analysis queue structure
- ✅ Content extraction

### Phase 3: Analysis Pipeline (CURRENT)
- 🚧 LLM integration
- 🚧 Result processing
- 🚧 Suggestion generation
- 🚧 Performance optimization

### Phase 4: UI Refinement (CURRENT)
- 🚧 Testing interfaces
- 🚧 Analysis configuration
- 🚧 Results visualization
- 🚧 User dashboard

## Environment Setup
Required environment variables:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITLAB_CLIENT_ID=your-gitlab-client-id
GITLAB_CLIENT_SECRET=your-gitlab-client-secret
```

## Documentation Guide
- **Getting Started**: See ONBOARDING.md
- **Current Tasks**: See CURRENT_TASKS.md
- **Testing Guide**: See TESTING_STRATEGY.md
- **Database Schema**: Check Supabase project