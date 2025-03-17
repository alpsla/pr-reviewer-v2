/**
 * VCS Client Factory
 * 
 * Provides factory methods for creating VCS clients with different configurations.
 */

import { VCSPlatform } from '../types/platform';
import { GitHubClient } from './github/github-client';
import { GitLabClient } from './gitlab/gitlab-client';
import { VCSClient } from './types';

/**
 * Create a VCS client for the specified platform with token-based authentication
 */
export function getVcsClient(platform: VCSPlatform, token?: string): VCSClient {
  switch (platform) {
    case 'github':
      return new GitHubClient(token || "");
    case 'gitlab':
      return new GitLabClient(token || "");
    default:
      throw new Error(`Unsupported VCS platform: ${platform}`);
  }
}

/**
 * Create a basic VCS client without complex configuration
 * Used for simple visibility checks and basic operations
 */
export function createBasicClient(platform: VCSPlatform, token?: string): VCSClient {
  return getVcsClient(platform, token || "");
}

/**
 * Get a VCS client based on the platform and a token mapping
 */
export function getClientForPlatform(
  platform: VCSPlatform,
  tokens: { github?: string; gitlab?: string }
): VCSClient {
  if (platform === 'github' && tokens.github) {
    return getVcsClient('github', tokens.github);
  } else if (platform === 'gitlab' && tokens.gitlab) {
    return getVcsClient('gitlab', tokens.gitlab);
  }
  
  throw new Error(`No authentication token available for ${platform}. Please check your login.`);
}
