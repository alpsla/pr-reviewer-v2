import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export class DatabaseService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createUser(data: Database['public']['Tables']['users']['Insert']) {
    const { data: user, error } = await this.supabase
      .from('users')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  async getUser(id: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return user;
  }

  async getUserByGithubId(githubId: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select()
      .eq('github_id', githubId)
      .single();

    if (error) throw error;
    return user;
  }

  async updateUser(id: string, data: Database['public']['Tables']['users']['Update']) {
    const { data: user, error } = await this.supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  async createRepository(data: Database['public']['Tables']['repositories']['Insert']) {
    const { data: repository, error } = await this.supabase
      .from('repositories')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return repository;
  }

  async getRepositoryByOwnerAndName(owner: string, name: string) {
    const { data: repository, error } = await this.supabase
      .from('repositories')
      .select()
      .eq('owner', owner)
      .eq('name', name)
      .single();

    if (error) throw error;
    return repository;
  }

  async createPullRequest(data: Database['public']['Tables']['pull_requests']['Insert']) {
    const { data: pullRequest, error } = await this.supabase
      .from('pull_requests')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return pullRequest;
  }

  async getPullRequest(id: string) {
    const { data: pullRequest, error } = await this.supabase
      .from('pull_requests')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return pullRequest;
  }

  async createAnalysisJob(data: Database['public']['Tables']['analysis_queue']['Insert']) {
    const { data: job, error } = await this.supabase
      .from('analysis_queue')
      .insert({
        ...data,
        status: 'pending' as Database['public']['Enums']['analysis_status']
      })
      .select()
      .single();

    if (error) throw error;
    return job;
  }

  async getNextAnalysisJob() {
    const { data: jobs, error } = await this.supabase
      .from('analysis_queue')
      .select()
      .eq('status', 'pending')
      .order('created_at')
      .limit(1);

    if (error) throw error;
    return jobs[0] || null;
  }
}