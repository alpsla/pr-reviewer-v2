/**
 * Database service interface for data collectors
 */
export interface IDatabaseService {
  getRepository: (id: string) => Promise<any>;
  getRepositoryByOwnerAndName: (owner: string, name: string) => Promise<any>;
  createRepository: (data: any) => Promise<any>;
  getRepositoryStructure: (repositoryId: string) => Promise<any>;
  getRepositoryDependencies: (repositoryId: string) => Promise<any>;
  getRepositorySecurityInfo: (repositoryId: string) => Promise<any>;
  getRepositoryPerformanceIndicators: (repositoryId: string) => Promise<any>;
  getDataCollectionJobsByRepository: (repositoryId: string, statuses?: string[]) => Promise<any[]>;
  createDataCollectionJob: (data: any) => Promise<any>;
}
