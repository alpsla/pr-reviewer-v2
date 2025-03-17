/**
 * Repository Visibility Helper Functions
 * 
 * This module provides functionality to check repository visibility
 * and smartly analyze pull requests based on their visibility status.
 */

import { VCSPlatform } from './repository-utils';

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
 * Result of a smart PR analysis attempt
 */
export interface SmartPrAnalysisResult {
  success: boolean;
  details?: any; // PullRequestBasicDetails
  error?: string;
  errorCode?: string;
  requiresAuth: boolean;
  visibility: RepositoryVisibility;
  exists: boolean;
  platform: VCSPlatform;
  owner: string;
  repo: string;
  prNumber: number;
  repositoryId?: string;
}

/**
 * Check repository visibility without requiring authentication
 * Uses public API endpoints and website checks to determine status
 */
export async function checkRepositoryVisibility(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  accessToken?: string
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
      // Handle cross-platform authentication if accessToken is provided
      if (accessToken) {
        try {
          // Try public API first without token (might work for public repos)
          const testResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
          });
          
          if (testResponse.ok) {
            console.log('Public repository access successful without token, using public API');
            // Note that the repository is public, but keep the token for authorized API calls
            result.visibility = RepositoryVisibility.PUBLIC;
            result.exists = true;
          } else {
            // If we're here with an access token but can't access the repo, it might be
            // a GitLab token trying to access GitHub or vice versa
            console.warn('Cross-platform authentication detected - GitLab token with GitHub repo?');
          }
        } catch (err) {
          console.error('Error in cross-platform auth check:', err);
        }
      }
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

/**
 * Smart PR analysis that checks visibility first and handles authentication appropriately
 */
export async function analyzePullRequest(
  platform: VCSPlatform,
  owner: string,
  repo: string,
  prNumber: number,
  accessToken?: string
): Promise<SmartPrAnalysisResult> {
  console.log(`Starting smart PR analysis for: ${platform}/${owner}/${repo}#${prNumber}`);
  
  try {
    // First, check repository visibility - this doesn't require authentication
    const visibilityResult = await checkRepositoryVisibility(platform, owner, repo, accessToken);
    
    // Basic result structure
    const result: SmartPrAnalysisResult = {
      success: false,
      requiresAuth: false,
      visibility: visibilityResult.visibility,
      exists: visibilityResult.exists,
      platform,
      owner,
      repo,
      prNumber
    };
    
    // Case 1: Repository doesn't exist
    if (!visibilityResult.exists) {
      result.error = `Repository '${owner}/${repo}' not found`;
      result.errorCode = 'REPOSITORY_NOT_FOUND';
      return result;
    }
    
    // Case 2: Private repository but no access token
    if (visibilityResult.visibility === RepositoryVisibility.PRIVATE && !accessToken) {
      result.error = `Repository '${owner}/${repo}' is private and requires authentication`;
      result.errorCode = 'AUTHENTICATION_REQUIRED';
      result.requiresAuth = true;
      return result;
    }
    
    // At this point, we either have:
    // 1. A public repository, or
    // 2. A private repository with an access token
    
    try {
      // If we have a token, use it regardless of visibility
      if (accessToken) {
        console.log(`Using access token for ${platform} to fetch PR data`);
        
        // Handle cross-platform authentication
        if (platform === 'github') {
          try {
            // Test the token with a simple request
            const testResponse = await fetch(`https://api.github.com/user`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${accessToken}`
              }
            });
            
            if (!testResponse.ok) {
              // If we got 401, it's probably a GitLab token trying to use GitHub API
              if (testResponse.status === 401) {
                console.warn('Cross-platform authentication detected - Non-GitHub token with GitHub repo');
                
                // If it's a public repository, we can try to use the public API
                if (visibilityResult.visibility === RepositoryVisibility.PUBLIC) {
                  console.log('Repository is public, continuing without authentication');
                  accessToken = undefined;
                } else {
                  // Set specific error message for cross-platform auth with private repos
                  result.success = false;
                  result.error = `Cross-platform authentication not supported. You're signed in with a different platform than the repository you're trying to access.`;
                  result.errorCode = 'CROSS_PLATFORM_AUTH';
                  result.requiresAuth = true;
                  
                  return result;
                }
              }
            }
          } catch (err) {
            console.error('Error validating token:', err);
          }
        }
        
        // Fetch actual PR data from GitHub API
        let prData;
        let repoData;
        let prFiles;
        
        if (platform === 'github') {
          // Fetch PR data from GitHub API
          const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `token ${accessToken}`
            }
          });
          
          if (!prResponse.ok) {
            throw new Error(`GitHub API error: ${prResponse.status} - ${await prResponse.text()}`);
          }
          
          prData = await prResponse.json();
          
          // Fetch repository data
          const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `token ${accessToken}`
            }
          });
          
          if (!repoResponse.ok) {
            throw new Error(`GitHub API error: ${repoResponse.status} - ${await repoResponse.text()}`);
          }
          
          repoData = await repoResponse.json();
          
          // Fetch PR files
          const filesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `token ${accessToken}`
            }
          });
          
          if (!filesResponse.ok) {
            throw new Error(`GitHub API error: ${filesResponse.status} - ${await filesResponse.text()}`);
          }
          
          prFiles = await filesResponse.json();
          
          // Calculate totals
          const filesChanged = prFiles.length;
          const linesAdded = prFiles.reduce((total: number, file: any) => total + (file.additions || 0), 0);
          const linesRemoved = prFiles.reduce((total: number, file: any) => total + (file.deletions || 0), 0);
          
          // Build PR details
          result.success = true;
          result.details = {
            title: prData.title,
            number: prNumber,
            createdAt: prData.created_at,
            updatedAt: prData.updated_at,
            author: prData.user,
            branch: prData.head.ref,
            baseBranch: prData.base.ref,
            repository: {
              id: repoData.id,
              name: repo,
              owner: owner,
              fullName: `${owner}/${repo}`,
              platform: platform,
              private: repoData.private
            },
            repositoryId: repoData.id.toString(),
            filesChanged: filesChanged,
            linesAdded: linesAdded,
            linesRemoved: linesRemoved
          };
        } else if (platform === 'gitlab') {
          // Implement GitLab API calls similar to above
          // For now, use placeholder data
          result.success = true;
          result.details = {
            title: `Pull Request #${prNumber}`,
            number: prNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              login: "user",
              avatarUrl: "https://gitlab.com/user.png"
            },
            branch: "feature",
            baseBranch: "main",
            repository: {
              id: `${platform}-${owner}-${repo}`,
              name: repo,
              owner: owner,
              fullName: `${owner}/${repo}`,
              platform: platform,
              private: visibilityResult.visibility === RepositoryVisibility.PRIVATE
            },
            filesChanged: 0,
            linesAdded: 0,
            linesRemoved: 0
          };
        }
        return result;
      } else if (visibilityResult.visibility === RepositoryVisibility.PUBLIC) {
        // For public repositories, try without token
        console.log(`Accessing public repository ${platform}/${owner}/${repo} without authentication`);
        
        // Fetch actual PR data from public APIs
        let prData;
        let repoData;
        let prFiles;
        
        if (platform === 'github') {
          // Fetch PR data from GitHub API (public repos don't need auth)
          const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (!prResponse.ok) {
            throw new Error(`GitHub API error: ${prResponse.status} - ${await prResponse.text()}`);
          }
          
          prData = await prResponse.json();
          
          // Fetch repository data
          const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (!repoResponse.ok) {
            throw new Error(`GitHub API error: ${repoResponse.status} - ${await repoResponse.text()}`);
          }
          
          repoData = await repoResponse.json();
          
          // Fetch PR files
          const filesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (!filesResponse.ok) {
            throw new Error(`GitHub API error: ${filesResponse.status} - ${await filesResponse.text()}`);
          }
          
          prFiles = await filesResponse.json();
          
          // Calculate totals
          const filesChanged = prFiles.length;
          const linesAdded = prFiles.reduce((total: number, file: any) => total + (file.additions || 0), 0);
          const linesRemoved = prFiles.reduce((total: number, file: any) => total + (file.deletions || 0), 0);
          
          // Build PR details
          result.success = true;
          result.details = {
            title: prData.title,
            number: prNumber,
            createdAt: prData.created_at,
            updatedAt: prData.updated_at,
            author: prData.user,
            branch: prData.head.ref,
            baseBranch: prData.base.ref,
            repository: {
              id: repoData.id,
              name: repo,
              owner: owner,
              fullName: `${owner}/${repo}`,
              platform: platform,
              private: repoData.private
            },
            repositoryId: repoData.id.toString(),
            filesChanged: filesChanged,
            linesAdded: linesAdded,
            linesRemoved: linesRemoved
          };
        } else if (platform === 'gitlab') {
          // Implement GitLab API calls similar to above
          // For now, use placeholder data
          result.success = true;
          result.details = {
            title: `Pull Request #${prNumber}`,
            number: prNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              login: "user",
              avatarUrl: "https://gitlab.com/user.png"
            },
            branch: "feature",
            baseBranch: "main",
            repository: {
              id: `${platform}-${owner}-${repo}`,
              name: repo,
              owner: owner,
              fullName: `${owner}/${repo}`,
              platform: platform,
              private: false
            },
            filesChanged: 0,
            linesAdded: 0,
            linesRemoved: 0
          };
        }
        return result;
      }
      
      // This should not happen, but handle it just in case
      result.error = 'Unable to access repository data';
      result.errorCode = 'UNKNOWN_ACCESS_ERROR';
      return result;
      
    } catch (fetchError) {
      console.error('Error fetching PR details:', fetchError);
      
      // Handle permission errors even with token
      if ((fetchError as any).status === 403 || 
          ((fetchError as any).message && 
           typeof (fetchError as any).message === 'string' && 
           (fetchError as any).message.toLowerCase().includes('permission'))) {
        
        result.error = `You don't have sufficient permissions to access ${owner}/${repo}`;
        result.errorCode = 'PERMISSION_DENIED';
        result.requiresAuth = true;
        return result;
      }
      
      // Handle 404 errors for PR not found
      if ((fetchError as any).status === 404 || 
          ((fetchError as any).message && 
           typeof (fetchError as any).message === 'string' && 
           (fetchError as any).message.toLowerCase().includes('not found'))) {
        
        result.error = `Pull request #${prNumber} not found in repository ${owner}/${repo}`;
        result.errorCode = 'PR_NOT_FOUND';
        return result;
      }
      
      // Handle authentication errors
      if ((fetchError as any).status === 401 || 
          ((fetchError as any).message && 
           typeof (fetchError as any).message === 'string' && 
           ((fetchError as any).message.toLowerCase().includes('authentication') || 
            (fetchError as any).message.toLowerCase().includes('unauthorized')))) {
        
        result.error = `Authentication required to access ${owner}/${repo}`;
        result.errorCode = 'AUTHENTICATION_FAILED';
        result.requiresAuth = true;
        return result;
      }
      
      // General error case
      result.error = `Error fetching PR data: ${(fetchError as any).message || 'Unknown error'}`; 
      result.errorCode = 'FETCH_ERROR';
      return result;
    }
    
  } catch (error) {
    // Handle unexpected errors in the visibility check or elsewhere
    console.error('Unexpected error in analyzePullRequest:', error);
    
    return {
      success: false,
      error: `Analysis failed: ${(error as any).message || 'Unknown error'}`,
      errorCode: 'ANALYSIS_ERROR',
      requiresAuth: false,
      visibility: RepositoryVisibility.UNKNOWN,
      exists: false,
      platform,
      owner,
      repo,
      prNumber
    };
  }
}
