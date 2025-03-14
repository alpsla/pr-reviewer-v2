import { VCSPlatform } from '../vcs';
import { BaseRepositoryService } from './base-repository-service';
import { convertVCSRepository } from './converters';
import { createValidationError } from './repository-error';
import { createRepositoryFingerprint, AnalysisLimitError } from './fingerprint';
import type { Repository } from './types';

export class RepositoryOperations extends BaseRepositoryService {
  public async getRepository(
    platform: VCSPlatform,
    owner: string,
    name: string
  ): Promise<Repository> {
    try {
      // Check cache first
      const cachedRepo = await this.db.getRepositoryByOwnerAndName(owner, name)
        .catch(() => null);
      
      console.log('Repository cache check:', { cached: !!cachedRepo, owner, name });
      
      if (cachedRepo && new Date(cachedRepo.last_synced_at).getTime() > Date.now() - 3600000) {
        return {
          id: cachedRepo.id,
          platform,
          externalId: platform === 'github' ? cachedRepo.github_id : cachedRepo.metadata?.external_id,
          owner: cachedRepo.owner,
          name: cachedRepo.name,
          fullName: `${cachedRepo.owner}/${cachedRepo.name}`,
          description: cachedRepo.description || '',
          private: cachedRepo.is_private,
          defaultBranch: cachedRepo.default_branch,
          url: cachedRepo.url,
          language: cachedRepo.language,
          topics: cachedRepo.topics || [],
          permissions: {
            admin: cachedRepo.metadata?.has_admin_access || false,
            push: cachedRepo.metadata?.has_write_access || false,
            pull: true
          },
          // Add analysis tracking fields
          analysisCount: cachedRepo.analysis_count || 0,
          freeTierLimit: cachedRepo.free_tier_analysis_limit || 5,
          fingerprint: cachedRepo.fingerprint,
          createdAt: new Date(cachedRepo.created_at),
          updatedAt: new Date(cachedRepo.updated_at),
          lastSyncedAt: new Date(cachedRepo.last_synced_at),
          lastAnalyzedAt: cachedRepo.last_analyzed_at ? new Date(cachedRepo.last_analyzed_at) : undefined
        };
      }
      
      // Get from VCS API
      console.log('Fetching repository from VCS:', { platform, owner, name });
      
      // Check if we have a client for this platform
      if ((platform === 'github' && !this.tokens.github) || 
          (platform === 'gitlab' && !this.tokens.gitlab)) {
        console.error('No token available for platform', platform);
        throw new Error(`No authentication token available for ${platform}. Please check your login.`);
      }
      
      const client = this.getClientForPlatform(platform);
      console.log('VCS client obtained, fetching repository...');
      const vcsRepo = await client.getRepository(owner, name);
      const repository = convertVCSRepository(vcsRepo);
      
      console.log('VCS repository details:', { 
        repoId: repository.externalId,
        owner: repository.owner,
        name: repository.name
      });
      
      // Generate fingerprint for this repository
      const fingerprint = createRepositoryFingerprint(platform, owner, name);
      
      // Check if there's any repository with this fingerprint already
      const existingByFingerprint = await this.db.getRepositoryByFingerprint(fingerprint)
        .catch(() => null);
      
      // For email-authenticated users, ensure we're using the same fingerprint
      // and analysis count as previously computed for any authentication method
      console.log('Fingerprint check:', { 
        fingerprint, 
        existingFound: !!existingByFingerprint,
        existingAnalysisCount: existingByFingerprint?.analysis_count || 0,
        platform
      });
      
      // Save to database
      console.log('Saving repository to database:', { 
        id: cachedRepo?.id || existingByFingerprint?.id,
        owner: repository.owner,
        name: repository.name,
        fingerprint
      });
      
      // Always set the platform field
      const savedRepo = await this.db.createRepository({
        // Use existing ID if available from either cache or fingerprint
        id: existingByFingerprint?.id || cachedRepo?.id,
        github_id: platform === 'github' ? repository.externalId : null,
        owner: repository.owner,
        name: repository.name,
        description: repository.description,
        is_private: repository.private,
        default_branch: repository.defaultBranch,
        url: repository.url,
        language: repository.language,
        topics: repository.topics,
        created_at: repository.createdAt.toISOString(),
        updated_at: repository.updatedAt.toISOString(),
        last_synced_at: new Date().toISOString(),
        last_analyzed_at: repository.lastSyncedAt?.toISOString(),
        // Set fingerprint (if an existing repo with this fingerprint was found, copy its analysis count)
        fingerprint: fingerprint,
        analysis_count: existingByFingerprint?.analysis_count ?? cachedRepo?.analysis_count ?? 0,
        free_tier_analysis_limit: existingByFingerprint?.free_tier_analysis_limit ?? cachedRepo?.free_tier_analysis_limit ?? undefined,
        // Always set platform field
        platform: platform,
        metadata: {
          external_id: platform === 'gitlab' ? repository.externalId : null,
          has_admin_access: repository.permissions.admin,
          has_write_access: repository.permissions.push,
          has_read_access: repository.permissions.pull
        }
      }, { 
        // Always use upsert to avoid duplicate key issues
        upsert: true
      });
      
      return {
        ...repository,
        id: savedRepo.id,
        fingerprint: savedRepo.fingerprint,
        analysisCount: savedRepo.analysis_count || 0,
        freeTierLimit: savedRepo.free_tier_analysis_limit || 5,
        lastAnalyzedAt: savedRepo.last_analyzed_at ? new Date(savedRepo.last_analyzed_at) : undefined
      };
    } catch (error) {
      console.error('Error in getRepository:', error);
      this.handleVCSError(error, { platform, owner, repo: name });
      throw error; // Re-throw after handling to ensure errors propagate
    }
  }

  public async checkRepositoryAccess(platform: VCSPlatform, owner: string, repo: string): Promise<{ hasAccess: boolean; private: boolean; permissions: { admin: boolean; push: boolean; pull: boolean; }; }> {
    try {
      console.log(`Checking access to ${platform} repo: ${owner}/${repo}`);
      console.log(`Token available for ${platform}: ${!!this.tokens[platform]}`);
      if (this.tokens[platform]) {
        // Log the first few characters of the token for debugging
        console.log(`Token starts with: ${this.tokens[platform]?.substring(0, 5)}...`);
      }
      
      // Check if we have a client for this platform
      if ((platform === 'github' && !this.tokens.github) || 
          (platform === 'gitlab' && !this.tokens.gitlab)) {
        console.error(`No token available for platform ${platform}`);
        return {
          hasAccess: false,
          private: false, // Don't assume privacy status without checking
          permissions: {
            admin: false,
            push: false,
            pull: false
          }
        };
      }

      const client = this.getClientForPlatform(platform);
      console.log('VCS client obtained, checking repository access...');
      
      // Get the repository (this will throw if access is denied)
      const repository = await this.getRepository(platform, owner, repo);
      
      // Attempt to handle GitHub API sometimes incorrectly reporting public repos as private
      // If we have pull permission, let's treat it as accessible
      let isPrivate = repository.private;
      
      // Special case handling: if a repo is marked as private but we have pull permission,
      // it might be a public repo incorrectly marked as private by the API
      if (isPrivate && repository.permissions.pull) {
        console.log('Repository is marked private but has pull permission - might be public');
        // We'll still mark it as private, but we'll allow access
      }
      
      console.log(`Access check result: hasAccess=true, private=${isPrivate}, permissions=`, repository.permissions);
      return {
        hasAccess: true,
        private: isPrivate,
        permissions: repository.permissions
      };
    } catch (error) {
      const isUnauthorizedError = error instanceof Error && (
        error.message.includes('Authentication') ||
        error.message.includes('authorization') ||
        error.message.includes('401') ||
        error.message.includes('token')
      );

      const isPermissionError = error instanceof Error && (
        error.message.includes('Permission denied') ||
        error.message.includes('access denied') ||
        error.message.includes('403') ||
        error.message.includes('not allowed')
      );

      console.error('Repository access check failed:', {
        error: error instanceof Error ? error.message : String(error),
        isUnauthorizedError,
        isPermissionError
      });
      
      // Differentiate between authentication errors and permission errors
      return {
        hasAccess: false,
        // If it's an unauthorized/authentication error, don't assume privacy
        // Only mark as private if it's a permission error
        private: isPermissionError, 
        permissions: {
          admin: false,
          push: false,
          pull: false
        }
      };
    }
  }

  public async getRateLimit(platform: VCSPlatform): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
    used: number;
  }> {
    try {
      const client = this.getClientForPlatform(platform);
      return client.getRateLimit();
    } catch (error) {
      // Handle the case of unsupported platforms with proper validation error
      if (platform !== 'github' && platform !== 'gitlab') {
        throw createValidationError(
          `No client available for platform: ${platform}`, 
          { platform }
        );
      }
      
      return {
        limit: 5000,
        remaining: 4999,
        reset: new Date(Date.now() + 3600000),
        used: 1
      };
    }
  }
  
  /**
   * Check if a repository has reached its free tier analysis limit
   */
  public async checkAnalysisLimit(
    platform: VCSPlatform,
    owner: string,
    repo: string
  ): Promise<{ current: number; limit: number; hasReachedLimit: boolean }> {
    try {
      // Generate fingerprint first to check if repository was already analyzed
      const fingerprint = createRepositoryFingerprint(platform, owner, repo);
      
      // Check if there's any repository with this fingerprint already
      let existingByFingerprint;
      try {
        existingByFingerprint = await this.db.getRepositoryByFingerprint(fingerprint);
        
        if (existingByFingerprint) {
          console.log('Found repository by fingerprint:', {
            fingerprint,
            repoId: existingByFingerprint.id,
            analysisCount: existingByFingerprint.analysis_count
          });
          
          // Return the analysis limit information from existing fingerprinted repo
          return this.db.checkRepositoryAnalysisLimit(existingByFingerprint.id);
        }
      } catch (err) {
        console.log('No existing repository found with fingerprint:', fingerprint);
      }
      
      // Check if we have a token for this platform - if not, create a mock repository entry for tracking
      // This is important for users authenticating with email who don't have platform tokens
      if ((platform === 'github' && !this.tokens.github) || 
          (platform === 'gitlab' && !this.tokens.gitlab)) {
        
        console.log(`No ${platform} token available, creating mock repository entry for tracking`);
        
        // Create a minimal repository entry for fingerprinting purposes
        const mockRepo = await this.db.createRepository({
          owner: owner,
          name: repo,
          description: `Mock repository for ${owner}/${repo}`,
          is_private: false,
          default_branch: 'main',
          url: `https://${platform}.com/${owner}/${repo}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          fingerprint: fingerprint,
          analysis_count: 0,
          free_tier_analysis_limit: 5,
          github_id: '0', // Add placeholder for github_id
          platform: platform // Always set platform
        }, { upsert: true });
        
        console.log('Created mock repository for tracking:', {
          id: mockRepo.id,
          fingerprint: mockRepo.fingerprint
        });
        
        return {
          current: mockRepo.analysis_count || 0,
          limit: mockRepo.free_tier_analysis_limit || 5,
          hasReachedLimit: (mockRepo.analysis_count || 0) >= (mockRepo.free_tier_analysis_limit || 5)
        };
      }
      
      // Get repository to ensure it exists and to get its ID
      const repository = await this.getRepository(platform, owner, repo);
      
      // Check the analysis limit
      return this.db.checkRepositoryAnalysisLimit(repository.id);
    } catch (error) {
      console.error('Error in checkAnalysisLimit:', error);
      // For email users without tokens, provide default values instead of failing
      if (error instanceof Error && error.message.includes('No authentication token available')) {
        console.log('No authentication token, using default analysis limits');
        return {
          current: 0,
          limit: 5,
          hasReachedLimit: false
        };
      }
      this.handleVCSError(error, { platform, owner, repo });
      throw error; // Re-throw for proper error handling
    }
  }
  
  /**
   * Increment the analysis count for a repository
   * 
   * @throws AnalysisLimitError if the repository has reached its free tier limit
   */
  public async incrementAnalysisCount(
    platform: VCSPlatform,
    owner: string,
    repo: string,
    bypassLimit = false
  ): Promise<number> {
    try {
      // Generate fingerprint first to check if repository was already analyzed
      const fingerprint = createRepositoryFingerprint(platform, owner, repo);
      
      // Check if there's any repository with this fingerprint already
      let existingByFingerprint;
      try {
        existingByFingerprint = await this.db.getRepositoryByFingerprint(fingerprint);
        
        if (existingByFingerprint) {
          console.log('Found repository by fingerprint for increment:', {
            fingerprint,
            repoId: existingByFingerprint.id,
            analysisCount: existingByFingerprint.analysis_count
          });
          
          // Check limit first (if not bypassing)
          if (!bypassLimit) {
            const { current, limit, hasReachedLimit } = 
              await this.db.checkRepositoryAnalysisLimit(existingByFingerprint.id);
            
            if (hasReachedLimit) {
              throw new AnalysisLimitError(
                `Repository '${owner}/${repo}' has reached the free tier analysis limit (${current}/${limit})`,
                existingByFingerprint.id,
                owner,
                repo,
                current,
                limit
              );
            }
          }
          
          // Increment the analysis count of the fingerprinted repository
          return this.db.incrementRepositoryAnalysisCount(existingByFingerprint.id);
        }
      } catch (err) {
        // Only log if it's not an AnalysisLimitError, which would be rethrown
        if (!(err instanceof AnalysisLimitError)) {
          console.log('Error or no existing repository found with fingerprint:', fingerprint);
        } else {
          throw err;
        }
      }
      
      // Check if we have a token for this platform - if not, create a mock repository entry for tracking
      // This is important for users authenticating with email who don't have platform tokens
      if ((platform === 'github' && !this.tokens.github) || 
          (platform === 'gitlab' && !this.tokens.gitlab)) {
        
        console.log(`No ${platform} token available, creating mock repository entry for incrementing`);
        
        // Create a minimal repository entry for fingerprinting purposes
        const mockRepo = await this.db.createRepository({
          owner: owner,
          name: repo,
          description: `Mock repository for ${owner}/${repo}`,
          is_private: false,
          default_branch: 'main',
          url: `https://${platform}.com/${owner}/${repo}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          fingerprint: fingerprint,
          analysis_count: 0,
          free_tier_analysis_limit: 5,
          github_id: '0', // Add placeholder for github_id
          platform: platform // Always set platform
        }, { upsert: true });
        
        console.log('Created mock repository for analysis increment:', {
          id: mockRepo.id,
          fingerprint: mockRepo.fingerprint
        });
        
        // Increment the analysis count
        return this.db.incrementRepositoryAnalysisCount(mockRepo.id);
      }
      
      // Get repository to ensure it exists and to get its ID
      const repository = await this.getRepository(platform, owner, repo);
      
      // Check limit first (if not bypassing)
      if (!bypassLimit) {
        const { current, limit, hasReachedLimit } = await this.db.checkRepositoryAnalysisLimit(repository.id);
        
        if (hasReachedLimit) {
          throw new AnalysisLimitError(
            `Repository '${owner}/${repo}' has reached the free tier analysis limit (${current}/${limit})`,
            repository.id,
            owner,
            repo,
            current,
            limit
          );
        }
      }
      
      // Increment the analysis count
      return this.db.incrementRepositoryAnalysisCount(repository.id);
    } catch (error) {
      console.error('Error in incrementAnalysisCount:', error);
      
      // If it's already an AnalysisLimitError, just rethrow it
      if (error instanceof AnalysisLimitError) {
        throw error;
      }
      
      // For email users without tokens, fallback to create a mock repository
      if (error instanceof Error && error.message.includes('No authentication token available')) {
        console.log('No auth token, creating mock repository for tracking');
        try {
          // Create minimal repository for tracking
          const fingerprint = createRepositoryFingerprint(platform, owner, repo);
          const mockRepo = await this.db.createRepository({
            owner: owner,
            name: repo,
            description: `Mock repository for ${owner}/${repo}`,
            is_private: false,
            default_branch: 'main',
            url: `https://${platform}.com/${owner}/${repo}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            fingerprint: fingerprint,
            analysis_count: 0,
            free_tier_analysis_limit: 5,
            github_id: '0', // Add placeholder for github_id
            platform: platform // Always set platform
          }, { upsert: true });
          
          // Increment the analysis count
          return this.db.incrementRepositoryAnalysisCount(mockRepo.id);
        } catch (createError) {
          console.error('Error creating mock repository:', createError);
          throw createError;
        }
      }
      
      // Otherwise handle as other VCS error
      this.handleVCSError(error, { platform, owner, repo });
      throw error; // Re-throw for proper error handling
    }
  }
}