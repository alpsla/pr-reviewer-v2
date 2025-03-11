/**
 * VCS Client Factory
 * Creates appropriate client based on platform type
 */
import { VCSPlatform, VCSClient } from './types';
import { GitHubClient } from './github/github-client';
import { GitLabClient } from './gitlab/gitlab-client';

/**
 * Create a VCS client based on platform
 * @param platform The VCS platform (github or gitlab)
 * @param token Authentication token for the platform
 * @param baseUrl Optional base URL for self-hosted instances
 * @returns VCS client instance
 */
const getVCSClient = (
  platform: VCSPlatform,
  token: string,
  baseUrl?: string
): VCSClient => {
  // Add token debugging (just show length for security)
  console.log(`Creating ${platform} client with token [length: ${token?.length || 0}]`);
  
  if (!token) {
    throw new Error(`Cannot create ${platform} client: No token provided`);
  }
  
  switch (platform) {
    case 'github':
      return new GitHubClient(token, baseUrl ? { baseUrl } : undefined);
    case 'gitlab':
      return new GitLabClient(token, baseUrl ? { baseUrl } : undefined);
    default:
      throw new Error(`Unsupported VCS platform: ${platform}`);
  }
};

export { getVCSClient };

// For backward compatibility, also export as default
export default getVCSClient;
