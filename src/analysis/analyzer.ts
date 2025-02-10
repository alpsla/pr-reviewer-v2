import type { CodeAnalysis, CodeIssue, SecurityIssue, PerformanceIssue } from '../types/analysis';

export class CodeAnalyzer {
  async analyze(sourceCode: string): Promise<CodeAnalysis> {
    const startTime = Date.now();
    
    const linesOfCode = sourceCode.split('\n').length;
    const complexity = this.calculateComplexity(sourceCode);
    
    return {
      codeQuality: {
        score: this.calculateQualityScore(linesOfCode, complexity),
        issues: this.findQualityIssues(sourceCode),
        suggestions: this.generateQualitySuggestions(sourceCode),
      },
      security: {
        score: this.calculateSecurityScore(sourceCode),
        vulnerabilities: this.findVulnerabilities(sourceCode),
        recommendations: this.generateSecurityRecommendations(sourceCode),
      },
      performance: {
        score: this.calculatePerformanceScore(sourceCode),
        issues: this.findPerformanceIssues(sourceCode),
        optimizations: this.generateOptimizations(sourceCode),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        analysisTime: Date.now() - startTime,
      },
    };
  }

  private calculateComplexity(code: string): number {
    const branchingStatements = (code.match(/if|while|for|switch/g) || []).length;
    const functionDefinitions = (code.match(/function|=>/g) || []).length;
    return Math.min(100, (branchingStatements + functionDefinitions) * 5);
  }

  private calculateQualityScore(lines: number, complexity: number): number {
    return Math.min(100, Math.max(0, 100 - (complexity / lines) * 10));
  }

  private findQualityIssues(code: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          type: 'line-length',
          message: 'Line exceeds maximum length of 120 characters',
          location: { line: index + 1, column: 1 },
          severity: 'warning'
        });
      }

      if (line.includes('TODO')) {
        issues.push({
          type: 'todo-comment',
          message: 'TODO comment found',
          location: { line: index + 1, column: line.indexOf('TODO') + 1 },
          severity: 'info'
        });
      }
    });

    return issues;
  }

  private generateQualitySuggestions(code: string): string[] {
    const suggestions: string[] = [];
    
    if (code.includes('var ')) {
      suggestions.push('Consider using let or const instead of var for better scoping');
    }
    
    if (code.length > 1000) {
      suggestions.push('Consider breaking down large files into smaller modules');
    }

    return suggestions;
  }

  private calculateSecurityScore(code: string): number {
    let score = 100;
    if (code.includes('eval(')) score -= 30;
    if (code.includes('innerHTML')) score -= 20;
    if (code.includes('document.write(')) score -= 20;
    return Math.max(0, score);
  }

  private findVulnerabilities(code: string): SecurityIssue[] {
    const vulnerabilities: SecurityIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('eval(')) {
        vulnerabilities.push({
          type: 'eval-usage',
          message: 'Dangerous use of eval() detected',
          severity: 'high',
          cwe: 'CWE-95',
          location: { line: index + 1, column: line.indexOf('eval') + 1 }
        });
      }

      if (line.includes('innerHTML')) {
        vulnerabilities.push({
          type: 'xss-vulnerability',
          message: 'Potential XSS vulnerability with innerHTML',
          severity: 'medium',
          cwe: 'CWE-79',
          location: { line: index + 1, column: line.indexOf('innerHTML') + 1 }
        });
      }
    });

    return vulnerabilities;
  }

  private generateSecurityRecommendations(code: string): string[] {
    const recommendations: string[] = [];
    
    if (code.includes('password') || code.includes('token')) {
      recommendations.push('Ensure sensitive data is properly encrypted');
    }
    
    return recommendations;
  }

  private calculatePerformanceScore(code: string): number {
    let score = 100;
    if (code.length > 10000) score -= 20;
    if (code.includes('document.querySelectorAll')) score -= 10;
    return Math.max(0, score);
  }

  private findPerformanceIssues(code: string): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('document.querySelectorAll')) {
        issues.push({
          type: 'query-selector',
          message: 'Multiple DOM queries may impact performance',
          impact: 'medium',
          suggestion: 'Cache DOM query results when used multiple times',
          location: { line: index + 1, column: line.indexOf('document.querySelectorAll') + 1 }
        });
      }
    });

    return issues;
  }

  private generateOptimizations(code: string): string[] {
    const optimizations: string[] = [];
    
    if (code.includes('for (')) {
      optimizations.push('Consider using array methods like map/reduce for better performance');
    }
    
    return optimizations;
  }
}

export const analyzer = new CodeAnalyzer();