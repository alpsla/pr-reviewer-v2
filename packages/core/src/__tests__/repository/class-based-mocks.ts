/**
 * This file provides class-based mocks for better type safety in tests
 */
import { 
  VCSClient, 
  VCSPlatform, 
  VCSUser, 
  VCSRepository, 
  VCSPullRequest,
  VCSPullRequestFile, 
  VCSPullRequestCommit,
  VCSPullRequestReview, 
  VCSPullRequestComment, 
  VCSPaginatedResponse
} from '../../vcs/types';

/**
 * Type definitions for mock methods
 */
type AnyMethodKey = keyof VCSClient;
type AnyMethod = (...args: unknown[]) => unknown;

export class MockVCSClient implements VCSClient {
  private platform: VCSPlatform;
  
  constructor(platform: VCSPlatform) {
    this.platform = platform;
    
    // Instead of trying to spy on methods directly,
    // we'll initialize them first and then apply spies after construction
    this.setupSpies();
  }
  
  private setupSpies() {
    // Type assertion to bypass TypeScript's strict checking
    const methods: AnyMethodKey[] = [
      'getPlatform',
      'getCurrentUser',
      'getRepository',
      'listUserRepositories',
      'listOrganizationRepositories',
      'getPullRequest',
      'listPullRequests',
      'getPullRequestFiles',
      'getPullRequestCommits',
      'getPullRequestReviews',
      'getPullRequestComments',
      'getRateLimit',
      'getRepositoryContents',
      'getFileContent',
      'getRepositoryTree'
    ];
    
    // Apply spies using type assertion
    methods.forEach(method => {
      // Cast to unknown first, then to Record<string, AnyMethod>
      jest.spyOn(this as unknown as Record<string, AnyMethod>, method);
    });
  }
  
  getPlatform(): VCSPlatform {
    return this.platform;
  }
  
  async getCurrentUser(): Promise<VCSUser> {
    return {
      id: 'mock-user-id',
      platform: this.platform,
      externalId: 'ext-123',
      login: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: 'https://example.com/avatar.png',
      url: 'https://example.com/user'
    };
  }
  
  async getRepository(owner: string, name: string): Promise<VCSRepository> {
    return {
      id: 'mock-repo-id',
      platform: this.platform,
      externalId: 'ext-repo-123',
      name,
      owner,
      fullName: `${owner}/${name}`,
      description: 'Mock repository for testing',
      isPrivate: false,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        admin: true,
        push: true,
        pull: true
      },
      url: `https://${this.platform}.com/${owner}/${name}`,
      language: 'TypeScript',
      topics: ['testing'],
      stargazersCount: 0,
      forksCount: 0
    };
  }
  
  async listUserRepositories(options?: Record<string, unknown>): Promise<VCSPaginatedResponse<VCSRepository>> {
    const repo = await this.getRepository('test-user', 'test-repo');
    return {
      data: [repo],
      pagination: {
        currentPage: options?.page ? Number(options.page) : 1,
        perPage: options?.perPage ? Number(options.perPage) : 30,
        hasNextPage: false,
        hasPreviousPage: false,
        page: options?.page ? Number(options.page) : 1,
        total: 1
      }
    };
  }
  
  async listOrganizationRepositories(org: string, options?: Record<string, unknown>): Promise<VCSPaginatedResponse<VCSRepository>> {
    const repo = await this.getRepository(org, 'test-repo');
    return {
      data: [repo],
      pagination: {
        currentPage: options?.page ? Number(options.page) : 1,
        perPage: options?.perPage ? Number(options.perPage) : 30,
        hasNextPage: false,
        hasPreviousPage: false,
        page: options?.page ? Number(options.page) : 1,
        total: 1
      }
    };
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPullRequest(_owner: string, _repo: string, _number: number): Promise<VCSPullRequest> {
    const repository = await this.getRepository(_owner, _repo);
    return {
      id: `mock-pr-${_number}`,
      platform: this.platform,
      externalId: `ext-pr-${_number}`,
      number: _number,
      title: `Test PR #${_number}`,
      description: `Test description for PR #${_number}`,
      state: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
      mergedAt: null,
      isDraft: false,
      user: await this.getCurrentUser(),
      head: {
        ref: 'feature-branch',
        sha: 'abc1234',
        repo: repository
      },
      base: {
        ref: 'main',
        sha: 'def5678',
        repo: repository
      },
      labels: ['test'],
      url: `https://${this.platform}.com/${_owner}/${_repo}/pull/${_number}`
    };
  }
  
  async listPullRequests(_owner: string, _repo: string, options?: Record<string, unknown>): Promise<VCSPaginatedResponse<VCSPullRequest>> {
    const pr1 = await this.getPullRequest(_owner, _repo, 1);
    const pr2 = await this.getPullRequest(_owner, _repo, 2);
    
    return {
      data: [pr1, pr2],
      pagination: {
        currentPage: options?.page ? Number(options.page) : 1,
        perPage: options?.perPage ? Number(options.perPage) : 30,
        hasNextPage: false,
        hasPreviousPage: false,
        page: options?.page ? Number(options.page) : 1,
        total: 2
      }
    };
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPullRequestFiles(_owner: string, _repo: string, _number: number): Promise<VCSPullRequestFile[]> {
    return [{
      sha: 'file-sha-123',
      filename: 'src/test.ts',
      status: 'modified',
      additions: 10,
      deletions: 5,
      changes: 15,
      patch: '@@ -1,5 +1,10 @@'
    }];
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPullRequestCommits(_owner: string, _repo: string, _number: number): Promise<VCSPullRequestCommit[]> {
    return [{
      sha: 'commit-sha-123',
      message: 'Test commit',
      author: {
        name: 'Test Author',
        email: 'author@example.com',
        date: new Date()
      },
      committer: {
        name: 'Test Committer',
        email: 'committer@example.com',
        date: new Date()
      },
      url: `https://${this.platform}.com/${_owner}/${_repo}/commit/abc123`
    }];
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPullRequestReviews(_owner: string, _repo: string, _number: number): Promise<VCSPullRequestReview[]> {
    return [{
      id: 'review-123',
      user: await this.getCurrentUser(),
      body: 'Looks good!',
      state: 'APPROVED',
      submittedAt: new Date(),
      commitId: 'commit-sha-123'
    }];
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPullRequestComments(_owner: string, _repo: string, _number: number): Promise<VCSPullRequestComment[]> {
    return [{
      id: 'comment-123',
      user: await this.getCurrentUser(),
      body: 'Great work!',
      createdAt: new Date(),
      updatedAt: new Date(),
      path: 'src/test.ts',
      position: 5,
      commitId: 'commit-sha-123'
    }];
  }
  
  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }> {
    return {
      limit: 5000,
      remaining: 4999,
      reset: new Date(Date.now() + 3600 * 1000),
      used: 1
    };
  }

  // Data collection extension methods
  async getRepositoryContents(owner: string, repo: string, path: string, ref?: string): Promise<any[]> {
    return [
      {
        name: 'file1.txt',
        path: `${path}/file1.txt`,
        sha: 'sha-123',
        size: 100,
        type: 'file',
        content: 'Mock file content',
        encoding: 'utf-8'
      }
    ];
  }

  async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string> {
    return 'Mock file content for ' + path;
  }

  async getRepositoryTree(owner: string, repo: string, ref: string = 'HEAD', recursive: boolean = false): Promise<any> {
    return {
      sha: 'tree-sha-123',
      tree: [
        {
          path: 'file1.txt',
          type: 'blob',
          sha: 'file-sha-123',
          size: 100
        },
        {
          path: 'dir/file2.txt',
          type: 'blob',
          sha: 'file-sha-456',
          size: 200
        }
      ],
      truncated: false
    };
  }
}

/**
 * Mock GitHub Client with proper inheritance
 */
export class MockGitHubClient extends MockVCSClient {
  constructor() {
    super('github');
  }
  
  // Override methods as needed for GitHub-specific behavior
}

/**
 * Mock GitLab Client with proper inheritance
 */
export class MockGitLabClient extends MockVCSClient {
  constructor() {
    super('gitlab');
  }
  
  // Override methods as needed for GitLab-specific behavior
}

/**
 * Mock Database Service with basic functionality
 */
export class MockDatabaseService {
  private repositories = new Map();
  private pullRequests = new Map();
  
  constructor() {
    // Setup spies after construction
    this.setupSpies();
  }
  
  private setupSpies() {
    // Type assertion to bypass TypeScript's strict checking
    const methods = [
      'getRepositoryByOwnerAndName',
      'createRepository',
      'updateRepository',
      'getPullRequestByNumber',
      'createPullRequest',
      'updatePullRequest'
    ];
    
    // Apply spies using type assertion
    methods.forEach(method => {
      // Cast to unknown first, then to Record<string, AnyMethod>
      jest.spyOn(this as unknown as Record<string, AnyMethod>, method);
    });
  }
  
  async getRepositoryByOwnerAndName(owner: string, name: string) {
    const key = `${owner}/${name}`;
    return this.repositories.get(key) || null;
  }
  
  async createRepository(repo: Record<string, unknown>) {
    const id = repo.id || `repo-${Date.now()}`;
    const storedRepo = {
      ...repo,
      id,
      external_id: repo.external_id || String(Date.now())
    };
    
    const key = `${repo.owner}/${repo.name}`;
    this.repositories.set(key, storedRepo);
    this.repositories.set(id, storedRepo);
    
    return storedRepo;
  }
  
  async updateRepository(id: string, data: Record<string, unknown>) {
    const repo = this.repositories.get(id);
    if (!repo) throw new Error(`Repository not found: ${id}`);
    
    const updatedRepo = {
      ...repo,
      ...data,
      id
    };
    
    this.repositories.set(id, updatedRepo);
    if (updatedRepo.owner && updatedRepo.name) {
      const key = `${updatedRepo.owner}/${updatedRepo.name}`;
      this.repositories.set(key, updatedRepo);
    }
    
    return updatedRepo;
  }
  
  async getPullRequestByNumber(repositoryId: string, number: number) {
    const key = `${repositoryId}:${number}`;
    return this.pullRequests.get(key) || null;
  }
  
  async createPullRequest(pr: Record<string, unknown>) {
    const id = pr.id || `pr-${Date.now()}`;
    const storedPR = {
      ...pr,
      id
    };
    
    const key = `${pr.repository_id}:${pr.number}`;
    this.pullRequests.set(key, storedPR);
    this.pullRequests.set(id, storedPR);
    
    return storedPR;
  }
  
  async updatePullRequest(id: string, data: Record<string, unknown>) {
    const pr = this.pullRequests.get(id);
    if (!pr) throw new Error(`Pull request not found: ${id}`);
    
    const updatedPR = {
      ...pr,
      ...data,
      id
    };
    
    this.pullRequests.set(id, updatedPR);
    const key = `${updatedPR.repository_id}:${updatedPR.number}`;
    this.pullRequests.set(key, updatedPR);
    
    return updatedPR;
  }
  
  // Helper to clear storage between tests
  clearStorage() {
    this.repositories.clear();
    this.pullRequests.clear();
  }
}
