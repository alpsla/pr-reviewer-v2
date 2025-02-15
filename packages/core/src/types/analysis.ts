export interface CodeIssue {
  type: string;
  message: string;
  location?: {
    line: number;
    column: number;
  };
  severity: "error" | "warning" | "info";
}

export interface SecurityIssue {
  type: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  cwe?: string;
  location?: {
    line: number;
    column: number;
  };
}

export interface PerformanceIssue {
  type: string;
  message: string;
  impact: "high" | "medium" | "low";
  suggestion: string;
  location?: {
    line: number;
    column: number;
  };
}

export interface CodeAnalysis {
  codeQuality: {
    score: number;
    issues: CodeIssue[];
    suggestions: string[];
  };
  security: {
    score: number;
    vulnerabilities: SecurityIssue[];
    recommendations: string[];
  };
  performance: {
    score: number;
    issues: PerformanceIssue[];
    optimizations: string[];
  };
  metadata: {
    timestamp: string;
    version: string;
    analysisTime: number;
  };
}
