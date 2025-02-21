# UI Development Plan

## Current Status

The core functionality of PR Reviewer is now stable with passing tests. We're ready to shift focus to the UI components to enable manual testing and provide a complete user experience.

## Architecture

The PR Reviewer UI is built using:

- React for component structure
- Next.js for server-side rendering and routing
- Tailwind CSS for styling
- shadcn/ui for component primitives

## Component Structure

The UI consists of several key areas:

1. **Authentication Components**
   - GitHub OAuth flow
   - GitLab OAuth flow
   - Email authentication

2. **Repository Browser**
   - List repositories from connected accounts
   - Filter and search capabilities
   - Repository metadata display

3. **Pull Request Viewer**
   - PR metadata display
   - File tree navigation
   - Diff viewer with syntax highlighting
   - Comment and review display

4. **Analysis Components** (future)
   - AI analysis results display
   - Suggestion highlighting
   - Acceptance/rejection of suggestions

## Implementation Priority

1. **Priority 1: Core Navigation and Authentication**
   - Login page with platform options
   - Basic dashboard structure
   - Repository listing

2. **Priority 2: Repository and PR Browsing**
   - Repository details page
   - PR listing and filtering
   - Basic PR viewer

3. **Priority 3: PR Details and Diff Viewing**
   - Full PR metadata display
   - Complete diff viewer with syntax highlighting
   - Comment display

4. **Priority 4: Analysis Features**
   - Analysis request UI
   - Results display
   - Suggestion management

## App Structure (Next.js App Router)

The web application uses Next.js with the App Router structure:

```
src/app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page
├── error.tsx               # Error handling
├── loading.tsx             # Loading state
├── not-found.tsx           # 404 page
├── auth/                   # Authentication routes
├── dashboard/              # Dashboard routes
└── components/             # App-specific components
```

## Key Components to Develop

Based on the manual testing requirements, these components need to be developed or enhanced:

### Authentication Components

- **Login Page**: For GitHub, GitLab, and email authentication
- **OAuth Callback**: Handle OAuth redirects
- **Magic Link Handler**: For email authentication
- **Auth Status Display**: Show current authentication status

### Repository Components

- **Repository List**: Display user repositories with filtering and sorting
- **Repository Card**: Show repository information
- **Organization Selector**: Switch between personal and org repositories
- **Repository Search**: Search functionality

### Pull Request Components

- **PR List**: Display PRs for a repository with filtering options
- **PR Card**: Show PR metadata in a card format
- **PR Details**: Complete PR information display
- **File Tree**: Navigate PR files in a tree structure
- **Diff Viewer**: Show file changes with syntax highlighting
- **Comment Display**: Show PR comments and reviews

## Testing Approach

For UI components, we'll focus on manual testing following the scenarios in the MANUAL_TESTS.md document. Key areas to test include:

1. **Authentication flows** across platforms
2. **Repository browsing** with various account types
3. **PR viewing** with different PR sizes and content types
4. **Error states** and loading indicators
5. **Responsive design** across device sizes

## Development Workflow

1. Build and verify basic component functionality
2. Implement manual test mode for offline testing
3. Connect to the core services via API
4. Test with real GitHub/GitLab repositories
5. Refine UX based on testing feedback
