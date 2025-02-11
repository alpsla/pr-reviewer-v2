import { DatabaseService } from '../../supabase/database';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

export class TestDatabaseService extends DatabaseService {
  createUser = jest.fn();
  getUser = jest.fn();
  getUserByGithubId = jest.fn();
  updateUser = jest.fn();
  createRepository = jest.fn();
  getRepositoryByOwnerAndName = jest.fn();
  createPullRequest = jest.fn();
  getPullRequest = jest.fn();
  createAnalysisJob = jest.fn();
  getNextAnalysisJob = jest.fn();

  constructor() {
    super({} as SupabaseClient<Database>);
    this.initializeMocks();
  }

  private initializeMocks(): void {
    this.createUser.mockImplementation((data) => Promise.resolve(data));
    this.getUser.mockImplementation((id) => Promise.resolve({ id }));
    this.getUserByGithubId.mockImplementation((id) => Promise.resolve({ github_id: id }));
    this.updateUser.mockImplementation((id, data) => Promise.resolve({ id, ...data }));
    this.createRepository.mockImplementation((data) => Promise.resolve(data));
    this.getRepositoryByOwnerAndName.mockImplementation((owner, name) => 
      Promise.resolve({ owner, name, full_name: `${owner}/${name}` }));
    this.createPullRequest.mockImplementation((data) => Promise.resolve(data));
    this.getPullRequest.mockImplementation((id) => Promise.resolve({ id }));
    this.createAnalysisJob.mockImplementation((data) => Promise.resolve(data));
    this.getNextAnalysisJob.mockImplementation(() => Promise.resolve(null));
  }
}