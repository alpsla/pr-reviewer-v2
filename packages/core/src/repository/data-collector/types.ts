import { VCSClient } from '../../vcs/types';

/**
 * Extended interface for VCS clients that support data collection operations
 */
export interface DataCollectionVCSClient extends VCSClient {
  getRepositoryContents: NonNullable<VCSClient['getRepositoryContents']>;
  getFileContent: NonNullable<VCSClient['getFileContent']>;
  getRepositoryTree: NonNullable<VCSClient['getRepositoryTree']>;
}
