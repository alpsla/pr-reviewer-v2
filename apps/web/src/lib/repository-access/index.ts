/**
 * Check if a repository is public (not requiring authentication)
 */
export async function isPublicRepository(
  platform: VCSPlatform,
  owner: string,
  repo: string
): Promise<boolean> {
  try {
    if (platform === 'github') {
      // Try a public API request (no auth required)
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: 'HEAD',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      
      // If we get a 200 response, the repo is public
      return response.status === 200;
    } else if (platform === 'gitlab') {
      // Try a public API request (no auth required)
      const response = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(`${owner}/${repo}`)}`, {
        method: 'HEAD'
      });
      
      // If we get a 200 response, the repo is public
      return response.status === 200;
    }
    
    // Default to false for unsupported platforms
    return false;
  } catch (error) {
    console.error('Error checking if repository is public:', error);
    // Default to false on error (safer to treat as private)
    return false;
  }
}

/**
 * Repository Access Module
 * 
 * This module provides functions to check repository access and validate user permissions.
 */

import { VCSPlatform } from '@/lib/repository-utils';

/**
 * Repository access levels
 */
export enum AccessLevel {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

/**
 * Result of an access check
 */
export interface AccessCheckResult {
  hasAccess: boolean;
  accessLevel: AccessLevel;
  platform: VCSPlatform;
  owner: string;
  repo: string;
  error?: string;
  errorCode?: string;
}

/**
 * Check if a user has access to a repository
 */
export async function checkRepositoryAccess(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  accessToken?: string
): Promise<AccessCheckResult> {
  console.log(`Checking access for ${platform}/${owner}/${repo}`);
  
  const result: AccessCheckResult = {
    hasAccess: false,
    accessLevel: AccessLevel.NONE,
    platform,
    owner,
    repo
  };
  
  if (!accessToken) {
    result.error = 'No access token provided';
    result.errorCode = 'NO_TOKEN';
    return result;
  }

  try {
    // For GitHub
    if (platform === 'github') {
      // Test API access with token
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${accessToken}`
        }
      });
      
      if (repoResponse.status === 200) {
        const repoData = await repoResponse.json();
        
        result.hasAccess = true;
        
        // Determine access level based on repository permissions
        if (repoData.permissions) {
          if (repoData.permissions.admin) {
            result.accessLevel = AccessLevel.ADMIN;
          } else if (repoData.permissions.push) {
            result.accessLevel = AccessLevel.WRITE;
          } else if (repoData.permissions.pull) {
            result.accessLevel = AccessLevel.READ;
          }
        } else {
          // If permissions aren't returned, default to READ
          result.accessLevel = AccessLevel.READ;
        }
        
        return result;
      } else if (repoResponse.status === 403) {
        result.error = 'Rate limit exceeded or insufficient permissions';
        result.errorCode = 'RATE_LIMIT_OR_PERMISSION';
        return result;
      } else if (repoResponse.status === 404) {
        result.error = 'Repository not found or no permission';
        result.errorCode = 'NOT_FOUND';
        return result;
      } else {
        result.error = `GitHub API error: ${repoResponse.status}`;
        result.errorCode = 'API_ERROR';
        return result;
      }
    }
    
    // For GitLab
    if (platform === 'gitlab') {
      // Get project info
      const projectResponse = await fetch(`https://gitlab.com/api/v4/projects/${encodeURIComponent(`${owner}/${repo}`)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (projectResponse.status === 200) {
        const projectData = await projectResponse.json();
        
        result.hasAccess = true;
        
        // Map GitLab access levels to our enum
        // GitLab: 10=Guest, 20=Reporter, 30=Developer, 40=Maintainer, 50=Owner
        if (projectData.permissions) {
          const accessLevel = Math.max(
            projectData.permissions.project_access?.access_level || 0,
            projectData.permissions.group_access?.access_level || 0
          );
          
          if (accessLevel >= 40) {
            result.accessLevel = AccessLevel.ADMIN;
          } else if (accessLevel >= 30) {
            result.accessLevel = AccessLevel.WRITE;
          } else if (accessLevel >= 20) {
            result.accessLevel = AccessLevel.READ;
          } else if (accessLevel >= 10) {
            result.accessLevel = AccessLevel.READ; // Guest can read but not much else
          }
        } else {
          // If permissions aren't returned, default to READ
          result.accessLevel = AccessLevel.READ;
        }
        
        return result;
      } else if (projectResponse.status === 403) {
        result.error = 'Rate limit exceeded or insufficient permissions';
        result.errorCode = 'RATE_LIMIT_OR_PERMISSION';
        return result;
      } else if (projectResponse.status === 404) {
        result.error = 'Repository not found or no permission';
        result.errorCode = 'NOT_FOUND';
        return result;
      } else {
        result.error = `GitLab API error: ${projectResponse.status}`;
        result.errorCode = 'API_ERROR';
        return result;
      }
    }
    
    result.error = `Unsupported platform: ${platform}`;
    result.errorCode = 'UNSUPPORTED_PLATFORM';
    return result;
  } catch (error) {
    console.error('Error checking repository access:', error);
    result.error = `Error checking access: ${(error as Error).message}`;
    result.errorCode = 'ACCESS_CHECK_ERROR';
    return result;
  }
}

/**
 * Validate if a token is valid and working for a given platform
 */
export async function validateToken(
  platform: VCSPlatform,
  accessToken: string
): Promise<boolean> {
  try {
    if (platform === 'github') {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${accessToken}`
        }
      });
      
      return response.status === 200;
    } else if (platform === 'gitlab') {
      const response = await fetch('https://gitlab.com/api/v4/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return response.status === 200;
    }
    
    return false;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}
