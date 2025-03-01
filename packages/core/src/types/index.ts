// Re-export database types
export * from './database';

// Re-export provider-specific types
export * from './github';

// Re-export platform types with fixed exports
export type {
  VCSPlatform,
  Repository,
  PullRequest,
  PullRequestFile,
  PaginationParams,
  PaginatedResponse
} from './vcs';

export { VCSErrorCode } from './vcs';

// Re-export analysis types
export type {
  AnalysisCategory,
  CodeAnalysis,
  CodeIssue,
  SecurityIssue,
  PerformanceIssue,
  LanguageAnalysis,
  FileAnalysis,
  PRAnalysisResult,
  CategoryResult,
  AnalysisConfig,
  AnalysisRequest
} from './analysis';

// Re-export AnalysisStatus with a new name to avoid conflict
export { AnalysisStatus as PRAnalysisStatus } from './analysis';