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
