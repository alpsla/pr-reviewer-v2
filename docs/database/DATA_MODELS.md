# Database Schema & Data Models

This document describes the database schema and data models used in the PR Reviewer application.

## Database Overview

PR Reviewer uses Supabase (PostgreSQL) as its primary database. The schema is designed to support:

1. **User data** - Authentication and profile information
2. **Repository data** - Information about connected repositories
3. **PR data** - Pull request metadata and content
4. **Analysis data** - Analysis results and feedback
5. **Queue management** - Analysis job tracking and status

## Table Definitions

### Users

Extends the built-in Supabase `auth.users` table with additional profile information.

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::JSONB
);
```

### Connections

Stores user's VCS provider connections and tokens.

```sql
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  provider TEXT NOT NULL,
  provider_user_id TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  provider_username TEXT,
  provider_email TEXT,
  provider_avatar_url TEXT,
  scopes TEXT[],
  UNIQUE (user_id, provider)
);
```

### Repositories

Stores information about repositories connected to the system.

```sql
CREATE TABLE public.repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  private BOOLEAN DEFAULT FALSE,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  default_branch TEXT DEFAULT 'main',
  languages JSONB DEFAULT '{}'::JSONB,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (provider, provider_id)
);
```

### Repository Access

Maps users to repositories they have access to.

```sql
CREATE TABLE public.repository_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  repository_id UUID REFERENCES public.repositories(id) NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, repository_id)
);
```

### Pull Requests

Stores metadata about pull requests.

```sql
CREATE TABLE public.pull_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES public.repositories(id) NOT NULL,
  pr_number INTEGER NOT NULL,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  state TEXT NOT NULL,
  url TEXT,
  author_username TEXT,
  author_id TEXT,
  base_branch TEXT NOT NULL,
  head_branch TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  provider_created_at TIMESTAMP WITH TIME ZONE,
  provider_updated_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (repository_id, pr_number)
);
```

### PR Files

Stores information about files changed in a pull request.

```sql
CREATE TABLE public.pr_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pull_request_id UUID REFERENCES public.pull_requests(id) NOT NULL,
  path TEXT NOT NULL,
  status TEXT NOT NULL,
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  changes INTEGER DEFAULT 0,
  content_type TEXT,
  content TEXT,
  patch TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (pull_request_id, path)
);
```

### Analysis Jobs

Tracks analysis jobs in the queue.

```sql
CREATE TABLE public.analysis_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  pull_request_id UUID REFERENCES public.pull_requests(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::JSONB
);
```

### Analysis Results

Stores the results of analysis jobs.

```sql
CREATE TABLE public.analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_job_id UUID REFERENCES public.analysis_jobs(id) NOT NULL,
  pull_request_id UUID REFERENCES public.pull_requests(id) NOT NULL,
  summary TEXT,
  categories JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (analysis_job_id)
);
```

### Analysis Issues

Stores individual issues found during analysis.

```sql
CREATE TABLE public.analysis_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_result_id UUID REFERENCES public.analysis_results(id) NOT NULL,
  file_path TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  suggestion TEXT,
  line_numbers INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location_start JSON,
  location_end JSON,
  code_snippet TEXT
);
```

## Data Models and Relationships

### User Data Flow

```
auth.users → profiles → connections → repository_access
```

### Repository Data Flow

```
repositories → repository_access → pull_requests → pr_files
```

### Analysis Data Flow

```
analysis_jobs → analysis_results → analysis_issues
```

## Security Policies

Supabase Row-Level Security (RLS) policies:

### Repository Access Policy

```sql
CREATE POLICY "Users can view repositories they have access to" ON repositories
  FOR SELECT USING (
    id IN (
      SELECT repository_id FROM repository_access
      WHERE user_id = auth.uid()
    )
  );
```

### Analysis Results Policy

```sql
CREATE POLICY "Users can view their own analysis results" ON analysis_results
  FOR SELECT USING (
    pull_request_id IN (
      SELECT pull_requests.id FROM pull_requests
      JOIN repositories ON pull_requests.repository_id = repositories.id
      JOIN repository_access ON repositories.id = repository_access.repository_id
      WHERE repository_access.user_id = auth.uid()
    )
  );
```

## Indexing Strategy

Key indexes to optimize query performance:

```sql
-- Repository lookups by provider and ID
CREATE INDEX idx_repositories_provider_provider_id ON repositories(provider, provider_id);

-- Pull request lookups
CREATE INDEX idx_pull_requests_repository_id ON pull_requests(repository_id);

-- Analysis jobs by status and priority
CREATE INDEX idx_analysis_jobs_status_priority ON analysis_jobs(status, priority);

-- Analysis results by PR
CREATE INDEX idx_analysis_results_pull_request_id ON analysis_results(pull_request_id);

-- Issues by file path and category
CREATE INDEX idx_analysis_issues_file_path ON analysis_issues(file_path);
CREATE INDEX idx_analysis_issues_category ON analysis_issues(category);
```

## Data Caching Strategy

1. **Repository Data**:
   - Cache period: 24 hours
   - Invalidation: On explicit sync request or PR submission

2. **PR Metadata**:
   - Cache period: 1 hour
   - Invalidation: On PR update or reanalysis

3. **Analysis Results**:
   - Cache period: Until PR changes
   - Invalidation: On PR update or explicit request

## Data Migration Strategy

Schema migrations are managed through versioned SQL scripts:

1. **Version Tracking**:
   - Use Supabase migrations feature
   - Name format: `YYYYMMDD_description.sql`

2. **Backward Compatibility**:
   - Maintain backward compatibility for one major version
   - Use transition tables for breaking changes

3. **Data Backfilling**:
   - Include data migration scripts with schema changes
   - Implement background workers for large datasets

## Database Performance Considerations

1. **Query Optimization**:
   - Use explain analyze for complex queries
   - Implement pagination for large result sets
   - Use appropriate indexes based on query patterns

2. **Connection Management**:
   - Implement connection pooling
   - Use prepared statements for repeated queries

3. **Transaction Handling**:
   - Keep transactions short and focused
   - Use appropriate isolation levels
   - Implement retry mechanisms for conflicts
