import { VCSClient } from '../../vcs/types';
import { IDatabaseService } from '../../database/types';
import { RepositoryStructure } from '../types';
import { generateUuid } from '../../utils/uuid';
import { asDataCollectionClient } from './utils';
import { DataCollectionVCSClient } from './types';

/**
 * Directory node in repository structure
 */
interface DirectoryNode {
  name: string;
  path: string;
  type: 'directory' | 'file';
  size?: number;
  children?: DirectoryNode[];
}

/**
 * Collect repository structure data
 */
export async function collectRepositoryStructure(
  repositoryId: string,
  vcsClient: VCSClient,
  db: IDatabaseService
): Promise<RepositoryStructure> {
  // Convert VCS client to data collection client
  const dataClient = asDataCollectionClient(vcsClient);
  
  // Get repository details from database
  const repository = await db.getRepository(repositoryId);
  if (!repository) {
    throw new Error(`Repository not found: ${repositoryId}`);
  }
  
  // Get repository tree from VCS
  const tree = await dataClient.getRepositoryTree(
    repository.owner, 
    repository.name, 
    repository.defaultBranch
  );
  
  // Process tree to create directory structure
  const rootDirectories = processTreeToDirectoryStructure(tree.tree);
  
  // Calculate file type statistics
  const fileTypes = calculateFileTypeStats(tree.tree);
  
  // Identify special directories
  const specialDirectories = identifySpecialDirectories(rootDirectories);
  
  // Create repository structure object
  const structure: RepositoryStructure = {
    id: generateUuid(),
    repositoryId,
    rootDirectories,
    fileTypes,
    specialDirectories,
    lastUpdated: new Date()
  };
  
  return structure;
}

/**
 * Process tree to directory structure
 */
function processTreeToDirectoryStructure(treeItems: any[]): DirectoryNode[] {
  // Map of path to node
  const nodeMap: Record<string, DirectoryNode> = {};
  
  // Create all nodes
  for (const item of treeItems) {
    const path = item.path;
    const isDirectory = item.type === 'tree';
    const name = path.split('/').pop() || path;
    
    nodeMap[path] = {
      name,
      path,
      type: isDirectory ? 'directory' : 'file',
      size: !isDirectory ? item.size : undefined,
      children: isDirectory ? [] : undefined
    };
  }
  
  // Build tree structure
  const rootNodes: DirectoryNode[] = [];
  
  for (const path in nodeMap) {
    const node = nodeMap[path];
    const pathParts = path.split('/');
    
    if (pathParts.length === 1) {
      // Root level node
      if (node) {
        rootNodes.push(node);
      }
    } else {
      // Child node
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentNode = nodeMap[parentPath];
      
      if (parentNode && parentNode.children && node) {
        parentNode.children.push(node);
      }
    }
  }
  
  return rootNodes;
}

/**
 * Calculate file type statistics
 */
function calculateFileTypeStats(treeItems: any[]): Record<string, number> {
  const stats: Record<string, number> = {};
  
  for (const item of treeItems) {
    if (item.type === 'blob') {
      const extension = getFileExtension(item.path);
      if (extension) {
        stats[extension] = (stats[extension] || 0) + 1;
      }
    }
  }
  
  return stats;
}

/**
 * Get file extension
 */
function getFileExtension(path: string): string | null {
  const match = path.match(/\.([^.]+)$/);
  return match ? match[1]!.toLowerCase() : null;
}

/**
 * Identify special directories
 */
function identifySpecialDirectories(rootDirectories: DirectoryNode[]): Record<string, string> {
  const specialDirs: Record<string, string> = {};
  
  // Flatten directory structure for easier searching
  const allDirs = flattenDirectories(rootDirectories);
  
  // Common special directories
  const specialPatterns = {
    src: ['src', 'source'],
    tests: ['tests', 'test', '__tests__', 'spec', 'specs'],
    config: ['config', 'configs', '.config'],
    docs: ['docs', 'documentation', 'wiki'],
    scripts: ['scripts', 'tools'],
    build: ['build', 'dist', 'public', 'out'],
    assets: ['assets', 'static', 'images', 'resources']
  };
  
  // Find special directories
  for (const [type, patterns] of Object.entries(specialPatterns)) {
    for (const dir of allDirs) {
      if (patterns.includes(dir.name.toLowerCase())) {
        specialDirs[type] = dir.path;
        break;
      }
    }
  }
  
  return specialDirs;
}

/**
 * Flatten directory structure
 */
function flattenDirectories(directories: DirectoryNode[]): DirectoryNode[] {
  const result: DirectoryNode[] = [];
  
  for (const dir of directories) {
    if (dir.type === 'directory') {
      result.push(dir);
      
      if (dir.children) {
        result.push(...flattenDirectories(dir.children));
      }
    }
  }
  
  return result;
}
