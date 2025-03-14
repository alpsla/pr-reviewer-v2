import { VCSClient } from '../../vcs/types';
import { DataCollectionVCSClient } from './types';

/**
 * Type guards for VCS client methods
 */
export function hasGetRepositoryContents(client: VCSClient): client is VCSClient & { getRepositoryContents: NonNullable<VCSClient['getRepositoryContents']> } {
  return typeof client.getRepositoryContents === 'function';
}

export function hasGetFileContent(client: VCSClient): client is VCSClient & { getFileContent: NonNullable<VCSClient['getFileContent']> } {
  return typeof client.getFileContent === 'function';
}

export function hasGetRepositoryTree(client: VCSClient): client is VCSClient & { getRepositoryTree: NonNullable<VCSClient['getRepositoryTree']> } {
  return typeof client.getRepositoryTree === 'function';
}

/**
 * Verify that VCS client has all required data collection methods
 */
export function verifyVCSClientForDataCollection(client: VCSClient): void {
  if (!hasGetRepositoryContents(client)) {
    throw new Error('VCS client does not implement getRepositoryContents method');
  }
  
  if (!hasGetFileContent(client)) {
    throw new Error('VCS client does not implement getFileContent method');
  }
  
  if (!hasGetRepositoryTree(client)) {
    throw new Error('VCS client does not implement getRepositoryTree method');
  }
}

/**
 * Convert VCSClient to DataCollectionVCSClient
 * This will throw an error if the client doesn't support data collection operations
 */
export function asDataCollectionClient(client: VCSClient): DataCollectionVCSClient {
  verifyVCSClientForDataCollection(client);
  return client as DataCollectionVCSClient;
}
