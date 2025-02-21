/**
 * Test type definitions to avoid using 'any' in test files
 */

import { VCSClient, VCSPlatform } from '../../vcs/types';

/**
 * Simple mock database interface for testing
 * Implements the minimal required interface for DatabaseService
 */
export interface MockDatabase {
  getRepositoryByOwnerAndName: jest.Mock;
  createRepository: jest.Mock;
  getPullRequestByNumber: jest.Mock;
  createPullRequest: jest.Mock;
  createUser?: jest.Mock;
  getUser?: jest.Mock;
  getUserByGithubId?: jest.Mock;
  updateUser?: jest.Mock;
  getPullRequest?: jest.Mock;
  createAnalysisJob?: jest.Mock;
  getNextAnalysisJob?: jest.Mock;
  [key: string]: jest.Mock | unknown;
}

/**
 * Simplified client for tests
 */
export interface SimplifiedVCSClient extends Partial<VCSClient> {
  getPlatform: () => VCSPlatform;
  [key: string]: jest.Mock | (() => VCSPlatform) | unknown;
}

/**
 * Generic response type for tests
 */
export interface MockResponse<T = unknown> {
  status: number;
  data: T;
  headers?: Record<string, string>;
}

/**
 * Error response
 */
export interface MockErrorResponse {
  status: number;
  message: string;
  response?: {
    data?: unknown;
    status?: number;
    headers?: Record<string, string>;
  };
}
