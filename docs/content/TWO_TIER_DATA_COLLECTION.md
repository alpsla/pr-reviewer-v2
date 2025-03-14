# Two-Tier Data Collection System

## Overview

The Two-Tier Data Collection system is designed to improve the PR Reviewer application's user experience while providing comprehensive analysis capabilities. This approach addresses issues with private repository access and data availability by splitting data collection into two distinct tiers:

1. **Primary (Immediate) Data Collection**
   - Basic PR metadata and access verification
   - Essential for the analyze page and enabling/disabling analysis
   - Fast response time for immediate user feedback

2. **Secondary (Background) Data Collection**
   - Comprehensive repository analysis
   - Security, performance, and dependency scanning
   - Runs asynchronously in the background

## System Architecture

The two-tier architecture consists of several key components:

### Database Schema

```sql
-- Data collection jobs
CREATE TABLE data_collection_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  data_types TEXT[] NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0
);

-- Repository structure
CREATE TABLE repository_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  root_directories JSONB NOT NULL,
  file_types JSONB NOT NULL,
  special_directories JSONB,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Dependencies
CREATE TABLE repository_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  package_managers TEXT[] NOT NULL,
  direct_dependencies JSONB NOT NULL,
  dev_dependencies JSONB NOT NULL,
  transitive_dependencies JSONB,
  vulnerabilities JSONB,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Security information
CREATE TABLE security_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  findings JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Performance indicators
CREATE TABLE performance_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  indicators JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Update repositories table
ALTER TABLE repositories 
ADD COLUMN last_data_collection TIMESTAMP WITH TIME ZONE,
ADD COLUMN collected_data_types TEXT[],
ADD COLUMN data_collection_status VARCHAR(20);
```

### Service Layer

The service layer consists of:

1. **Repository Service**
   - Extended with methods for two-tier data collection
   - Primary tier methods: `getPullRequestBasicDetails`, `checkAnalysisEligibility`
   - Secondary tier methods: `scheduleDataCollection`, `getDataCollectionStatus`, etc.

2. **Data Collector Service**
   - Handles background data collection job management
   - Processes jobs asynchronously
   - Implements collectors for different data types

3. **Background Worker**
   - Processes data collection jobs in the background
   - Manages job priorities and concurrency
   - Provides graceful shutdown capabilities

### API Endpoints

1. **Primary Tier Endpoints**
   - `/api/prs/[owner]/[repo]/[number]/basic-details` - Get basic PR details

2. **Secondary Tier Endpoints**
   - `/api/analysis/data-collection` - Schedule background data collection
   - `/api/analysis/data-collection/[repositoryId]` - Get data collection status

### Frontend Components

1. **PR Preview Section**
   - Displays immediately available PR data
   - Shows progress indicators for background data collection

2. **Data Collection Status Component**
   - Displays the current status of background data collection
   - Shows progress bar and completed/pending data types

## User Experience

The two-tier approach ensures that users have a responsive experience while still getting comprehensive repository analysis:

1. Users input a PR URL
2. The system immediately fetches and displays basic PR details
3. In the background, more comprehensive data is collected
4. The UI shows collection progress and updates as data becomes available

## Advantages of the Two-Tier Approach

1. **Improved User Experience**
   - Immediate feedback on PR validation
   - Faster initial page load
   - Transparency about data collection progress

2. **Better Error Handling**
   - Graceful degradation when full data can't be collected
   - Specific error messaging for different collection stages
   - Ability to retry failed background collections

3. **Reduced API Load**
   - Spreads API calls over time
   - Prioritizes essential data over nice-to-haves
   - Implements backoff strategies for rate limits

4. **Enhanced Private Repository Support**
   - Handles access token validation separately from data collection
   - Provides clear feedback on access issues
   - Shows partial data when full access isn't available

## Implementation Details

### Data Types

The system collects several types of repository data:

1. **Structure** - Directory hierarchy and file type statistics
2. **Dependencies** - Package managers and dependency lists
3. **Security** - Security findings and vulnerability scans
4. **Performance** - Performance indicators and optimization opportunities

### Collection Process

1. The process starts when a user validates a PR URL
2. Primary tier data is fetched synchronously
3. If primary tier data validates successfully, secondary tier collection is scheduled
4. A background worker picks up collection jobs and processes them
5. As data is collected, the UI is updated to reflect progress

### Error Handling

1. Primary tier failures prevent analysis from proceeding
2. Secondary tier failures are logged but don't block user interaction
3. Failed jobs are retried with exponential backoff
4. Users can manually trigger retries for failed data collections

## Future Enhancements

1. **Caching Layer**
   - Cache common repository data to reduce duplicate collections
   - Implement intelligent invalidation strategies

2. **Priority Scheduling**
   - Adjust job priorities based on user actions
   - Prioritize critical data types over nice-to-haves

3. **Enhanced Monitoring**
   - Add detailed logging for collection jobs
   - Implement collection metrics for performance tuning

4. **Differential Updates**
   - Only recollect data that might have changed
   - Implement efficient change detection

## Testing Strategy

1. **Unit Testing**
   - Test individual collectors in isolation
   - Validate proper job creation and scheduling

2. **Integration Testing**
   - Ensure proper communication between services
   - Verify database operations and status updates

3. **End-to-End Testing**
   - Test the full flow from PR input to data display
   - Verify UI feedback for various collection scenarios

4. **Performance Testing**
   - Measure collection times for different repository sizes
   - Test concurrent job processing capabilities

## Conclusion

The two-tier data collection system provides a significant improvement to the PR analysis process by balancing immediate user feedback with comprehensive data collection. It addresses key issues with private repositories and ensures that users always have the best possible experience, even when full data collection might take some time.