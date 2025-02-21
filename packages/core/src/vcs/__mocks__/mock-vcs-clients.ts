/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  VCSClient, 
  VCSPlatform,
  VCSPullRequestComment,
  VCSPullRequestReview
} from '../types';
import { 
  mockGitHubPR
} from './github-mock-data';
import {
  mockGitLabUser
} from './gitlab-mock-data';

/**
 * Creates a mock GitHub client for testing
 */
export const createMockGitHubClient = (): jest.Mocked<VCSClient> => {
  const mockClient: jest.Mocked<VCSClient> = {
    getPlatform: jest.fn().mockReturnValue('github'),
    getCurrentUser: jest.fn(),
    getRepository: jest.fn(),
    listUserRepositories: jest.fn(),
    listOrganizationRepositories: jest.fn(),
    getPullRequest: jest.fn(),
    listPullRequests: jest.fn(),
    getPullRequestFiles: jest.fn(),
    getPullRequestCommits: jest.fn(),
    getPullRequestReviews: jest.fn(),
    getPullRequestComments: jest.fn(),
    getRateLimit: jest.fn()
  };

  // Set default implementations
  mockClient.getCurrentUser.mockResolvedValue({
    id: mockGitHubPR.user.id.toString(),
    platform: 'github',
    externalId: mockGitHubPR.user.id.toString(),
    login: mockGitHubPR.user.login,
    name: mockGitHubPR.user.login,
    email: `${mockGitHubPR.user.login}@example.com`,
    avatarUrl: mockGitHubPR.user.avatar_url,
    url: mockGitHubPR.user.html_url
  });
  
  mockClient.getRepository.mockImplementation(async (owner, name) => {
    // Make sure we're returning a proper Promise
    // Create a properly structured repo with all required fields
    const mockRepo = {
      id: 12345678,
      node_id: 'R_kgDOBs7Abcd',
      name: name,
      full_name: `${owner}/${name}`,
      private: false,
      owner: {
        login: owner,
        id: 98765432,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjk4NzY1NDMy',
        avatar_url: 'https://avatars.githubusercontent.com/u/98765432?v=4',
        gravatar_id: null,
        url: `https://api.github.com/users/${owner}`,
        html_url: `https://github.com/${owner}`,
        followers_url: `https://api.github.com/users/${owner}/followers`,
        following_url: `https://api.github.com/users/${owner}/following{/other_user}`,
        gists_url: `https://api.github.com/users/${owner}/gists{/gist_id}`,
        starred_url: `https://api.github.com/users/${owner}/starred{/owner}{/repo}`,
        subscriptions_url: `https://api.github.com/users/${owner}/subscriptions`,
        organizations_url: `https://api.github.com/users/${owner}/orgs`,
        repos_url: `https://api.github.com/users/${owner}/repos`,
        events_url: `https://api.github.com/users/${owner}/events{/privacy}`,
        received_events_url: `https://api.github.com/users/${owner}/received_events`,
        type: 'Organization',
        site_admin: false,
        name: owner,
        email: null
      },
      html_url: `https://github.com/${owner}/${name}`,
      description: 'Test repository for unit tests',
      fork: false,
      url: `https://api.github.com/repos/${owner}/${name}`,
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
    
    // We should not invoke sanitizeGitHubRepo here
    const sanitizedRepo = mockRepo;
    
    return {
      id: sanitizedRepo.id?.toString() ?? 'unknown',
      platform: 'github',
      externalId: sanitizedRepo.id?.toString() ?? 'unknown',
      name: sanitizedRepo.name ?? 'unknown',
      owner: sanitizedRepo.owner?.login ?? 'unknown',
      fullName: sanitizedRepo.full_name ?? 'unknown/unknown',
      description: sanitizedRepo.description ?? null,
      isPrivate: sanitizedRepo.private ?? false,
      defaultBranch: sanitizedRepo.default_branch ?? 'main',
      createdAt: new Date(sanitizedRepo.created_at || Date.now()),
      updatedAt: new Date(sanitizedRepo.updated_at || Date.now()),
      permissions: {
        admin: sanitizedRepo.permissions?.admin || false,
        push: sanitizedRepo.permissions?.push || false,
        pull: sanitizedRepo.permissions?.pull || true
      },
      url: sanitizedRepo.html_url ?? '',
      language: sanitizedRepo.language ?? null,
      topics: sanitizedRepo.topics ?? [],
      stargazersCount: sanitizedRepo.stargazers_count ?? 0,
      forksCount: sanitizedRepo.forks_count ?? 0,
      openIssuesCount: sanitizedRepo.open_issues_count ?? 0
    };
  });
  
  // Complete the implementation of the remaining methods
  mockClient.getPullRequest.mockImplementation(async (owner, repo, number) => {
    const mockPR = {...mockGitHubPR};
    mockPR.number = number;
    mockPR.head.repo.owner.login = owner;
    mockPR.head.repo.name = repo;
    mockPR.base.repo.owner.login = owner;
    mockPR.base.repo.name = repo;
    
    return {
      id: mockPR.id.toString(),
      platform: 'github',
      externalId: mockPR.id.toString(),
      number,
      title: `Test PR #${number}`,
      description: `Description for PR #${number}`,
      state: 'open',
      createdAt: new Date(mockPR.created_at),
      updatedAt: new Date(mockPR.updated_at),
      closedAt: null,
      mergedAt: null,
      isDraft: false,
      user: {
        id: mockPR.user.id.toString(),
        platform: 'github',
        externalId: mockPR.user.id.toString(),
        login: mockPR.user.login,
        name: mockPR.user.login, // Use login instead of null
        email: `${mockPR.user.login}@example.com`, // Provide an email instead of null
        avatarUrl: mockPR.user.avatar_url,
        url: mockPR.user.html_url
      },
      head: {
        ref: 'feature-branch',
        sha: 'abc1234',
        repo: {
          id: 'repo-123',
          platform: 'github',
          externalId: '12345678',
          name: repo,
          owner: owner,
          fullName: `${owner}/${repo}`,
          description: 'Test repo',
          isPrivate: false,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: `https://github.com/${owner}/${repo}`,
          language: 'TypeScript',
          topics: [],
          stargazersCount: 0,
          forksCount: 0
        }
      },
      base: {
        ref: 'main',
        sha: 'def5678',
        repo: {
          id: 'repo-123',
          platform: 'github',
          externalId: '12345678',
          name: repo,
          owner: owner,
          fullName: `${owner}/${repo}`,
          description: 'Test repo',
          isPrivate: false,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: `https://github.com/${owner}/${repo}`,
          language: 'TypeScript',
          topics: [],
          stargazersCount: 0,
          forksCount: 0
        }
      },
      labels: ['bug', 'enhancement'],
      url: `https://github.com/${owner}/${repo}/pull/${number}`
    };
  });
  
  mockClient.listPullRequests.mockImplementation(async (owner, repo, options) => {
    const prs = await Promise.all([
      mockClient.getPullRequest(owner, repo, 1),
      mockClient.getPullRequest(owner, repo, 2),
      mockClient.getPullRequest(owner, repo, 3)
    ]);
    
    return {
      data: prs,
      pagination: {
        currentPage: options?.page || 1,
        perPage: options?.perPage || 30,
        total: 3,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  });
  
  mockClient.getPullRequestFiles.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        sha: 'abc123def456',
        filename: 'src/index.ts',
        status: 'modified',
        additions: 10,
        deletions: 5,
        changes: 15,
        patch: '@@ -1,5 +1,10 @@\n+// New comment\n function example() {\n-  return true;\n+  return false;\n }'
      }
    ];
  });
  
  mockClient.getPullRequestCommits.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        sha: 'abc123',
        message: 'Fix bug',
        author: {
          name: 'Test User',
          email: 'test@example.com',
          date: new Date()
        },
        committer: {
          name: 'Test User',
          email: 'test@example.com',
          date: new Date()
        },
        url: 'https://github.com/example/commit/abc123'
      }
    ];
  });
  
  mockClient.getPullRequestReviews.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        id: '1',
        user: {
          id: '456',
          platform: 'github',
          externalId: '456',
          login: 'reviewer',
          name: 'Reviewer',
          email: 'reviewer@example.com', // Add email instead of null
          avatarUrl: 'https://github.com/reviewer.png',
          url: 'https://github.com/reviewer'
        },
        state: 'APPROVED',
        body: 'Looks good!',
        commitId: 'abc123', // Make sure this is a string not null
        submittedAt: new Date()
      }
    ] as VCSPullRequestReview[];
  });
  
  mockClient.getPullRequestComments.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        id: '1',
        user: {
          id: '456',
          platform: 'github',
          externalId: '456',
          login: 'commenter',
          name: 'Commenter',
          email: 'commenter@example.com', // Add email instead of null
          avatarUrl: 'https://github.com/commenter.png',
          url: 'https://github.com/commenter'
        },
        body: 'Please fix this',
        createdAt: new Date(),
        updatedAt: new Date(),
        path: 'src/index.ts',
        position: 5,
        commitId: 'abc123' // Add required commitId
      }
    ] as VCSPullRequestComment[];
  });
  
  mockClient.getRateLimit.mockImplementation(async () => {
    return {
      limit: 5000,
      remaining: 4990,
      reset: new Date(Date.now() + 3600 * 1000),
      used: 10
    };
  });
  
  mockClient.listUserRepositories.mockImplementation(async (options) => {
    return {
      data: [
        {
          id: 'repo-1',
          platform: 'github',
          externalId: '12345',
          name: 'repo-1',
          owner: 'test-user',
          fullName: 'test-user/repo-1',
          description: 'Test repo 1',
          isPrivate: false,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: 'https://github.com/test-user/repo-1',
          language: 'TypeScript',
          topics: ['api', 'testing'],
          stargazersCount: 5,
          forksCount: 2
        }
      ],
      pagination: {
        currentPage: options?.page || 1,
        perPage: options?.perPage || 30,
        total: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  });
  
  mockClient.listOrganizationRepositories.mockImplementation(async (org, options) => {
    return {
      data: [
        {
          id: 'repo-2',
          platform: 'github',
          externalId: '67890',
          name: 'repo-2',
          owner: org,
          fullName: `${org}/repo-2`,
          description: 'Test repo 2',
          isPrivate: true,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: `https://github.com/${org}/repo-2`,
          language: 'JavaScript',
          topics: ['web', 'app'],
          stargazersCount: 10,
          forksCount: 5
        }
      ],
      pagination: {
        currentPage: options?.page || 1,
        perPage: options?.perPage || 30,
        total: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  });
  
  return mockClient;
};

/**
 * Creates a mock GitLab client for testing
 */
export const createMockGitLabClient = (): jest.Mocked<VCSClient> => {
  const mockClient: jest.Mocked<VCSClient> = {
    getPlatform: jest.fn().mockReturnValue('gitlab'),
    getCurrentUser: jest.fn(),
    getRepository: jest.fn(),
    listUserRepositories: jest.fn(),
    listOrganizationRepositories: jest.fn(),
    getPullRequest: jest.fn(),
    listPullRequests: jest.fn(),
    getPullRequestFiles: jest.fn(),
    getPullRequestCommits: jest.fn(),
    getPullRequestReviews: jest.fn(),
    getPullRequestComments: jest.fn(),
    getRateLimit: jest.fn()
  };

  // Set default implementations
  mockClient.getCurrentUser.mockResolvedValue({
    id: mockGitLabUser.id.toString(),
    platform: 'gitlab',
    externalId: mockGitLabUser.id.toString(),
    login: mockGitLabUser.username,
    name: mockGitLabUser.name,
    email: mockGitLabUser.email,
    avatarUrl: mockGitLabUser.avatar_url,
    url: mockGitLabUser.web_url
  });
  
  // Complete the GitLab client implementation
  mockClient.getRepository.mockImplementation(async (owner, name) => {
    return {
      id: 'gitlab-repo-123',
      platform: 'gitlab',
      externalId: '87654321',
      name,
      owner,
      fullName: `${owner}/${name}`,
      description: 'GitLab test repository',
      isPrivate: false,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        admin: true,
        push: true,
        pull: true
      },
      url: `https://gitlab.com/${owner}/${name}`,
      language: 'TypeScript',
      topics: ['gitlab', 'testing'],
      stargazersCount: 8,
      forksCount: 3,
      openIssuesCount: 5
    };
  });
  
  mockClient.getPullRequest.mockImplementation(async (owner, repo, number) => {
    return {
      id: `gitlab-pr-${number}`,
      platform: 'gitlab',
      externalId: `${number}`,
      number,
      title: `GitLab MR #${number}`,
      description: `Description for GitLab MR #${number}`,
      state: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
      mergedAt: null,
      isDraft: false,
      user: {
        id: mockGitLabUser.id.toString(),
        platform: 'gitlab',
        externalId: mockGitLabUser.id.toString(),
        login: mockGitLabUser.username,
        name: mockGitLabUser.name,
        email: mockGitLabUser.email,
        avatarUrl: mockGitLabUser.avatar_url,
        url: mockGitLabUser.web_url
      },
      head: {
        ref: 'feature-branch',
        sha: 'gl1234',
        repo: {
          id: 'gitlab-repo-123',
          platform: 'gitlab',
          externalId: '87654321',
          name: repo,
          owner: owner,
          fullName: `${owner}/${repo}`,
          description: 'GitLab test repository',
          isPrivate: false,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: `https://gitlab.com/${owner}/${repo}`,
          language: 'TypeScript',
          topics: [],
          stargazersCount: 0,
          forksCount: 0
        }
      },
      base: {
        ref: 'main',
        sha: 'gl5678',
        repo: {
          id: 'gitlab-repo-123',
          platform: 'gitlab',
          externalId: '87654321',
          name: repo,
          owner: owner,
          fullName: `${owner}/${repo}`,
          description: 'GitLab test repository',
          isPrivate: false,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: `https://gitlab.com/${owner}/${repo}`,
          language: 'TypeScript',
          topics: [],
          stargazersCount: 0,
          forksCount: 0
        }
      },
      labels: ['bug', 'enhancement', 'gitlab'],
      url: `https://gitlab.com/${owner}/${repo}/-/merge_requests/${number}`
    };
  });
  
  // Implement the remaining GitLab client methods with the same pattern
  mockClient.listPullRequests.mockImplementation(async (owner, repo, options) => {
    const prs = await Promise.all([
      mockClient.getPullRequest(owner, repo, 1),
      mockClient.getPullRequest(owner, repo, 2)
    ]);
    
    return {
      data: prs,
      pagination: {
        currentPage: options?.page || 1,
        perPage: options?.perPage || 20,
        total: 2,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  });
  
  mockClient.getPullRequestFiles.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        sha: 'gl1234abc',
        filename: 'src/gitlab-file.ts',
        status: 'modified',
        additions: 15,
        deletions: 3,
        changes: 18,
        patch: '@@ -1,3 +1,15 @@\n+// GitLab file\n export function gitlabFunction() {\n+  return "gitlab";\n }'
      }
    ];
  });
  
  mockClient.getPullRequestCommits.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        sha: 'gl1234',
        message: 'GitLab commit',
        author: {
          name: mockGitLabUser.name,
          email: mockGitLabUser.email,
          date: new Date()
        },
        committer: {
          name: mockGitLabUser.name,
          email: mockGitLabUser.email,
          date: new Date()
        },
        url: 'https://gitlab.com/example/commit/gl1234'
      }
    ];
  });
  
  mockClient.getPullRequestReviews.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        id: '1',
        user: {
          id: '789',
          platform: 'gitlab',
          externalId: '789',
          login: 'gitlab-reviewer',
          name: 'GitLab Reviewer',
          email: 'gitlab-reviewer@example.com', // Add email instead of null
          avatarUrl: 'https://gitlab.com/gitlab-reviewer.png',
          url: 'https://gitlab.com/gitlab-reviewer'
        },
        state: 'APPROVED',
        body: 'LGTM!',
        commitId: 'gl1234',
        submittedAt: new Date()
      }
    ] as VCSPullRequestReview[];
  });
  
  mockClient.getPullRequestComments.mockImplementation(async (_owner, _repo, _number) => {
    return [
      {
        id: '1',
        user: {
          id: '789',
          platform: 'gitlab',
          externalId: '789',
          login: 'gitlab-commenter',
          name: 'GitLab Commenter',
          email: 'gitlab-commenter@example.com', // Add email instead of null
          avatarUrl: 'https://gitlab.com/gitlab-commenter.png',
          url: 'https://gitlab.com/gitlab-commenter'
        },
        body: 'Please update this',
        createdAt: new Date(),
        updatedAt: new Date(),
        path: 'src/gitlab-file.ts',
        position: 3,
        commitId: 'gl1234' // Add required commitId
      }
    ] as VCSPullRequestComment[];
  });
  
  mockClient.getRateLimit.mockImplementation(async () => {
    return {
      limit: 2000,
      remaining: 1990,
      reset: new Date(Date.now() + 3600 * 1000),
      used: 10
    };
  });
  
  mockClient.listUserRepositories.mockImplementation(async (options) => {
    return {
      data: [
        {
          id: 'gitlab-repo-1',
          platform: 'gitlab',
          externalId: '12345',
          name: 'gitlab-repo-1',
          owner: 'gitlab-user',
          fullName: 'gitlab-user/gitlab-repo-1',
          description: 'GitLab test repo 1',
          isPrivate: false,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: 'https://gitlab.com/gitlab-user/gitlab-repo-1',
          language: 'TypeScript',
          topics: ['api', 'testing'],
          stargazersCount: 5,
          forksCount: 2
        }
      ],
      pagination: {
        currentPage: options?.page || 1,
        perPage: options?.perPage || 20,
        total: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  });
  
  mockClient.listOrganizationRepositories.mockImplementation(async (org, options) => {
    return {
      data: [
        {
          id: 'gitlab-repo-2',
          platform: 'gitlab',
          externalId: '67890',
          name: 'gitlab-repo-2',
          owner: org,
          fullName: `${org}/gitlab-repo-2`,
          description: 'GitLab test repo 2',
          isPrivate: true,
          defaultBranch: 'main',
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: {
            admin: true,
            push: true,
            pull: true
          },
          url: `https://gitlab.com/${org}/gitlab-repo-2`,
          language: 'JavaScript',
          topics: ['web', 'app'],
          stargazersCount: 10,
          forksCount: 5
        }
      ],
      pagination: {
        currentPage: options?.page || 1,
        perPage: options?.perPage || 20,
        total: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  });
  
  return mockClient;
};

/**
 * Creates a mock VCS client based on the specified platform
 */
export const createMockVCSClient = (platform: VCSPlatform): jest.Mocked<VCSClient> => {
  if (platform === 'github') return createMockGitHubClient();
  if (platform === 'gitlab') return createMockGitLabClient();
  throw new Error(`Unsupported platform: ${platform}`);
};
