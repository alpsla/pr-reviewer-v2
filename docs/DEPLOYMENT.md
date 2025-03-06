# PR Reviewer Deployment Guide

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Authentication Configuration](#authentication-configuration)
3. [Database Setup](#database-setup)
4. [Deployment Process](#deployment-process)
5. [Post-Deployment Verification](#post-deployment-verification)

## Environment Setup

### Required Environment Variables
```env
# Application URLs (Required in production)
NEXT_PUBLIC_APP_URL=https://codequal.dev
NEXT_PUBLIC_API_URL=https://codequal.dev/api
NEXT_PUBLIC_SUPABASE_URL=https://ftjhmbbcuqjqmmbaymqb.supabase.co/auth/v1/callback

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OAuth Providers
# GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# GitLab
GITLAB_CLIENT_ID=your_gitlab_client_id
GITLAB_CLIENT_SECRET=your_gitlab_client_secret

# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Azure AD
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
```

### Environment Configuration
The application uses environment-specific configuration for URLs and endpoints. These are managed in `packages/core/src/config/urls.ts`:

```typescript
environments: {
  development: {
    appUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api',
    authCallbackPath: '/auth/callback'
  },
  production: {
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    authCallbackPath: '/auth/callback'
  }
}
```

### Authentication URLs
The application manages three types of URLs for authentication:

1. **Application Callback URL**: Where users are redirected after authentication
   - Development: `http://localhost:3000/auth/callback`
   - Production: `${NEXT_PUBLIC_APP_URL}/auth/callback`

2. **Supabase Callback URL**: Used in Supabase configuration
   - Development: Same as Application Callback URL
   - Production: `${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`

3. **Provider Redirect URLs**: Set in OAuth provider configurations
   - Must match the Supabase Callback URL

## Authentication Configuration

### Setting Up OAuth Providers

#### GitHub
1. Go to GitHub Developer Settings > OAuth Apps
2. Create a new OAuth App
3. Set homepage URL to your application URL
4. Set callback URL to your Supabase callback URL
5. Copy Client ID and Client Secret to environment variables

[Previous GitLab, Google, and Azure AD sections remain the same...]

### Supabase Configuration

#### Initial Setup
1. Go to Authentication > URL Configuration
2. Set Site URL to your application URL (e.g., `https://your-production-domain.com`)
3. Set Redirect URLs:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   ```

#### Provider Setup
1. Go to Authentication > Providers
2. Enable each provider
3. Add respective Client IDs and Secrets
4. Verify callback URLs are correctly set

#### Environment-Specific Configuration
For production deployments, update the Supabase configuration using the CLI:

```bash
# Update Site URL
supabase config set AUTH_SITE_URL="${NEXT_PUBLIC_APP_URL}"

# Update callback URLs
supabase auth config set --callback-url "${NEXT_PUBLIC_APP_URL}/auth/callback"
```

[Rest of the deployment guide remains the same...]

## Troubleshooting

### Common Issues

#### 1. URL Configuration
```bash
# Verify current URL configuration
pnpm run check-urls

# Update Supabase callback URL
pnpm run update-callback-url
```

#### 2. Environment Variables
```bash
# Verify environment configuration
pnpm run verify-env

# List current URL settings
pnpm run list-urls
```

[Rest of the troubleshooting section remains the same...]