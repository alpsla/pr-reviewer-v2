import { VCSClient } from '../../vcs/types';
import { IDatabaseService } from '../../database/types';
import { Dependencies } from '../types';
import { generateUuid } from '../../utils/uuid';
import { asDataCollectionClient } from './utils';
import { DataCollectionVCSClient } from './types';

/**
 * Dependency information
 */
interface Dependency {
  name: string;
  version: string;
  latest?: string;
  outdated?: boolean;
  license?: string;
}

/**
 * Dependency vulnerability information
 */
interface DependencyVulnerability {
  id: string;
  dependencyName: string;
  dependencyVersion: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fixedInVersion?: string;
}

/**
 * Collect repository dependencies
 */
export async function collectDependencies(
  repositoryId: string,
  vcsClient: VCSClient,
  db: IDatabaseService
): Promise<Dependencies> {
  // Convert VCS client to data collection client
  const dataClient = asDataCollectionClient(vcsClient);
  
  // Get repository details from database
  const repository = await db.getRepository(repositoryId);
  if (!repository) {
    throw new Error(`Repository not found: ${repositoryId}`);
  }
  
  // Find dependency files in the repository
  const dependencyFiles = await findDependencyFiles(dataClient, repository);
  
  // Extract package managers and dependencies
  const { packageManagers, directDependencies, devDependencies } = 
    await extractDependenciesFromFiles(dataClient, repository, dependencyFiles);
  
  // Check for vulnerability information
  const vulnerabilities = await checkVulnerabilities(directDependencies, devDependencies);
  
  // Create dependencies object
  const dependencies: Dependencies = {
    id: generateUuid(),
    repositoryId,
    packageManagers,
    directDependencies,
    devDependencies,
    vulnerabilities,
    lastUpdated: new Date()
  };
  
  return dependencies;
}

/**
 * Find dependency files in the repository
 */
async function findDependencyFiles(vcsClient: DataCollectionVCSClient, repository: any): Promise<any[]> {
  // Common dependency file patterns
  const patterns = [
    'package.json',
    'requirements.txt',
    'Gemfile',
    'composer.json',
    'go.mod',
    'build.gradle',
    'pom.xml',
    'Cargo.toml'
  ];

  const files = [];
  
  // Get file list from repository
  const fileList = await vcsClient.getRepositoryContents!(
    repository.owner,
    repository.name,
    '',
    repository.defaultBranch
  );
  
  // Search for dependency files at root level
  for (const file of fileList) {
    if (file.type === 'file' && patterns.includes(file.name)) {
      files.push(file);
    }
  }
  
  // If package.json exists, also check for package-lock.json or yarn.lock
  const packageJsonFile = files.find(file => file.name === 'package.json');
  if (packageJsonFile) {
    for (const lockFile of ['package-lock.json', 'yarn.lock', 'npm-shrinkwrap.json']) {
      try {
        const file = await vcsClient.getRepositoryContents!(
          repository.owner,
          repository.name,
          lockFile,
          repository.defaultBranch
        );
        
        if (file) {
          files.push(file);
        }
      } catch (error) {
        // Lock file doesn't exist, that's okay
      }
    }
  }
  
  return files;
}

/**
 * Extract dependencies from files
 */
async function extractDependenciesFromFiles(
  vcsClient: DataCollectionVCSClient, 
  repository: any, 
  files: any[]
): Promise<{
  packageManagers: string[];
  directDependencies: Dependency[];
  devDependencies: Dependency[];
}> {
  const packageManagers: string[] = [];
  const directDependencies: Dependency[] = [];
  const devDependencies: Dependency[] = [];
  
  for (const file of files) {
    try {
      // Get file content
      const content = await vcsClient.getFileContent!(
        repository.owner,
        repository.name,
        file.path,
        repository.defaultBranch
      );
      
      if (!content) {
        continue;
      }
      
      // Process based on file type
      if (file.name === 'package.json') {
        packageManagers.push('npm');
        
        const packageJson = JSON.parse(content);
        
        // Process dependencies
        if (packageJson.dependencies) {
          for (const [name, version] of Object.entries<string>(packageJson.dependencies)) {
            directDependencies.push({
              name,
              version: cleanVersion(version),
            });
          }
        }
        
        // Process dev dependencies
        if (packageJson.devDependencies) {
          for (const [name, version] of Object.entries<string>(packageJson.devDependencies)) {
            devDependencies.push({
              name,
              version: cleanVersion(version),
            });
          }
        }
      } else if (file.name === 'requirements.txt') {
        packageManagers.push('pip');
        
        // Process requirements
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [name, version] = parseRequirement(trimmedLine);
            directDependencies.push({ name, version });
          }
        }
      }
      // Add additional handlers for other dependency file types as needed
    } catch (error) {
      console.error(`Error processing dependency file ${file.path}:`, error);
    }
  }
  
  return { packageManagers, directDependencies, devDependencies };
}

/**
 * Clean version string
 */
function cleanVersion(version: string): string {
  // Clean npm version strings (remove ^, ~, etc.)
  return version.replace(/^[\^~]/, '');
}

/**
 * Parse pip requirement
 */
function parseRequirement(requirement: string): [string, string] {
  // Parse pip requirement (e.g. "requests==2.25.1", "django>=3.0")
  const match = requirement.match(/^([a-zA-Z0-9_-]+)([<>=!~].+)?$/);
  if (match) {
  return [match[1]!, match[2] ? match[2].replace(/^[=<>!~]+/, '') : 'latest'];
  }
  return [requirement, 'unknown'];
}

/**
 * Check for vulnerabilities in dependencies
 */
async function checkVulnerabilities(
  directDependencies: Dependency[], 
  devDependencies: Dependency[]
): Promise<DependencyVulnerability[]> {
  // In a real implementation, you would check against a vulnerability database
  // For this example, we'll return an empty array
  
  // TODO: Implement actual vulnerability checking with a security database API
  return [];
}
