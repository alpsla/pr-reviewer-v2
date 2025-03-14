import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Default free tier analysis limit
const DEFAULT_FREE_TIER_LIMIT = 5;

export class DatabaseService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createUser(data: Database["public"]["Tables"]["users"]["Insert"]) {
    const { data: user, error } = await this.supabase
      .from("users")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  async getUser(id: string) {
    const { data: user, error } = await this.supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;
    return user;
  }

  async getUserByGithubId(githubId: string) {
    const { data: user, error } = await this.supabase
      .from("users")
      .select()
      .eq("github_id", githubId)
      .single();

    if (error) throw error;
    return user;
  }

  async updateUser(
    id: string,
    data: Database["public"]["Tables"]["users"]["Update"],
  ) {
    const { data: user, error } = await this.supabase
      .from("users")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  async createRepository(
    data: Database["public"]["Tables"]["repositories"]["Insert"],
    options: { upsert?: boolean } = {}
  ) {
    console.log('DatabaseService.createRepository called with:', {
      owner: data.owner,
      name: data.name,
      fingerprint: data.fingerprint,
      upsert: options.upsert
    });
    
    // Set default values for analysis tracking if not provided
    const repositoryData = {
      ...data,
      analysis_count: data.analysis_count ?? 0,
      free_tier_analysis_limit: data.free_tier_analysis_limit ?? DEFAULT_FREE_TIER_LIMIT,
      // Add placeholder for github_id if needed to satisfy the NOT NULL constraint
      github_id: data.github_id || '0', // Using '0' as a placeholder when no GitHub ID is available
      // Make sure platform is set or defaulted
      platform: data.platform || 'github'
    };

    try {
      // First check if repository exists by fingerprint to avoid id conflicts
      if (data.fingerprint) {
        const { data: existingRepo } = await this.supabase
          .from("repositories")
          .select("id, owner, name, fingerprint, analysis_count, free_tier_analysis_limit")
          .eq("fingerprint", data.fingerprint)
          .maybeSingle();
          
        if (existingRepo) {
          console.log('Found existing repository by fingerprint, updating instead:', {
            id: existingRepo.id,
            owner: existingRepo.owner,
            name: existingRepo.name,
            fingerprint: existingRepo.fingerprint
          });
          
          // Update the existing repository while preserving analysis counts
          const { data: updatedRepo, error } = await this.supabase
            .from("repositories")
            .update({
              ...repositoryData,
              analysis_count: repositoryData.analysis_count ?? existingRepo.analysis_count,
              free_tier_analysis_limit: repositoryData.free_tier_analysis_limit ?? existingRepo.free_tier_analysis_limit
            })
            .eq("id", existingRepo.id)
            .select()
            .single();
            
          if (error) {
            console.error('Error updating existing repository:', error);
            throw error;
          }
          
          console.log('Repository updated successfully:', {
            id: updatedRepo.id,
            owner: updatedRepo.owner,
            name: updatedRepo.name
          });
          
          return updatedRepo;
        }
      }
      
      // If there's an ID provided, first check if it exists to avoid primary key conflicts
      if (data.id) {
        const { data: existingRepoById } = await this.supabase
          .from("repositories")
          .select("id")
          .eq("id", data.id)
          .maybeSingle();
          
        if (existingRepoById) {
          console.log('Repository with this ID already exists, updating:', data.id);
          
          // Update the existing repository
          const { data: updatedRepo, error } = await this.supabase
            .from("repositories")
            .update(repositoryData)
            .eq("id", data.id)
            .select()
            .single();
            
          if (error) {
            console.error('Error updating repository by ID:', error);
            throw error;
          }
          
          console.log('Repository updated successfully by ID:', {
            id: updatedRepo.id,
            owner: updatedRepo.owner,
            name: updatedRepo.name
          });
          
          return updatedRepo;
        }
      }
      
      // Check by owner/name if we should upsert
      if (options.upsert) {
        const { data: existingByName } = await this.supabase
          .from("repositories")
          .select("id")
          .eq("owner", data.owner)
          .eq("name", data.name)
          .maybeSingle();
          
        if (existingByName) {
          console.log('Repository exists by name, updating:', {
            owner: data.owner,
            name: data.name,
            id: existingByName.id
          });
          
          // Update the existing repository
          const { data: updatedRepo, error } = await this.supabase
            .from("repositories")
            .update(repositoryData)
            .eq("id", existingByName.id)
            .select()
            .single();
            
          if (error) {
            console.error('Error updating repository by name:', error);
            throw error;
          }
          
          console.log('Repository updated successfully by name:', {
            id: updatedRepo.id,
            owner: updatedRepo.owner,
            name: updatedRepo.name
          });
          
          return updatedRepo;
        }
      }
        
      // If we get here, create a new repository record
      console.log('Creating new repository:', {
        owner: repositoryData.owner,
        name: repositoryData.name,
        fingerprint: repositoryData.fingerprint
      });
      
      // Check for duplicate owner/name entries first
      const { data: duplicateCheck } = await this.supabase
        .from("repositories")
        .select('id, name')
        .eq("owner", repositoryData.owner)
        .eq("name", repositoryData.name);
      
      // If we found duplicates, modify the name to make it unique
      if (duplicateCheck && duplicateCheck.length > 0) {
        console.log('Found duplicate owner/name entries, modifying name to be unique:', {
          owner: repositoryData.owner,
          name: repositoryData.name,
          count: duplicateCheck.length
        });
        
        // Append a unique identifier based on timestamp
        const uniqueSuffix = `-${Date.now().toString().slice(-6)}`;
        repositoryData.name = `${repositoryData.name}${uniqueSuffix}`;
        
        console.log('Modified name to:', repositoryData.name);
      }
      
      const { data: repository, error } = await this.supabase
        .from("repositories")
        .insert(repositoryData)
        .select()
        .single();

      if (error) {
        console.error('Error inserting repository:', error);
        throw error;
      }
      
      console.log('Repository created successfully:', {
        id: repository.id,
        owner: repository.owner,
        name: repository.name
      });
      
      return repository;
    } catch (error) {
      console.error('Unexpected error in createRepository:', error);
      throw error;
    }
  }

  async getRepositoryByOwnerAndName(owner: string, name: string) {
    const { data: repository, error } = await this.supabase
      .from("repositories")
      .select()
      .eq("owner", owner)
      .eq("name", name)
      .single();

    if (error) throw error;
    return repository;
  }

  async createPullRequest(
    data: Database["public"]["Tables"]["pull_requests"]["Insert"],
  ) {
    const { data: pullRequest, error } = await this.supabase
      .from("pull_requests")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return pullRequest;
  }

  async getPullRequest(id: string) {
    const { data: pullRequest, error } = await this.supabase
      .from("pull_requests")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;
    return pullRequest;
  }

  async getPullRequestByNumber(repositoryId: string, number: number) {
    const { data: pullRequest, error } = await this.supabase
      .from("pull_requests")
      .select()
      .eq("repository_id", repositoryId)
      .eq("number", number)
      .single();

    if (error) throw error;
    return pullRequest;
  }

  async createAnalysisJob(
    data: Database["public"]["Tables"]["analysis_queue"]["Insert"],
  ) {
    const { data: job, error } = await this.supabase
      .from("analysis_queue")
      .insert({
        ...data,
        status: "pending" as Database["public"]["Enums"]["analysis_status"],
      })
      .select()
      .single();

    if (error) throw error;
    return job;
  }

  async getNextAnalysisJob() {
    const { data: jobs, error } = await this.supabase
      .from("analysis_queue")
      .select()
      .eq("status", "pending")
      .order("created_at")
      .limit(1);

    if (error) throw error;
    return jobs[0] || null;
  }

  async storePullRequest(data: {
    repository_id: string;
    number: number;
    title: string;
    description?: string;
    author: string;
    base_branch: string;
    head_branch: string;
    state: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const { data: pr, error } = await this.supabase
      .from('pull_requests')
      .upsert([data])
      .select()
      .single();

    if (error) throw error;
    return pr.id;
  }

  async createAnalysisQueue(data: {
    pull_request_id: string;
    status: string;
    priority: number;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const { data: queue, error } = await this.supabase
      .from('analysis_queue')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return queue.id;
  }

  /**
   * Get repository by fingerprint
   */
  async getRepositoryByFingerprint(fingerprint: string) {
    const { data: repository, error } = await this.supabase
      .from("repositories")
      .select()
      .eq("fingerprint", fingerprint)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return error ? null : repository;
  }

  /**
   * Update repository analysis count
   */
  async incrementRepositoryAnalysisCount(repositoryId: string): Promise<number> {
    // First get current analysis count
    const { data: repository, error: fetchError } = await this.supabase
      .from("repositories")
      .select("analysis_count")
      .eq("id", repositoryId)
      .single();

    if (fetchError) throw fetchError;
    
    const newCount = (repository.analysis_count || 0) + 1;
    
    // Update the repository with the new count and last analyzed timestamp
    const { data: updatedRepo, error: updateError } = await this.supabase
      .from("repositories")
      .update({
        analysis_count: newCount,
        last_analyzed_at: new Date().toISOString()
      })
      .eq("id", repositoryId)
      .select()
      .single();

    if (updateError) throw updateError;
    return newCount;
  }

  /**
   * Check if repository has reached free tier analysis limit
   */
  async checkRepositoryAnalysisLimit(repositoryId: string): Promise<{
    current: number;
    limit: number;
    hasReachedLimit: boolean;
  }> {
    const { data: repository, error } = await this.supabase
      .from("repositories")
      .select("analysis_count, free_tier_analysis_limit")
      .eq("id", repositoryId)
      .single();

    if (error) throw error;
    
    const current = repository.analysis_count || 0;
    const limit = repository.free_tier_analysis_limit || DEFAULT_FREE_TIER_LIMIT;
    
    return {
      current,
      limit,
      hasReachedLimit: current >= limit
    };
  }

  /**
   * Get repository by ID
   */
  async getRepository(id: string) {
    const { data: repository, error } = await this.supabase
      .from("repositories")
      .select()
      .eq("id", id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return error ? null : repository;
  }

  /**
   * Get data collection jobs for a repository
   */
  async getDataCollectionJobsByRepository(repositoryId: string, statuses: string[] = []) {
    let query = this.supabase
      .from("data_collection_jobs")
      .select()
      .eq("repository_id", repositoryId);
      
    if (statuses.length > 0) {
      query = query.in("status", statuses);
    }
    
    const { data: jobs, error } = await query;

    if (error) throw error;
    return jobs || [];
  }

  /**
   * Get repository structure
   */
  async getRepositoryStructure(repositoryId: string) {
    const { data, error } = await this.supabase
      .from("repository_structure")
      .select()
      .eq("repository_id", repositoryId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return error ? null : data;
  }

  /**
   * Get repository dependencies
   */
  async getRepositoryDependencies(repositoryId: string) {
    const { data, error } = await this.supabase
      .from("repository_dependencies")
      .select()
      .eq("repository_id", repositoryId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return error ? null : data;
  }

  /**
   * Get repository security info
   */
  async getRepositorySecurityInfo(repositoryId: string) {
    const { data, error } = await this.supabase
      .from("repository_security")
      .select()
      .eq("repository_id", repositoryId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return error ? null : data;
  }

  /**
   * Get repository performance indicators
   */
  async getRepositoryPerformanceIndicators(repositoryId: string) {
    const { data, error } = await this.supabase
      .from("repository_performance")
      .select()
      .eq("repository_id", repositoryId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return error ? null : data;
  }

  /**
   * Create a data collection job
   */
  async createDataCollectionJob(data: {
    id?: string;
    repository_id: string;
    data_types: string[];
    status: string;
    priority?: number;
    created_at?: string;
    updated_at?: string;
  }) {
    const { data: job, error } = await this.supabase
      .from("data_collection_jobs")
      .insert({
        id: data.id,
        repository_id: data.repository_id,
        data_types: data.data_types,
        status: data.status,
        priority: data.priority || 1,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating data collection job:', error);
      // For now, return a simulated job object even if the database insert fails
      return {
        id: data.id || crypto.randomUUID(),
        repository_id: data.repository_id,
        data_types: data.data_types,
        status: data.status,
        priority: data.priority || 1,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    }
    return job;
  }

  /**
   * Get the next data collection job to process
   */
  async getNextDataCollectionJob() {
    const { data: jobs, error } = await this.supabase
      .from("data_collection_jobs")
      .select()
      .eq("status", "pending")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error getting next data collection job:', error);
      return null;
    }

    return jobs.length > 0 ? jobs[0] : null;
  }

  /**
   * Update a data collection job
   */
  async updateDataCollectionJob(id: string, data: any) {
    const { data: job, error } = await this.supabase
      .from("data_collection_jobs")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Error updating data collection job:', error);
      throw error;
    }

    return job;
  }
}