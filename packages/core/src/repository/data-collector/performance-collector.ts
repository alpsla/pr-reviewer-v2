import { VCSClient } from '../../vcs/types';
import { IDatabaseService } from '../../database/types';
import { PerformanceIndicators } from '../types';
import { generateUuid } from '../../utils/uuid';
import { asDataCollectionClient } from './utils';
import { DataCollectionVCSClient } from './types';

/**
 * Performance indicator information
 */
interface PerformanceIndicator {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation?: string;
}

/**
 * Collect performance indicators for a repository
 */
export async function collectPerformanceIndicators(
  repositoryId: string,
  vcsClient: VCSClient,
  db: IDatabaseService
): Promise<PerformanceIndicators> {
  // Convert VCS client to data collection client
  const dataClient = asDataCollectionClient(vcsClient);
  
  // Get repository details from database
  const repository = await db.getRepository(repositoryId);
  if (!repository) {
    throw new Error(`Repository not found: ${repositoryId}`);
  }
  
  // Collect performance indicators
  const indicators: PerformanceIndicator[] = [];
  
  // Check asset sizes
  const assetSizeIndicators = await checkAssetSizes(dataClient, repository);
  indicators.push(...assetSizeIndicators);
  
  // Check query complexity
  const queryComplexityIndicators = await checkQueryComplexity(dataClient, repository);
  indicators.push(...queryComplexityIndicators);
  
  // Check API overhead
  const apiOverheadIndicators = await checkApiOverhead(dataClient, repository);
  indicators.push(...apiOverheadIndicators);
  
  // Check worker configurations
  const workerConfigIndicators = await checkWorkerConfigs(dataClient, repository);
  indicators.push(...workerConfigIndicators);
  
  // Create performance indicators object
  const performanceIndicators: PerformanceIndicators = {
    id: generateUuid(),
    repositoryId,
    indicators,
    lastUpdated: new Date()
  };
  
  return performanceIndicators;
}

/**
 * Check for large assets that might impact performance
 */
async function checkAssetSizes(vcsClient: DataCollectionVCSClient, repository: any): Promise<PerformanceIndicator[]> {
  const indicators: PerformanceIndicator[] = [];
  
  try {
    // Get repository tree
    const tree = await vcsClient.getRepositoryTree!(
      repository.owner,
      repository.name,
      repository.defaultBranch,
      true
    );
    
    // Look for image and other asset files
    const assetFiles = tree.tree.filter((item: any) => 
      item.type === 'blob' && 
      /\.(png|jpg|jpeg|gif|svg|webp|mp4|webm|mov|pdf)$/i.test(item.path) &&
      item.size > 1024 * 100 // Larger than 100KB
    );
    
    // Group by file type
    const assetsByType: Record<string, { count: number, totalSize: number, paths: string[] }> = {};
    
    for (const file of assetFiles) {
      const extension = file.path.split('.').pop()?.toLowerCase() || 'unknown';
      
      if (!assetsByType[extension]) {
        assetsByType[extension] = { count: 0, totalSize: 0, paths: [] };
      }
      
      assetsByType[extension].count++;
      assetsByType[extension].totalSize += file.size;
      assetsByType[extension].paths.push(file.path);
    }
    
    // Create indicators for large assets
    for (const [type, info] of Object.entries(assetsByType)) {
      if (info.totalSize > 1024 * 1024) { // Over 1MB total
        const sizeMB = (info.totalSize / (1024 * 1024)).toFixed(2);
        
        indicators.push({
          id: generateUuid(),
          type: 'large_assets',
          title: `Large ${type.toUpperCase()} assets`,
          description: `Found ${info.count} ${type.toUpperCase()} files totaling ${sizeMB}MB`,
          impact: info.totalSize > 5 * 1024 * 1024 ? 'high' : 'medium',
          recommendation: `Consider optimizing or compressing ${type.toUpperCase()} files to improve load time`
        });
      }
    }
  } catch (error) {
    console.error('Error checking asset sizes:', error);
  }
  
  return indicators;
}

/**
 * Check for complex database queries
 */
async function checkQueryComplexity(vcsClient: DataCollectionVCSClient, repository: any): Promise<PerformanceIndicator[]> {
  const indicators: PerformanceIndicator[] = [];
  
  try {
    // Get repository tree
    const tree = await vcsClient.getRepositoryTree!(
      repository.owner,
      repository.name,
      repository.defaultBranch,
      true
    );
    
    // Look for SQL or ORM files
    const queryFiles = tree.tree.filter((item: any) => 
      item.type === 'blob' && 
      /\.(sql|ts|js)$/i.test(item.path)
    );
    
    // Check a sample of files (limit to 20 for performance)
    const sampleFiles = queryFiles.slice(0, 20);
    let complexQueryCount = 0;
    let nestedQueryCount = 0;
    let missingIndexCount = 0;
    
    for (const file of sampleFiles) {
      try {
        const content = await vcsClient.getFileContent!(
          repository.owner,
          repository.name,
          file.path,
          repository.defaultBranch
        );
        
        if (!content) {
          continue;
        }
        
        // Check for complex SQL patterns
        if (/SELECT.*FROM.*JOIN.*JOIN.*WHERE.*ORDER BY/is.test(content)) {
          complexQueryCount++;
        }
        
        // Check for nested queries
        if (/SELECT.*\(SELECT/is.test(content)) {
          nestedQueryCount++;
        }
        
        // Check for INDEX statements in schema
        if (/CREATE TABLE/is.test(content) && !/CREATE INDEX/is.test(content)) {
          missingIndexCount++;
        }
      } catch (error) {
        console.error(`Error checking file ${file.path} for query complexity:`, error);
      }
    }
    
    // Create indicators for complex queries
    if (complexQueryCount > 0) {
      indicators.push({
        id: generateUuid(),
        type: 'complex_queries',
        title: 'Complex database queries',
        description: `Found ${complexQueryCount} potentially complex database queries`,
        impact: complexQueryCount > 5 ? 'high' : 'medium',
        recommendation: 'Review complex queries and consider optimization strategies'
      });
    }
    
    if (nestedQueryCount > 0) {
      indicators.push({
        id: generateUuid(),
        type: 'nested_queries',
        title: 'Nested database queries',
        description: `Found ${nestedQueryCount} nested database queries`,
        impact: nestedQueryCount > 3 ? 'high' : 'medium',
        recommendation: 'Consider refactoring nested queries into multiple single queries or using JOIN operations'
      });
    }
    
    if (missingIndexCount > 0) {
      indicators.push({
        id: generateUuid(),
        type: 'missing_indexes',
        title: 'Potentially missing database indexes',
        description: `Found ${missingIndexCount} table definitions without explicit indexes`,
        impact: 'medium',
        recommendation: 'Consider adding indexes to frequently queried columns'
      });
    }
  } catch (error) {
    console.error('Error checking query complexity:', error);
  }
  
  return indicators;
}

/**
 * Check for excessive API calls or network overhead
 */
async function checkApiOverhead(vcsClient: DataCollectionVCSClient, repository: any): Promise<PerformanceIndicator[]> {
  const indicators: PerformanceIndicator[] = [];
  
  try {
    // Get repository tree
    const tree = await vcsClient.getRepositoryTree!(
      repository.owner,
      repository.name,
      repository.defaultBranch,
      true
    );
    
    // Look for frontend JavaScript/TypeScript files
    const frontendFiles = tree.tree.filter((item: any) => 
      item.type === 'blob' && 
      /\.(js|jsx|ts|tsx)$/i.test(item.path) &&
      !/\.(test|spec)\.(js|jsx|ts|tsx)$/i.test(item.path)
    );
    
    // Check a sample of files (limit to 20 for performance)
    const sampleFiles = frontendFiles.slice(0, 20);
    let nonBatchedApiCallsCount = 0;
    let apiPollingCount = 0;
    
    for (const file of sampleFiles) {
      try {
        const content = await vcsClient.getFileContent!(
          repository.owner,
          repository.name,
          file.path,
          repository.defaultBranch
        );
        
        if (!content) {
          continue;
        }
        
        // Check for multiple fetch/axios calls in loops
        if (/for\s*\(.*\).*\{[^}]*fetch\s*\(/is.test(content) || 
            /for\s*\(.*\).*\{[^}]*axios\./is.test(content)) {
          nonBatchedApiCallsCount++;
        }
        
        // Check for API polling with setInterval
        if (/setInterval\s*\([^)]*fetch\s*\(/is.test(content) || 
            /setInterval\s*\([^)]*axios\./is.test(content)) {
          apiPollingCount++;
        }
      } catch (error) {
        console.error(`Error checking file ${file.path} for API overhead:`, error);
      }
    }
    
    // Create indicators for API overhead
    if (nonBatchedApiCallsCount > 0) {
      indicators.push({
        id: generateUuid(),
        type: 'non_batched_api_calls',
        title: 'Non-batched API calls',
        description: `Found ${nonBatchedApiCallsCount} instances of API calls in loops`,
        impact: nonBatchedApiCallsCount > 3 ? 'high' : 'medium',
        recommendation: 'Consider batching multiple API calls into a single request'
      });
    }
    
    if (apiPollingCount > 0) {
      indicators.push({
        id: generateUuid(),
        type: 'api_polling',
        title: 'API polling',
        description: `Found ${apiPollingCount} instances of API polling`,
        impact: apiPollingCount > 3 ? 'high' : 'medium',
        recommendation: 'Consider using WebSockets or server-sent events instead of polling'
      });
    }
  } catch (error) {
    console.error('Error checking API overhead:', error);
  }
  
  return indicators;
}

/**
 * Check for inefficient worker configurations
 */
async function checkWorkerConfigs(vcsClient: DataCollectionVCSClient, repository: any): Promise<PerformanceIndicator[]> {
  const indicators: PerformanceIndicator[] = [];
  
  try {
    // Check for worker configuration files
    const configFiles = [
      'webpack.config.js',
      'next.config.js',
      'vite.config.js',
      'tsconfig.json',
      'package.json'
    ];
    
    for (const fileName of configFiles) {
      try {
        const content = await vcsClient.getFileContent!(
          repository.owner,
          repository.name,
          fileName,
          repository.defaultBranch
        );
        
        if (!content) {
          continue;
        }
        
        // Check for webpack config
        if (fileName === 'webpack.config.js') {
          // Check for missing code splitting
          if (!content.includes('splitChunks') && !content.includes('dynamic')) {
            indicators.push({
              id: generateUuid(),
              type: 'missing_code_splitting',
              title: 'Missing code splitting',
              description: 'Webpack configuration may not be optimized for code splitting',
              impact: 'medium',
              recommendation: 'Consider enabling code splitting to improve initial load time'
            });
          }
        }
        
        // Check for Next.js config
        if (fileName === 'next.config.js') {
          // Check for missing image optimization
          if (!content.includes('images') || !content.includes('optimization')) {
            indicators.push({
              id: generateUuid(),
              type: 'missing_image_optimization',
              title: 'Missing image optimization',
              description: 'Next.js image optimization may not be configured',
              impact: 'medium',
              recommendation: 'Enable Next.js image optimization to improve performance'
            });
          }
        }
        
        // Check for TypeScript config
        if (fileName === 'tsconfig.json') {
          const tsConfig = JSON.parse(content);
          
          // Check for skipLibCheck: false
          if (tsConfig.compilerOptions && tsConfig.compilerOptions.skipLibCheck === false) {
            indicators.push({
              id: generateUuid(),
              type: 'typescript_performance',
              title: 'TypeScript performance',
              description: 'TypeScript is configured to type-check library code',
              impact: 'low',
              recommendation: 'Set skipLibCheck to true to improve build performance'
            });
          }
        }
      } catch (error) {
        // File doesn't exist or error parsing, that's okay
      }
    }
  } catch (error) {
    console.error('Error checking worker configurations:', error);
  }
  
  return indicators;
}
