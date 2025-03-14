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

### Data Collection Jobs

Tracks data collection jobs for the two-tier data collection system.

```sql
CREATE TABLE public.data_collection_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  data_types TEXT[] NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0
);
```

### Repository Structure

Stores information about the repository's directory structure and file types.

```sql
CREATE TABLE public.repository_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  root_directories JSONB NOT NULL,
  file_types JSONB NOT NULL,
  special_directories JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Repository Dependencies

Stores information about the repository's dependencies.

```sql
CREATE TABLE public.repository_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  package_managers TEXT[] NOT NULL,
  direct_dependencies JSONB NOT NULL,
  dev_dependencies JSONB NOT NULL,
  transitive_dependencies JSONB,
  vulnerabilities JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Security Information

Stores security findings for a repository.

```sql
CREATE TABLE public.security_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  findings JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Performance Indicators

Stores performance-related information for a repository.

```sql
CREATE TABLE public.performance_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  indicators JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

### Data Collection Flow

```
repositories → data_collection_jobs → [repository_structures, repository_dependencies, security_info, performance_indicators]
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

-- Data collection jobs by status and repository ID
CREATE INDEX idx_data_collection_jobs_status ON data_collection_jobs(status);
CREATE INDEX idx_data_collection_jobs_repository_id ON data_collection_jobs(repository_id);

-- Repository data by repository ID
CREATE INDEX idx_repository_structures_repository_id ON repository_structures(repository_id);
CREATE INDEX idx_repository_dependencies_repository_id ON repository_dependencies(repository_id);
CREATE INDEX idx_security_info_repository_id ON security_info(repository_id);
CREATE INDEX idx_performance_indicators_repository_id ON performance_indicators(repository_id);
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
