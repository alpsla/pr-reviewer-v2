/**
 * Interface definitions for the PR analyzer page
 */

import { PullRequest } from './types';

export interface RepositoryData {
  id: string;
  owner: string;
  name: string;
  platform?: string;
  external_id?: string;
  description?: string | null;
  is_private?: boolean;
  default_branch?: string;
  created_at?: string;
  updated_at?: string;
  last_synced_at?: string;
  url?: string;
  has_admin_access?: boolean;
  has_write_access?: boolean;
  language?: string | null;
  topics?: string[];
  stargazers_count?: number;
  forks_count?: number;
  [key: string]: any; // For additional properties
}

export interface PullRequestData {
  id: string;
  repository_id: string;
  number: number;
  platform?: string;
  external_id?: string;
  title?: string;
  description?: string | null;
  state?: string;
  created_at?: string;
  updated_at?: string;
  closed_at?: string | null;
  merged_at?: string | null;
  is_draft?: boolean;
  author_id?: string;
  author_login?: string;
  author_name?: string;
  author_avatar_url?: string;
  head_ref?: string;
  base_ref?: string;
  head_sha?: string;
  base_sha?: string;
  labels?: string[];
  url?: string;
  [key: string]: any; // For additional properties
}

export interface UserData {
  id: string;
  name?: string;
  email?: string;
  github_id?: string;
  login?: string;
  avatar_url?: string;
  [key: string]: any; // For additional properties
}

export interface AnalysisRequestData {
  id: string;
  pull_request_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
  completed_at?: string | null;
  user_id?: string;
  model?: string;
  options?: Record<string, unknown>;
  [key: string]: any; // For additional properties
}

export interface AnalysisResultData {
  id: string;
  pull_request_id: string;
  analysis_request_id?: string;
  summary: string;
  details: {
    issues: Array<{
      id: string;
      title: string;
      description: string;
      severity: string;
      line_number?: number;
      file_path?: string;
      [key: string]: any;
    }>;
    suggestions: Array<{
      id: string;
      title: string;
      description: string;
      line_number?: number;
      file_path?: string;
      [key: string]: any;
    }>;
    metrics: {
      complexity?: string;
      test_coverage?: string;
      changes_size?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // For additional properties
}

export interface SettingsData {
  id: string;
  github_token?: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
  default_model?: string;
  default_language?: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // For additional properties
}
