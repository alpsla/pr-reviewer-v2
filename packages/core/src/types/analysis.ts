/**
 * PR Analysis Types
 */

export enum AnalysisStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum AnalysisCategory {
  CODE_QUALITY = 'code_quality',
  DEPENDENCIES = 'dependencies',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  BEST_PRACTICES = 'best_practices',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing'
}

// Code Issue Types
export interface CodeLocation {
  line: number;
  column: number;
}

export interface CodeIssue {
  type: string;
  message: string;
  location: CodeLocation;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'warning';
}

export interface SecurityIssue {
  type: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cwe?: string;
  location: CodeLocation;
}

export interface PerformanceIssue {
  type: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
  suggestion?: string;
  location: CodeLocation;
}

// Analysis Result Types
export interface CodeQualityResult {
  score: number;
  issues: CodeIssue[];
  suggestions: string[];
}

export interface SecurityResult {
  score: number;
  vulnerabilities: SecurityIssue[];
  recommendations: string[];
}

export interface PerformanceResult {
  score: number;
  issues: PerformanceIssue[];
  optimizations: string[];
}

export interface CodeAnalysis {
  codeQuality: CodeQualityResult;
  security: SecurityResult;
  performance: PerformanceResult;
  metadata: {
    timestamp: string;
    version: string;
    analysisTime: number;
  };
}

// Analysis Config Types
export interface AnalysisConfig {
  id: string;
  name: string;
  description?: string;
  categories: AnalysisCategory[];
  rules: Record<string, any>;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AnalysisRequest {
  prId: string;
  categories: AnalysisCategory[];
  config?: AnalysisConfig;
  priority?: number;
  metadata?: Record<string, any>;
}

export interface CategoryResult {
  category: AnalysisCategory;
  score: number;
  issues: string[];
  suggestions: string[];
  metadata?: Record<string, any>;
}

export interface PRAnalysisResult {
  id: string;
  prId: string;
  status: AnalysisStatus;
  summary: string;
  categories: CategoryResult[];
  overallScore: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface LanguageAnalysis {
  language: string;
  percentage: number;
  linesOfCode: number;
  files: number;
  patterns?: string[];
  frameworks?: string[];
}

export interface FileAnalysis {
  path: string;
  language?: string;
  issues: {
    category: AnalysisCategory;
    line?: number;
    message: string;
    severity: 'critical' | 'major' | 'minor' | 'info';
    suggestion?: string;
  }[];
  metrics?: {
    complexity?: number;
    coverage?: number;
    duplication?: number;
  };
}