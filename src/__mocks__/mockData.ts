import type { MockData } from '../types/database';

export const mockData: MockData = {
  users: {
    id: 'user-123',
    github_id: '12345',
    email: 'test@example.com',
    name: 'Test User',
    avatar_url: 'https://example.com/avatar.png',
    aud: 'authenticated',
    created_at: '2024-02-07T00:00:00.000Z',
    role: 'authenticated',
    updated_at: '2024-02-07T00:00:00.000Z',
    app_metadata: {
      provider: 'azure',
      provider_token: 'test-token'
    },
    user_metadata: {
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.png'
    }
  },
  repositories: {
    id: 'repo-123',
    owner: 'test-owner',
    name: 'test-repo',
    full_name: 'test-owner/test-repo',
    description: 'Test repository'
  },
  pull_requests: {
    id: 'pr-123',
    number: 1,
    title: 'Test PR',
    repository_id: 'repo-123',
    status: 'open',
    author: 'test-user'
  },
  analysis_queue: {
    id: 'job-123',
    status: 'pending',
    pull_request_id: 'pr-123',
    created_at: new Date().toISOString()
  }
};