# Implementation Plan: Analysis Pipeline with Two-Tier Data Collection

## Overview
The Analysis Pipeline is a core feature that processes pull requests through AI models to generate intelligent code reviews. This plan details the architecture, components, and implementation steps for the complete pipeline, including the new two-tier data collection approach.

## Goals
1. Implement two-tier data collection for improved user experience
2. Split data collection into immediate and background processes
3. Detect programming languages in PR files
4. Implement job queue for analysis and data collection tasks
5. Integrate with LLM provider
6. Store and present analysis results
7. Handle rate limits and large PRs

## Architecture

### Component Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  PR Service     │────►│  Analysis Queue │────►│  LLM Client     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                       │
         │                      │                       │
         ▼                      ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Language       │     │  Results        │     │  Template       │
│  Detector       │     │  Storage        │     │  Manager        │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Key Interfaces

#### 1. Analysis Service
```typescript
interface AnalysisService {
  queueAnalysis(pullRequest: PullRequestDetails): Promise<string>; // Returns job ID
  getAnalysisStatus(jobId: string): Promise<AnalysisStatus>;
  getAnalysisResults(jobId: string): Promise<AnalysisResults>;
  cancelAnalysis(jobId: string): Promise<boolean>;
}

type AnalysisStatus = 'queued' | 'processing' | 'completed' | 'failed';

interface AnalysisResults {
  id: string;
  jobId: string;
  summary: string;
  fileComments: FileComment[];
  suggestions: Suggestion[];
  createdAt: Date;
  completedAt: Date;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
}
```

#### 2. Language Detector
```typescript
interface LanguageDetector {
  detectLanguage(filename: string, content: string): Language;
  detectLanguages(files: PullRequestFile[]): Map<string, Language>;
  getSupportedLanguages(): Language[];
}

interface Language {
  id: string;
  name: string;
  extensions: string[];
  linter?: string;
  formatter?: string;
}
```

#### 3. LLM Client
```typescript
interface LLMClient {
  generateReview(prompt: string, options: ReviewOptions): Promise<ReviewResponse>;
  getModelInfo(): ModelInfo;
  estimateTokenUsage(prompt: string): number;
}

interface ReviewOptions {
  temperature: number;
  maxTokens: number;
  stopSequences?: string[];
  model?: string;
}

interface ReviewResponse {
  content: string;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
  finishReason: string;
}
```

### Database Schema Extensions

```sql
-- Analysis Jobs Table
CREATE TABLE analysis_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pull_request_id UUID NOT NULL REFERENCES pull_requests(id),
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  options JSONB,
  
  CONSTRAINT valid_status CHECK (status IN ('queued', 'processing', 'completed', 'failed'))
);

-- Analysis Results Table
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES analysis_jobs(id),
  summary TEXT,
  file_comments JSONB,
  suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  token_usage JSONB,
  model TEXT NOT NULL
);

-- Create indexes
CREATE INDEX idx_analysis_jobs_status ON analysis_jobs(status);
CREATE INDEX idx_analysis_jobs_pr_id ON analysis_jobs(pull_request_id);
```

## Technical Approach

### 1. Language Detection
We'll implement a language detector that:
- Uses file extensions as primary identifiers
- Falls back to content analysis for ambiguous extensions
- Maintains a mapping of languages to appropriate review strategies
- Supports multi-language repositories

Implementation will use a combination of:
- Static mapping of extensions to languages
- Basic content analysis (shebang lines, import patterns)
- Language-specific configurations

### 2. Analysis Queue
We'll implement a job queue system using:
- Database-backed job storage for persistence
- In-memory queue for active jobs
- Polling mechanism for status updates
- Job prioritization based on PR size and user role

This approach provides:
- Resilience to service restarts
- Visibility into job status
- Ability to prioritize and throttle jobs

### 3. LLM Integration
We'll start with OpenAI's API and design for multi-provider support:
- Abstract client interface
- Provider-specific implementations
- Token usage tracking
- Rate limit handling with exponential backoff
- Response validation and error recovery

### 4. Template Management
Review prompts will be managed through:
- Language-specific templates
- Customizable prompts with variables
- Template versioning
- A/B testing capability

### 5. Results Storage and Presentation
Analysis results will be:
- Stored in structured format in database
- Rendered in different views (inline, summary, detailed)
- Linked to specific lines and files
- Tagged with categories (security, performance, style)

## Implementation Steps

### Phase 1: Core Infrastructure (Weeks 1-2)
1. Create database schema extensions
   - Analysis jobs table
   - Analysis results table
   - Necessary indexes
2. Implement basic language detector
   - Extension-based detection
   - Basic content analysis
   - Test with common languages
3. Set up analysis job queue
   - Job creation API
   - Status management
   - Simple worker process

### Phase 2: LLM Integration (Weeks 3-4)
1. Implement OpenAI client
   - API wrapper
   - Error handling
   - Rate limit management
2. Create templating system
   - Define base templates
   - Template variables
   - Language-specific customizations
3. Implement token usage tracking
   - Estimation utilities
   - Usage limits and warnings
   - Cost analysis tools

### Phase 3: Review Generation (Weeks 5-6)
1. Implement core review logic
   - PR content preparation
   - Context management for large PRs
   - Result parsing and structuring
2. Create review strategies by language
   - Language-specific heuristics
   - Rule prioritization
   - Comment generation
3. Build summary generation
   - High-level overview
   - Critical issues identification
   - Action item extraction

### Phase 4: Frontend Integration (Weeks 7-8)
1. Implement analysis request UI
   - Configuration options
   - Progress indication
   - Error handling
2. Build results visualization
   - Inline comments
   - Summary view
   - Detailed breakdown
3. Add user feedback mechanism
   - Comment ratings
   - Suggestion acceptance tracking
   - Template improvement collection

## Potential Challenges

### 1. Large PRs
**Challenge**: LLM context limits make large PRs difficult to analyze
**Mitigation**:
- Implement chunking strategy to break large PRs into manageable pieces
- Develop summary-first approach that identifies critical files
- Create priority-based analysis that focuses on modified code

### 2. Rate Limits
**Challenge**: LLM provider rate limits could slow analysis
**Mitigation**:
- Implement queue throttling based on available capacity
- Add exponential backoff for rate limit errors
- Provide user feedback on expected completion time

### 3. Multi-language Repositories
**Challenge**: PRs often contain multiple languages with different standards
**Mitigation**:
- Implement per-file language detection
- Create language-specific review templates
- Develop unified review presentation regardless of language

### 4. False Positives
**Challenge**: LLM may generate incorrect or irrelevant suggestions
**Mitigation**:
- Implement confidence scoring for suggestions
- Collect user feedback to improve templates
- Add project-specific context to reviews

## Testing Strategy

### Automated Tests
1. **Unit Tests**:
   - Language detector accuracy
   - Queue management functions
   - Template rendering
   - Response parsing

2. **Integration Tests**:
   - Job flow from creation to completion
   - Database state transitions
   - LLM client error handling

### Manual Tests
1. **Real PR Analysis**:
   - Test with actual PRs of varying sizes
   - Evaluate accuracy of suggestions
   - Measure performance and resource usage

2. **Edge Cases**:
   - Very large PRs
   - Uncommon languages
   - Rate limit scenarios
   - Service interruptions

## Alternatives Considered

### 1. Serverless Functions for Analysis
**Approach**: Use serverless functions to process analysis jobs
**Rejection Reason**: Serverless timeout limits are too restrictive for large PRs

### 2. Local LLM Deployment
**Approach**: Self-host LLMs for analysis
**Rejection Reason**: Resource requirements too high for current deployment strategy

### 3. Pre-commit Hooks
**Approach**: Analyze code before PR creation
**Rejection Reason**: Less flexible and requires client-side setup

### 4. Language-Specific Analysis Tools
**Approach**: Use specialized tools for each language
**Rejection Reason**: Increased complexity and inconsistent user experience
