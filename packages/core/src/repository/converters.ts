import type {
  VCSRepository,
  VCSPullRequest,
  VCSPullRequestFile,
  VCSUser
} from '../vcs/types';
import type {
  Repository,
  PullRequest,
  PullRequestFile
} from './types';

/**
 * Convert VCS repository to internal repository type
 */
export function convertVCSRepository(vcsRepo: VCSRepository): Repository {
  return {
    id: '', // Will be set by database
    platform: vcsRepo.platform,
    externalId: vcsRepo.externalId,
    owner: vcsRepo.owner,
    name: vcsRepo.name,
    fullName: vcsRepo.fullName,
    description: vcsRepo.description,
    private: vcsRepo.isPrivate, // Map isPrivate to private
    defaultBranch: vcsRepo.defaultBranch,
    url: vcsRepo.url,
    language: vcsRepo.language,
    topics: vcsRepo.topics,
    permissions: {
      admin: vcsRepo.permissions.admin,
      push: vcsRepo.permissions.push,
      pull: vcsRepo.permissions.pull
    },
    createdAt: vcsRepo.createdAt,
    updatedAt: vcsRepo.updatedAt,
    lastSyncedAt: new Date()
  };
}

/**
 * Convert VCS pull request to internal pull request type
 */
export function convertVCSPullRequest(vcsPR: VCSPullRequest): PullRequest {
  return {
    id: '', // Will be set by database
    platform: vcsPR.platform,
    externalId: vcsPR.externalId,
    number: vcsPR.number,
    repository: {
      id: vcsPR.base.repo.id,
      owner: vcsPR.base.repo.owner,
      name: vcsPR.base.repo.name
    },
    title: vcsPR.title,
    body: vcsPR.description,
    state: vcsPR.state,
    draft: vcsPR.isDraft,
    url: vcsPR.url,
    baseRef: vcsPR.base.ref,
    baseSha: vcsPR.base.sha,
    headRef: vcsPR.head.ref,
    headSha: vcsPR.head.sha,
    author: {
      id: vcsPR.user.id,
      login: vcsPR.user.login,
      name: vcsPR.user.name,
      avatarUrl: vcsPR.user.avatarUrl
    },
    labels: vcsPR.labels,
    createdAt: vcsPR.createdAt,
    updatedAt: vcsPR.updatedAt,
    closedAt: vcsPR.closedAt,
    mergedAt: vcsPR.mergedAt
  };
}

/**
 * Convert VCS pull request file to internal pull request file type
 */
export function convertVCSPullRequestFile(vcsFile: VCSPullRequestFile): PullRequestFile {
  return {
    path: vcsFile.filename,
    status: vcsFile.status,
    additions: vcsFile.additions,
    deletions: vcsFile.deletions,
    changes: vcsFile.changes,
    patch: vcsFile.patch,
    previousPath: vcsFile.previousFilename
  };
}

/**
 * Convert VCS user to internal user type
 */
export function convertVCSUser(vcsUser: VCSUser) {
  return {
    id: vcsUser.id,
    login: vcsUser.login,
    name: vcsUser.name,
    avatarUrl: vcsUser.avatarUrl
  };
}
