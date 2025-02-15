import type { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { DatabaseService } from '../../supabase/database';
import type { AuthProviderConfig } from '../../auth/types';
import { mockData } from '../../__mocks__/mockData';
import type { Database } from '../../types/database';

interface AuthResponse<T> {
  data: T;
  error: null;
}

interface MockSupabaseAuth {
  signInWithOAuth: jest.Mock<Promise<AuthResponse<{ url?: string; session?: Session }>>>;
  signOut: jest.Mock<Promise<{ error: null }>>;
  getSession: jest.Mock<Promise<AuthResponse<{ session: Session | null }>>>;
  getUser: jest.Mock<Promise<AuthResponse<{ user: User | null }>>>;
  onAuthStateChange: jest.Mock;
}

type SupabaseClientType = SupabaseClient<Database>;

interface MockSupabaseClient {
  auth: MockSupabaseAuth;
  from: jest.Mock;
  storage: {
    from: jest.Mock;
    createBucket: jest.Mock;
    getBucket: jest.Mock;
    listBuckets: jest.Mock;
    deleteBucket: jest.Mock;
    emptyBucket: jest.Mock;
  };
  rpc: jest.Mock;
  rest: {
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
  };
}

export const createMockSupabaseClient = (): jest.Mocked<SupabaseClientType> => {
  const mockClient: MockSupabaseClient = {
    auth: {
      signInWithOAuth: jest.fn().mockImplementation(() => Promise.resolve({
        data: {
          url: 'http://localhost:3000/auth/callback',
          session: mockAuthData.session
        },
        error: null
      })),
      signOut: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
      getSession: jest.fn().mockImplementation(() => Promise.resolve({
        data: { session: mockAuthData.session },
        error: null
      })),
      getUser: jest.fn().mockImplementation(() => Promise.resolve({
        data: { user: mockAuthData.users },
        error: null
      })),
      onAuthStateChange: jest.fn()
    },
    from: jest.fn(),
    storage: {
      from: jest.fn(),
      createBucket: jest.fn(),
      getBucket: jest.fn(),
      listBuckets: jest.fn(),
      deleteBucket: jest.fn(),
      emptyBucket: jest.fn()
    },
    rpc: jest.fn(),
    rest: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    }
  };

  return mockClient as unknown as jest.Mocked<SupabaseClientType>;
};

interface MockDatabaseServiceMethods {
  createUser: jest.Mock;
  getUser: jest.Mock;
  updateUser: jest.Mock;
  getUserByGithubId: jest.Mock;
  createRepository: jest.Mock;
  getRepositoryByOwnerAndName: jest.Mock;
  createPullRequest: jest.Mock;
  getPullRequest: jest.Mock;
  createAnalysisJob: jest.Mock;
  getNextAnalysisJob: jest.Mock;
}

export const createMockDatabaseService = (): jest.Mocked<DatabaseService> => {
  const methods: MockDatabaseServiceMethods = {
    createUser: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
    getUserByGithubId: jest.fn(),
    createRepository: jest.fn(),
    getRepositoryByOwnerAndName: jest.fn(),
    createPullRequest: jest.fn(),
    getPullRequest: jest.fn(),
    createAnalysisJob: jest.fn(),
    getNextAnalysisJob: jest.fn()
  };

  const mockService = { ...methods, supabase: createMockSupabaseClient() };
  return mockService as unknown as jest.Mocked<DatabaseService>;
};

export const defaultAuthConfig: AuthProviderConfig = {
  provider: 'github',
  defaultScopes: {
    github: ['repo', 'read:user'],
    gitlab: ['api', 'read_user'],
    microsoft: ['openid', 'email', 'profile']
  }
};

export const mockAuthData = {
  users: mockData.users,
  session: {
    access_token: 'test-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockData.users
  } as Session
};