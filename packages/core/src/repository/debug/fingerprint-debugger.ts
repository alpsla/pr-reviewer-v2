/**
 * Repository Fingerprinting Debugger
 * 
 * This module provides debugging tools for repository fingerprinting
 * to help with edge case testing and troubleshooting.
 */

import { VCSPlatform } from '../../types/platform';
import { createRepositoryFingerprint, isSameRepository } from '../fingerprint';

/**
 * Detailed information about a fingerprint
 */
export interface FingerprintDebugInfo {
  // Input values
  rawPlatform: string;
  rawOwner: string;
  rawName: string;
  
  // Normalized values
  normalizedPlatform: string;
  normalizedOwner: string;
  normalizedName: string;
  
  // Fingerprint generation
  fingerprintString: string;
  fingerprint: string;
  
  // Character information
  ownerSpecialChars: { char: string, code: number }[];
  nameSpecialChars: { char: string, code: number }[];
}

/**
 * Compare results between two repository identifiers
 */
export interface RepositoryCompareResult {
  // Raw values
  repoA: { platform: string, owner: string, name: string };
  repoB: { platform: string, owner: string, name: string };
  
  // Normalized values 
  normalizedA: { platform: string, owner: string, name: string };
  normalizedB: { platform: string, owner: string, name: string };
  
  // Fingerprints
  fingerprintA: string;
  fingerprintB: string;
  
  // Comparison results
  isSame: boolean;
  
  // Difference details
  platformMatch: boolean;
  ownerMatch: boolean;
  nameMatch: boolean;
  
  // Character-level differences
  ownerDifferences: { index: number, charA: string, charB: string }[];
  nameDifferences: { index: number, charA: string, charB: string }[];
}

/**
 * Debugger for repository fingerprinting
 */
export class FingerprintDebugger {
  /**
   * Get detailed debugging information about a repository fingerprint
   */
  static getDebugInfo(
    platform: VCSPlatform,
    owner: string,
    name: string
  ): FingerprintDebugInfo {
    // Normalize inputs (same as in createRepositoryFingerprint)
    const normalizedPlatform = platform.toLowerCase().trim();
    const normalizedOwner = owner.toLowerCase().trim();
    const normalizedName = name.toLowerCase().trim();
    
    // Create fingerprint string 
    const fingerprintString = `${normalizedPlatform}:${normalizedOwner}/${normalizedName}`;
    
    // Get the actual fingerprint
    const fingerprint = createRepositoryFingerprint(platform, owner, name);
    
    // Detect special characters
    const ownerSpecialChars = this.detectSpecialChars(owner);
    const nameSpecialChars = this.detectSpecialChars(name);
    
    return {
      // Raw inputs
      rawPlatform: platform,
      rawOwner: owner,
      rawName: name,
      
      // Normalized values
      normalizedPlatform,
      normalizedOwner,
      normalizedName,
      
      // Fingerprint details
      fingerprintString,
      fingerprint,
      
      // Special character information
      ownerSpecialChars,
      nameSpecialChars
    };
  }
  
  /**
   * Compare two repositories to see if they generate the same fingerprint
   */
  static compareRepositories(
    repoA: { platform: VCSPlatform, owner: string, name: string },
    repoB: { platform: VCSPlatform, owner: string, name: string }
  ): RepositoryCompareResult {
    // Get normalized values
    const normalizedA = {
      platform: repoA.platform.toLowerCase().trim(),
      owner: repoA.owner.toLowerCase().trim(),
      name: repoA.name.toLowerCase().trim()
    };
    
    const normalizedB = {
      platform: repoB.platform.toLowerCase().trim(),
      owner: repoB.owner.toLowerCase().trim(),
      name: repoB.name.toLowerCase().trim()
    };
    
    // Generate fingerprints
    const fingerprintA = createRepositoryFingerprint(
      repoA.platform, 
      repoA.owner, 
      repoA.name
    );
    
    const fingerprintB = createRepositoryFingerprint(
      repoB.platform, 
      repoB.owner, 
      repoB.name
    );
    
    // Check if they're the same repository according to our logic
    const isSame = isSameRepository(repoA, repoB);
    
    // Check individual field matches
    const platformMatch = normalizedA.platform === normalizedB.platform;
    const ownerMatch = normalizedA.owner === normalizedB.owner;
    const nameMatch = normalizedA.name === normalizedB.name;
    
    // Character-level differences
    const ownerDifferences = this.findCharDifferences(
      normalizedA.owner, 
      normalizedB.owner
    );
    
    const nameDifferences = this.findCharDifferences(
      normalizedA.name, 
      normalizedB.name
    );
    
    return {
      repoA: { ...repoA },
      repoB: { ...repoB },
      normalizedA,
      normalizedB,
      fingerprintA,
      fingerprintB,
      isSame,
      platformMatch,
      ownerMatch,
      nameMatch,
      ownerDifferences,
      nameDifferences
    };
  }
  
  /**
   * Test repository fingerprinting with special characters
   */
  static testSpecialCharacters(platform: VCSPlatform): {
    cases: { input: string, normalized: string, containsSpecial: boolean }[]
    recommendations: string[]
  } {
    // Test a variety of special characters and edge cases
    const testCases = [
      'normal-repo',
      'UPPERCASE',
      'repo.with.dots',
      'repo-with-hyphens',
      'repo_with_underscores',
      'repo with spaces',
      'répo-wíth-áccènts',
      'repo#with#hashtags',
      'repo@with@at-signs',
      'repo$with$dollar',
      'repo%with%percent',
      'repo^with^carets',
      'repo&with&ampersands',
      'repo*with*asterisks',
      'repo(with)parentheses',
      'repo[with]brackets',
      'repo{with}braces',
      'repo+with+plus',
      'repo=with=equals',
      'repo/with/slashes', // This could cause issues
      'repo\\with\\backslashes', // This could cause issues
      'repo"with"quotes',
      "repo'with'quotes",
      'repo`with`backticks',
      'repo|with|pipes',
      'repo<with>angle-brackets',
      'repo:with:colons', // This could cause issues
      'repo;with;semicolons',
      'repo,with,commas',
      'repo?with?questions',
      'repo!with!exclamations',
      '   repo with leading and trailing spaces   ',
      // Emoji case
      'repo🚀with🔥emojis',
      // Control character case (invisible)
      'repo\u0000with\u0001control\u0002chars',
      // Zero-width spaces and other invisible characters
      'repo\u200Bwith\u200Czero\u200Dwidth\u200Espaces',
      // Multi-byte UTF-8 characters (Chinese)
      '中文-repo-name',
      // Multi-byte UTF-8 characters (Japanese)
      'リポジトリ-name',
      // Multi-byte UTF-8 characters (Arabic)
      'اسم-المستودع',
      // Very long name 
      'a'.repeat(255)
    ];
    
    const results = testCases.map(testCase => {
      const normalized = testCase.toLowerCase().trim();
      const specialChars = this.detectSpecialChars(testCase);
      
      return {
        input: testCase,
        normalized,
        containsSpecial: specialChars.length > 0,
        specialChars,
        fingerprint: createRepositoryFingerprint(platform, 'owner', testCase)
      };
    });
    
    // Generate recommendations based on problematic cases
    const recommendations = [
      'Ensure that repository names with slashes are properly handled',
      'Watch for case sensitivity differences between "Owner/Repo" and "owner/repo"',
      'Be cautious with invisible characters, which will be normalized but can be confusing',
      'Very long names are handled correctly but may be unwieldy in URLs',
      'Repository names with emoji are supported but may cause issues in some interfaces'
    ];
    
    return {
      cases: results.map(r => ({
        input: r.input,
        normalized: r.normalized,
        containsSpecial: r.containsSpecial
      })),
      recommendations
    };
  }
  
  /**
   * Find character-level differences between two strings
   */
  private static findCharDifferences(strA: string, strB: string): { index: number, charA: string, charB: string }[] {
    const maxLength = Math.max(strA.length, strB.length);
    const differences: Array<{ index: number, charA: string, charB: string }> = [];
    
    for (let i = 0; i < maxLength; i++) {
      // Get characters safely
      const a = strA.charAt(i);
      const b = strB.charAt(i);
      
      if (a !== b) {
        // Log for debugging but don't include in return type
        console.log(`Difference at index ${i}:`, {
          index: i,
          charA: a,
          charB: b,
          codeA: a ? a.charCodeAt(0) : 'none',
          codeB: b ? b.charCodeAt(0) : 'none'
        });
        
        // Add to differences array
        differences.push({
          index: i,
          charA: a,
          charB: b
        });
      }
    }
    
    return differences;
  }
  
  /**
   * Detect and report special characters in a string
   */
  private static detectSpecialChars(str: string): { char: string, code: number }[] {
    const specialChars: Array<{ char: string, code: number }> = [];
    
    for (let i = 0; i < str.length; i++) {
      // Use charAt which always returns a string (empty string if out of bounds)
      const char = str.charAt(i);
      if (char === '') continue; // Skip empty characters
      
      const code = char.charCodeAt(0);
      
      // Consider anything outside ASCII alphanumeric, hyphen, underscore as "special"
      if (
        !(
          (code >= 48 && code <= 57) || // 0-9
          (code >= 65 && code <= 90) || // A-Z
          (code >= 97 && code <= 122) || // a-z
          code === 45 || // hyphen
          code === 95 // underscore
        )
      ) {
        specialChars.push({ char, code });
      }
    }
    
    return specialChars;
  }
}
