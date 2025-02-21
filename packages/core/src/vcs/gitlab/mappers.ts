/* eslint-disable @typescript-eslint/no-explicit-any */
import { VCSRepository, VCSUser, VCSPullRequest } from '../types';

/**
 * Map a GitLab project to our standardized VCSRepository type
 */
export function mapGitLabProject(project: any): VCSRepository {
  if (!project) {
    // Return a placeholder for deleted projects
    return {
      id: 'deleted',
      platform: 'gitlab',
      externalId: 'deleted',
      name: 'deleted',
      owner: 'deleted',
      fullName: 'deleted/deleted',
      description: 'Project has been deleted',
      isPrivate: false,
      defaultBranch: 'main',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        admin: false,
        push: false,
        pull: false
      },
      url: '',
      language: null,
      topics: [],
      stargazersCount: 0,
      forksCount: 0,
      openIssuesCount: 0
    };
  }

  // Extract owner from path with namespace or from namespace
  let owner = '';
  if (project.path_with_namespace) {
    const parts = project.path_with_namespace.split('/');
    owner = parts.length > 1 ? parts[0] : '';
  } else if (project.namespace) {
    owner = typeof project.namespace === 'string' ? project.namespace : project.namespace.path;
  }

  return {
    id: project.id.toString(),
    platform: 'gitlab',
    externalId: project.id.toString(),
    name: project.path || project.name,
    owner: owner,
    fullName: project.path_with_namespace || `${owner}/${project.path || project.name}`,
    description: project.description || '',
    isPrivate: project.visibility !== 'public',
    defaultBranch: project.default_branch || 'main',
    createdAt: new Date(project.created_at),
    updatedAt: new Date(project.last_activity_at || project.created_at),
    permissions: {
      admin: Boolean(project.permissions?.project_access?.access_level >= 40 || project.permissions?.group_access?.access_level >= 40),
      push: Boolean(project.permissions?.project_access?.access_level >= 30 || project.permissions?.group_access?.access_level >= 30),
      pull: Boolean(project.permissions?.project_access?.access_level >= 20 || project.permissions?.group_access?.access_level >= 20)
    },
    url: project.web_url || '',
    language: project.repository_language || null,
    topics: project.topics || [],
    stargazersCount: project.star_count || 0,
    forksCount: project.forks_count || 0,
    openIssuesCount: project.open_issues_count || 0
  };
}

/**
 * Map a GitLab user to our standardized VCSUser type
 */
export function mapGitLabUser(user: any): VCSUser {
  if (!user) {
    return {
      id: 'unknown',
      platform: 'gitlab',
      externalId: 'unknown',
      login: 'unknown',
      name: '',
      email: '',
      avatarUrl: '',
      url: ''
    };
  }

  return {
    id: user.id.toString(),
    platform: 'gitlab',
    externalId: user.id.toString(),
    login: user.username || '',
    name: user.name || '',
    email: user.email || '',
    avatarUrl: user.avatar_url || '',
    url: user.web_url || ''
  };
}

/**
 * Map a GitLab merge request to our standardized VCSPullRequest type
 * Note: Requires the parent project to properly set some fields
 */
export function mapGitLabMergeRequest(mr: any, project: any): VCSPullRequest {
  const targetProject = project || {
    id: mr.target_project_id,
    path_with_namespace: mr.references?.full.split('!')[0] || '',
    web_url: mr.web_url?.split('/-/')[0] || ''
  };
  
  const sourceProject = mr.source_project_id === mr.target_project_id
    ? targetProject 
    : { 
        id: mr.source_project_id,
        path_with_namespace: mr.source_branch?.includes(':') 
          ? mr.source_branch.split(':')[0]
          : targetProject.path_with_namespace,
        web_url: targetProject.web_url
      };

  // Determine state
  let state: 'open' | 'closed' | 'merged' = 'open';
  if (mr.state === 'merged') {
    state = 'merged';
  } else if (mr.state === 'closed') {
    state = 'closed';
  }

  // Parse dates
  const createdAt = new Date(mr.created_at);
  const updatedAt = new Date(mr.updated_at);
  const closedAt = mr.closed_at ? new Date(mr.closed_at) : null;
  const mergedAt = mr.merged_at ? new Date(mr.merged_at) : null;

  return {
    id: mr.id.toString(),
    platform: 'gitlab',
    externalId: mr.id.toString(),
    number: mr.iid,
    title: mr.title || '',
    description: mr.description || '',
    state: state,
    createdAt: createdAt,
    updatedAt: updatedAt,
    closedAt: closedAt,
    mergedAt: mergedAt,
    isDraft: mr.work_in_progress || false,
    user: mapGitLabUser(mr.author),
    head: {
      ref: mr.source_branch?.includes(':')
        ? mr.source_branch.split(':')[1]
        : mr.source_branch || '',
      sha: mr.sha || mr.diff_refs?.head_sha || '',
      repo: mapGitLabProject(sourceProject)
    },
    base: {
      ref: mr.target_branch || '',
      sha: mr.diff_refs?.base_sha || '',
      repo: mapGitLabProject(targetProject)
    },
    labels: Array.isArray(mr.labels) ? mr.labels : [],
    url: mr.web_url || '',
    mergeable: mr.merge_status === 'can_be_merged',
    rebaseable: true // GitLab supports rebase, but doesn't expose a specific flag
  };
}
