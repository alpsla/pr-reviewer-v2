/**
 * Repository Operations Debugger
 * 
 * This module provides debugging tools for repository operations
 * to help with edge case testing and troubleshooting.
 */

import { VCSPlatform } from '../../types/platform';
import { DatabaseService } from '../../supabase/database';
import { RepositoryOperations } from '../repository-operations';
import { FingerprintDebugger } from './fingerprint-debugger';
import { createRepositoryFingerprint } from '../fingerprint';

/**
 * Repository operation debug information
 */
export interface RepositoryDebugInfo {
  // Repository identifier
  platform: string;
  owner: string;
  name: string;
  
  // Tracking information
  fingerprint: string;
  fingerprintDetails: ReturnType<typeof FingerprintDebugger.getDebugInfo>;
  
  // Database records
  dbRecord?: any;
  dbRecordFound: boolean;
  
  // Analysis counts
  analysisCount: number;
  freeLimit: number;
  hasReachedLimit: boolean;
  
  // Timing information (in ms)
  timing: {
    dbLookup: number;
    apiCall?: number;
    total: number;
  };
}

/**
 * Large PR debug information
 */
export interface LargePrDebugInfo {
  platform: string;
  owner: string;
  repo: string;
  prNumber: number;
  
  // PR statistics
  fileCount: number;
  batchCount: number;
  totalAdditions: number;
  totalDeletions: number;
  
  // Timing information (in ms)
  timing: {
    perBatch: number[];
    total: number;
  };
  
  // Error information if any
  errors: string[];
  
  // Memory usage information
  memoryUsage: {
    beforeFetch: NodeJS.MemoryUsage;
    afterFetch: NodeJS.MemoryUsage;
    difference: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
  };
}

/**
 * Debugger for repository operations
 */
export class RepositoryDebugger {
  private repoOps: RepositoryOperations;
  private db: DatabaseService;
  
  constructor(
    repoOps: RepositoryOperations,
    db: DatabaseService
  ) {
    this.repoOps = repoOps;
    this.db = db;
  }
  
  /**
   * Debug repository fingerprinting and tracking for a specific repository
   */
  async debugRepository(
    platform: VCSPlatform,
    owner: string,
    name: string
  ): Promise<RepositoryDebugInfo> {
    const startTime = Date.now();
    
    // Generate fingerprint
    const fingerprint = createRepositoryFingerprint(platform, owner, name);
    
    // Get detailed fingerprint debug info
    const fingerprintDetails = FingerprintDebugger.getDebugInfo(platform, owner, name);
    
    // Try to find repository in DB
    const dbLookupStart = Date.now();
    let dbRecord = null;
    let dbRecordFound = false;
    
    try {
      // First try by fingerprint
      dbRecord = await this.db.getRepositoryByFingerprint(fingerprint);
      dbRecordFound = true;
    } catch (error) {
      try {
        // Then try by owner/name
        dbRecord = await this.db.getRepositoryByOwnerAndName(owner, name);
        dbRecordFound = true;
      } catch (innerError) {
        // No record found
        dbRecordFound = false;
      }
    }
    
    const dbLookupTime = Date.now() - dbLookupStart;
    
    // Get analysis counts
    let analysisCount = 0;
    let freeLimit = 5;
    let hasReachedLimit = false;
    
    if (dbRecord) {
      analysisCount = dbRecord.analysis_count || 0;
      freeLimit = dbRecord.free_tier_analysis_limit || 5;
      hasReachedLimit = analysisCount >= freeLimit;
    }
    
    // Call API if needed to verify info
    let apiCallTime: number | undefined;
    
    if (!dbRecordFound) {
      const apiCallStart = Date.now();
      try {
        // Get repository from API
        await this.repoOps.getRepository(platform, owner, name);
      } catch (error) {
        // API call failed, just log in debug info
        console.error('API call failed in debug mode:', error);
      }
      apiCallTime = Date.now() - apiCallStart;
    }
    
    const totalTime = Date.now() - startTime;
    
    return {
      platform,
      owner,
      name,
      fingerprint,
      fingerprintDetails,
      dbRecord,
      dbRecordFound,
      analysisCount,
      freeLimit,
      hasReachedLimit,
      timing: {
        dbLookup: dbLookupTime,
        apiCall: apiCallTime,
        total: totalTime
      }
    };
  }
  
  /**
   * Compare two similar repositories to debug fingerprinting
   */
  async compareRepositories(
    repoA: { platform: VCSPlatform, owner: string, name: string },
    repoB: { platform: VCSPlatform, owner: string, name: string }
  ): Promise<{
    comparison: ReturnType<typeof FingerprintDebugger.compareRepositories>,
    dbRecordA?: any,
    dbRecordB?: any,
    bothFound: boolean,
    sameRecord: boolean
  }> {
    // Get comparison from fingerprint debugger
    const comparison = FingerprintDebugger.compareRepositories(repoA, repoB);
    
    // Try to find both repositories in DB
    let dbRecordA = null;
    let dbRecordB = null;
    let bothFound = false;
    let sameRecord = false;
    
    try {
      // Get repoA from DB
      dbRecordA = await this.db.getRepositoryByFingerprint(comparison.fingerprintA);
      
      // Get repoB from DB
      dbRecordB = await this.db.getRepositoryByFingerprint(comparison.fingerprintB);
      
      bothFound = true;
      
      // Check if they're actually the same record
      if (dbRecordA && dbRecordB && dbRecordA.id === dbRecordB.id) {
        sameRecord = true;
      }
    } catch (error) {
      // One or both records not found
      bothFound = false;
    }
    
    return {
      comparison,
      dbRecordA,
      dbRecordB,
      bothFound,
      sameRecord
    };
  }
  
  /**
   * Test simulating a repository changing from public to private
   */
  async testPublicPrivateSwitch(
    platform: VCSPlatform,
    owner: string,
    name: string
  ): Promise<{
    originalRecord?: any,
    afterUpdate?: any,
    fingerprint: string,
    fingerprintChanged: boolean,
    analysisCountPreserved: boolean
  }> {
    // First, get current record
    let originalRecord = null;
    
    try {
      const fingerprint = createRepositoryFingerprint(platform, owner, name);
      originalRecord = await this.db.getRepositoryByFingerprint(fingerprint);
    } catch (error) {
      // Record not found, try to create it
      try {
        const repo = await this.repoOps.getRepository(platform, owner, name);
        const fingerprint = createRepositoryFingerprint(platform, owner, name);
        originalRecord = await this.db.getRepositoryByFingerprint(fingerprint);
      } catch (innerError) {
        console.error('Could not get or create repository record', innerError);
        return {
          fingerprint: createRepositoryFingerprint(platform, owner, name),
          fingerprintChanged: false,
          analysisCountPreserved: false
        };
      }
    }
    
    // Capture original values
    const originalFingerprint = originalRecord.fingerprint;
    const originalAnalysisCount = originalRecord.analysis_count || 0;
    
    // Simulate changing from public to private (and back)
    // We'll update the is_private field in the database record
    const updatedRepo = await this.db.createRepository({
      ...originalRecord,
      is_private: !originalRecord.is_private
    }, { upsert: true });
    
    // Get updated record
    const updatedRecord = await this.db.getRepositoryByFingerprint(originalFingerprint);
    
    // Check if fingerprint changed (it shouldn't)
    const fingerprintChanged = updatedRecord.fingerprint !== originalFingerprint;
    
    // Check if analysis count was preserved (it should be)
    const analysisCountPreserved = updatedRecord.analysis_count === originalAnalysisCount;
    
    return {
      originalRecord,
      afterUpdate: updatedRecord,
      fingerprint: originalFingerprint,
      fingerprintChanged,
      analysisCountPreserved
    };
  }
  
  /**
   * Test repository fingerprinting with special characters
   */
  testSpecialCharacters(platform: VCSPlatform): ReturnType<typeof FingerprintDebugger.testSpecialCharacters> {
    return FingerprintDebugger.testSpecialCharacters(platform);
  }
  
  /**
   * Debug large PR handling
   */
  async debugLargePr(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    prNumber: number,
    batchSize = 100
  ): Promise<LargePrDebugInfo> {
    const startTime = Date.now();
    const errors: string[] = [];
    const batchTimes: number[] = [];
    
    // Capture memory usage before
    const memBefore = process.memoryUsage();
    
    let fileCount = 0;
    let batchCount = 0;
    let totalAdditions = 0;
    let totalDeletions = 0;
    
    try {
      // Get client for this platform
      const client = (this.repoOps as any).getClientForPlatform(platform);
      
      // Get initial PR information
      const prInfo = await client.getPullRequest(owner, repo, prNumber);
      fileCount = prInfo.changedFiles || 0;
      
      // Estimate total batches needed
      const estimatedBatches = Math.ceil(fileCount / batchSize);
      console.log(`Large PR debugging: Found approximately ${fileCount} files, will fetch in ~${estimatedBatches} batches`);
      
      // Fetch files in batches
      let page = 1;
      let hasMorePages = true;
      let files: any[] = [];
      
      while (hasMorePages) {
        const batchStart = Date.now();
        console.log(`Fetching batch ${page}...`);
        
        try {
          // Fetching PR files with pagination
          const batchFiles = await client.getPullRequestFiles(owner, repo, prNumber, {
            page,
            perPage: batchSize
          });
          
          if (batchFiles.length === 0) {
            hasMorePages = false;
          } else {
            files = [...files, ...batchFiles];
            
            // Process this batch stats
            for (const file of batchFiles) {
              totalAdditions += file.additions || 0;
              totalDeletions += file.deletions || 0;
            }
            
            page++;
            batchCount++;
            
            // Record timing for this batch
            const batchTime = Date.now() - batchStart;
            batchTimes.push(batchTime);
            
            console.log(`Batch ${batchCount} complete, fetched ${batchFiles.length} files in ${batchTime}ms`);
            console.log(`Total so far: ${files.length} files, +${totalAdditions}/-${totalDeletions} lines`);
          }
        } catch (error) {
          const errorMsg = `Error fetching batch ${page}: ${error instanceof Error ? error.message : String(error)}`;
          console.error(errorMsg);
          errors.push(errorMsg);
          hasMorePages = false;
        }
        
        // Safety check - limit to 20 batches maximum to avoid excessive API calls
        if (batchCount >= 20) {
          console.log('Reached maximum batch limit (20)');
          errors.push('Reached maximum batch limit (20)');
          hasMorePages = false;
        }
      }
      
      // Update file count to actual number
      fileCount = files.length;
    } catch (error) {
      const errorMsg = `Error in PR debugging: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
    
    // Capture memory usage after
    const memAfter = process.memoryUsage();
    
    // Calculate memory difference
    const memDiff = {
      rss: memAfter.rss - memBefore.rss,
      heapTotal: memAfter.heapTotal - memBefore.heapTotal,
      heapUsed: memAfter.heapUsed - memBefore.heapUsed,
      external: memAfter.external - memBefore.external
    };
    
    const totalTime = Date.now() - startTime;
    
    return {
      platform,
      owner,
      repo,
      prNumber,
      fileCount,
      batchCount,
      totalAdditions,
      totalDeletions,
      timing: {
        perBatch: batchTimes,
        total: totalTime
      },
      errors,
      memoryUsage: {
        beforeFetch: memBefore,
        afterFetch: memAfter,
        difference: memDiff
      }
    };
  }
}
