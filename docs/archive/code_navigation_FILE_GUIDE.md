# Key Files Guide

This document provides a guide to the most important files you'll need to focus on for continuing development of the PR Reviewer web UI.

## Core Package (Completed)

The core package has been fixed and now has passing tests. The key files include:

```
packages/core/
├── jest.config.simplified.js       # Test configuration
├── src/
│   ├── repository/
│   │   ├── repository-service.ts   # Main service for repo operations
│   │   └── repository-error.ts     # Error handling
│   ├── vcs/
│   │   ├── github/                 # GitHub client
│   │   └── gitlab/                 # GitLab client
│   └── __tests__/
│       └── repository/
│           ├── simplified-tests.ts           # Core tests
│           ├── simplified-platform.test.ts   # Platform tests
│           ├── simplified-error.test.ts      # Error tests
│           └── basic-test.ts                 # Basic tests
```

## Web App (Focus Area)

The web app is the current focus for development. Key files include:

```
apps/web/
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── page.tsx         # Home page
│   │   ├── dashboard/       # Dashboard routes
│   │   └── auth/            # Auth routes
│   ├── components/          # Reusable React components
│   │   ├── repository/      # Repository components
│   │   ├── pr/              # PR components
│   │   └── ui/              # UI components
│   ├── lib/                 # Helper functions
│   │   ├── api.ts           # API client
│   │   └── auth.ts          # Auth utilities
│   └── types/               # TypeScript types
```

## Documentation (Updated)

The documentation has been updated to reflect the current status:

```
docs/
├── MANUAL_TESTS.md           # Manual testing scenarios
├── TESTING_STRATEGY.md       # Overall testing approach
├── TESTING_STATUS.md         # Current testing status
├── UI_DEVELOPMENT.md         # UI development plan
└── code_navigation/          # Code navigation guide
    ├── README.md             # Overview
    ├── CURRENT_STATUS.md     # Current status
    └── FILE_GUIDE.md         # This file
```

## Build and Lint Configuration

For building and linting the web app:

```
apps/web/
├── .eslintrc.json           # ESLint configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Environment Configuration

Environment configuration for the web app:

```
apps/web/
├── .env                     # Default environment variables
├── .env.example             # Example environment variables
└── .env.local               # Local environment variables (not committed)
```

## Testing Files

For testing the web app:

```
apps/web/
├── jest.config.ts           # Jest configuration
├── jest.setup.ts            # Jest setup
└── src/__tests__/           # Test files
```
