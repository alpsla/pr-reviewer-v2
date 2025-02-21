/**
 * GitHub API response mappers
 * Converts GitHub API responses to unified VCS types
 */
import type { 
  VCSRepository,
  VCSPullRequest,
  VCSUser
} from '../types';

/**
 * Sanitizes repository name by removing special characters
 * @param repo The repository data to sanitize, or a string repository name
 */
export function sanitizeGitHubRepo(repo: string | Record<string, unknown>): string | Record<string, unknown> {
  if (typeof repo === 'string') {
    return repo.replace(/[^a-zA-Z0-9-_.]/g, '');
  }
  // If it's an object, return it unchanged
  return repo;
}

/**
 * Maps GitHub repository API response to VCS repository type
 */
export function mapGitHubRepository(repo: Record<string, unknown>): VCSRepository {
  if (!repo) {
    return {
      id: 'unknown',
      platform: 'github',
      externalId: 'unknown',
      name: 'unknown',
      owner: 'unknown',
      fullName: 'unknown/unknown',
      description: '',
      isPrivate: false,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        admin: false,
        push: false,
        pull: true,
      },
      url: '',
      language: null,
      topics: [],
      stargazersCount: 0,
      forksCount: 0
    };
  }

  return {
    id: String(repo.id || 'unknown'),
    platform: 'github',
    externalId: String(repo.id || 'unknown'),
    name: String(repo.name || 'unknown'),
    owner: String((repo.owner as Record<string, unknown>)?.login || ''),
    fullName: String(repo.full_name || 'unknown/unknown'),
    description: String(repo.description || ''),
    isPrivate: Boolean(repo.private),
    defaultBranch: String(repo.default_branch || 'main'),
    createdAt: new Date(String(repo.created_at || Date.now())),
    updatedAt: new Date(String(repo.updated_at || Date.now())),
    permissions: {
      admin: Boolean((repo.permissions as Record<string, unknown>)?.admin || false),
      push: Boolean((repo.permissions as Record<string, unknown>)?.push || false),
      pull: Boolean((repo.permissions as Record<string, unknown>)?.pull || true),
    },
    url: String(repo.html_url || ''),
    language: repo.language ? String(repo.language) : null,
    topics: Array.isArray(repo.topics) ? repo.topics.map(String) : [],
    stargazersCount: Number(repo.stargazers_count || 0),
    forksCount: Number(repo.forks_count || 0)
  };
}

/**
 * Maps GitHub user to VCS user
 */
export function mapGitHubUser(user: Record<string, unknown> | null): VCSUser {
  if (!user) {
    return {
      id: 'unknown',
      platform: 'github',
      externalId: 'unknown',
      login: 'unknown',
      name: '',
      email: '',
      avatarUrl: '',
      url: ''
    };
  }

  return {
    id: user.id ? String(user.id) : 'unknown',
    platform: 'github',
    externalId: user.id ? String(user.id) : 'unknown',
    login: String(user.login || ''),
    name: String(user.name || user.login || ''),
    email: String(user.email || ''),
    avatarUrl: String(user.avatar_url || ''),
    url: String(user.html_url || '')
  };
}

/**
 * Maps GitHub PR to VCS PR
 */
export function mapGitHubPR(pr: Record<string, unknown>): VCSPullRequest {
  if (!pr) {
    return {
      id: 'unknown',
      platform: 'github',
      externalId: 'unknown',
      number: 0,
      title: '',
      description: '',
      state: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
      mergedAt: null,
      isDraft: false,
      user: mapGitHubUser(null),
      head: {
        ref: '',
        sha: '',
        repo: mapGitHubRepository({})
      },
      base: {
        ref: '',
        sha: '',
        repo: mapGitHubRepository({})
      },
      labels: [],
      url: ''
    };
  }

  return {
    id: String(pr.id),
    externalId: String(pr.id),
    number: Number(pr.number),
    platform: 'github',
    title: String(pr.title || ''),
    description: String(pr.body || ''),
    state: pr.merged ? 'merged' : pr.state === 'open' ? 'open' : 'closed',
    createdAt: new Date(String(pr.created_at)),
    updatedAt: new Date(String(pr.updated_at)),
    closedAt: pr.closed_at ? new Date(String(pr.closed_at)) : null,
    mergedAt: pr.merged_at ? new Date(String(pr.merged_at)) : null,
    isDraft: Boolean(pr.draft || false),
    user: mapGitHubUser(pr.user as Record<string, unknown>),
    head: {
      ref: String((pr.head as Record<string, unknown>)?.ref || ''),
      sha: String((pr.head as Record<string, unknown>)?.sha || ''),
      repo: mapGitHubRepository((pr.head as Record<string, unknown>)?.repo as Record<string, unknown> || {})
    },
    base: {
      ref: String((pr.base as Record<string, unknown>)?.ref || ''),
      sha: String((pr.base as Record<string, unknown>)?.sha || ''),
      repo: mapGitHubRepository((pr.base as Record<string, unknown>)?.repo as Record<string, unknown> || {})
    },
    labels: Array.isArray(pr.labels) 
      ? pr.labels.map((label: Record<string, unknown>) => String(label.name || '')) 
      : [],
    url: String(pr.html_url || '')
  };
}
