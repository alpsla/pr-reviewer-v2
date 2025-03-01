import { VCSPlatform } from '../../types/platform';
import { Repository } from '../../repository/types';

export class MockDatabaseService {
  private repos: Map<string, Repository> = new Map();

  async getRepository(owner: string, name: string): Promise<Repository | null> {
    const key = `${owner}/${name}`;
    return this.repos.get(key) || null;
  }

  async storeRepository(repo: Repository): Promise<void> {
    const key = `${repo.owner}/${repo.name}`;
    this.repos.set(key, repo);
  }

  generateTestRepo(owner: string, name: string, platform: VCSPlatform = 'github'): Repository {
    return {
      id: `${platform}-${owner}-${name}`,
      platform,
      externalId: `12345`,
      owner,
      name,
      fullName: `${owner}/${name}`,
      description: `Test repository ${owner}/${name}`,
      private: false,
      defaultBranch: 'main',
      url: `https://github.com/${owner}/${name}`,
      language: 'TypeScript',
      topics: ['testing', 'mock'],
      permissions: {
        admin: true,
        push: true,
        pull: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}