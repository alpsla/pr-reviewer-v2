# PR Reviewer Project Onboarding

## Project Overview
PR Reviewer is a web application that provides AI-powered code review for pull requests. The application integrates with GitHub and GitLab to fetch PR data, analyzes code changes using AI, and provides helpful feedback to developers.

## Project Structure
```
/
├── apps/
│   └── web/                 # Next.js frontend application
├── packages/
│   └── core/                # Core business logic and services
│       ├── auth/            # Authentication services (GitHub, GitLab, Email)
│       ├── github/          # GitHub integration
│       ├── analysis/        # Code analysis engine
│       └── types/           # Shared type definitions
├── supabase/                # Supabase configuration
└── docs/                    # Documentation
```

## Tech Stack
- **Frontend**: Next.js with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase for authentication and database
- **Authentication**: GitHub OAuth, GitLab OAuth, Email (magic links)
- **Deployment**: Vercel

## Current Project Status
- **Completed**:
  - GitHub authentication flow
  - GitLab authentication flow
  - Authentication callback handler
  - ESLint configuration and TypeScript setup
  - Basic UI components with shadcn/ui

- **In Progress**:
  - Email authentication (partially implemented, facing rate limits)
  - PR data fetching module

- **Up Next**:
  - Repository selection interface
  - PR analysis pipeline
  - Results visualization

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Git

### Setup Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pr-reviewer-v2.git
   cd pr-reviewer-v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment configuration**
   - Copy `.env.example` to `.env.local` in both root and apps/web
   - Set up OAuth credentials for GitHub and GitLab
   - Configure Supabase connection details

4. **Run development server**
   ```bash
   pnpm dev
   ```

### Development Workflow
1. Create a new branch for your feature or fix
2. Make your changes following the project's code style
3. Ensure tests pass with `pnpm test`
4. Submit a pull request for review

## Authentication System
The authentication system supports three providers:
- **GitHub** (primary for code integration)
- **GitLab** (primary for code integration)
- **Email** (secondary option using magic links)

Auth implementation is in `packages/core/src/auth` with the following key components:
- `auth-service.ts` - Main authentication service
- `types.ts` - Shared authentication types
- `config.ts` - Authentication configuration

## Key Files and Directories

### Core Package
- `packages/core/src/index.ts` - Main exports
- `packages/core/src/auth/` - Authentication implementation
- `packages/core/src/github/` - GitHub API integration
- `packages/core/src/types/` - Shared type definitions

### Web Application
- `apps/web/src/app/` - Next.js app router pages
- `apps/web/src/components/` - React components
- `apps/web/src/lib/` - Utility functions and services

## Troubleshooting

### Common Issues
1. **Authentication errors**: 
   - Verify OAuth credentials in environment variables
   - Check callback URLs in OAuth provider settings
   - Ensure Supabase configuration is correct

2. **Build failures**:
   - Run `pnpm clean` followed by `pnpm install`
   - Check for TypeScript errors with `pnpm typecheck`
   - Verify ESLint configuration

## Additional Resources
- [Project Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Session Notes](./sessions/)

## Contact
If you have questions or need assistance, please contact the project maintainers or open an issue on GitHub.
