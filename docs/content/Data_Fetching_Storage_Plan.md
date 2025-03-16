# Data Fetching and Storage Plan

## Executive Summary

This document outlines our comprehensive data fetching and storage strategy for the PR Reviewer application. It provides a tiered approach to data collection and storage, detailed implementation priorities, and clear guidelines for daily development tasks. This plan directly supports our marketing differentiators while ensuring efficient use of resources.

## Table of Contents

1. [Tiered Storage Strategy](#tiered-storage-strategy)
2. [Data Fetching Implementation](#data-fetching-implementation)
3. [Priority Task Sequence](#priority-task-sequence)
4. [Testing Strategy](#testing-strategy)
5. [Integration with LLM Pipeline](#integration-with-llm-pipeline)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Tiered Storage Strategy

### Hot Storage (Tier 1)

**Purpose**: Store high-frequency access data needed for immediate analysis and user interaction.

**Data Types**:
- Repository metadata
- Current PR data and diffs
- Active user session data
- Most recent analysis results
- Frequently accessed files and their metadata

**Technical Implementation**:
- Database: PostgreSQL with connection pooling
- Cache Layer: Redis for session data and frequently accessed items
- Storage Pattern: Normalized tables with efficient indexing
- Retention Policy: Keep until no longer actively used (typically 7-30 days)
- Access Pattern: Optimized for read-heavy workloads with high concurrency

**Performance Requirements**:
- Read latency: <100ms for 95% of requests
- Write latency: <200ms for 95% of requests
- Availability: 99.9% uptime

### Warm Storage (Tier 2)

**Purpose**: Store historical analysis data needed for user growth tracking and medium-term comparisons.

**Data Types**:
- Historical PR analyses (up to 6 months)
- User activity history
- Repository structure snapshots
- Past analysis results and trends
- Issue resolution patterns

**Technical Implementation**:
- Database: PostgreSQL with partitioning by date ranges
- Storage Pattern: Mix of normalized and denormalized structures
- Compression: Light compression for text data
- Retention Policy: 6 months of detailed data
- Access Pattern: Optimized for analytical queries and trend detection

**Performance Requirements**:
- Read latency: <500ms for 95% of queries
- Batch processing capability: Handle nightly aggregation jobs
- Query flexibility: Support complex joins and aggregations

### Cold Storage (Tier 3)

**Purpose**: Store long-term trend data and infrequently accessed historical information.

**Data Types**:
- Aggregated analysis metrics (beyond 6 months)
- Long-term user growth trends
- Repository evolution data
- Anonymized pattern databases
- Archived repositories and PRs

**Technical Implementation**:
- Database: PostgreSQL for indexed metadata + Cloud object storage (S3/equivalent)
- Storage Pattern: Heavily denormalized, aggregated data
- Compression: Heavy compression for raw data
- Retention Policy: 2+ years with increasing aggregation
- Access Pattern: Optimized for batch analysis and infrequent retrieval

**Performance Requirements**:
- Read latency: <2s for 95% of queries
- Cost efficiency: Optimize for storage cost over performance
- Durability: Multiple region redundancy for critical data

### Cross-Tier Data Movement

**Aging Policy**:
- Hot → Warm: Based on access patterns, typically 30 days
- Warm → Cold: Time-based, 6 months with aggregation/summarization

**Rehydration Process**:
- Cold → Warm: On-demand via background jobs with notification
- Warm → Hot: Automatic when data access frequency increases

**Data Consistency**:
- Unique identifiers preserved across all tiers
- Version tracking for changed entities
- Transaction logs for cross-tier operations

## Data Fetching Implementation

### Primary Tier (Immediate Data)

**Collection Targets**:
- PR metadata (title, author, timestamps)
- Changed files list with basic stats
- Repository access verification
- Branch information

**Implementation Priorities**:
1. ✅ Fix pagination for GitHub/GitLab API calls to get ALL files
2. ✅ Implement proper error handling for network/API issues
3. ✅ Add concurrent fetching for related resources
4. 🔄 Create caching layer for frequently accessed metadata
5. 🔄 Implement rate limit aware throttling

**Performance Goals**:
- Complete primary data collection in <3 seconds for 95% of PRs
- Support PRs with up to 1,000 files
- Handle 100+ simultaneous analysis requests

### Secondary Tier (Comprehensive Data)

**Collection Targets**:
- Complete file contents (not just diffs)
- Repository structure
- Dependency information
- Code quality metrics
- Security indicators
- Performance data

**Implementation Priorities**:
1. 🔄 Create background workers for non-blocking collection
2. 🔄 Implement progressive delivery of analysis results
3. 🔄 Add retry mechanism with exponential backoff
4. ⬜ Develop incremental update strategy for large repositories
5. ⬜ Implement selective fetching based on analysis needs

**Performance Goals**:
- Complete background collection within 5 minutes for 90% of repositories
- Handle repositories up to 500MB in size
- Process up to 20 concurrent background jobs

### Historical Tier (Trend Data)

**Collection Targets**:
- User contribution history
- Analysis result history
- Issue resolution patterns
- Code evolution metrics
- Growth tracking data

**Implementation Priorities**:
1. ⬜ Design efficient historical data schema
2. ⬜ Implement periodic snapshot mechanism
3. ⬜ Create delta-based update strategy
4. ⬜ Develop aggregation jobs for trend analysis
5. ⬜ Build efficient query patterns for growth visualization

**Performance Goals**:
- Generate trend analysis for 1 year of data in <10 seconds
- Support up to 10,000 analyses per repository
- Maintain reasonable storage growth (<10MB per month per active repository)

## Priority Task Sequence

### Immediate Tasks (Current Sprint)

1. **Complete Primary Tier Testing**
   - Test pagination fix with repos containing 100+ files
   - Verify all file metadata is correctly captured
   - Ensure proper error handling for API failures
   - Validate data consistency between GitHub UI and our application
   
2. **Implement Hot Storage Optimizations**
   - Add Redis caching for frequently accessed repository data
   - Optimize database queries for PR metadata
   - Implement connection pooling for database access
   - Add monitoring for hot storage performance metrics

3. **Enhance Secondary Tier Data Collection**
   - Complete the implementation of background workers
   - Add progress tracking for background jobs
   - Implement safe cancellation and resumption of jobs
   - Create API endpoints for checking collection status

### Short-Term Tasks (Next 2 Sprints)

1. **Complete Warm Storage Implementation**
   - Set up database partitioning for historical data
   - Implement data archiving policies and jobs
   - Create efficient query patterns for trend analysis
   - Develop data aggregation for performance metrics

2. **Enhance Data Processing Pipeline**
   - Build language-specific file processors
   - Implement dependency resolution for package files
   - Create repository structure analyzer
   - Develop code pattern extractors for LLM context

3. **Implement Data Quality Monitoring**
   - Add data completeness checks
   - Create alerts for failed collections
   - Implement rehydration triggers for missing data
   - Add dashboards for data quality metrics

### Medium-Term Tasks (3-5 Sprints)

1. **Implement Cold Storage Architecture**
   - Set up cloud storage integration
   - Create data export and import pipelines
   - Implement compression strategies
   - Develop access patterns for archived data

2. **Build Growth Tracking Data Collection**
   - Design user activity tracking schema
   - Implement historical PR analysis collection
   - Create issue pattern recognition system
   - Develop trend visualization data preparation

3. **Integrate with LLM Analysis Pipeline**
   - Implement context preparation for LLM analysis
   - Create specialized data extractors for each analysis type
   - Build feedback loop for improving data collection based on LLM needs
   - Develop caching strategies for LLM-ready contexts

## Testing Strategy

### Primary Tier Testing (Current Focus)

**Testing Priorities**:
- Verify complete file collection with pagination
- Validate metadata accuracy against GitHub/GitLab UI
- Test error recovery during partial API failures
- Benchmark performance for various repository sizes

**Test Cases**:
1. Small PR (1-10 files) collection completeness
2. Medium PR (10-100 files) collection with pagination
3. Large PR (100-500 files) collection with efficient pagination
4. Very large PR (500+ files) stress testing
5. API failure recovery testing

**Validation Metrics**:
- File count matches GitHub/GitLab UI
- Lines added/removed match GitHub/GitLab UI
- All metadata fields are correctly populated
- Collection time meets performance goals

### Secondary Tier Testing

**Testing Priorities**:
- Verify background job reliability
- Validate complete repository structure collection
- Test incremental updates for changed repositories
- Benchmark performance for large repositories

**Key Test Cases**:
1. Complete repository collection (various sizes)
2. Dependency resolution accuracy
3. Background job cancellation and resumption
4. Progress reporting accuracy
5. Concurrent job handling

### Historical Data Testing

**Testing Priorities**:
- Verify data consistency across time periods
- Validate trend calculation accuracy
- Test data aging and archiving processes
- Benchmark query performance for analytics

**Key Test Cases**:
1. Historical data retrieval accuracy
2. Trend calculation for 6+ month timeframes
3. Data aging transition between storage tiers
4. Rehydration of archived data

## Integration with LLM Pipeline

### Data Preparation for LLM Analysis

**Key Requirements**:
- File content must be preprocessed for context windows
- Code snippets need surrounding context for accurate analysis
- Repository structure should be simplified for LLM consumption
- Issues need categorization before LLM routing

**Implementation Approach**:
1. Create specialized extractors for each analysis category
2. Implement smart chunking for large files
3. Build metadata enrichment for context enhancement
4. Develop priority-based filtering for context limits

### Context Optimization

**Strategies**:
- Extract only relevant sections of large files
- Include imports and dependencies for context
- Prioritize recently changed code
- Include file hierarchy information

**Implementation Steps**:
1. Create language-specific parsers for context extraction
2. Implement relevance scoring for code sections
3. Build context window optimization algorithms
4. Develop metadata enrichment for LLM context

## Monitoring and Maintenance

### Key Metrics to Track

**Collection Performance**:
- API call success rates
- Collection time by repository size
- Pagination efficiency
- Error rates and types

**Storage Efficiency**:
- Data volume by tier
- Compression ratios
- Query performance
- Cache hit rates

**Data Quality**:
- Completeness scores
- Accuracy validation
- Freshness metrics
- Consistency checks

### Maintenance Tasks

**Regular Jobs**:
- Data tier transitions (hot → warm → cold)
- Aggregation and summarization
- Index optimization
- Stale data cleanup

**Health Checks**:
- API connectivity monitoring
- Storage capacity planning
- Performance anomaly detection
- Data integrity verification

## Conclusion

This data fetching and storage plan provides a comprehensive roadmap for implementing the data foundation necessary to support our key marketing differentiators. The tiered storage strategy ensures efficient use of resources while maintaining performance for critical operations.

**Current Priority**: Complete the testing of our primary tier data collection, with particular focus on the pagination fixes for repositories with large numbers of files. This will ensure we have a solid foundation before proceeding with the implementation of advanced features that depend on comprehensive data collection.

The plan balances immediate needs with long-term architecture goals, providing a clear path forward for daily development tasks while keeping the bigger picture in mind.

Updated reviewed plan:
# Data Fetching Implementation Plan for PR Reviewer

## Overview

Based on the codebase review, we need to implement the first tier of the Two-Tier Data Collection system for PR Reviewer. Specifically, we need to implement the required data fetching methods in the VCS clients (GitHub/GitLab) and ensure they properly handle pagination to retrieve ALL data for large PRs.

## Key Issues to Address

1. **Missing VCS Client Methods**: The GitHub and GitLab clients lack the required methods for data collection:
   - `getRepositoryContents`
   - `getFileContent`
   - `getRepositoryTree`

2. **Data Collection Client Interface**: The `DataCollectionVCSClient` interface requires these methods, but they aren't implemented.

3. **Pagination Handling**: Ensure ALL data is collected for large PRs with proper pagination.

## Implementation Plan

### 1. Extend GitHub Client (High Priority)

Implement the missing methods in `github-client.ts`:

```typescript
/**
 * Get repository contents for a directory path
 */
async getRepositoryContents(owner: string, repo: string, path: string, ref?: string): Promise<any[]> {
  try {
    const response = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: ref || 'HEAD'
    });
    
    // Handle both file and directory responses
    if (Array.isArray(response.data)) {
      return response.data.map(item => ({
        name: item.name,
        path: item.path,
        sha: item.sha,
        size: item.size,
        type: item.type, // 'file', 'dir', 'symlink', or 'submodule'
        downloadUrl: item.download_url,
        url: item.url,
        htmlUrl: item.html_url
      }));
    } else {
      // Single file response
      return [{
        name: response.data.name,
        path: response.data.path,
        sha: response.data.sha,
        size: response.data.size,
        type: response.data.type,
        downloadUrl: response.data.download_url,
        url: response.data.url,
        htmlUrl: response.data.html_url
      }];
    }
  } catch (error) {
    return this.handleError(error, { owner, repo, path });
  }
}

/**
 * Get file content from a repository
 */
async getFileContent(owner: string, repo: string, path: string, ref?: string): Promise<string> {
  try {
    const response = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: ref || 'HEAD'
    });
    
    // Ensure it's a file
    if (Array.isArray(response.data) || !('content' in response.data)) {
      throw new Error(`Path '${path}' does not point to a file`);
    }
    
    // Decode base64 content
    return Buffer.from(response.data.content, 'base64').toString('utf-8');
  } catch (error) {
    return this.handleError(error, { owner, repo, path });
  }
}

/**
 * Get repository tree with recursive option
 */
async getRepositoryTree(owner: string, repo: string, ref?: string, recursive: boolean = false): Promise<any> {
  try {
    const response = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: ref || 'HEAD',
      recursive: recursive ? '1' : undefined
    });
    
    return {
      sha: response.data.sha,
      url: response.data.url,
      tree: response.data.tree.map(item => ({
        path: item.path,
        mode: item.mode,
        type: item.type,
        sha: item.sha,
        size: item.size,
        url: item.url
      }))
    };
  } catch (error) {
    return this.handleError(error, { owner, repo });
  }
}
```

### 2. Complete the Data Collector Service (High Priority)

Update the `DataCollectorService` class to properly implement the job processing functionality:

```typescript
async processJob(job: DataCollectionJob): Promise<boolean> {
  // Get repository from database
  const repository = await this.db.getRepository(job.repositoryId);
  if (!repository) {
    console.error(`Repository not found: ${job.repositoryId}`);
    return false;
  }
  
  // Track successful data types
  const successfulDataTypes: DataType[] = [];
  
  // Process each data type
  for (const dataType of job.dataTypes) {
    try {
      console.log(`Processing data type: ${dataType} for repository ${repository.owner}/${repository.name}`);
      
      switch (dataType) {
        case 'structure':
          const structure = await collectRepositoryStructure(job.repositoryId, this.vcsClient, this.db);
          await this.db.saveRepositoryStructure(structure);
          successfulDataTypes.push('structure');
          break;
          
        case 'dependencies':
          const dependencies = await collectRepositoryDependencies(job.repositoryId, this.vcsClient, this.db);
          await this.db.saveRepositoryDependencies(dependencies);
          successfulDataTypes.push('dependencies');
          break;
          
        case 'security':
          const security = await collectRepositorySecurity(job.repositoryId, this.vcsClient, this.db);
          await this.db.saveRepositorySecurityInfo(security);
          successfulDataTypes.push('security');
          break;
          
        case 'performance':
          const performance = await collectRepositoryPerformance(job.repositoryId, this.vcsClient, this.db);
          await this.db.saveRepositoryPerformanceIndicators(performance);
          successfulDataTypes.push('performance');
          break;
      }
    } catch (error) {
      console.error(`Error processing data type ${dataType}:`, error);
      // Continue with other data types even if one fails
    }
  }
  
  // Update repository with collected data types
  if (successfulDataTypes.length > 0) {
    const collectedDataTypes = [
      ...(repository.collected_data_types || []),
      ...successfulDataTypes
    ];
    
    // Remove duplicates
    const uniqueDataTypes = [...new Set(collectedDataTypes)];
    
    // Update repository record
    await this.db.updateRepository(job.repositoryId, {
      collected_data_types: uniqueDataTypes,
      last_data_collection: new Date().toISOString(),
      data_collection_status: successfulDataTypes.length === job.dataTypes.length 
        ? 'completed' 
        : 'partially_completed'
    });
  }
  
  // Return success if at least one data type was processed
  return successfulDataTypes.length > 0;
}
```

### 3. Complete the Background Worker (Medium Priority)

Enhance the background worker in `worker.ts` to handle data collection jobs:

```typescript
import { DataCollectorService } from './data-collector';

export class DataCollectionWorker {
  private isRunning = false;
  private shouldStop = false;
  
  constructor(
    private readonly dataCollector: DataCollectorService,
    private readonly pollInterval: number = 5000 // 5 seconds
  ) {}
  
  /**
   * Start the worker
   */
  start() {
    if (this.isRunning) {
      console.log('Worker is already running');
      return;
    }
    
    this.isRunning = true;
    this.shouldStop = false;
    
    this.poll();
    
    console.log('Data collection worker started');
  }
  
  /**
   * Stop the worker
   */
  stop() {
    this.shouldStop = true;
    console.log('Data collection worker stopping...');
  }
  
  /**
   * Poll for jobs and process them
   */
  private async poll() {
    if (this.shouldStop) {
      this.isRunning = false;
      console.log('Data collection worker stopped');
      return;
    }
    
    try {
      // Process the next job
      const jobProcessed = await this.dataCollector.processNextJob();
      
      if (jobProcessed) {
        // If a job was processed, immediately check for more
        setTimeout(() => this.poll(), 100);
      } else {
        // If no job was available, wait longer before polling again
        setTimeout(() => this.poll(), this.pollInterval);
      }
    } catch (error) {
      console.error('Error in data collection worker:', error);
      // Continue polling even if there was an error
      setTimeout(() => this.poll(), this.pollInterval);
    }
  }
}
```

### 4. Add API Routes for Data Collection (Medium Priority)

Create REST API routes for the data collection system:

```typescript
// api/analysis/data-collection
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Schedule data collection
    const { repositoryId, dataTypes } = req.body;
    
    // Validate inputs
    if (!repositoryId || !dataTypes || !Array.isArray(dataTypes)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    try {
      const dataCollectionService = getDataCollectionService(req);
      const job = await dataCollectionService.scheduleDataCollection(repositoryId, dataTypes);
      
      return res.status(200).json(job);
    } catch (error) {
      console.error('Error scheduling data collection:', error);
      return res.status(500).json({ error: 'Failed to schedule data collection' });
    }
  } else if (req.method === 'GET') {
    // Get data collection status for all repositories
    try {
      const dataCollectionService = getDataCollectionService(req);
      const jobs = await dataCollectionService.getAllDataCollectionStatus();
      
      return res.status(200).json(jobs);
    } catch (error) {
      console.error('Error getting data collection status:', error);
      return res.status(500).json({ error: 'Failed to get data collection status' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// api/analysis/data-collection/[repositoryId]
export default async function handler(req, res) {
  const { repositoryId } = req.query;
  
  if (req.method === 'GET') {
    // Get data collection status for a repository
    try {
      const dataCollectionService = getDataCollectionService(req);
      const status = await dataCollectionService.getDataCollectionStatus(repositoryId);
      
      return res.status(200).json(status);
    } catch (error) {
      console.error('Error getting data collection status:', error);
      return res.status(500).json({ error: 'Failed to get data collection status' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### 5. Update the Database Layer (Low Priority)

Ensure the database layer supports the data collection operations:

```typescript
// Additional methods for the database service
interface DataCollectionDatabaseMethods {
  createDataCollectionJob(job: any): Promise<any>;
  updateDataCollectionJob(jobId: string, updates: any): Promise<any>;
  getNextDataCollectionJob(): Promise<any>;
  getDataCollectionJobsByRepository(repositoryId: string, statuses?: string[]): Promise<any[]>;
  saveRepositoryStructure(structure: RepositoryStructure): Promise<any>;
  getRepositoryStructure(repositoryId: string): Promise<RepositoryStructure | null>;
  saveRepositoryDependencies(dependencies: Dependencies): Promise<any>;
  getRepositoryDependencies(repositoryId: string): Promise<Dependencies | null>;
  saveRepositorySecurityInfo(securityInfo: SecurityInfo): Promise<any>;
  getRepositorySecurityInfo(repositoryId: string): Promise<SecurityInfo | null>;
  saveRepositoryPerformanceIndicators(indicators: PerformanceIndicators): Promise<any>;
  getRepositoryPerformanceIndicators(repositoryId: string): Promise<PerformanceIndicators | null>;
}
```

## Testing Plan

1. **Unit Tests**: 
   - Test each VCS client method with mocked responses
   - Test data collector service with mocked database
   - Test pagination handling with large mock datasets

2. **Integration Tests**:
   - Test the full data collection flow with a real repository
   - Test handling of rate limits and errors
   - Test background worker with multiple job types

3. **Validation Tests**:
   - Compare data collected against GitHub UI to ensure completeness
   - Test with repositories of varying sizes
   - Validate collection timing and performance

## Implementation Timeline

### Day 1:
- Implement GitHub client data collection methods
- Add unit tests for GitHub client methods

### Day 2:
- Complete the DataCollectorService implementation
- Implement the collector methods for structure and dependencies

### Day 3:
- Implement the collector methods for security and performance
- Add API routes for data collection

### Day 4:
- Implement the background worker
- Integration testing and bug fixes

### Day 5:
- Performance optimization
- Documentation updates
- Final testing and validation

## Conclusion

This implementation plan addresses the core requirements for the first tier of data fetching in the PR Reviewer application. By following this approach, we'll ensure that:

1. The GitHub client can properly fetch all repository data
2. Data collection can be performed asynchronously in the background
3. All data is collected even for large PRs and repositories
4. The system is robust and handles errors gracefully

Once implemented, this will provide the foundation for the comprehensive data analysis features of the PR Reviewer.