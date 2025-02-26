# API Reference

This document provides a comprehensive reference for the internal APIs used in the PR Reviewer application.

## VCS Abstraction Layer

The VCS abstraction layer provides a common interface for working with different version control systems.

### VCSClient Interface

```typescript
interface VCSClient {
  // Repository Operations
  getRepository(owner: string, repo: string): Promise<Repository>;
  listUserRepositories(page?: number, perPage?: number): Promise<Repository[]>;
  
  // PR Operations
  getPullRequest(owner: string, repo: string, number: number): Promise<PullRequest>;
  getPullRequestFromUrl(url: string): Promise<PullRequest>;
  listPullRequests(owner: string, repo: string, state?: string): Promise<PullRequest[]>;
  
  // File Operations
  getPullRequestFiles(owner: string, repo: string, number: number): Promise<PRFile[]>;
  getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string>;
  
  // Comment Operations
  createPullRequestComment(owner: string, repo: string, number: number, body: string, path?: string, line?: number): Promise<Comment>;
  
  // Authentication
  isAuthenticated(): boolean;
  getTokenExpiryTime(): Date | null;
  refreshToken(): Promise<boolean>;
}
```

### GitHub Client Implementation

```typescript
class GitHubClient implements VCSClient {
  constructor(
    private octokit: Octokit,
    private tokenManager: TokenManager
  ) {}
  
  // Implementation of VCSClient interface for GitHub
  // ...
}
```

### GitLab Client Implementation

```typescript
class GitLabClient implements VCSClient {
  constructor(
    private gitbeaker: Gitbeaker,
    private tokenManager: TokenManager
  ) {}
  
  // Implementation of VCSClient interface for GitLab
  // ...
}
```

### VCS Factory

```typescript
class VCSFactory {
  static createClient(provider: string, token: string): VCSClient {
    switch (provider.toLowerCase()) {
      case 'github':
        return new GitHubClient(new Octokit({ auth: token }), new TokenManager(token));
      case 'gitlab':
        return new GitLabClient(new Gitbeaker({ token }), new TokenManager(token));
      default:
        throw new Error(`Unsupported VCS provider: ${provider}`);
    }
  }
  
  static createClientFromUrl(url: string, token: string): VCSClient {
    if (url.includes('github.com')) {
      return this.createClient('github', token);
    } else if (url.includes('gitlab.com')) {
      return this.createClient('gitlab', token);
    } else {
      throw new Error(`Unable to determine VCS provider from URL: ${url}`);
    }
  }
}
```

## Authentication Service

Manages authentication and token handling across different providers.

### AuthService Interface

```typescript
interface AuthService {
  // Authentication
  signInWithOAuth(provider: string): Promise<User>;
  signInWithMagicLink(email: string): Promise<boolean>;
  signOut(): Promise<void>;
  
  // Session Management
  getSession(): Promise<Session | null>;
  refreshSession(): Promise<boolean>;
  
  // User Management
  getUser(): Promise<User | null>;
  updateUser(data: Partial<User>): Promise<User>;
  
  // Connection Management
  getProviderConnections(): Promise<ProviderConnection[]>;
  addProviderConnection(provider: string, code: string): Promise<ProviderConnection>;
  removeProviderConnection(provider: string): Promise<boolean>;
}
```

### SupabaseAuthService Implementation

```typescript
class SupabaseAuthService implements AuthService {
  constructor(
    private supabaseClient: SupabaseClient
  ) {}
  
  // Implementation of AuthService interface using Supabase
  // ...
}
```

## Repository Service

Provides high-level operations for working with repositories and pull requests.

### RepositoryService Interface

```typescript
interface RepositoryService {
  // Repository Operations
  getRepository(owner: string, repo: string, provider: string): Promise<Repository>;
  listUserRepositories(provider: string): Promise<Repository[]>;
  syncRepository(owner: string, repo: string, provider: string): Promise<Repository>;
  
  // PR Operations
  getPullRequest(owner: string, repo: string, number: number, provider: string): Promise<PullRequest>;
  getPullRequestFromUrl(url: string): Promise<PullRequest>;
  getPullRequestFiles(pullRequestId: string): Promise<PRFile[]>;
  
  // Analysis Operations
  requestAnalysis(pullRequestId: string, options?: AnalysisOptions): Promise<AnalysisJob>;
  getAnalysisStatus(jobId: string): Promise<AnalysisStatus>;
  getAnalysisResults(jobId: string): Promise<AnalysisResult>;
}
```

### DatabaseRepositoryService Implementation

```typescript
class DatabaseRepositoryService implements RepositoryService {
  constructor(
    private dbService: DatabaseService,
    private vcsFactory: VCSFactory,
    private analysisQueue: AnalysisQueue
  ) {}
  
  // Implementation of RepositoryService interface using database
  // ...
}
```

## Analysis Service

Manages analysis jobs and LLM integration.

### AnalysisService Interface

```typescript
interface AnalysisService {
  // Queue Management
  submitJob(pullRequestId: string, userId: string, options?: AnalysisOptions): Promise<AnalysisJob>;
  getJob(jobId: string): Promise<AnalysisJob>;
  listJobs(status?: string, userId?: string): Promise<AnalysisJob[]>;
  cancelJob(jobId: string): Promise<boolean>;
  
  // Analysis Operations
  processJob(job: AnalysisJob): Promise<AnalysisResult>;
  getAnalysisResults(jobId: string): Promise<AnalysisResult>;
}
```

### LLMAnalysisService Implementation

```typescript
class LLMAnalysisService implements AnalysisService {
  constructor(
    private dbService: DatabaseService,
    private repositoryService: RepositoryService,
    private llmProvider: LLMProvider
  ) {}
  
  // Implementation of AnalysisService interface using LLM
  // ...
}
```

## LLM Provider

Handles interactions with language model providers.

### LLMProvider Interface

```typescript
interface LLMProvider {
  // Core Operations
  generateResponse(prompt: string, options?: LLMOptions): Promise<string>;
  
  // Utility Methods
  estimateTokens(text: string): number;
  isWithinContextLimit(text: string): boolean;
  
  // Management
  getRateLimitStatus(): Promise<RateLimitStatus>;
}
```

### OpenAIProvider Implementation

```typescript
class OpenAIProvider implements LLMProvider {
  constructor(
    private openai: OpenAIApi,
    private options: OpenAIOptions
  ) {}
  
  // Implementation of LLMProvider interface using OpenAI
  // ...
}
```

## Database Service

Provides access to the database.

### DatabaseService Interface

```typescript
interface DatabaseService {
  // Repository Methods
  getRepository(id: string): Promise<Repository>;
  findRepositoryByProvider(provider: string, providerId: string): Promise<Repository>;
  createRepository(data: Partial<Repository>): Promise<Repository>;
  updateRepository(id: string, data: Partial<Repository>): Promise<Repository>;
  
  // PR Methods
  getPullRequest(id: string): Promise<PullRequest>;
  findPullRequestByProvider(repositoryId: string, provider: string, providerNumber: number): Promise<PullRequest>;
  createPullRequest(data: Partial<PullRequest>): Promise<PullRequest>;
  savePullRequestFiles(pullRequestId: string, files: PRFile[]): Promise<number>;
  
  // Analysis Methods
  createAnalysisJob(data: Partial<AnalysisJob>): Promise<AnalysisJob>;
  updateAnalysisJob(id: string, data: Partial<AnalysisJob>): Promise<AnalysisJob>;
  saveAnalysisResults(jobId: string, results: AnalysisResult): Promise<boolean>;
  
  // Utility Methods
  runTransaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T>;
}
```

### SupabaseDatabaseService Implementation

```typescript
class SupabaseDatabaseService implements DatabaseService {
  constructor(
    private supabaseClient: SupabaseClient
  ) {}
  
  // Implementation of DatabaseService interface using Supabase
  // ...
}
```

## Frontend API Routes

Internal API routes used by the frontend.

### Authentication Routes

```typescript
// POST /api/auth/signin
// Request: { provider: string, email?: string }
// Response: { user: User, session: Session } | { message: string }

// POST /api/auth/signout
// Response: { success: boolean }

// GET /api/auth/session
// Response: { user: User, session: Session } | { message: string }
```

### Repository Routes

```typescript
// GET /api/repos
// Query: { provider?: string }
// Response: { repositories: Repository[] }

// GET /api/repos/:owner/:repo
// Params: { owner: string, repo: string }
// Query: { provider: string }
// Response: { repository: Repository }

// GET /api/repos/:owner/:repo/prs
// Params: { owner: string, repo: string }
// Query: { provider: string, state?: string }
// Response: { pullRequests: PullRequest[] }
```

### Analysis Routes

```typescript
// POST /api/analysis
// Request: { pullRequestUrl: string, options?: AnalysisOptions }
// Response: { job: AnalysisJob }

// GET /api/analysis/:jobId
// Params: { jobId: string }
// Response: { job: AnalysisJob, results?: AnalysisResult }

// GET /api/analysis/history
// Response: { jobs: AnalysisJob[] }
```

## Error Handling

Standardized error types and handling across the application.

```typescript
// Base error class
class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Auth errors
class AuthenticationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'auth/unauthenticated', 401, details);
  }
}

// VCS errors
class VCSError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, `vcs/${code}`, 400, details);
  }
}

class RateLimitError extends VCSError {
  constructor(message: string, details?: any) {
    super(message, 'rate-limit', details);
  }
}

// Analysis errors
class AnalysisError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, `analysis/${code}`, 500, details);
  }
}

// Error mapper functions for platform-specific errors
function mapGitHubError(error: any): AppError {
  // Convert GitHub-specific errors to AppError types
}

function mapGitLabError(error: any): AppError {
  // Convert GitLab-specific errors to AppError types
}
```

## Data Transfer Objects (DTOs)

Common data structures used across the application.

```typescript
interface Repository {
  id: string;
  provider: string;
  providerId: string;
  owner: string;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  url: string;
  defaultBranch: string;
  languages?: Record<string, number>;
  lastSyncedAt?: Date;
}

interface PullRequest {
  id: string;
  repositoryId: string;
  number: number;
  provider: string;
  providerId: string;
  title: string;
  description?: string;
  state: 'open' | 'closed' | 'merged';
  url: string;
  authorUsername?: string;
  authorId?: string;
  baseBranch: string;
  headBranch: string;
  createdAt: Date;
  updatedAt: Date;
  providerCreatedAt?: Date;
  providerUpdatedAt?: Date;
  lastSyncedAt?: Date;
}

interface PRFile {
  id?: string;
  pullRequestId?: string;
  path: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  contentType?: string;
  content?: string;
  patch?: string;
}

interface AnalysisJob {
  id: string;
  userId: string;
  pullRequestId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  retryCount: number;
  settings?: Record<string, any>;
}

interface AnalysisResult {
  id: string;
  analysisJobId: string;
  pullRequestId: string;
  summary: string;
  categories: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
  issues: AnalysisIssue[];
}

interface AnalysisIssue {
  id: string;
  analysisResultId: string;
  filePath: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'suggestion';
  title: string;
  description?: string;
  suggestion?: string;
  lineNumbers: number[];
  codeSnippet?: string;
}
```

## API Request/Response Examples

### Request PR Analysis

```http
POST /api/analysis
Content-Type: application/json

{
  "pullRequestUrl": "https://github.com/owner/repo/pull/123",
  "options": {
    "categories": ["quality", "security", "performance"],
    "priority": 1
  }
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "job": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "pending",
    "createdAt": "2025-02-26T12:34:56.789Z",
    "pullRequestId": "b2c3d4e5-f6g7-8901-ijkl-mn2345678901"
  }
}
```

### Get Analysis Results

```http
GET /api/analysis/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "job": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "completed",
    "createdAt": "2025-02-26T12:34:56.789Z",
    "startedAt": "2025-02-26T12:35:00.123Z",
    "completedAt": "2025-02-26T12:36:30.456Z",
    "pullRequestId": "b2c3d4e5-f6g7-8901-ijkl-mn2345678901"
  },
  "results": {
    "id": "c3d4e5f6-g7h8-9012-opqr-st3456789012",
    "summary": "This PR adds a new user authentication function with several quality improvements needed.",
    "categories": {
      "quality": 3,
      "security": 1,
      "performance": 0
    },
    "issues": [
      {
        "id": "d4e5f6g7-h8i9-0123-uvwx-yz4567890123",
        "filePath": "src/auth.js",
        "category": "security",
        "severity": "high",
        "title": "Unvalidated user input",
        "description": "The user input is not properly validated before being used.",
        "suggestion": "Add input validation using a library like zod or joi.",
        "lineNumbers": [24, 25],
        "codeSnippet": "function authenticateUser(username, password) {\n  // Missing validation\n  return database.query(`SELECT * FROM users WHERE username='${username}'`);\n}"
      }
    ]
  }
}
```
