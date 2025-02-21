/**
 * Mock data for GitLab API responses
 * These mocks follow the structure of actual GitLab API responses
 */

// Mock GitLab project (equivalent to a repository)
export const mockGitLabProject = {
  id: 12345678,
  name: 'test-repo',
  path: 'test-repo',
  path_with_namespace: 'test-group/test-repo',
  namespace: {
    id: 98765432,
    name: 'Test Group',
    path: 'test-group',
    kind: 'group',
    full_path: 'test-group',
    parent_id: null,
    avatar_url: 'https://secure.gravatar.com/avatar/abcd1234?s=80&d=identicon'
  },
  description: 'Test repository for unit tests',
  default_branch: 'main',
  visibility: 'public',
  ssh_url_to_repo: 'git@gitlab.com:test-group/test-repo.git',
  http_url_to_repo: 'https://gitlab.com/test-group/test-repo.git',
  web_url: 'https://gitlab.com/test-group/test-repo',
  readme_url: 'https://gitlab.com/test-group/test-repo/-/blob/main/README.md',
  created_at: '2022-01-01T00:00:00Z',
  last_activity_at: '2023-01-01T00:00:00Z',
  forks_count: 5,
  star_count: 10,
  open_issues_count: 2,
  merge_requests_enabled: true,
  jobs_enabled: true,
  wiki_enabled: true,
  snippets_enabled: true,
  container_registry_enabled: true,
  created_by_id: 12345,
  packages_enabled: true,
  empty_repo: false,
  archived: false,
  avatar_url: null,
  shared_runners_enabled: true,
  public_jobs: true,
  permissions: {
    project_access: {
      access_level: 40,
      notification_level: 3
    },
    group_access: {
      access_level: 50,
      notification_level: 3
    }
  }
};

// Mock GitLab merge request (equivalent to a pull request)
export const mockGitLabMergeRequest = {
  id: 987654321,
  iid: 42,
  project_id: 12345678,
  title: 'Test merge request',
  description: 'This is a test merge request for unit testing',
  state: 'opened',
  created_at: '2023-03-01T00:00:00Z',
  updated_at: '2023-03-02T00:00:00Z',
  merged_at: null,
  closed_at: null,
  target_branch: 'main',
  source_branch: 'feature-branch',
  user_notes_count: 5,
  upvotes: 1,
  downvotes: 0,
  author: {
    id: 12345,
    name: 'Test User',
    username: 'test-user',
    state: 'active',
    avatar_url: 'https://secure.gravatar.com/avatar/abcd1234?s=80&d=identicon',
    web_url: 'https://gitlab.com/test-user'
  },
  assignees: [],
  assignee: null,
  reviewers: [],
  source_project_id: 12345678,
  target_project_id: 12345678,
  labels: ['enhancement', 'bug'],
  work_in_progress: false,
  milestone: null,
  merge_when_pipeline_succeeds: false,
  merge_status: 'can_be_merged',
  sha: 'abc1234567890defghijklmnopqrstuvwxyz1234',
  merge_commit_sha: null,
  squash_commit_sha: null,
  discussion_locked: null,
  should_remove_source_branch: true,
  force_remove_source_branch: false,
  reference: '!42',
  web_url: 'https://gitlab.com/test-group/test-repo/-/merge_requests/42',
  time_stats: {
    time_estimate: 0,
    total_time_spent: 0,
    human_time_estimate: null,
    human_total_time_spent: null
  },
  squash: false,
  task_completion_status: {
    count: 0,
    completed_count: 0
  },
  has_conflicts: false,
  blocking_discussions_resolved: true,
  approvals_before_merge: 1
};

// Mock GitLab changes (files modified in merge request)
export const mockGitLabChanges = {
  changes: [
    {
      old_path: 'src/components/Button.tsx',
      new_path: 'src/components/Button.tsx',
      a_mode: '100644',
      b_mode: '100644',
      new_file: false,
      renamed_file: false,
      deleted_file: false,
      diff: '@@ -10,7 +10,22 @@ export const Button = ({\n' +
        '   onClick,\n' +
        '   children\n' +
        ' }) => {\n' +
        '-  return <button className="btn" onClick={onClick}>{children}</button>;\n' +
        '+  return (\n' +
        '+    <button \n' +
        '+      className="btn btn-primary" \n' +
        '+      onClick={onClick}\n' +
        '+      aria-label="Button"\n' +
        '+    >\n' +
        '+      {children}\n' +
        '+    </button>\n' +
        '+  );\n' +
        ' };\n'
    },
    {
      old_path: 'src/types/index.ts',
      new_path: 'src/types/index.ts',
      a_mode: '100644',
      b_mode: '100644',
      new_file: false,
      renamed_file: false,
      deleted_file: false,
      diff: '@@ -25,6 +25,21 @@ export interface User {\n' +
        '   avatarUrl: string;\n' +
        '   email?: string;\n' +
        ' }\n' +
        '+\n' +
        '+export interface ButtonProps {\n' +
        '+  /**\n' +
        '+   * Button variant\n' +
        '+   */\n' +
        '+  variant?: \'primary\' | \'secondary\' | \'danger\';\n' +
        '+  \n' +
        '+  /**\n' +
        '+   * Button size\n' +
        '+   */\n' +
        '+  size?: \'sm\' | \'md\' | \'lg\';\n' +
        '+  \n' +
        '+  /**\n' +
        '+   * Click handler\n' +
        '+   */\n' +
        '+  onClick?: () => void;\n' +
        '+}\n'
    }
  ]
};

// Mock GitLab commits
export const mockGitLabCommits = [
  {
    id: 'abc1234567890defghijklmnopqrstuvwxyz1234',
    short_id: 'abc1234',
    created_at: '2023-03-01T10:00:00Z',
    title: 'Add button component enhancements',
    message: 'Add button component enhancements\n\nImproves accessibility and styling',
    author_name: 'Test User',
    author_email: 'test.user@example.com',
    authored_date: '2023-03-01T10:00:00Z',
    committer_name: 'Test User',
    committer_email: 'test.user@example.com',
    committed_date: '2023-03-01T10:00:00Z',
    web_url: 'https://gitlab.com/test-group/test-repo/-/commit/abc1234567890defghijklmnopqrstuvwxyz1234',
    parent_ids: ['ghi9876543210abcdefghijklmnopqrstuv5432']
  },
  {
    id: 'def1234567890abcghijklmnopqrstuvwxyz5678',
    short_id: 'def1234',
    created_at: '2023-03-01T11:30:00Z',
    title: 'Update button component types',
    message: 'Update button component types\n\nAdds proper TypeScript definitions',
    author_name: 'Test User',
    author_email: 'test.user@example.com',
    authored_date: '2023-03-01T11:30:00Z',
    committer_name: 'Test User',
    committer_email: 'test.user@example.com',
    committed_date: '2023-03-01T11:30:00Z',
    web_url: 'https://gitlab.com/test-group/test-repo/-/commit/def1234567890abcghijklmnopqrstuvwxyz5678',
    parent_ids: ['abc1234567890defghijklmnopqrstuvwxyz1234']
  }
];

// Mock GitLab approvals
export const mockGitLabApprovals = {
  id: 42,
  iid: 42,
  project_id: 12345678,
  title: 'Test merge request',
  description: 'This is a test merge request for unit testing',
  state: 'opened',
  created_at: '2023-03-01T00:00:00Z',
  updated_at: '2023-03-02T00:00:00Z',
  merge_status: 'can_be_merged',
  approved: true,
  approvals_required: 1,
  approvals_left: 0,
  approved_by: [
    {
      user: {
        id: 23456,
        name: 'Reviewer 1',
        username: 'reviewer1',
        state: 'active',
        avatar_url: 'https://secure.gravatar.com/avatar/efgh5678?s=80&d=identicon',
        web_url: 'https://gitlab.com/reviewer1'
      }
    }
  ]
};

// Mock GitLab discussions and comments
export const mockGitLabDiscussions = [
  {
    id: 'discussion-1',
    individual_note: true,
    notes: [
      {
        id: 123456789,
        type: 'DiscussionNote',
        body: 'Great work on this MR!',
        author: {
          id: 45678,
          name: 'Team Lead',
          username: 'team-lead',
          state: 'active',
          avatar_url: 'https://secure.gravatar.com/avatar/ijkl9012?s=80&d=identicon',
          web_url: 'https://gitlab.com/team-lead'
        },
        created_at: '2023-03-02T11:00:00Z',
        updated_at: '2023-03-02T11:00:00Z',
        system: false,
        noteable_id: 42,
        noteable_type: 'MergeRequest'
      }
    ]
  },
  {
    id: 'discussion-2',
    individual_note: false,
    notes: [
      {
        id: 987654321,
        type: 'DiffNote',
        body: 'Consider adding a data-testid attribute for better testing.',
        author: {
          id: 34567,
          name: 'Reviewer 2',
          username: 'reviewer2',
          state: 'active',
          avatar_url: 'https://secure.gravatar.com/avatar/mnop3456?s=80&d=identicon',
          web_url: 'https://gitlab.com/reviewer2'
        },
        created_at: '2023-03-02T10:35:00Z',
        updated_at: '2023-03-02T10:35:00Z',
        system: false,
        noteable_id: 42,
        noteable_type: 'MergeRequest',
        position: {
          base_sha: 'ghi9876543210abcdefghijklmnopqrstuv5432',
          start_sha: 'ghi9876543210abcdefghijklmnopqrstuv5432',
          head_sha: 'def1234567890abcghijklmnopqrstuvwxyz5678',
          old_path: 'src/components/Button.tsx',
          new_path: 'src/components/Button.tsx',
          position_type: 'text',
          old_line: null,
          new_line: 15
        }
      },
      {
        id: 987654322,
        type: 'DiscussionNote',
        body: 'Good point, I\'ll add it.',
        author: {
          id: 12345,
          name: 'Test User',
          username: 'test-user',
          state: 'active',
          avatar_url: 'https://secure.gravatar.com/avatar/abcd1234?s=80&d=identicon',
          web_url: 'https://gitlab.com/test-user'
        },
        created_at: '2023-03-02T10:40:00Z',
        updated_at: '2023-03-02T10:40:00Z',
        system: false,
        noteable_id: 42,
        noteable_type: 'MergeRequest'
      }
    ]
  }
];

// Mock GitLab user
export const mockGitLabUser = {
  id: 12345,
  name: 'Test User',
  username: 'test-user',
  state: 'active',
  avatar_url: 'https://secure.gravatar.com/avatar/abcd1234?s=80&d=identicon',
  web_url: 'https://gitlab.com/test-user',
  created_at: '2020-01-01T00:00:00Z',
  bio: 'GitLab test user',
  public_email: 'test.user@example.com',
  skype: '',
  linkedin: '',
  twitter: '',
  website_url: 'https://example.com',
  organization: 'Test Organization',
  job_title: 'Developer',
  work_information: null,
  location: 'Testland',
  email: 'test.user@example.com'
};
