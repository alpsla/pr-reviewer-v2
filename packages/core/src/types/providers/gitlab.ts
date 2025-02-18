import { BaseProviderUser, BaseProviderScope } from './base';

export interface GitLabUser extends BaseProviderUser {
  username: string;
  web_url: string;
  state: string;
  access_level?: number;
}

export interface GitLabScope extends BaseProviderScope {
  name: 'api' | 'read_user' | 'read_repository' | 'write_repository';
}

export interface GitLabTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}