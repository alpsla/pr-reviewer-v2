import type { Database } from '../types/database';

export const mockData = {
  users: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    auth_provider: 'github',
    status: 'active' as const,
    github_id: 'test-github-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } satisfies Database['public']['Tables']['users']['Row'],

  sessions: {
    id: 'test-session-id',
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer'
  }
};