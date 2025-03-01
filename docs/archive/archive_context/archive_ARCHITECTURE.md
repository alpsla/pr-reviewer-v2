# PR Reviewer Architecture

## System Overview

PR Reviewer is an AI-powered code review system that integrates with GitHub and GitLab to provide automated code reviews. The system follows a modular, service-oriented architecture with clear separation of concerns.

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Github/GitLab  │◄────►│  PR Reviewer    │◄────►│  LLM Service    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Core Architectural Principles

1. **Modular Design**: Clear separation between components with well-defined interfaces
2. **Service Orientation**: Business logic organized into distinct services
3. **Clean Dependencies**: Minimized and explicit dependencies between modules
4. **Progressive Enhancement**: Core functions work without advanced features
5. **Type Safety**: Comprehensive TypeScript types throughout the application

## Application Structure

```
/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── src/app          # Next.js App Router pages
│       ├── src/components   # UI components
│       ├── src/lib          # Web app utilities
│       └── public           # Static assets
├── packages/
│   └── core/                # Core business logic and services
│       ├── src/auth/        # Authentication services
│       ├── src/github/      # GitHub integration
│       ├── src/gitlab/      # GitLab integration
│       ├── src/analysis/    # Code analysis engine
│       ├── src/types/       # Shared type definitions
│       └── src/utils/       # Shared utilities
├── supabase/                # Supabase configuration
└── docs/                    # Documentation
```

## Key Components

### 1. Authentication System (Implemented)
The authentication system provides multi-provider authentication with GitHub, GitLab, and Email.

**Key Files:**
- `packages/core/src/auth/auth-service.ts`: Main authentication service
- `packages/core/src/auth/email-auth.ts`: Email-specific authentication
- `packages/core/src/auth/types.ts`: Authentication related types

**Design Patterns:**
- Factory pattern for provider creation
- Strategy pattern for different authentication methods
- Repository pattern for user data access

### 2. Repository Service (Planned)
Manages repository data retrieval and caching from version control systems.

**Planned Components:**
- Abstract repository client
- Platform-specific adapters
- Repository data models
- Caching and invalidation strategy

**Service Responsibilities:**
- List user's repositories
- Fetch repository metadata
- Validate access permissions
- Cache repository information

### 3. Pull Request Service (Planned)
Handles fetching and processing of pull request data.

**Planned Components:**
- PR fetching clients
- Diff processing utilities
- PR data models
- Change analysis helpers

**Service Responsibilities:**
- Fetch PR metadata
- Retrieve file changes
- Process commit history
- Handle comments and reviews

### 4. Analysis Engine (Planned)
Processes pull requests with AI to generate review feedback.

**Planned Components:**
- Analysis queue system
- Language detection service
- LLM integration client
- Template management
- Result processing

**Design Patterns:**
- Queue/Worker pattern for processing
- Template method for analysis steps
- Strategy pattern for language-specific analysis
- Observer pattern for progress tracking

### 5. Frontend Application
Next.js application providing the user interface.

**Key Areas:**
- Authentication flows
- Repository/PR selection
- Analysis configuration
- Results visualization

**Design Patterns:**
- Container/Presenter pattern for components
- Custom hooks for shared logic
- Context providers for global state

## Data Flow

### Authentication Flow (Implemented)
```
┌────────┐     ┌───────────┐     ┌─────────────┐     ┌─────────┐
│        │     │           │     │             │     │         │
│  User  │────►│  OAuth    │────►│  Callback   │────►│  App    │
│        │     │  Provider │     │  Handler    │     │  State  │
│        │     │           │     │             │     │         │
└────────┘     └───────────┘     └─────────────┘     └─────────┘
```

### PR Review Flow (Planned)
```
┌────────┐     ┌───────────┐     ┌─────────────┐     ┌─────────┐
│        │     │           │     │             │     │         │
│  User  │────►│  PR       │────►│  Analysis   │────►│ Results │
│        │     │  Selection│     │  Pipeline   │     │ Display │
│        │     │           │     │             │     │         │
└────────┘     └───────────┘     └─────────────┘     └─────────┘
```

## Database Schema

Using Supabase with the following core tables:

### Users Table
```sql
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  name text,
  avatar_url text,
  github_id text unique,
  gitlab_id text unique,
  auth_provider text not null,
  status text not null default 'active',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
```

### Repositories Table (Planned)
```sql
create table public.repositories (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  external_id text not null,
  owner text not null,
  name text not null,
  description text,
  is_private boolean not null default false,
  default_branch text not null default 'main',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  last_synced_at timestamp with time zone,
  
  unique(platform, owner, name)
);
```

### Pull Requests Table (Planned)
```sql
create table public.pull_requests (
  id uuid primary key default uuid_generate_v4(),
  repository_id uuid references public.repositories not null,
  external_id text not null,
  number int not null,
  title text not null,
  description text,
  author text not null,
  state text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  
  unique(repository_id, number)
);
```

### Analyses Table (Planned)
```sql
create table public.analyses (
  id uuid primary key default uuid_generate_v4(),
  pull_request_id uuid references public.pull_requests not null,
  status text not null default 'pending',
  started_at timestamp with time zone default now() not null,
  completed_at timestamp with time zone,
  summary text,
  results jsonb,
  error text,
  token_usage jsonb,
  model text,
  
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
```

## API Structure

### Authentication API (Implemented)
- `POST /api/auth/callback` - Handle OAuth callbacks
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out user

### Repository API (Planned)
- `GET /api/repositories` - List user repositories
- `GET /api/repositories/:id` - Get repository details
- `GET /api/repositories/:id/branches` - List branches

### Pull Request API (Planned)
- `GET /api/repositories/:id/pull-requests` - List repository PRs
- `GET /api/pull-requests/:id` - Get PR details
- `POST /api/pull-requests/:id/analyze` - Request PR analysis

### Analysis API (Planned)
- `GET /api/analyses/:id` - Get analysis results
- `GET /api/analyses/:id/status` - Check analysis status
- `POST /api/analyses/:id/feedback` - Submit feedback on analysis

## Security Considerations

1. **Authentication**: Secure token handling and proper session management
2. **Authorization**: Appropriate access controls for repositories and PRs
3. **Data Protection**: Encryption for sensitive data
4. **API Security**: Rate limiting, input validation, and proper error handling
5. **Dependency Security**: Regular audits and updates

## Performance Strategies

1. **Caching**: Implement multiple caching layers:
   - Browser caching for static assets
   - Memory caching for API responses
   - Database caching for expensive operations

2. **Optimized API Requests**:
   - Batching where appropriate
   - Pagination for large result sets
   - Only fetching required fields

3. **Background Processing**:
   - Asynchronous analysis jobs
   - Progress tracking for long-running operations
   - Webhook support for real-time updates

## Testing Strategy

1. **Unit Tests**: Test individual services and utilities
2. **Integration Tests**: Test service interactions
3. **End-to-End Tests**: Test complete user flows
4. **Performance Tests**: Ensure system meets performance requirements

## Future Architectural Considerations

1. **Scaling**:
   - Horizontal scaling for analysis workers
   - Distributed caching for shared state
   - Database read replicas for increased throughput

2. **Advanced Features**:
   - WebSocket support for real-time updates
   - Machine learning for personalized reviews
   - Integration with additional platforms

3. **Enterprise Features**:
   - Single sign-on (SSO) integration
   - Advanced access controls
   - Custom analysis rules
   - Compliance reporting
