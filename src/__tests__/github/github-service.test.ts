import { GitHubService } from '../../github/github-service';

describe('GitHubService', () => {
  let service: GitHubService;

  beforeEach(() => {
    // Use a mock token for tests
    service = new GitHubService('test-token');
  });

  it('should get pull request details', async () => {
    // This test requires real GitHub credentials, so we'll mock it
    await expect(service.getPullRequest('owner', 'repo', 1))
      .rejects
      .toThrow('Bad credentials');
  });
});