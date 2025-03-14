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
  getRepositoryTree(owner: string, repo: string, ref?: string): Promise<RepositoryTree>;
  getRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>>;
  
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
  checkRepositoryAccess(owner: string, repo: string, provider: string): Promise<AccessStatus>;
  
  // PR Operations
  getPullRequest(owner: string, repo: string, number: number, provider: string): Promise<PullRequest>;
  getPullRequestFromUrl(url: string): Promise<PullRequest>;
  getPullRequestFiles(pullRequestId: string): Promise<PRFile[]>;
  getPullRequestDetails(owner: string, repo: string, number: number, provider: string): Promise<PullRequestDetails>;
  
  // Repository Data Operations
  getRepositoryTree(owner: string, repo: string, provider: string): Promise<RepositoryTree>;
  getRepositoryLanguages(owner: string, repo: string, provider: string): Promise<Record<string, number>>;
  getRepositoryDependencies(owner: string, repo: string, provider: string): Promise<Dependencies>;
  getRepositorySecurityInfo(owner: string, repo: string, provider: string): Promise<SecurityInfo>;
  getRepositoryStructure(owner: string, repo: string, provider: string): Promise<RepositoryStructure>;
  getRepositoryPerformanceIndicators(owner: string, repo: string, provider: string): Promise<PerformanceIndicators>;
  
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
  
  // Background Data Collection
  scheduleRepositoryDataCollection(repoId: string, dataTypes: string[]): Promise<void>;
  getDataCollectionStatus(repoId: string): Promise<DataCollectionStatus>;
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
  
  // Repository Data Methods
  saveRepositoryTree(repositoryId: string, tree: RepositoryTree): Promise<boolean>;
  saveRepositoryLanguages(repositoryId: string, languages: Record<string, number>): Promise<boolean>;
  saveRepositoryDependencies(repositoryId: string, dependencies: Dependencies): Promise<boolean>;
  saveRepositorySecurityInfo(repositoryId: string, securityInfo: SecurityInfo): Promise<boolean>;
  saveRepositoryStructure(repositoryId: string, structure: RepositoryStructure): Promise<boolean>;
  saveRepositoryPerformanceIndicators(repositoryId: string, indicators: PerformanceIndicators): Promise<boolean>;
  
  // Analysis Methods
  createAnalysisJob(data: Partial<AnalysisJob>): Promise<AnalysisJob>;
  updateAnalysisJob(id: string, data: Partial<AnalysisJob>): Promise<AnalysisJob>;
  saveAnalysisResults(jobId: string, results: AnalysisResult): Promise<boolean>;
  saveSecurityFindings(repositoryId: string, findings: SecurityFinding[]): Promise<boolean>;
  savePerformanceIndicators(repositoryId: string, indicators: PerformanceIndicator[]): Promise<boolean>;
  
  // Data Collection Methods
  createDataCollectionJob(repositoryId: string, dataTypes: string[]): Promise<DataCollectionJob>;
  updateDataCollectionJob(id: string, data: Partial<DataCollectionJob>): Promise<DataCollectionJob>;
  getDataCollectionJobs(repositoryId: string, status?: string): Promise<DataCollectionJob[]>;
  
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

## Background Processing

### DataCollector Interface

```typescript
interface DataCollector {
  // Queue Management
  scheduleCollection(repositoryId: string, dataTypes: string[], priority?: number): Promise<DataCollectionJob>;
  processJob(job: DataCollectionJob): Promise<void>;
  
  // Collection Methods
  collectRepositoryTree(repositoryId: string): Promise<RepositoryTree>;
  collectRepositoryLanguages(repositoryId: string): Promise<Record<string, number>>;
  collectRepositoryDependencies(repositoryId: string): Promise<Dependencies>;
  collectRepositorySecurityInfo(repositoryId: string): Promise<SecurityInfo>;
  collectRepositoryStructure(repositoryId: string): Promise<RepositoryStructure>;
  collectRepositoryPerformanceIndicators(repositoryId: string): Promise<PerformanceIndicators>;
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

// GET /api/repos/:owner/:repo/access
// Params: { owner: string, repo: string }
// Query: { provider: string }
// Response: { access: AccessStatus }

// GET /api/repos/:owner/:repo/structure
// Params: { owner: string, repo: string }
// Query: { provider: string }
// Response: { structure: RepositoryStructure }

// GET /api/repos/:owner/:repo/languages
// Params: { owner: string, repo: string }
// Query: { provider: string }
// Response: { languages: Record<string, number> }

// GET /api/repos/:owner/:repo/dependencies
// Params: { owner: string, repo: string }
// Query: { provider: string }
// Response: { dependencies: Dependencies }

// GET /api/repos/:owner/:repo/security
// Params: { owner: string, repo: string }
// Query: { provider: string }
// Response: { security: SecurityInfo }

// GET /api/repos/:owner/:repo/performance
// Params: { owner: string, repo: string }
// Query: { provider: string }
// Response: { performance: PerformanceIndicators }
```

### PR Routes

```typescript
// GET /api/prs/:owner/:repo/:number/details
// Params: { owner: string, repo: string, number: number }
// Query: { provider: string }
// Response: { details: PullRequestDetails }

// GET /api/prs/:owner/:repo/:number/files
// Params: { owner: string, repo: string, number: number }
// Query: { provider: string }
// Response: { files: PRFile[] }
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

// POST /api/analysis/data-collection
// Request: { repositoryId: string, dataTypes: string[] }
// Response: { job: DataCollectionJob }

// GET /api/analysis/data-collection/:repositoryId
// Params: { repositoryId: string }
// Response: { jobs: DataCollectionJob[] }
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

class RepositoryAccessError extends VCSError {
  constructor(message: string, details?: any) {
    super(message, 'access-denied', 403, details);
  }
}

// Analysis errors
class AnalysisError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, `analysis/${code}`, 500, details);
  }
}

// Data Collection errors
class DataCollectionError extends AppError {
  constructor(message: string, code: string, details?: any) {
    super(message, `data-collection/${code}`, 500, details);
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
  lastAnalyzedAt?: Date;
  fingerprint?: string;
  analysisCount?: number;
  freeTierLimit?: number;
}

interface AccessStatus {
  hasAccess: boolean;
  private: boolean;
  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
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

interface PullRequestDetails {
  id: string;
  pullRequest: PullRequest;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  commits: number;
  reviewers?: string[];
  labels?: string[];
  milestone?: string;
  isDraft?: boolean;
  mergeableState?: string;
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

interface RepositoryTree {
  sha: string;
  tree: TreeItem[];
}

interface TreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface RepositoryStructure {
  id: string;
  repositoryId: string;
  rootDirectories: DirectoryNode[];
  fileTypes: Record<string, number>;
  specialDirectories: Record<string, string>;
  lastUpdated: Date;
}

interface DirectoryNode {
  path: string;
  type: 'directory' | 'file';
  children?: DirectoryNode[];
  size?: number;
  extension?: string;
}

interface Dependencies {
  id: string;
  repositoryId: string;
  packageManagers: string[];
  directDependencies: Dependency[];
  devDependencies: Dependency[];
  transitiveDependencies?: Dependency[];
  vulnerabilities: DependencyVulnerability[];
  lastUpdated: Date;
}

interface Dependency {
  name: string;
  version: string;
  latestVersion?: string;
  outdated?: boolean;
  packageManager: string;
}

interface DependencyVulnerability {
  id: string;
  dependencyName: string;
  dependencyVersion: string;
  vulnerability: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fixedInVersion?: string;
}

interface SecurityInfo {
  id: string;
  repositoryId: string;
  findings: SecurityFinding[];
  lastUpdated: Date;
}

interface SecurityFinding {
  id: string;
  type: 'dependency' | 'code' | 'configuration';
  path?: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation?: string;
  cwe?: string;
  detectedAt: Date;
}

interface PerformanceIndicators {
  id: string;
  repositoryId: string;
  indicators: PerformanceIndicator[];
  lastUpdated: Date;
}

interface PerformanceIndicator {
  id: string;
  type: 'asset_size' | 'query_complexity' | 'api_overhead' | 'memory_usage' | 'worker_config';
  path?: string;
  measurement: Record<string, any>;
  impact: 'high' | 'medium' | 'low';
  recommendation?: string;
  detectedAt: Date;
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

interface DataCollectionJob {
  id: string;
  repositoryId: string;
  dataTypes: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  retryCount: number;
}

interface DataCollectionStatus {
  repositoryId: string;
  collectedDataTypes: string[];
  pendingDataTypes: string[];
  failedDataTypes: string[];
  lastUpdated: Date;
  completionPercentage: number;
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

### Request Repository Data Collection

```http
POST /api/analysis/data-collection
Content-Type: application/json

{
  "repositoryId": "b2c3d4e5-f6g7-8901-ijkl-mn2345678901",
  "dataTypes": ["languages", "dependencies", "security", "structure", "performance"]
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "job": {
    "id": "d4e5f6g7-h8i9-0123-uvwx-yz4567890123",
    "status": "pending",
    "dataTypes": ["languages", "dependencies", "security", "structure", "performance"],
    "createdAt": "2025-02-26T12:37:45.123Z",
    "repositoryId": "b2c3d4e5-f6g7-8901-ijkl-mn2345678901",
    "completionPercentage": 0
  }
}
```

### Get PR Details with Initial Data

```http
GET /api/prs/owner/repo/123/details?provider=github
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "details": {
    "id": "b2c3d4e5-f6g7-8901-ijkl-mn2345678901",
    "pullRequest": {
      "id": "c3d4e5f6-g7h8-9012-opqr-st3456789012",
      "title": "Add user authentication",
      "number": 123,
      "state": "open",
      "url": "https://github.com/owner/repo/pull/123",
      "authorUsername": "developer",
      "baseBranch": "main",
      "headBranch": "feature/auth",
      "createdAt": "2025-02-25T10:15:30.456Z",
      "updatedAt": "2025-02-26T09:22:15.789Z"
    },
    "filesChanged": 5,
    "linesAdded": 120,
    "linesRemoved": 25,
    "commits": 3
  },
  "dataCollectionStatus": {
    "pendingDataTypes": ["security", "performance"],
    "collectedDataTypes": ["languages", "structure"],
    "completionPercentage": 40
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
