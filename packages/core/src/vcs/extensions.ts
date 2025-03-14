/**
 * VCS Client Extensions
 * 
 * This file provides additional function extensions for the VCS clients
 * that are needed by collectors.
 */

// Import the base VCS client interface
import { VCSClient } from './types';

/**
 * Add extension methods to GitHub client prototype
 */
export function extendGitHubClient(client: any): void {
  // GitHub-specific implementations
  client.getRepositoryContents = async function(owner: string, repo: string, path: string, ref?: string) {
    console.log(`Getting repository contents for ${owner}/${repo}/${path}`);
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref
      });
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error('Error getting repository contents:', error);
      return [];
    }
  };

  client.getFileContent = async function(owner: string, repo: string, path: string, ref?: string) {
    console.log(`Getting file content for ${owner}/${repo}/${path}`);
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref
      });
      
      // If this is a directory, throw an error
      if (Array.isArray(response.data)) {
        throw new Error(`Path ${path} is a directory, not a file`);
      }
      
      // Get content and decode if it's base64 encoded
      const content = response.data.content;
      if (response.data.encoding === 'base64') {
        return Buffer.from(content, 'base64').toString('utf-8');
      }
      return content;
    } catch (error) {
      console.error('Error getting file content:', error);
      throw error;
    }
  };

  client.getRepositoryTree = async function(owner: string, repo: string, ref = 'HEAD', recursive = true) {
    console.log(`Getting repository tree for ${owner}/${repo} at ${ref}`);
    try {
      const response = await this.octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: ref,
        recursive: recursive ? '1' : '0'
      });
      return response.data;
    } catch (error) {
      console.error('Error getting repository tree:', error);
      throw error;
    }
  };
}

/**
 * Add extension methods to GitLab client prototype
 */
export function extendGitLabClient(client: any): void {
  // GitLab-specific implementations
  client.getRepositoryContents = async function(owner: string, repo: string, path: string, ref?: string) {
    console.log(`Getting repository contents for ${owner}/${repo}/${path}`);
    try {
      const projectId = encodeURIComponent(`${owner}/${repo}`);
      const response = await this.client.RepositoryFiles.showDirectory(projectId, path, ref || 'main');
      return response;
    } catch (error) {
      console.error('Error getting repository contents:', error);
      return [];
    }
  };

  client.getFileContent = async function(owner: string, repo: string, path: string, ref?: string) {
    console.log(`Getting file content for ${owner}/${repo}/${path}`);
    try {
      const projectId = encodeURIComponent(`${owner}/${repo}`);
      const response = await this.client.RepositoryFiles.show(projectId, path, ref || 'main');
      
      // Get content and decode if it's base64 encoded
      const content = response.content;
      if (response.encoding === 'base64') {
        return Buffer.from(content, 'base64').toString('utf-8');
      }
      return content;
    } catch (error) {
      console.error('Error getting file content:', error);
      throw error;
    }
  };

  client.getRepositoryTree = async function(owner: string, repo: string, ref = 'HEAD', recursive = true) {
    console.log(`Getting repository tree for ${owner}/${repo} at ${ref}`);
    try {
      const projectId = encodeURIComponent(`${owner}/${repo}`);
      const response = await this.client.Repositories.tree(projectId, {
        ref: ref,
        recursive: recursive
      });
      return response;
    } catch (error) {
      console.error('Error getting repository tree:', error);
      throw error;
    }
  };
}

/**
 * Initialize VCS client extensions
 */
export function initializeVCSExtensions(client: any): void {
  // Determine the type of client and extend it
  try {
    if ((client as any).octokit) {
      extendGitHubClient(client);
    } else if ((client as any).client) {
      extendGitLabClient(client);
    }
    console.log('VCS client extensions initialized successfully');
  } catch (error) {
    console.error('Failed to initialize VCS client extensions:', error);
    // Fall back to empty implementations if extension fails
    client.getRepositoryContents = async () => [];
    client.getFileContent = async () => '';
    client.getRepositoryTree = async () => ({ tree: [] });
  }
}
