# UI Components Structure

This document outlines the UI component structure for the PR Reviewer web application.

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

### UI Components

- **Navigation**: App navigation with breadcrumbs
- **Loading States**: Spinners and skeletons for loading data
- **Error Displays**: User-friendly error messages
- **Empty States**: Displayed when no data is available
- **Filter Controls**: For filtering repositories and PRs

## Component Implementation Priorities

1. **First Priority**: Authentication flow and basic repository listing
   - Login page
   - OAuth handling
   - Basic dashboard
   - Simple repository list

2. **Second Priority**: Repository details and PR listing
   - Enhanced repository cards
   - Repository details page
   - Basic PR listing
   - PR filtering

3. **Third Priority**: PR details and diff viewing
   - Complete PR details page
   - File tree navigation
   - Diff viewer with syntax highlighting
   - Comment display

## Component Reuse Strategy

For efficiency, we should create reusable components that can be shared:

- **Card Component**: Base for repository and PR cards
- **List Component**: Base for repository and PR lists
- **Filter Component**: Reusable filter controls
- **Button Component**: Styled buttons with variants
- **Loading Component**: Consistent loading indicators
- **Error Component**: Consistent error displays

## Styling Approach

The application uses Tailwind CSS for styling:

- Use consistent color schemes defined in `tailwind.config.ts`
- Create utility classes for common patterns
- Use responsive design for all components
- Create dark mode variants

## Component Testing

For each component:

1. Test basic rendering
2. Test interactive behavior
3. Test edge cases (empty data, errors, etc.)
4. Test accessibility
