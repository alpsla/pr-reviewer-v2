# Web App Structure

This document outlines the structure of the web application in the PR Reviewer project.

## Directory Structure

```
apps/web/
├── public/              # Static files
├── src/
│   ├── app/             # Next.js app router
│   │   ├── auth/        # Authentication routes
│   │   ├── dashboard/   # Dashboard routes
│   │   ├── components/  # App-specific components
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Home page
│   │   ├── error.tsx    # Error handling
│   │   └── loading.tsx  # Loading state
│   ├── components/      # Shared React components
│   │   ├── repository/  # Repository components
│   │   ├── pr/          # PR components
│   │   └── ui/          # UI components
│   ├── lib/             # Utility functions
│   │   ├── api.ts       # API client
│   │   └── auth.ts      # Auth utilities
│   └── types/           # TypeScript types
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── next.config.js       # Next.js configuration
└── tailwind.config.ts   # Tailwind CSS configuration
```

## Key Files and Directories

### App Router Structure

The Next.js app router organizes the application by URL paths:

- `/app/page.tsx` - Home page (/)
- `/app/auth/...` - Authentication routes (/auth/...)
- `/app/dashboard/...` - Dashboard routes (/dashboard/...)

### Component Organization

Components are organized by feature area:

1. **UI Components** (`/components/ui/`)
   - Basic UI elements (buttons, inputs, etc.)
   - Layout components (cards, containers, etc.)
   - Navigation components (menus, tabs, etc.)

2. **Repository Components** (`/components/repository/`)
   - Repository list
   - Repository card
   - Repository details

3. **PR Components** (`/components/pr/`)
   - PR list
   - PR card
   - PR details
   - Diff viewer

4. **Authentication Components** (`/components/auth/`)
   - Login form
   - OAuth buttons
   - User profile

### Utility Libraries

The `/lib` directory contains utility functions:

- `api.ts` - API client for core services
- `auth.ts` - Authentication utilities
- `utils.ts` - General utility functions

## Styling Approach

The application uses Tailwind CSS for styling:

- Component-specific styles in component files
- Shared styles in global.css
- Theme configuration in tailwind.config.ts

## Data Flow

1. **Authentication Flow**
   - User logs in via auth providers
   - Tokens stored in secure cookies
   - User redirected to dashboard

2. **Repository Browsing Flow**
   - Dashboard fetches repositories
   - User selects repository
   - Repository details displayed
   - PRs listed for selected repository

3. **PR Viewing Flow**
   - User selects PR from list
   - PR details fetched
   - File changes displayed
   - Diff viewer shows code changes

## Building and Running

```bash
# Install dependencies
pnpm install

# Run development server
cd apps/web
pnpm dev

# Build for production
pnpm build
```

## Environment Configuration

The web app uses environment variables for configuration:

- `NEXT_PUBLIC_API_URL` - Core API URL
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GITLAB_CLIENT_ID` - GitLab OAuth client ID
- `GITLAB_CLIENT_SECRET` - GitLab OAuth client secret

## Implementation Plan

1. **First Step**: Verify the build and fix any immediate issues
2. **Next**: Implement authentication components and flows
3. **Then**: Build repository browsing interface
4. **Finally**: Create PR viewing and diff components
