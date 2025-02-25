import type { PullRequest, PullRequestFile } from './types';
import type { VCSPullRequest, VCSPullRequestFile } from '../vcs/types';

/**
 * Convert VCS pull request to internal pull request type
 */
export function convertVCSPullRequestToPullRequest(vcsPR: VCSPullRequest): PullRequest {
  return {
    id: '', // Will be set by database
    platform: vcsPR.platform,
    externalId: vcsPR.externalId,
    number: vcsPR.number,
    title: vcsPR.title,
    body: vcsPR.description,
    state: vcsPR.state,
    draft: vcsPR.isDraft,
    url: vcsPR.url,
    repository: {
      id: vcsPR.base.repo.id,
      owner: vcsPR.base.repo.owner,
      name: vcsPR.base.repo.name
    },
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
export function convertVCSPullRequestFileToPullRequestFile(vcsFile: VCSPullRequestFile): PullRequestFile {
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
