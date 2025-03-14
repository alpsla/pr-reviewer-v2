import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { RepositoryService, createRepositoryFingerprint } from '@/lib/repository';
import { DatabaseService } from '@/lib/database';

// Import the VCSPlatform type
import type { VCSPlatform } from '@pr-reviewer/core';

// Create simplified versions of the debug tools directly

// FingerprintDebugger simplified implementation
const SimpleFingerprintDebugger = {
  getDebugInfo(platform: VCSPlatform, owner: string, name: string) {
    // Normalize inputs (lowercase, trim spaces)
    const normalizedPlatform = platform.toLowerCase().trim();
    const normalizedOwner = owner.toLowerCase().trim();
    const normalizedName = name.toLowerCase().trim();
    
    // Create fingerprint string
    const fingerprintString = `${normalizedPlatform}:${normalizedOwner}/${normalizedName}`;
    
    // Get the actual fingerprint
    const fingerprint = createRepositoryFingerprint(platform, owner, name);
    
    return {
      rawPlatform: platform,
      rawOwner: owner,
      rawName: name,
      normalizedPlatform,
      normalizedOwner,
      normalizedName,
      fingerprintString,
      fingerprint
    };
  },
  
  compareRepositories(
    repoA: { platform: VCSPlatform, owner: string, name: string },
    repoB: { platform: VCSPlatform, owner: string, name: string }
  ) {
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
    const isSame = normalizedA.platform === normalizedB.platform &&
                    normalizedA.owner === normalizedB.owner &&
                    normalizedA.name === normalizedB.name;
    
    return {
      repoA: { ...repoA },
      repoB: { ...repoB },
      normalizedA,
      normalizedB,
      fingerprintA,
      fingerprintB,
      isSame,
      platformMatch: normalizedA.platform === normalizedB.platform,
      ownerMatch: normalizedA.owner === normalizedB.owner,
      nameMatch: normalizedA.name === normalizedB.name
    };
  },
  
  testSpecialCharacters(platform: VCSPlatform) {
    const testCases = [
      'normal-repo',
      'UPPERCASE',
      'repo.with.dots',
      'repo with spaces',
      'répo-wíth-áccènts',
      '中文-repo-name',
      'リポジトリ-name'
    ];
    
    const results = testCases.map(testCase => {
      const normalized = testCase.toLowerCase().trim();
      const fingerprint = createRepositoryFingerprint(platform, 'owner', testCase);
      
      return {
        input: testCase,
        normalized,
        fingerprint
      };
    });
    
    return {
      cases: results,
      recommendations: [
        'Ensure that repository names are properly normalized',
        'Watch for case sensitivity differences',
        'Be cautious with special characters and international characters'
      ]
    };
  }
};

// RepositoryDebugger simplified implementation
class SimpleRepositoryDebugger {
  private db: DatabaseService;
  
  constructor(db: DatabaseService) {
    this.db = db;
  }
  
  async debugRepository(platform: VCSPlatform, owner: string, name: string) {
    const startTime = Date.now();
    
    // Generate fingerprint
    const fingerprint = createRepositoryFingerprint(platform, owner, name);
    
    // Get detailed fingerprint debug info
    const fingerprintDetails = SimpleFingerprintDebugger.getDebugInfo(platform, owner, name);
    
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
        total: totalTime
      }
    };
  }
  
  async compareRepositories(
    repoA: { platform: VCSPlatform, owner: string, name: string },
    repoB: { platform: VCSPlatform, owner: string, name: string }
  ) {
    // Get comparison from fingerprint debugger
    const comparison = SimpleFingerprintDebugger.compareRepositories(repoA, repoB);
    
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
  
  async testPublicPrivateSwitch(platform: VCSPlatform, owner: string, name: string) {
    // Generate fingerprint
    const fingerprint = createRepositoryFingerprint(platform, owner, name);
    
    // Try to find repository in DB
    let originalRecord = null;
    
    try {
      originalRecord = await this.db.getRepositoryByFingerprint(fingerprint);
    } catch (error) {
      // Record not found
      return {
        fingerprint,
        fingerprintChanged: false,
        analysisCountPreserved: false,
        error: 'Repository not found'
      };
    }
    
    if (!originalRecord) {
      return {
        fingerprint,
        fingerprintChanged: false,
        analysisCountPreserved: false,
        error: 'Repository record not found'
      };
    }
    
    // Capture original values
    const originalAnalysisCount = originalRecord.analysis_count || 0;
    
    // Simulate changing from public to private (and back)
    try {
      // Update the is_private field in the database record
      const updatedRepo = await this.db.createRepository({
        ...originalRecord,
        is_private: !originalRecord.is_private
      }, { upsert: true });
      
      // Get updated record
      const updatedRecord = await this.db.getRepositoryByFingerprint(fingerprint);
      
      // Check if fingerprint changed (it shouldn't)
      const fingerprintChanged = updatedRecord.fingerprint !== fingerprint;
      
      // Check if analysis count was preserved (it should be)
      const analysisCountPreserved = updatedRecord.analysis_count === originalAnalysisCount;
      
      return {
        originalRecord,
        afterUpdate: updatedRecord,
        fingerprint,
        fingerprintChanged,
        analysisCountPreserved
      };
    } catch (error) {
      return {
        fingerprint,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  testSpecialCharacters(platform: VCSPlatform) {
    return SimpleFingerprintDebugger.testSpecialCharacters(platform);
  }
  
  async debugLargePr(platform: VCSPlatform, owner: string, repo: string, prNumber: number) {
    // Simulate performance metrics for a large PR
    const startTime = Date.now();
    
    // Determine file count based on inputs to make it somewhat realistic
    // We'll use a combination of owner, repo and PR number to generate a value
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    // Generate a file count between 500 and 2000
    const seed = hashCode(`${platform}:${owner}/${repo}#${prNumber}`);
    const fileCount = 500 + (seed % 1500);
    
    // Generate a reasonable number of batches
    const batchSize = 100;
    const batchCount = Math.ceil(fileCount / batchSize);
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random additions/deletions based on file count
    const avgChangesPerFile = 20 + (seed % 40); // Between 20 and 60 lines per file
    const totalAdditions = Math.floor(fileCount * avgChangesPerFile * 0.6); // 60% additions
    const totalDeletions = Math.floor(fileCount * avgChangesPerFile * 0.4); // 40% deletions
    
    // Simulate batch times
    const batchTimes = [];
    for (let i = 0; i < batchCount; i++) {
      batchTimes.push(200 + (Math.random() * 800)); // 200-1000ms per batch
    }
    
    // Calculate memory usage
    const memBefore = {
      rss: 100 * 1024 * 1024,
      heapTotal: 50 * 1024 * 1024,
      heapUsed: 30 * 1024 * 1024,
      external: 10 * 1024 * 1024,
    };
    
    const heapUsedPerFile = 5000; // ~5KB per file in memory
    const memAfter = {
      rss: memBefore.rss + (fileCount * 10000),
      heapTotal: memBefore.heapTotal + (fileCount * 2000),
      heapUsed: memBefore.heapUsed + (fileCount * heapUsedPerFile),
      external: memBefore.external + (fileCount * 1000),
    };
    
    // Memory difference
    const memDiff = {
      rss: memAfter.rss - memBefore.rss,
      heapTotal: memAfter.heapTotal - memBefore.heapTotal,
      heapUsed: memAfter.heapUsed - memBefore.heapUsed,
      external: memAfter.external - memBefore.external,
    };
    
    const totalTime = Date.now() - startTime + 1000; // Add 1 second to make it realistic
    
    return {
      success: true,
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
      memoryUsage: {
        beforeFetch: memBefore,
        afterFetch: memAfter,
        difference: memDiff
      },
      status: 'simulated'
    };
  }
}

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'info';
    
    // Get platform
    const platformParam = url.searchParams.get('platform') || 'github';
    
    // Validate the platform value
    const platform: VCSPlatform = (
      platformParam === 'gitlab' ? 'gitlab' : 'github'
    );
    
    // For single repository actions
    const repoUrl = url.searchParams.get('repo') || '';
    let owner = url.searchParams.get('owner') || '';
    let repo = url.searchParams.get('name') || '';
    
    // For comparison actions
    const repo2Url = url.searchParams.get('repo2') || '';
    let owner2 = url.searchParams.get('owner2') || '';
    let repo2 = url.searchParams.get('name2') || '';
    
    // Parse repo URL if provided
    if (repoUrl && !owner && !repo) {
      const parts = repoUrl.split('/');
      if (parts.length >= 2) {
        owner = parts[0];
        repo = parts[1];
      }
    }
    
    // Parse second repo URL if provided
    if (repo2Url && !owner2 && !repo2) {
      const parts = repo2Url.split('/');
      if (parts.length >= 2) {
        owner2 = parts[0];
        repo2 = parts[1];
      }
    }

    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({
        success: false,
        error: 'Session error',
        details: sessionError.message
      }, { status: 401 });
    }

    // Initialize services
    const dbService = new DatabaseService(supabase);
    const tokens: { github?: string; gitlab?: string } = {};
    
    // Get token from session if available
    if (session?.provider_token && session?.user?.app_metadata?.provider === 'github') {
      tokens.github = session.provider_token;
    } else if (session?.provider_token && session?.user?.app_metadata?.provider === 'gitlab') {
      tokens.gitlab = session.provider_token;
    }
    
    // Create repository service and database service
    const repoService = new RepositoryService(dbService, tokens);
    
    // Create debugger instance
    const debugTool = new SimpleRepositoryDebugger(dbService);

    // Handle different actions
    switch (action) {
      case 'info': {
        // Simple fingerprint info
        if (!owner || !repo) {
          return NextResponse.json({
            success: false,
            error: 'Missing repository details',
            details: 'Both owner and repo name are required'
          }, { status: 400 });
        }
        
        // Get debug info using our new tools
        const debugInfo = await debugTool.debugRepository(
          platform,
          owner,
          repo
        );
        
        return NextResponse.json({
          success: true,
          debugInfo
        });
      }
      
      case 'compare': {
        // Compare two repositories
        if (!owner || !repo || !owner2 || !repo2) {
          return NextResponse.json({
            success: false,
            error: 'Missing repository details',
            details: 'Both repositories require owner and name'
          }, { status: 400 });
        }
        
        const compareResult = await debugTool.compareRepositories(
          { platform, owner, name: repo },
          { platform, owner: owner2, name: repo2 }
        );
        
        return NextResponse.json({
          success: true,
          compareResult
        });
      }
      
      case 'special-chars': {
        // Test special characters in repository names
        const specialCharsTest = debugTool.testSpecialCharacters(platform);
        
        return NextResponse.json({
          success: true,
          specialCharsTest
        });
      }
      
      case 'public-private': {
        // Test public/private repository switch
        if (!owner || !repo) {
          return NextResponse.json({
            success: false,
            error: 'Missing repository details',
            details: 'Both owner and repo name are required'
          }, { status: 400 });
        }
        
        const switchTest = await debugTool.testPublicPrivateSwitch(
          platform,
          owner,
          repo
        );
        
        return NextResponse.json({
          success: true,
          switchTest
        });
      }
      
      case 'large-pr': {
        // Test handling of large PRs
        if (!owner || !repo) {
          return NextResponse.json({
            success: false,
            error: 'Missing repository details',
            details: 'Both owner and repo name are required'
          }, { status: 400 });
        }
        
        const prNumber = parseInt(url.searchParams.get('pr') || '1', 10);
        if (isNaN(prNumber) || prNumber <= 0) {
          return NextResponse.json({
            success: false,
            error: 'Invalid PR number',
            details: 'PR number must be a positive integer'
          }, { status: 400 });
        }
        
        const largePrTest = await debugTool.debugLargePr(
          platform,
          owner,
          repo,
          prNumber
        );
        
        return NextResponse.json({
          success: true,
          largePrTest
        });
      }
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          details: `Action "${action}" is not supported`
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Fingerprint debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
