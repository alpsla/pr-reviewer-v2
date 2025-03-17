/**
 * Public Repository Checker
 * 
 * This utility provides methods to check if a repository is public without requiring authentication.
 * It uses the public APIs of different platforms (GitHub, GitLab) to determine repository visibility.
 */

import { logger } from './logger';

export type Platform = 'github' | 'gitlab';

/**
 * Get the appropriate public API endpoint for a given platform
 */
export function getPublicApiEndpoint(platform: Platform, owner: string, repo: string): string {
  switch (platform) {
    case 'github':
      return `https://api.github.com/repos/${owner}/${repo}`;
    case 'gitlab':
      // GitLab API v4
      return `https://gitlab.com/api/v4/projects/${encodeURIComponent(`${owner}/${repo}`)}`;
    default:
      throw new Error(`UNSUPPORTED_PLATFORM: ${platform} is not supported for public API checks`);
  }
}

/**
 * Check if a repository is public using unauthenticated public API endpoints
 */
export async function isPublicRepository(platform: Platform, owner: string, repo: string): Promise<boolean> {
  try {
    logger.info(`Checking if ${platform}/${owner}/${repo} is public...`);
    
    const endpoint = getPublicApiEndpoint(platform, owner, repo);
    // Create headers based on platform
    let headers: Record<string, string>;
    if (platform === 'github') {
      headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PR-Reviewer-App/1.0'
      };
    } else {
      headers = {
        'User-Agent': 'PR-Reviewer-App/1.0'
      };
    }
    
    const startTime = Date.now();
    const response = await fetch(endpoint, { headers });
    const latency = Date.now() - startTime;
    
    logger.info(`Public API check for ${platform}/${owner}/${repo} completed`, {
      status: response.status,
      latency: `${latency}ms`
    });
    
    // Log API version if available (for future reference)
    if (platform === 'github') {
      const apiVersion = response.headers.get('x-github-api-version');
      if (apiVersion) {
        logger.info('GitHub API version used', { version: apiVersion });
      }
    }
    
    if (response.ok) {
      // For additional validation, we can check the response structure
      try {
        const data = await response.json();
        
        // Check for expected fields in the response
        const expectedFields = platform === 'github' 
          ? ['id', 'private', 'visibility'] 
          : ['id', 'visibility'];
          
        const missingFields = expectedFields.filter(field => !(field in data));
        
        if (missingFields.length > 0) {
          logger.warn(`${platform} public API response missing expected fields`, {
            endpoint,
            missingFields,
            receivedFields: Object.keys(data)
          });
        }
        
        // Determine if the repository is public based on the response
        if (platform === 'github') {
          // GitHub has both 'private' (boolean) and 'visibility' fields
          if ('visibility' in data) {
            return data.visibility === 'public';
          } else if ('private' in data) {
            return data.private === false;
          }
        } else if (platform === 'gitlab') {
          // GitLab uses 'visibility' field
          return data.visibility === 'public';
        }
      } catch (parseError) {
        logger.error(`Error parsing ${platform} API response`, {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          endpoint
        });
      }
    }
    
    // If response is not ok (not 2xx), or we couldn't determine from the response
    if (response.status === 404) {
      logger.info(`Repository ${platform}/${owner}/${repo} not found`);
      return false;
    } else if (response.status === 403) {
      // 403 usually means rate limiting or the repo exists but is private
      logger.info(`Repository ${platform}/${owner}/${repo} access forbidden (likely private or rate limited)`);
      return false;
    }
    
    // For other status codes, we log detailed information
    logger.warn(`Unexpected ${platform} API response for public repo check`, {
      status: response.status,
      statusText: response.statusText,
      endpoint
    });
    
    return false;
  } catch (error) {
    // Log any network or other errors
    logger.error(`Error checking if ${platform}/${owner}/${repo} is public`, {
      error: error instanceof Error ? error.message : String(error),
      platform,
      owner,
      repo
    });
    
    return false;
  }
}

/**
 * Verify that the public API endpoints are working by checking a known public repository
 */
export async function verifyPublicApiEndpoints(): Promise<Record<Platform, boolean>> {
  const knownPublicRepos = {
    github: { owner: 'microsoft', repo: 'vscode' },
    gitlab: { owner: 'gitlab-org', repo: 'gitlab' }
  };
  
  const results: Record<Platform, boolean> = { github: false, gitlab: false };
  
  for (const platform of ['github', 'gitlab'] as Platform[]) {
    try {
      const repo = knownPublicRepos[platform];
      results[platform] = await isPublicRepository(platform, repo.owner, repo.repo);
      
      if (!results[platform]) {
        logger.warn(`Public API check failed for known public repository ${platform}/${repo.owner}/${repo.repo}`);
      }
    } catch (error) {
      logger.error(`Error verifying ${platform} public API endpoint`, {
        error: error instanceof Error ? error.message : String(error)
      });
      results[platform] = false;
    }
  }
  
  return results;
}
