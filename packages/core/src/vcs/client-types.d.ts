/**
 * Type declarations for third-party VCS clients
 * This helps avoid circular dependencies during the DTS build
 */

// GitHub types
import type { Octokit } from '@octokit/rest';
export type GitHubClient = Octokit;
export type GitHubOptions = {
  auth: string;
  userAgent?: string;
  timeZone?: string;
  baseUrl?: string;
};

// GitLab types
import type { Gitlab } from '@gitbeaker/rest';
export type GitLabClient = Gitlab;
export type GitLabOptions = {
  token: string;
  host?: string;
  userAgent?: string;
};
