/**
 * Mock data for GitHub API responses
 * These mocks follow the structure of actual GitHub API responses
 */

// Mock GitHub repository
export const mockGitHubRepo = {
  id: 12345678,
  node_id: 'R_kgDOBs7Abcd',
  name: 'test-repo',
  full_name: 'test-org/test-repo',
  private: false,
  owner: {
    login: 'test-org',
    id: 98765432,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjk4NzY1NDMy',
    avatar_url: 'https://avatars.githubusercontent.com/u/98765432?v=4',
    url: 'https://api.github.com/users/test-org',
    html_url: 'https://github.com/test-org',
    type: 'Organization',
  },
  html_url: 'https://github.com/test-org/test-repo',
  description: 'Test repository for unit tests',
  fork: false,
  url: 'https://api.github.com/repos/test-org/test-repo',
  created_at: '2022-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  pushed_at: '2023-02-01T00:00:00Z',
  homepage: null,
  size: 1024,
  stargazers_count: 10,
  watchers_count: 10,
  language: 'TypeScript',
  forks_count: 5,
  open_issues_count: 2,
  master_branch: 'main',
  default_branch: 'main',
  topics: ['testing', 'typescript', 'api'],
  permissions: {
    admin: true,
    maintain: true,
    push: true,
    triage: true,
    pull: true
  },
  allow_squash_merge: true,
  allow_merge_commit: true,
  allow_rebase_merge: true,
  archived: false,
  visibility: 'public'
};

// Mock GitHub pull request
export const mockGitHubPR = {
  id: 987654321,
  node_id: 'PR_kwDOBs7AbcdefA',
  number: 42,
  state: 'open',
  title: 'Test pull request',
  body: 'This is a test pull request for unit testing',
  created_at: '2023-03-01T00:00:00Z',
  updated_at: '2023-03-02T00:00:00Z',
  closed_at: null,
  merged_at: null,
  merge_commit_sha: null,
  draft: false,
  user: {
    login: 'test-user',
    id: 12345,
    node_id: 'MDQ6VXNlcjEyMzQ1',
    avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
    html_url: 'https://github.com/test-user'
  },
  head: {
    ref: 'feature-branch',
    sha: 'abc1234567890defghijklmnopqrstuvwxyz1234',
    repo: mockGitHubRepo
  },
  base: {
    ref: 'main',
    sha: 'def1234567890abcghijklmnopqrstuvwxyz5678',
    repo: mockGitHubRepo
  },
  mergeable: true,
  rebaseable: true,
  mergeable_state: 'clean',
  comments: 5,
  review_comments: 10,
  commits: 3,
  additions: 100,
  deletions: 50,
  changed_files: 5,
  labels: [
    {
      id: 123456789,
      node_id: 'MDU6TGFiZWwxMjM0NTY3ODk=',
      name: 'enhancement',
      color: '0e8a16',
      description: 'New feature or enhancement'
    },
    {
      id: 987654321,
      node_id: 'MDU6TGFiZWw5ODc2NTQzMjE=',
      name: 'bug',
      color: 'd73a4a',
      description: 'Something isn\'t working'
    }
  ]
};

// Mock GitHub pull request files
export const mockGitHubPRFiles = [
  {
    sha: 'abc123def456abc123def456abc123def4567890',
    filename: 'src/components/Button.tsx',
    status: 'modified',
    additions: 20,
    deletions: 5,
    changes: 25,
    blob_url: 'https://github.com/test-org/test-repo/blob/abc123/src/components/Button.tsx',
    raw_url: 'https://github.com/test-org/test-repo/raw/abc123/src/components/Button.tsx',
    contents_url: 'https://api.github.com/repos/test-org/test-repo/contents/src/components/Button.tsx?ref=abc123',
    patch: '@@ -10,7 +10,22 @@ export const Button = ({\n   onClick,\n   children\n }) => {\n-  return <button className="btn" onClick={onClick}>{children}</button>;\n+  return (\n+    <button \n+      className="btn btn-primary" \n+      onClick={onClick}\n+      aria-label="Button"\n+    >\n+      {children}\n+    </button>\n+  );\n };\n'
  },
  {
    sha: 'def456abc789def456abc789def456abc7890123',
    filename: 'src/types/index.ts',
    status: 'modified',
    additions: 15,
    deletions: 0,
    changes: 15,
    blob_url: 'https://github.com/test-org/test-repo/blob/def456/src/types/index.ts',
    raw_url: 'https://github.com/test-org/test-repo/raw/def456/src/types/index.ts',
    contents_url: 'https://api.github.com/repos/test-org/test-repo/contents/src/types/index.ts?ref=def456',
    patch: '@@ -25,6 +25,21 @@ export interface User {\n   avatarUrl: string;\n   email?: string;\n }\n+\n+export interface ButtonProps {\n+  /**\n+   * Button variant\n+   */\n+  variant?: \'primary\' | \'secondary\' | \'danger\';\n+  \n+  /**\n+   * Button size\n+   */\n+  size?: \'sm\' | \'md\' | \'lg\';\n+  \n+  /**\n+   * Click handler\n+   */\n+  onClick?: () => void;\n+}\n'
  }
];

// Mock GitHub commits
export const mockGitHubCommits = [
  {
    sha: 'abc1234567890defghijklmnopqrstuvwxyz1234',
    node_id: 'MDY6Q29tbWl0YWJjMTIzNDU2Nzg5MGRlZg==',
    commit: {
      author: {
        name: 'Test User',
        email: 'test.user@example.com',
        date: '2023-03-01T10:00:00Z'
      },
      committer: {
        name: 'Test User',
        email: 'test.user@example.com',
        date: '2023-03-01T10:00:00Z'
      },
      message: 'Add button component enhancements',
      tree: {
        sha: 'def9876543210abcdefghijklmnopqrstuv9876',
        url: 'https://api.github.com/repos/test-org/test-repo/git/trees/def9876543210abcdefghijklmnopqrstuv9876'
      },
      url: 'https://api.github.com/repos/test-org/test-repo/git/commits/abc1234567890defghijklmnopqrstuvwxyz1234',
      verification: {
        verified: true,
        reason: 'valid',
        signature: '-----BEGIN PGP SIGNATURE-----\n...\n-----END PGP SIGNATURE-----',
        payload: 'tree def9876543210abcdefghijklmnopqrstuv9876\n...'
      }
    },
    url: 'https://api.github.com/repos/test-org/test-repo/commits/abc1234567890defghijklmnopqrstuvwxyz1234',
    html_url: 'https://github.com/test-org/test-repo/commit/abc1234567890defghijklmnopqrstuvwxyz1234',
    comments_url: 'https://api.github.com/repos/test-org/test-repo/commits/abc1234567890defghijklmnopqrstuvwxyz1234/comments',
    author: {
      login: 'test-user',
      id: 12345,
      node_id: 'MDQ6VXNlcjEyMzQ1',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
      html_url: 'https://github.com/test-user'
    },
    committer: {
      login: 'test-user',
      id: 12345,
      node_id: 'MDQ6VXNlcjEyMzQ1',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
      html_url: 'https://github.com/test-user'
    },
    parents: [
      {
        sha: 'ghi9876543210abcdefghijklmnopqrstuv5432',
        url: 'https://api.github.com/repos/test-org/test-repo/commits/ghi9876543210abcdefghijklmnopqrstuv5432',
        html_url: 'https://github.com/test-org/test-repo/commit/ghi9876543210abcdefghijklmnopqrstuv5432'
      }
    ]
  },
  {
    sha: 'def1234567890abcghijklmnopqrstuvwxyz5678',
    node_id: 'MDY6Q29tbWl0ZGVmMTIzNDU2Nzg5MGFiYw==',
    commit: {
      author: {
        name: 'Test User',
        email: 'test.user@example.com',
        date: '2023-03-01T11:30:00Z'
      },
      committer: {
        name: 'Test User',
        email: 'test.user@example.com',
        date: '2023-03-01T11:30:00Z'
      },
      message: 'Update button component types',
      tree: {
        sha: 'jkl9876543210abcdefghijklmnopqrstuv5432',
        url: 'https://api.github.com/repos/test-org/test-repo/git/trees/jkl9876543210abcdefghijklmnopqrstuv5432'
      },
      url: 'https://api.github.com/repos/test-org/test-repo/git/commits/def1234567890abcghijklmnopqrstuvwxyz5678',
      verification: {
        verified: true,
        reason: 'valid',
        signature: '-----BEGIN PGP SIGNATURE-----\n...\n-----END PGP SIGNATURE-----',
        payload: 'tree jkl9876543210abcdefghijklmnopqrstuv5432\n...'
      }
    },
    url: 'https://api.github.com/repos/test-org/test-repo/commits/def1234567890abcghijklmnopqrstuvwxyz5678',
    html_url: 'https://github.com/test-org/test-repo/commit/def1234567890abcghijklmnopqrstuvwxyz5678',
    comments_url: 'https://api.github.com/repos/test-org/test-repo/commits/def1234567890abcghijklmnopqrstuvwxyz5678/comments',
    author: {
      login: 'test-user',
      id: 12345,
      node_id: 'MDQ6VXNlcjEyMzQ1',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
      html_url: 'https://github.com/test-user'
    },
    committer: {
      login: 'test-user',
      id: 12345,
      node_id: 'MDQ6VXNlcjEyMzQ1',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
      html_url: 'https://github.com/test-user'
    },
    parents: [
      {
        sha: 'abc1234567890defghijklmnopqrstuvwxyz1234',
        url: 'https://api.github.com/repos/test-org/test-repo/commits/abc1234567890defghijklmnopqrstuvwxyz1234',
        html_url: 'https://github.com/test-org/test-repo/commit/abc1234567890defghijklmnopqrstuvwxyz1234'
      }
    ]
  }
];

// Mock GitHub reviews
export const mockGitHubReviews = [
  {
    id: 80765432,
    node_id: 'MDE3OlB1bGxSZXF1ZXN0UmV2aWV3ODA3NjU0MzI=',
    user: {
      login: 'reviewer1',
      id: 23456,
      node_id: 'MDQ6VXNlcjIzNDU2',
      avatar_url: 'https://avatars.githubusercontent.com/u/23456?v=4',
      html_url: 'https://github.com/reviewer1'
    },
    body: 'Looks good! I like the improvements to the button component.',
    state: 'APPROVED',
    html_url: 'https://github.com/test-org/test-repo/pull/42#pullrequestreview-80765432',
    pull_request_url: 'https://api.github.com/repos/test-org/test-repo/pulls/42',
    _links: {
      html: {
        href: 'https://github.com/test-org/test-repo/pull/42#pullrequestreview-80765432'
      },
      pull_request: {
        href: 'https://api.github.com/repos/test-org/test-repo/pulls/42'
      }
    },
    submitted_at: '2023-03-02T09:00:00Z',
    commit_id: 'def1234567890abcghijklmnopqrstuvwxyz5678'
  },
  {
    id: 80765433,
    node_id: 'MDE3OlB1bGxSZXF1ZXN0UmV2aWV3ODA3NjU0MzM=',
    user: {
      login: 'reviewer2',
      id: 34567,
      node_id: 'MDQ6VXNlcjM0NTY3',
      avatar_url: 'https://avatars.githubusercontent.com/u/34567?v=4',
      html_url: 'https://github.com/reviewer2'
    },
    body: 'I think we should add more documentation for the button props.',
    state: 'COMMENTED',
    html_url: 'https://github.com/test-org/test-repo/pull/42#pullrequestreview-80765433',
    pull_request_url: 'https://api.github.com/repos/test-org/test-repo/pulls/42',
    _links: {
      html: {
        href: 'https://github.com/test-org/test-repo/pull/42#pullrequestreview-80765433'
      },
      pull_request: {
        href: 'https://api.github.com/repos/test-org/test-repo/pulls/42'
      }
    },
    submitted_at: '2023-03-02T10:30:00Z',
    commit_id: 'def1234567890abcghijklmnopqrstuvwxyz5678'
  }
];

// Mock GitHub comments
export const mockGitHubIssueComments = [
  {
    id: 123456789,
    node_id: 'MDEyOklzc3VlQ29tbWVudDEyMzQ1Njc4OQ==',
    url: 'https://api.github.com/repos/test-org/test-repo/issues/comments/123456789',
    html_url: 'https://github.com/test-org/test-repo/pull/42#issuecomment-123456789',
    body: 'Great work on this PR!',
    user: {
      login: 'team-lead',
      id: 45678,
      node_id: 'MDQ6VXNlcjQ1Njc4',
      avatar_url: 'https://avatars.githubusercontent.com/u/45678?v=4',
      html_url: 'https://github.com/team-lead'
    },
    created_at: '2023-03-02T11:00:00Z',
    updated_at: '2023-03-02T11:00:00Z'
  },
  {
    id: 123456790,
    node_id: 'MDEyOklzc3VlQ29tbWVudDEyMzQ1Njc5MA==',
    url: 'https://api.github.com/repos/test-org/test-repo/issues/comments/123456790',
    html_url: 'https://github.com/test-org/test-repo/pull/42#issuecomment-123456790',
    body: 'Thanks! I\'ll address the review comments soon.',
    user: {
      login: 'test-user',
      id: 12345,
      node_id: 'MDQ6VXNlcjEyMzQ1',
      avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
      html_url: 'https://github.com/test-user'
    },
    created_at: '2023-03-02T12:00:00Z',
    updated_at: '2023-03-02T12:00:00Z'
  }
];

export const mockGitHubPRComments = [
  {
    id: 987654321,
    node_id: 'MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDk4NzY1NDMyMQ==',
    pull_request_review_id: 80765433,
    diff_hunk: '@@ -10,7 +10,22 @@ export const Button = ({',
    path: 'src/components/Button.tsx',
    position: 15,
    original_position: 15,
    commit_id: 'def1234567890abcghijklmnopqrstuvwxyz5678',
    original_commit_id: 'def1234567890abcghijklmnopqrstuvwxyz5678',
    user: {
      login: 'reviewer2',
      id: 34567,
      node_id: 'MDQ6VXNlcjM0NTY3',
      avatar_url: 'https://avatars.githubusercontent.com/u/34567?v=4',
      html_url: 'https://github.com/reviewer2'
    },
    body: 'Consider adding a data-testid attribute for better testing.',
    created_at: '2023-03-02T10:35:00Z',
    updated_at: '2023-03-02T10:35:00Z',
    html_url: 'https://github.com/test-org/test-repo/pull/42#discussion_r987654321',
    pull_request_url: 'https://api.github.com/repos/test-org/test-repo/pulls/42',
    _links: {
      self: {
        href: 'https://api.github.com/repos/test-org/test-repo/pulls/comments/987654321'
      },
      html: {
        href: 'https://github.com/test-org/test-repo/pull/42#discussion_r987654321'
      },
      pull_request: {
        href: 'https://api.github.com/repos/test-org/test-repo/pulls/42'
      }
    }
  },
  {
    id: 987654322,
    node_id: 'MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDk4NzY1NDMyMg==',
    pull_request_review_id: 80765433,
    diff_hunk: '@@ -25,6 +25,21 @@ export interface User {',
    path: 'src/types/index.ts',
    position: 12,
    original_position: 12,
    commit_id: 'def1234567890abcghijklmnopqrstuvwxyz5678',
    original_commit_id: 'def1234567890abcghijklmnopqrstuvwxyz5678',
    user: {
      login: 'reviewer2',
      id: 34567,
      node_id: 'MDQ6VXNlcjM0NTY3',
      avatar_url: 'https://avatars.githubusercontent.com/u/34567?v=4',
      html_url: 'https://github.com/reviewer2'
    },
    body: 'Can we make some of these props required? E.g., variant should probably have a required default.',
    created_at: '2023-03-02T10:40:00Z',
    updated_at: '2023-03-02T10:40:00Z',
    html_url: 'https://github.com/test-org/test-repo/pull/42#discussion_r987654322',
    pull_request_url: 'https://api.github.com/repos/test-org/test-repo/pulls/42',
    _links: {
      self: {
        href: 'https://api.github.com/repos/test-org/test-repo/pulls/comments/987654322'
      },
      html: {
        href: 'https://github.com/test-org/test-repo/pull/42#discussion_r987654322'
      },
      pull_request: {
        href: 'https://api.github.com/repos/test-org/test-repo/pulls/42'
      }
    }
  }
];

// Mock rate limit response
export const mockGitHubRateLimit = {
  resources: {
    core: {
      limit: 5000,
      used: 125,
      remaining: 4875,
      reset: Math.floor(Date.now() / 1000) + 3600
    },
    search: {
      limit: 30,
      used: 5,
      remaining: 25,
      reset: Math.floor(Date.now() / 1000) + 3600
    },
    graphql: {
      limit: 5000,
      used: 0,
      remaining: 5000,
      reset: Math.floor(Date.now() / 1000) + 3600
    },
    integration_manifest: {
      limit: 5000,
      used: 0,
      remaining: 5000,
      reset: Math.floor(Date.now() / 1000) + 3600
    },
    code_scanning_upload: {
      limit: 500,
      used: 0,
      remaining: 500,
      reset: Math.floor(Date.now() / 1000) + 3600
    }
  },
  rate: {
    limit: 5000,
    used: 125,
    remaining: 4875,
    reset: Math.floor(Date.now() / 1000) + 3600
  }
};
