// VCS Client Type Definitions
// This file isolates third-party type imports to prevent circular dependencies

// GitHub client types
import type { Octokit } from '@octokit/rest';
export type GitHubClient = Octokit;
export type GitHubOptions = {
  auth: string;
  userAgent?: string;
  timeZone?: string;
};

// GitLab client types
import type { Gitlab } from '@gitbeaker/core';
export type GitLabClient = Gitlab;
export type GitLabOptions = {
  token: string;
  host?: string;
  userAgent?: string;
};
