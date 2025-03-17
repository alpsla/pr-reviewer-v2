/**
 * Repository Analysis Limits Configuration
 * 
 * This file contains settings related to repository analysis limits
 * and can be adjusted without modifying the core application code.
 */

// Default number of free analyses allowed per repository
const BASE_FREE_TIER_ANALYSIS_LIMIT = 5;

// Default number of free analyses for test repositories
const BASE_TEST_REPOSITORY_LIMIT = 10;

/**
 * Get the default free tier analysis limit, with localStorage override
 */
export function getDefaultFreeAnalysisLimit(): number {
  if (typeof window !== 'undefined') {
    try {
      const savedLimit = localStorage.getItem('defaultFreeAnalysisLimit');
      if (savedLimit) {
        const parsedLimit = parseInt(savedLimit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          return parsedLimit;
        }
      }
    } catch (e) {
      // Ignore localStorage errors
      console.warn('Error reading defaultFreeAnalysisLimit from localStorage', e);
    }
  }
  return BASE_FREE_TIER_ANALYSIS_LIMIT;
}

/**
 * Get the test repository analysis limit, with localStorage override
 */
export function getTestRepositoryLimit(): number {
  if (typeof window !== 'undefined') {
    try {
      const savedLimit = localStorage.getItem('testRepoAnalysisLimit');
      if (savedLimit) {
        const parsedLimit = parseInt(savedLimit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          return parsedLimit;
        }
      }
    } catch (e) {
      // Ignore localStorage errors
      console.warn('Error reading testRepoAnalysisLimit from localStorage', e);
    }
  }
  return BASE_TEST_REPOSITORY_LIMIT;
}

/**
 * The default number of free analyses allowed per repository
 * This setting affects all new repositories being analyzed
 */
export const DEFAULT_FREE_TIER_ANALYSIS_LIMIT = getDefaultFreeAnalysisLimit();

/**
 * Whether to enforce limits in development mode
 * Set to false to disable limit checks during development
 */
export const ENFORCE_LIMITS_IN_DEVELOPMENT = true;

/**
 * Settings for test repositories
 */
export const TEST_REPOSITORIES = {
  /**
   * Free tier analysis limit for test repositories
   */
  FREE_TIER_ANALYSIS_LIMIT: getTestRepositoryLimit(),
  
  /**
   * Whether to identify repositories with 'test' in their name as test repositories
   */
  IDENTIFY_BY_NAME: true
};

/**
 * Gets custom repository limits from localStorage
 */
export function getCustomRepositoryLimits(): { owner: string; repo: string; limit: number }[] {
  if (typeof window !== 'undefined') {
    try {
      const savedLimits = localStorage.getItem('customRepositoryLimits');
      if (savedLimits) {
        return JSON.parse(savedLimits);
      }
    } catch (e) {
      // Ignore localStorage errors
      console.warn('Error reading customRepositoryLimits from localStorage', e);
    }
  }
  return [];
}

/**
 * Get the appropriate analysis limit based on repository information
 * 
 * @param platform The VCS platform ('github', 'gitlab', etc.)
 * @param owner Repository owner/organization
 * @param repo Repository name
 * @returns The appropriate analysis limit
 */
export function getAnalysisLimit(platform: string, owner: string, repo: string): number {
  // First check for custom repository limits
  const customLimits = getCustomRepositoryLimits();
  const customLimit = customLimits.find(
    limit => 
      limit.owner.toLowerCase() === owner.toLowerCase() && 
      limit.repo.toLowerCase() === repo.toLowerCase()
  );
  
  if (customLimit) {
    return customLimit.limit;
  }
  
  // Check if this is a test repository
  if (TEST_REPOSITORIES.IDENTIFY_BY_NAME && 
      (owner.toLowerCase().includes('test') || repo.toLowerCase().includes('test'))) {
    return TEST_REPOSITORIES.FREE_TIER_ANALYSIS_LIMIT;
  }
  
  // Special cases can be added here
  // For example, specific repositories or organizations
  if (owner === 'open-source' || owner === 'demo-org') {
    return 20; // Higher limit for open source projects
  }
  
  // Default limit for all other repositories
  return DEFAULT_FREE_TIER_ANALYSIS_LIMIT;
}
