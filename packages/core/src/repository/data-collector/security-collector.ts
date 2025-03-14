import { VCSClient } from '../../vcs/types';
import { IDatabaseService } from '../../database/types';
import { SecurityInfo } from '../types';
import { generateUuid } from '../../utils/uuid';
import { asDataCollectionClient } from './utils';
import { DataCollectionVCSClient } from './types';

/**
 * Security finding information
 */
interface SecurityFinding {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation?: string;
  detectedAt: Date;
}

/**
 * Collect security information for a repository
 */
export async function collectSecurityInfo(
  repositoryId: string,
  vcsClient: VCSClient,
  db: IDatabaseService
): Promise<SecurityInfo> {
  // Convert VCS client to data collection client
  const dataClient = asDataCollectionClient(vcsClient);
  
  // Get repository details from database
  const repository = await db.getRepository(repositoryId);
  if (!repository) {
    throw new Error(`Repository not found: ${repositoryId}`);
  }
  
  // Get repository dependencies (need this for dependency vulnerabilities)
  const dependencies = await db.getRepositoryDependencies(repositoryId);
  
  // Collect security findings
  const findings: SecurityFinding[] = [];
  
  // Add dependency vulnerabilities if available
  if (dependencies && dependencies.vulnerabilities.length > 0) {
    findings.push(...dependencies.vulnerabilities.map((vuln: any) => ({
      id: generateUuid(),
      type: 'dependency',
      title: `Vulnerable dependency: ${vuln.dependencyName}@${vuln.dependencyVersion}`,
      description: vuln.description,
      severity: vuln.severity,
      recommendation: `Update to ${vuln.fixedInVersion || 'latest version'}`,
      detectedAt: new Date()
    })));
  }
  
  // Find security issues in code
  const codeSecurityIssues = await findCodeSecurityIssues(dataClient, repository);
  findings.push(...codeSecurityIssues);
  
  // Check for security configurations
  const configSecurityIssues = await findConfigSecurityIssues(dataClient, repository);
  findings.push(...configSecurityIssues);
  
  // Create security info object
  const securityInfo: SecurityInfo = {
    id: generateUuid(),
    repositoryId,
    findings,
    lastUpdated: new Date()
  };
  
  return securityInfo;
}

/**
 * Find security issues in code
 */
async function findCodeSecurityIssues(vcsClient: DataCollectionVCSClient, repository: any): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  
  try {
    // Get repository tree
    const tree = await vcsClient.getRepositoryTree!(
      repository.owner,
      repository.name,
      repository.defaultBranch
    );
    
    // Define patterns to look for
    const securityPatterns = [
      { 
        pattern: /password\s*=\s*['"][^'"]+['"]|api[_]?key\s*=\s*['"][^'"]+['"]|secret\s*=\s*['"][^'"]+['"]/i,
        type: 'hardcoded_credentials',
        title: 'Hardcoded credentials',
        description: 'Hardcoded credentials were found in the codebase',
        severity: 'high' as const
      },
      {
        pattern: /eval\s*\(/i,
        type: 'eval_usage',
        title: 'Use of eval()',
        description: 'The use of eval() can lead to code injection vulnerabilities',
        severity: 'medium' as const
      }
    ];
    
    // Look for JavaScript, TypeScript, and Python files
    const codeFiles = tree.tree.filter((item: any) => 
      item.type === 'blob' && 
      /\.(js|ts|py|rb|php)$/.test(item.path)
    );
    
    // Check a sample of files (limit to 10 for performance)
    const sampleFiles = codeFiles.slice(0, 10);
    
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
        
        // Check each security pattern
        for (const { pattern, type, title, description, severity } of securityPatterns) {
          if (pattern.test(content)) {
            findings.push({
              id: generateUuid(),
              type,
              title,
              description: `${description} in file ${file.path}`,
              severity,
              recommendation: 'Review and remove sensitive information or replace with environment variables',
              detectedAt: new Date()
            });
          }
        }
      } catch (error) {
        console.error(`Error checking file ${file.path} for security issues:`, error);
      }
    }
  } catch (error) {
    console.error('Error checking code for security issues:', error);
  }
  
  return findings;
}

/**
 * Find security issues in configuration files
 */
async function findConfigSecurityIssues(vcsClient: DataCollectionVCSClient, repository: any): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  
  // Check common configuration files
  const configFiles = [
    '.env',
    '.env.example',
    '.env.development',
    'config.json',
    'settings.json'
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
      
      // Check for sensitive information in config files
      if (/password|secret|key|token/i.test(content)) {
        findings.push({
          id: generateUuid(),
          type: 'sensitive_config',
          title: 'Sensitive information in configuration file',
          description: `The file ${fileName} may contain sensitive information`,
          severity: 'medium',
          recommendation: 'Review configuration files and remove sensitive information',
          detectedAt: new Date()
        });
      }
    } catch (error) {
      // File doesn't exist, that's okay
    }
  }
  
  // Check for .gitignore file
  try {
    const gitignoreContent = await vcsClient.getFileContent!(
      repository.owner,
      repository.name,
      '.gitignore',
      repository.defaultBranch
    );
    
    if (!gitignoreContent || !/.env/m.test(gitignoreContent)) {
      findings.push({
        id: generateUuid(),
        type: 'missing_gitignore',
        title: 'Missing .env entries in .gitignore',
        description: 'Environment files (.env) should be ignored in Git to prevent leaking sensitive information',
        severity: 'medium',
        recommendation: 'Add .env* to your .gitignore file',
        detectedAt: new Date()
      });
    }
  } catch (error) {
    // .gitignore doesn't exist
    findings.push({
      id: generateUuid(),
      type: 'missing_gitignore',
      title: 'Missing .gitignore file',
      description: 'No .gitignore file found to prevent sensitive files from being committed',
      severity: 'low',
      recommendation: 'Add a .gitignore file with appropriate entries',
      detectedAt: new Date()
    });
  }
  
  return findings;
}
