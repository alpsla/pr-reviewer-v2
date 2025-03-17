/**
 * Repository Visibility Service
 * 
 * Provides functionality to check repository visibility status before attempting access.
 * This allows for more elegant handling of public vs private repositories.
 */

import { VCSPlatform } from '../../types/platform';

/**
 * Repository visibility status
 */
export enum RepositoryVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  UNKNOWN = "unknown"
}

/**
 * Result of a repository visibility check
 */
export interface VisibilityCheckResult {
  visibility: RepositoryVisibility;
  exists: boolean;
  url: string;
  platform: VCSPlatform;
  owner: string;
  repo: string;
}

/**
 * Check repository visibility without requiring authentication
 * Uses public API endpoints and website checks to determine status
 */
export async function checkRepositoryVisibility(
  platform: VCSPlatform,
  owner: string,
  repo: string
): Promise<VisibilityCheckResult> {
  console.log(`Checking visibility for ${platform}/${owner}/${repo}`);
  
  const result: VisibilityCheckResult = {
    visibility: RepositoryVisibility.UNKNOWN,
    exists: false,
    url: `https://${platform}.com/${owner}/${repo}`,
    platform,
    owner,
    repo
  };
  
  try {
    // For GitHub
    if (platform === 'github') {
      // Try a public API request first (no auth required)
      const apiResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: 'HEAD',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      
      if (apiResponse.status === 200) {
        // Repository exists and is public
        console.log(`Repository ${owner}/${repo} is PUBLIC on GitHub (API check)`);
        result.visibility = RepositoryVisibility.PUBLIC;
        result.exists = true;
        return result;
      } 
      
      // If API returns 404, try a website check to see if the repo exists but is private
      if (apiResponse.status === 404) {
        const webResponse = await fetch(`https://github.com/${owner}/${repo}`, {
          method: 'HEAD'
        });
        
        if (webResponse.status === 200) {
          // Repository exists on GitHub website but not accessible via API without auth
          // This means it's private
          console.log(`Repository ${owner}/${repo} is PRIVATE on GitHub (web check)`);
          result.visibility = RepositoryVisibility.PRIVATE;
          result.exists = true;
        } else {
          // Repository doesn't seem to exist at all
          console.log(`Repository ${owner}/${repo} does NOT EXIST on GitHub`);
          result.visibility = RepositoryVisibility.UNKNOWN;
          result.exists = false;
        }
        
        return result;
      }
    }
    
    // For GitLab
    if (platform === 'gitlab') {
      // Similar approach for GitLab
      const apiResponse = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(`${owner}/${repo}`)}`, {
        method: 'HEAD'
      });
      
      if (apiResponse.status === 200) {
        // Repository exists and is public
        console.log(`Repository ${owner}/${repo} is PUBLIC on GitLab (API check)`);
        result.visibility = RepositoryVisibility.PUBLIC;
        result.exists = true;
        return result;
      } 
      
      if (apiResponse.status === 404) {
        // Check the website to determine if it exists but is private
        const webResponse = await fetch(`https://gitlab.com/${owner}/${repo}`, {
          method: 'HEAD'
        });
        
        if (webResponse.status === 200) {
          // Repository exists on GitLab website but not accessible via API without auth
          // This means it's private
          console.log(`Repository ${owner}/${repo} is PRIVATE on GitLab (web check)`);
          result.visibility = RepositoryVisibility.PRIVATE;
          result.exists = true;
        } else {
          // Repository doesn't seem to exist at all
          console.log(`Repository ${owner}/${repo} does NOT EXIST on GitLab`);
          result.visibility = RepositoryVisibility.UNKNOWN;
          result.exists = false;
        }
        
        return result;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error checking repository visibility:', error);
    // On error, return UNKNOWN status
    return result;
  }
}
