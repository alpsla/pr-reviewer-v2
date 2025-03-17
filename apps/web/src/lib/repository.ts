/**
 * Direct implementation of Repository-related services
 * This replaces imports from @pr-reviewer/core
 */

import { DatabaseService } from './database';
import { DEFAULT_FREE_TIER_ANALYSIS_LIMIT, getAnalysisLimit } from '@/config/limits';

export class AnalysisLimitError extends Error {
  current: number;
  limit: number;
  
  constructor(message: string, current: number, limit: number) {
    super(message);
    this.name = 'AnalysisLimitError';
    this.current = current;
    this.limit = limit;
  }
}

export class RepositoryError extends Error {
  details?: any;
  
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'RepositoryError';
    this.details = details;
  }
}

export class RepositoryService {
  dbService: DatabaseService;
  tokens: any;
  baseUrls?: { github?: string; gitlab?: string; };
  
  constructor(
    dbService: DatabaseService, 
    tokens: any = {}, 
    baseUrls?: { github?: string; gitlab?: string; }
  ) {
    this.dbService = dbService;
    this.tokens = tokens;
    this.baseUrls = baseUrls;
    console.log('Direct RepositoryService initialized');
  }

  async getRepository(platform: string, owner: string, name: string): Promise<any> {
    console.log('RepositoryService.getRepository called:', platform, owner, name);
    return {
      id: 'mock-repo-id',
      platform,
      owner,
      name,
      fullName: `${owner}/${name}`,
      private: false,
      defaultBranch: 'main'
    };
  }

  async incrementAnalysisCount(platform: string, owner: string, repo: string, bypassLimit: boolean = false): Promise<number> {
    console.log('RepositoryService.incrementAnalysisCount called:', platform, owner, repo);
    
    if (!bypassLimit) {
      const limit = getAnalysisLimit(platform, owner, repo);
      throw new AnalysisLimitError(
        `Repository '${owner}/${repo}' has reached the free tier analysis limit (${limit}/${limit})`,
        limit, 
        limit
      );
    }
    
    return 6;
  }

  async checkRepositoryAccess(platform: string, owner: string, repo: string): Promise<any> {
    console.log('RepositoryService.checkRepositoryAccess called:', platform, owner, repo);
    return {
      hasAccess: true,
      private: false,
      permissions: { pull: true, push: false, admin: false }
    };
  }
  
  /**
   * Check if a repository has reached its analysis limit
   */
  async checkAnalysisLimit(platform: string, owner: string, repo: string): Promise<any> {
    console.log('RepositoryService.checkAnalysisLimit called:', platform, owner, repo);
    
    // Mock implementation - returns limits based on configuration
    const limit = getAnalysisLimit(platform, owner, repo);
    return {
      current: 3,
      limit: limit,
      hasReachedLimit: false,
      owner,
      repo,
      platform,
      remainingAnalyses: limit - 3
    };
  }

  /**
   * Get a pull request by platform, owner, repo, and number
   */
  async getPullRequest(platform: string, owner: string, repo: string, number: number): Promise<any> {
    console.log('RepositoryService.getPullRequest called:', platform, owner, repo, number);
    
    // Mock implementation - returns fake PR data
    return {
      id: `${platform}-${owner}-${repo}-${number}`,
      number,
      title: `Mock PR #${number}`,
      body: "This is a mock pull request description",
      state: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        login: "mock-user",
        avatarUrl: "https://example.com/avatar.png"
      },
      baseRef: {
        name: "main",
        sha: "mock-base-sha"
      },
      headRef: {
        name: "feature-branch",
        sha: "mock-head-sha"
      },
      repository: {
        owner,
        name: repo,
        fullName: `${owner}/${repo}`
      }
    };
  }

  /**
   * Get pull request files
   */
  async getPullRequestFiles(platform: string, owner: string, repo: string, number: number): Promise<any[]> {
    console.log('RepositoryService.getPullRequestFiles called:', platform, owner, repo, number);
    
    // Mock implementation - returns fake PR files
    return [
      {
        filename: "src/mock-file-1.js",
        status: "modified",
        additions: 10,
        deletions: 5,
        changes: 15,
        patch: "@@ -1,5 +1,10 @@\n// Mock diff content\n+Added line\n-Removed line"
      },
      {
        filename: "src/mock-file-2.js",
        status: "added",
        additions: 20,
        deletions: 0,
        changes: 20,
        patch: "@@ -0,0 +1,20 @@\n// New file content\n+Added line"
      }
    ];
  }

  /**
   * Get pull request commits
   */
  async getPullRequestCommits(platform: string, owner: string, repo: string, number: number): Promise<any[]> {
    console.log('RepositoryService.getPullRequestCommits called:', platform, owner, repo, number);
    
    // Mock implementation - returns fake PR commits
    return [
      {
        sha: "mock-commit-sha-1",
        message: "Mock commit message 1",
        author: {
          name: "Mock Author",
          email: "mock@example.com",
          date: new Date().toISOString()
        },
        committer: {
          name: "Mock Committer",
          email: "mock@example.com",
          date: new Date().toISOString()
        }
      },
      {
        sha: "mock-commit-sha-2",
        message: "Mock commit message 2",
        author: {
          name: "Mock Author",
          email: "mock@example.com",
          date: new Date().toISOString()
        },
        committer: {
          name: "Mock Committer",
          email: "mock@example.com",
          date: new Date().toISOString()
        }
      }
    ];
  }
}

// Re-export utility functions for backward compatibility
import { createRepositoryFingerprint } from './repository-utils';
export { createRepositoryFingerprint };
