import { Octokit } from '@octokit/rest';
import type { GitHubPullRequest, GitHubRepository } from '../types/github';

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const { data } = await this.octokit.repos.get({
      owner,
      repo,
    });
    return data as GitHubRepository;
  }

  async getPullRequest(owner: string, repo: string, number: number): Promise<GitHubPullRequest> {
    const { data } = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: number,
    });
    return data as GitHubPullRequest;
  }
}

export const createGitHubService = (token: string) => new GitHubService(token);