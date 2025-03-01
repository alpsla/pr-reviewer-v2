# Deployment Guide

This document outlines the deployment process for the PR Reviewer application.

## Deployment Environments

PR Reviewer supports three deployment environments:

1. **Development**: For feature development and testing
2. **Staging**: For pre-production validation 
3. **Production**: For end-user access

## Infrastructure Components

### Application Hosting (Vercel)

The Next.js frontend is deployed on Vercel.

### Database (Supabase)

PostgreSQL database hosting provided by Supabase.

### Authentication (Supabase Auth)

Authentication services provided by Supabase Auth.

### File Storage (Supabase Storage)

File storage for repository and PR data.

### LLM API Integration

Multiple provider support with abstraction layer:
- OpenAI API
- (Future) Additional LLM providers

## Deployment Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│                 │     │              │     │                 │
│   Web Browser   ├────►│  Vercel CDN  ├────►│  Next.js App    │
│                 │     │              │     │                 │
└─────────────────┘     └──────────────┘     └─────────┬───────┘
                                                       │
                                                       ▼
                 ┌─────────────────────────────────────────────┐
                 │                                             │
                 │               Supabase                      │
                 │                                             │
                 │  ┌─────────────┐    ┌──────────────────┐   │
                 │  │             │    │                  │   │
                 │  │  Auth       │    │  PostgreSQL DB   │   │
                 │  │             │    │                  │   │
                 │  └─────────────┘    └──────────────────┘   │
                 │                                             │
                 └─────────────────────────────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │                     │
                            │  LLM API Providers  │
                            │                     │
                            └─────────────────────┘
```

## Environment Variables

### Required Variables

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITLAB_CLIENT_ID=your-gitlab-client-id
GITLAB_CLIENT_SECRET=your-gitlab-client-secret

# LLM API Keys
OPENAI_API_KEY=your-openai-api-key
```

### Optional Variables

```ini
# Feature Flags
ENABLE_ADVANCED_SECURITY=true
ENABLE_PERFORMANCE_ANALYSIS=true

# Infrastructure Configuration
MAX_CONCURRENT_ANALYSES=5
ANALYSIS_TIMEOUT_SECONDS=300
```

## Deployment Steps

### Initial Setup

1. **Create Supabase Project**
   - Create a new Supabase project
   - Run database migration scripts
   - Configure authentication providers
   - Set up storage buckets and policies

2. **Configure OAuth Applications**
   - **GitHub**:
     - Register a new OAuth application in GitHub
     - Set callback URL to `https://your-domain.com/auth/callback/github`
   - **GitLab**:
     - Register a new OAuth application in GitLab
     - Set callback URL to `https://your-domain.com/auth/callback/gitlab`

3. **Set Up Vercel Project**
   - Connect GitHub repository to Vercel
   - Configure build settings
   - Add environment variables

### Deployment Process

1. **Prepare for Deployment**
   ```bash
   # Install dependencies
   pnpm install

   # Run type checking
   pnpm run typecheck

   # Run tests
   pnpm test

   # Build application
   pnpm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Login to Vercel CLI
   vercel login

   # Deploy to development
   vercel

   # Deploy to production
   vercel --prod
   ```

3. **Database Migrations**
   ```bash
   # Run migrations on Supabase
   supabase db push
   ```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy PR Reviewer

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install
      - name: Check types
        run: pnpm run typecheck
      - name: Run tests
        run: pnpm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Monitoring and Observability

### Vercel Analytics

- **Web Vitals**: Monitor Core Web Vitals
- **Usage Statistics**: Track user activity
- **Error Reporting**: Real-time error tracking

### Custom Telemetry

- **Analysis Metrics**:
  - Analysis queue length
  - Processing time
  - Success/failure rates
  - Token usage

- **User Experience Metrics**:
  - Time to first analysis
  - Suggestion acceptance rate
  - User retention

### Logging Strategy

- **Structured Logging**:
  - JSON format logs
  - Correlation IDs for request tracing
  - Contextual information

- **Log Categories**:
  - Error logs
  - Performance logs
  - Security logs
  - Audit logs

## Scaling Strategy

### Horizontal Scaling

- **Frontend**: Automatic scaling with Vercel
- **Database**: Connection pooling and read replicas
- **Analysis Queue**: Distributed worker model

### Cost Management

- **Caching Strategy**:
  - Cache PR metadata and content
  - Cache analysis results when PR unchanged
  - Token usage optimization

- **LLM Cost Optimization**:
  - Provider selection based on cost/performance
  - Batched requests
  - Context size optimization

## Backup and Recovery

### Database Backups

- **Automated Backups**:
  - Daily point-in-time backups
  - 30-day retention period

- **Recovery Process**:
  1. Restore database from backup
  2. Verify data integrity
  3. Reconnect application

### Environment Recovery

- **Infrastructure as Code**:
  - Vercel configuration in version control
  - Supabase schema in migration scripts
  - Environment variables in secure storage

- **Disaster Recovery Plan**:
  1. Restore database from latest backup
  2. Redeploy application from version control
  3. Verify system functionality

## Security Measures

### Data Protection

- **Encryption**:
  - TLS for all connections
  - Data encrypted at rest
  - Sensitive values (tokens) encrypted in database

- **Access Controls**:
  - Row-level security in database
  - Role-based access control
  - Token scoping

### Secrets Management

- **Environment Variables**:
  - Stored securely in Vercel and Supabase
  - Not exposed to client-side code
  - Rotated regularly

- **Token Handling**:
  - OAuth tokens stored encrypted
  - Short-lived access tokens
  - Automatic token refresh

### Vulnerability Scanning

- **Dependency Scanning**:
  - Regular dependency updates
  - Vulnerability scanning in CI/CD
  - Security notifications

- **Code Scanning**:
  - Static analysis for security issues
  - Secure coding practices
  - Regular security reviews

## Deployment Checklist

Pre-deployment checklist:

- [ ] All tests passing
- [ ] Type checking passed
- [ ] Environment variables configured
- [ ] Database migrations prepared
- [ ] OAuth applications configured
- [ ] LLM API keys valid

Post-deployment verification:

- [ ] Application loads correctly
- [ ] Authentication flows working
- [ ] PR analysis functions as expected
- [ ] Error handling working correctly
- [ ] Performance metrics within expected ranges
