import { RepositoryProcessor } from '../../repository/processor';
import { DatabaseService } from '../../supabase/database-service';
import { RepositoryService } from '../../repository/repository-service';
import { PRAnalysisStatus } from '../../types';

// Mock the database and repository services
const mockDatabaseService = {
  storePullRequest: jest.fn().mockResolvedValue('pr-123'),
  createAnalysisQueue: jest.fn().mockResolvedValue('queue-123')
} as unknown as DatabaseService;

const mockRepositoryService = {
  getPullRequest: jest.fn().mockResolvedValue({
    id: 'pr-123',
    repositoryId: 'repo-123',
    number: 1,
    title: 'Test PR',
    description: 'Test description',
    authorLogin: 'testuser',
    baseBranch: 'main',
    headBranch: 'feature',
    state: 'open',
    url: 'https://github.com/test/test/pull/1',
    stats: {
      additions: 10,
      deletions: 5,
      changedFiles: 3
    }
  }),
  getPullRequestFiles: jest.fn().mockResolvedValue([
    {
      id: 'file-1',
      path: 'test.ts',
      stats: {
        additions: 10,
        deletions: 5,
        changes: 15
      }
    }
  ])
} as unknown as RepositoryService;

describe('RepositoryProcessor', () => {
  let processor: RepositoryProcessor;

  beforeEach(() => {
    jest.clearAllMocks();
    processor = new RepositoryProcessor(mockRepositoryService, mockDatabaseService);
  });

  it('processes PR and queues for analysis', async () => {
    const result = await processor.processPR('github', 'test', 'test', 1);

    expect(result.prId).toBe('pr-123');
    expect(mockDatabaseService.storePullRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        repository_id: 'repo-123',
        number: 1,
        title: 'Test PR'
      })
    );
    expect(mockDatabaseService.createAnalysisQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        pull_request_id: 'pr-123',
        status: PRAnalysisStatus.PENDING
      })
    );
  });

  it('analyzes PR languages correctly', async () => {
    const languages = await processor.analyzePRLanguages('github', 'test', 'test', 1);

    expect(languages).toHaveLength(1);
    expect(languages[0]).toEqual(expect.objectContaining({
      language: 'TypeScript',
      files: 1,
      linesOfCode: 15, // additions + deletions
      percentage: 100
    }));
  });
});