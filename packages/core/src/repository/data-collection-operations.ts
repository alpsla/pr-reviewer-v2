import { VCSPlatform, VCSPullRequestFile } from '../vcs';
import { BaseRepositoryService } from './base-repository-service';
import { DataCollectorService } from './data-collector';
import { generateUuid } from '../utils/uuid';
import { 
  PullRequestBasicDetails, 
  AnalysisEligibility,
  DataType,
  DataCollectionJob,
  DataCollectionStatusInfo,
  RepositoryStructure,
  Dependencies,
  SecurityInfo,
  PerformanceIndicators,
  Repository
} from './types';

/**
 * Repository data collection operations
 * 
 * This class handles the two-tier data collection approach:
 * - Primary (Immediate) Data Collection: Basic PR metadata and access verification
 * - Secondary (Background) Data Collection: Comprehensive repository analysis
 */
export class DataCollectionOperations extends BaseRepositoryService {
  private dataCollector!: DataCollectorService;

  constructor(
    db: any,
    tokens: { github?: string; gitlab?: string; } = {},
    baseUrls?: { github?: string; gitlab?: string; }
  ) {
    // CRITICAL FIX: If there's only one token available, use it for both platforms
    // This ensures cross-platform access works correctly
    const fixedTokens = { ...tokens };
    if (fixedTokens.github && !fixedTokens.gitlab) {
      fixedTokens.gitlab = fixedTokens.github;
      console.log('Using GitHub token as GitLab token for cross-platform support');
    } else if (fixedTokens.gitlab && !fixedTokens.github) {
      fixedTokens.github = fixedTokens.gitlab;
      console.log('Using GitLab token as GitHub token for cross-platform support');
    }
    
    super(db, fixedTokens, baseUrls);
    
    try {
      // Create data collector service instances for each platform
      if (tokens.github) {
        const githubClient = this.getClientForPlatform('github');
        this.dataCollector = new DataCollectorService(db, githubClient);
      } else if (tokens.gitlab) {
        const gitlabClient = this.getClientForPlatform('gitlab');
        this.dataCollector = new DataCollectorService(db, gitlabClient);
      } else {
        // Default to GitHub if no token is available (this will likely fail when used)
        const githubClient = this.getClientForPlatform('github');
        this.dataCollector = new DataCollectorService(db, githubClient);
      }
    } catch (error) {
      console.error('Error initializing DataCollectorService:', error);
      // Still continue even if data collector service fails to initialize
      // This ensures other functions will still work
    }
  }

  /**
   * Get repository details
   * 
   * This method is needed for DataCollectionOperations to inherit properly
   * from BaseRepositoryService
   */
  public async getRepository(platform: VCSPlatform, owner: string, name: string): Promise<Repository> {
    try {
      // Get the client for this platform
      const client = this.getClientForPlatform(platform);
      
      // Check if repository exists in the database first
      const existingRepo = await this.db.getRepositoryByOwnerAndName(owner, name)
        .catch(() => null);
      
      if (existingRepo) {
        return {
          id: existingRepo.id,
          platform,
          externalId: existingRepo.external_id || '',
          owner: existingRepo.owner,
          name: existingRepo.name,
          fullName: `${existingRepo.owner}/${existingRepo.name}`,
          description: existingRepo.description || '',
          private: existingRepo.is_private,
          defaultBranch: existingRepo.default_branch || 'main',
          url: existingRepo.url || `https://${platform}.com/${owner}/${name}`,
          language: existingRepo.language,
          topics: existingRepo.topics || [],
          permissions: {
            admin: existingRepo.permissions?.admin || false,
            push: existingRepo.permissions?.push || false,
            pull: existingRepo.permissions?.pull || true
          },
          analysisCount: existingRepo.analysis_count,
          freeTierLimit: existingRepo.free_tier_analysis_limit,
          createdAt: new Date(existingRepo.created_at),
          updatedAt: new Date(existingRepo.updated_at),
          lastSyncedAt: existingRepo.last_synced_at ? new Date(existingRepo.last_synced_at) : undefined,
          lastAnalyzedAt: existingRepo.last_analyzed_at ? new Date(existingRepo.last_analyzed_at) : undefined,
          fingerprint: existingRepo.fingerprint
        };
      }
      
      // If not in the database, fetch from VCS
      const vcsRepo = await client.getRepository(owner, name);
      
      // Format into our Repository type
      const repository = {
        id: '',  // Will be set after database insert
        platform,
        externalId: vcsRepo.externalId,
        owner: vcsRepo.owner,
        name: vcsRepo.name,
        fullName: vcsRepo.fullName,
        description: vcsRepo.description || '',
        private: vcsRepo.isPrivate,
        defaultBranch: vcsRepo.defaultBranch,
        url: vcsRepo.url,
        language: vcsRepo.language,
        topics: vcsRepo.topics || [],
        permissions: {
          admin: vcsRepo.permissions?.admin || false,
          push: vcsRepo.permissions?.push || false,
          pull: vcsRepo.permissions?.pull || true
        },
        createdAt: vcsRepo.createdAt,
        updatedAt: vcsRepo.updatedAt
      };
      
      // Store in database for future use
      try {
        const savedRepo = await this.db.createRepository({
          // Store the externalId in the appropriate field based on platform
          github_id: platform === 'github' ? repository.externalId : undefined,
          gitlab_id: platform === 'gitlab' ? repository.externalId : undefined,
          platform: repository.platform,
          owner: repository.owner,
          name: repository.name,
          description: repository.description,
          is_private: repository.private,
          default_branch: repository.defaultBranch,
          url: repository.url,
          language: repository.language,
          topics: repository.topics,
          metadata: { permissions: repository.permissions },
          created_at: repository.createdAt.toISOString(),
          updated_at: repository.updatedAt.toISOString(),
          last_synced_at: new Date().toISOString()
        });
        
        // Add ID from database
        repository.id = savedRepo.id;
      } catch (dbError) {
        console.error('Error saving repository to database:', dbError);
        // Continue with the VCS repository even if saving fails
      }
      
      return repository;
    } catch (error) {
      this.handleVCSError(error, { platform, owner, repo: name });
      throw error; // This line should never be reached due to handleVCSError throwing
    }
  }

  /**
   * Get basic PR details (primary tier data collection)
   */
  public async getPullRequestBasicDetails(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    number: number
  ): Promise<PullRequestBasicDetails> {
    try {
      console.log(`Getting basic PR details for ${platform}/${owner}/${repo}#${number}`);
      
      // Get VCS client
      const client = this.getClientForPlatform(platform);
      
      // Get repository to ensure it exists and to get its ID
      let repository;
      try {
        repository = await this.getRepository(platform, owner, repo);
        console.log(`Successfully retrieved repository: ${owner}/${repo}`);
      } catch (repoError) {
        console.error(`Error retrieving repository ${owner}/${repo}:`, repoError);
        throw new Error(`Repository not found or inaccessible: ${owner}/${repo}`);
      }
      
      // Get PR details
      let pullRequest;
      try {
        pullRequest = await client.getPullRequest(owner, repo, number);
        console.log(`Successfully retrieved PR #${number}`);
      } catch (prError) {
        console.error(`Error retrieving PR #${number}:`, prError);
        throw new Error(`Pull request #${number} not found or inaccessible`);
      }
      
      // Get PR files - this is what contains our stats
      let prFiles: VCSPullRequestFile[] = [];
      try {
        console.log(`Attempting to fetch files for PR #${number}...`);
        console.log(`Using client type: ${client.constructor.name}`);
        console.log(`Client platform: ${client.getPlatform()}`);
        
        if (!client.getPullRequestFiles) {
          console.error('ERROR: getPullRequestFiles method is not available on client');
          console.log('Client methods:', Object.keys(client as unknown as Record<string, unknown>).filter(key => typeof (client as unknown as Record<string, unknown>)[key] === 'function'));
          throw new Error('Client does not implement getPullRequestFiles method');
        }
        
        prFiles = await client.getPullRequestFiles(owner, repo, number);
        console.log(`Successfully retrieved ${prFiles.length} files for PR #${number}`);
        if (prFiles.length > 0) {
          console.log('Sample file data:', JSON.stringify(prFiles[0]));
        }
      } catch (filesError) {
        console.error(`Error retrieving files for PR #${number}:`, filesError);
        console.error('Error details:', {
          name: filesError instanceof Error ? filesError.name : 'Unknown',
          message: filesError instanceof Error ? filesError.message : String(filesError),
          stack: filesError instanceof Error ? filesError.stack : 'No stack trace'
        });
        
        // Important: We don't throw here but continue with empty files array
        // This allows us to still return partial PR details
        console.warn(`Continuing with empty files list for PR #${number}`);
      }
      
      // Calculate basic stats
      let filesChanged = prFiles.length;
      let linesAdded = 0;
      let linesRemoved = 0;
      
      for (const file of prFiles) {
        linesAdded += file.additions || 0;
        linesRemoved += file.deletions || 0;
      }
      
      // Create basic details object
      const basicDetails: PullRequestBasicDetails = {
        repositoryId: repository.id,
        owner,
        repo,
        number,
        title: pullRequest.title,
        author: pullRequest.user?.login || 'Unknown',
        branch: pullRequest.head.ref,
        baseBranch: pullRequest.base.ref,
        filesChanged,
        linesAdded,
        linesRemoved,
        createdAt: new Date(pullRequest.createdAt),
        updatedAt: new Date(pullRequest.updatedAt),
        url: pullRequest.url
      };
      
      return basicDetails;
    } catch (error) {
      console.error('Error getting basic PR details:', error);
      
      // We still need a fallback, but let's try to create a more informative error message
      let errorMessage = error instanceof Error ? error.message : String(error);
      
      // Only use mock data as a last resort
      if (errorMessage.includes('not found') || errorMessage.includes('inaccessible')) {
        throw new Error(`Unable to access PR: ${errorMessage}`);
      }
      
      // We only reach here for unexpected errors
      const repositoryId = `${platform}-${owner}-${repo}`;
      
      console.warn(`Falling back to mock data for ${owner}/${repo}#${number} due to unexpected error`);
      
      // Return mock data but indicate it's mock data via the title
      return {
        repositoryId,
        owner,
        repo,
        number,
        title: `[DATA ISSUE] Pull Request #${number}`,  // Mark as having data issues
        author: 'unknown',
        branch: 'unknown',
        baseBranch: 'main',
        filesChanged: 0,  // Use zero values instead of hardcoded mock values
        linesAdded: 0,    // to make it clear that data is missing
        linesRemoved: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `https://${platform}.com/${owner}/${repo}/pull/${number}`
      };
    }
  }

  /**
   * Check if a repository is eligible for analysis
   */
  public async checkAnalysisEligibility(repositoryId: string): Promise<AnalysisEligibility> {
    try {
      // Get repository by ID
      const repository = await this.db.getRepository(repositoryId);
      
      if (!repository) {
        return {
          eligible: false,
          reason: 'Repository not found'
        };
      }
      
      // Check analysis limit
      const { hasReachedLimit } = await this.db.checkRepositoryAnalysisLimit(repositoryId);
      
      if (hasReachedLimit) {
        return {
          eligible: false,
          reason: 'Repository has reached the free tier analysis limit'
        };
      }
      
      return {
        eligible: true
      };
    } catch (error) {
      console.error('Error checking analysis eligibility:', error);
      
      return {
        eligible: false,
        reason: 'Error checking eligibility: ' + (error instanceof Error ? error.message : String(error))
      };
    }
  }

  /**
   * Schedule data collection for a repository
   */
  public async scheduleDataCollection(
    repositoryId: string,
    dataTypes: DataType[]
  ): Promise<DataCollectionJob> {
    return this.dataCollector.createJob(repositoryId, dataTypes);
  }

  /**
   * Get data collection status for a repository
   */
  public async getDataCollectionStatus(repositoryId: string): Promise<DataCollectionStatusInfo> {
    try {
      // Get repository by ID
      const repository = await this.db.getRepository(repositoryId);
      
      if (!repository) {
        throw new Error(`Repository not found: ${repositoryId}`);
      }
      
      // Get pending or processing jobs
      const activeJobs = await this.db.getDataCollectionJobsByRepository(
        repositoryId,
        ['pending', 'processing']
      );
      
      // Calculate completion percentage
      let completionPercentage = 0;
      const collectedDataTypes: DataType[] = repository.collected_data_types || [];
      const pendingDataTypes: DataType[] = [];
      
      // Combine all data types from active jobs
      for (const job of activeJobs) {
      pendingDataTypes.push(...job.dataTypes.filter(
      (dt: DataType) => !collectedDataTypes.includes(dt) && !pendingDataTypes.includes(dt)
      ));
      }
      
      // If there are no pending data types, consider it 100% complete
      if (pendingDataTypes.length === 0) {
        completionPercentage = 100;
      } else {
        // Calculate percentage based on completed vs total
        const totalDataTypes = [...new Set([...collectedDataTypes, ...pendingDataTypes])];
        completionPercentage = Math.round((collectedDataTypes.length / totalDataTypes.length) * 100);
      }
      
      return {
        repositoryId,
        status: repository.data_collection_status || 'completed',
        completionPercentage,
        collectedDataTypes,
        pendingDataTypes,
        lastUpdated: repository.last_data_collection ? new Date(repository.last_data_collection) : new Date()
      };
    } catch (error) {
      console.error('Error getting data collection status:', error);
      
      // Return a default status
      return {
        repositoryId,
        status: 'failed',
        completionPercentage: 0,
        collectedDataTypes: [],
        pendingDataTypes: [],
        lastUpdated: new Date()
      };
    }
  }

  /**
   * Get repository structure
   */
  public async getRepositoryStructure(repositoryId: string): Promise<RepositoryStructure | null> {
    try {
      return this.db.getRepositoryStructure(repositoryId);
    } catch (error) {
      console.error('Error getting repository structure:', error);
      return null;
    }
  }

  /**
   * Get dependency information
   */
  public async getDependencyInfo(repositoryId: string): Promise<Dependencies | null> {
    try {
      return this.db.getRepositoryDependencies(repositoryId);
    } catch (error) {
      console.error('Error getting dependency info:', error);
      return null;
    }
  }

  /**
   * Get security information
   */
  public async getSecurityInfo(repositoryId: string): Promise<SecurityInfo | null> {
    try {
      return this.db.getRepositorySecurityInfo(repositoryId);
    } catch (error) {
      console.error('Error getting security info:', error);
      return null;
    }
  }

  /**
   * Get performance indicators
   */
  public async getPerformanceIndicators(repositoryId: string): Promise<PerformanceIndicators | null> {
    try {
      return this.db.getRepositoryPerformanceIndicators(repositoryId);
    } catch (error) {
      console.error('Error getting performance indicators:', error);
      return null;
    }
  }
}