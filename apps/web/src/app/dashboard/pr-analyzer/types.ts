export type VCSPlatform = 'github' | 'gitlab';

export interface PRAuthor {
  login: string;
  avatarUrl?: string;
}

export interface PRRepository {
  id: string;
  owner: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  defaultBranch: string;
}

export interface PRFile {
  path: string;
  status: 'added' | 'modified' | 'removed';
  additions: number;
  deletions: number;
  content?: string;
  patch?: string;
}

export interface PullRequest {
  id: string;
  platform: VCSPlatform;
  number: number;
  title: string;
  description?: string;
  state: string;
  url: string;
  headRef: string;
  baseRef: string;
  author: PRAuthor;
  repository: PRRepository;
  labels?: string[];
  files: PRFile[];
  additions: number;
  deletions: number;
  changedFiles: number;
  createdAt: string;
  updatedAt: string;
  mergedAt?: string;
  closedAt?: string;
}

export interface DatabasePR {
  id: string;
  repository_id: string;
  number: number;
  title: string;
  description: string | null;
  author: string;
  base_branch: string;
  head_branch: string;
  state: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  closed_at: string | null;
  metadata: Record<string, any>;
}

export interface DatabasePRFile {
  pr_id: string;
  path: string;
  status: string;
  additions: number;
  deletions: number;
  content: string | null;
  patch: string | null;
}

export interface AnalysisQueueItem {
  id: string;
  repository_id: string | null;
  pull_request_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PRAnalysis {
  id: string;
  prUrl: string;
  prId: number;
  platform: VCSPlatform;
  repository: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  summary: string;
  suggestions: Array<{
    id?: string;
    title: string;
    description: string;
    line_number?: number;
    file_path?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PRAnalysisError extends Error {
  code?: string;
  context?: Record<string, any>;
}