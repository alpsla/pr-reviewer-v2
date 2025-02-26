# PR Reviewer

AI-powered code review for your pull requests. Integrates with GitHub and GitLab to provide insightful feedback on code changes.

## Quick Links

- [Setup Guide](#setup-guide)
- [Project Status](#project-status)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Project Overview

PR Reviewer is a web application that integrates with GitHub and GitLab to fetch pull request data, analyzes code changes using AI, and provides helpful feedback to developers. The goal is to improve code quality, catch issues early, and reduce the burden on human reviewers.

### Key Features

- **Multi-Platform Support**: Works with GitHub and GitLab (Azure DevOps planned)
- **AI-Powered Analysis**: Uses LLM to identify code issues and suggest improvements
- **Comprehensive Review Coverage**: Analyzes code quality, security issues, and performance
- **Easy Integration**: Simple setup process with OAuth for popular VCS platforms

## Setup Guide

### Prerequisites
- Node.js 18+
- pnpm 8+
- GitHub account
- GitLab account (optional)
- Supabase account
- OpenAI API key (for LLM integration)

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/pr-reviewer-v2.git
   cd pr-reviewer-v2
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment**
   Create a `.env.local` file with the required variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITLAB_CLIENT_ID=your-gitlab-client-id
   GITLAB_CLIENT_SECRET=your-gitlab-client-secret
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Setup Database**
   - Create a new Supabase project
   - Run schema initialization script from `/database/schema.sql`
   - Configure needed policies and indexes

5. **Start Development Server**
   ```bash
   pnpm run dev
   ```

## Project Status

### Completed ✅
- Authentication system with GitHub OAuth, GitLab OAuth, and Email Magic Links
- VCS abstraction layer for GitHub and GitLab
- Basic UI framework with Next.js, Tailwind CSS, and shadcn/ui
- Database schema and PR data fetching/storage
- Error handling and recovery system

### In Progress 🚧
- User flow design and implementation
- LLM integration for code review
- Analysis queue processing
- Frontend testing interfaces

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (auth, database)
- **APIs**: GitHub API (Octokit), GitLab API (Gitbeaker)
- **AI**: OpenAI API for code analysis
- **Testing**: Jest, Manual Testing
- **Deployment**: Vercel (planned)

## Documentation

For detailed documentation, check out the following resources:

- [Project Plan](docs/content/PROJECT_PLAN.md) - Current tasks and implementation roadmap
- [Architecture](docs/content/ARCHITECTURE_VISION.md) - System architecture and design patterns
- [Testing](docs/content/TESTING_STRATEGY.md) - Testing approach and methodologies

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

MIT © [Your Organization]
