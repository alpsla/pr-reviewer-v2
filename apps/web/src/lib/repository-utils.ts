/**
 * Check if a repository is publicly accessible
 * 
 * @param platform The VCS platform (github, gitlab)
 * @param owner Repository owner/organization
 * @param repo Repository name
 * @returns True if the repository is public
 */
export async function isPublicRepository(
  platform: string,
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
 * Get appropriate authentication headers for API requests
 * 
 * @param platform The VCS platform (github, gitlab)
 * @param isPublic Whether the repository is public
 * @param tokens Available authentication tokens
 * @returns Headers object for API requests
 */
export function getAuthHeaders(
  platform: string,
  isPublic: boolean,
  tokens?: { github?: string; gitlab?: string }
): HeadersInit {
  const headers: HeadersInit = {};
  
  // Always add Accept headers
  if (platform === 'github') {
    headers['Accept'] = 'application/vnd.github.v3+json';
  }
  
  // Add authorization if needed and available
  if (!isPublic || (tokens && Object.keys(tokens).length > 0)) {
    if (platform === 'github' && tokens?.github) {
      headers['Authorization'] = `token ${tokens.github}`;
    } else if (platform === 'gitlab' && tokens?.gitlab) {
      headers['Authorization'] = `Bearer ${tokens.gitlab}`;
    }
  }
  
  return headers;
}

/**
 * Repository utility functions
 * 
 * This module provides repository-related utility functions
 * to support operations in the main repository service.
 */

import { createHash } from 'crypto';

/**
 * VCS platform types
 */
export type VCSPlatform = 'github' | 'gitlab';

/**
 * Creates a unique fingerprint for a repository based on platform, owner, and name
 * 
 * @param platform The VCS platform (github, gitlab)
 * @param owner Repository owner/organization
 * @param name Repository name
 * @returns A unique fingerprint hash
 */
export function createRepositoryFingerprint(
  platform: VCSPlatform | string,
  owner: string,
  name: string
): string {
  // Normalize inputs (lowercase, trim spaces)
  const normalizedPlatform = platform.toLowerCase().trim();
  const normalizedOwner = owner.toLowerCase().trim();
  const normalizedName = name.toLowerCase().trim();
  
  // Create fingerprint string and hash it 
  const fingerprintString = `${normalizedPlatform}:${normalizedOwner}/${normalizedName}`;
  
  // Log fingerprint creation for debugging
  console.log(`Creating fingerprint for repository: ${fingerprintString}`);
  
  const hash = createHash('sha256')
    .update(fingerprintString)
    .digest('hex');
  
  console.log(`Generated fingerprint hash: ${hash.substring(0, 16)}...`);
  return hash;
}

/**
 * Checks if two repositories are the same based on their identifiers
 * 
 * @param a First repository platform, owner, and name
 * @param b Second repository platform, owner, and name
 * @returns True if they are the same repository
 */
export function isSameRepository(
  a: { platform: VCSPlatform | string, owner: string, name: string },
  b: { platform: VCSPlatform | string, owner: string, name: string }
): boolean {
  return (
    a.platform.toLowerCase() === b.platform.toLowerCase() &&
    a.owner.toLowerCase() === b.owner.toLowerCase() &&
    a.name.toLowerCase() === b.name.toLowerCase()
  );
}

/**
 * Analysis limit tracking error
 */
export class AnalysisLimitError extends Error {
  public readonly repositoryId: string;
  public readonly owner: string;
  public readonly repo: string;
  public readonly current: number;
  public readonly limit: number;
  
  constructor(
    message: string,
    repositoryId: string,
    owner: string,
    repo: string,
    current: number,
    limit: number
  ) {
    super(message);
    this.name = 'AnalysisLimitError';
    this.repositoryId = repositoryId;
    this.owner = owner;
    this.repo = repo;
    this.current = current;
    this.limit = limit;
  }
}
