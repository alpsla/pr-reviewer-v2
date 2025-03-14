/**
 * Repository Fingerprinting
 * 
 * This module handles creating unique fingerprints for repositories
 * to track analysis limits regardless of user account.
 */

import { VCSPlatform } from '../../types/platform';
import { createHash } from 'crypto';

/**
 * Creates a unique fingerprint for a repository based on platform, owner, and name
 * 
 * @param platform The VCS platform (github, gitlab)
 * @param owner Repository owner/organization
 * @param name Repository name
 * @returns A unique fingerprint hash
 */
export function createRepositoryFingerprint(
  platform: VCSPlatform,
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
  a: { platform: VCSPlatform, owner: string, name: string },
  b: { platform: VCSPlatform, owner: string, name: string }
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
  public readonly name: string;
  public readonly current: number;
  public readonly limit: number;
  
  constructor(
    message: string,
    repositoryId: string,
    owner: string,
    name: string,
    current: number,
    limit: number
  ) {
    super(message);
    this.name = 'AnalysisLimitError';
    this.repositoryId = repositoryId;
    this.owner = owner;
    this.name = name;
    this.current = current;
    this.limit = limit;
  }
}
