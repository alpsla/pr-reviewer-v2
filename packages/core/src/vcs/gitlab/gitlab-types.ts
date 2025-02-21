/**
 * GitLab API response types
 */
export interface GitLabUser {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url: string;
  web_url: string;
}

export interface GitLabProject {
  id: number;
  path: string;
  name: string;
  description: string | null;
  visibility: 'private' | 'internal' | 'public';
  path_with_namespace: string;
  default_branch: string;
  created_at: string;
  last_activity_at: string;
  web_url: string;
  star_count: number;
  forks_count: number;
  namespace: {
    path: string;
    name: string;
  };
  permissions: {
    project_access?: {
      access_level: number;
    };
    group_access?: {
      access_level: number;
    };
  };
  topics: string[];
  tag_list: string[];
  predominant_language?: string;
}

export interface GitLabMergeRequest {
  id: number;
  iid: number;
  title: string;
  description: string | null;
  state: 'opened' | 'closed' | 'merged' | 'locked';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  work_in_progress: boolean;
  author: GitLabUser;
  source_branch: string;
  target_branch: string;
  sha: string;
  diff_refs: {
    head_sha: string;
    base_sha: string;
  };
  labels: string[];
}

export interface GitLabChange {
  new_path: string;
  old_path: string;
  renamed_file: boolean;
  deleted_file: boolean;
  new_file: boolean;
  additions: number;
  deletions: number;
  diff: string;
}

export interface GitLabCommit {
  id: string;
  message: string;
  author_name: string;
  author_email: string;
  created_at: string;
  committed_date: string;
  committer_name: string;
  committer_email: string;
  web_url: string;
}

export interface GitLabApproval {
  user: GitLabUser;
}

export interface GitLabNote {
  id: number;
  body: string;
  author: GitLabUser;
  created_at: string;
  updated_at: string;
  system: boolean;
  position?: {
    new_path: string;
    new_line: number;
    old_line: number;
    head_sha: string;
    start_sha: string;
  };
}

export interface GitLabDiscussion {
  id: string;
  notes: GitLabNote[];
}