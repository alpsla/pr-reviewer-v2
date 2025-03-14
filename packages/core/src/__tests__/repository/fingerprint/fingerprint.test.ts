import { createRepositoryFingerprint, isSameRepository, AnalysisLimitError } from '../../../repository/fingerprint';
import { VCSPlatform } from '../../../types/platform';

describe('Repository Fingerprinting', () => {
  describe('createRepositoryFingerprint', () => {
    it('should create consistent fingerprints for the same repository', () => {
      const fingerprint1 = createRepositoryFingerprint('github', 'octocat', 'hello-world');
      const fingerprint2 = createRepositoryFingerprint('github', 'octocat', 'hello-world');
      
      expect(fingerprint1).toBe(fingerprint2);
    });

    it('should create different fingerprints for different repositories', () => {
      const fingerprint1 = createRepositoryFingerprint('github', 'octocat', 'hello-world');
      const fingerprint2 = createRepositoryFingerprint('github', 'octocat', 'different-repo');
      
      expect(fingerprint1).not.toBe(fingerprint2);
    });

    it('should handle normalized inputs (lowercase, trim spaces)', () => {
      const fingerprint1 = createRepositoryFingerprint('github', 'OctoCat', 'Hello-World');
      const fingerprint2 = createRepositoryFingerprint('github', 'octocat', 'hello-world');
      const fingerprint3 = createRepositoryFingerprint('github', ' octocat ', ' hello-world ');
      
      expect(fingerprint1).toBe(fingerprint2);
      expect(fingerprint2).toBe(fingerprint3);
    });

    it('should differentiate platforms', () => {
      const githubFingerprint = createRepositoryFingerprint('github', 'octocat', 'hello-world');
      const gitlabFingerprint = createRepositoryFingerprint('gitlab', 'octocat', 'hello-world');
      
      expect(githubFingerprint).not.toBe(gitlabFingerprint);
    });
  });

  describe('isSameRepository', () => {
    it('should identify the same repository correctly', () => {
      const repoA = { platform: 'github' as VCSPlatform, owner: 'octocat', name: 'hello-world' };
      const repoB = { platform: 'github' as VCSPlatform, owner: 'octocat', name: 'hello-world' };
      
      expect(isSameRepository(repoA, repoB)).toBe(true);
    });

    it('should identify different repositories correctly', () => {
      const repoA = { platform: 'github' as VCSPlatform, owner: 'octocat', name: 'hello-world' };
      const repoB = { platform: 'github' as VCSPlatform, owner: 'different', name: 'hello-world' };
      const repoC = { platform: 'github' as VCSPlatform, owner: 'octocat', name: 'different-repo' };
      const repoD = { platform: 'gitlab' as VCSPlatform, owner: 'octocat', name: 'hello-world' };
      
      expect(isSameRepository(repoA, repoB)).toBe(false);
      expect(isSameRepository(repoA, repoC)).toBe(false);
      expect(isSameRepository(repoA, repoD)).toBe(false);
    });

    it('should handle case insensitivity', () => {
      const repoA = { platform: 'github' as VCSPlatform, owner: 'OctoCat', name: 'Hello-World' };
      const repoB = { platform: 'github' as VCSPlatform, owner: 'octocat', name: 'hello-world' };
      
      expect(isSameRepository(repoA, repoB)).toBe(true);
    });
  });

  describe('AnalysisLimitError', () => {
    it('should create an error with the correct properties', () => {
      const message = 'Repository has reached free tier limit';
      const repoId = '12345';
      const owner = 'octocat';
      const name = 'hello-world';
      const current = 5;
      const limit = 5;
      
      const error = new AnalysisLimitError(
        message,
        repoId,
        owner,
        name,
        current,
        limit
      );
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.repositoryId).toBe(repoId);
      expect(error.owner).toBe(owner);
      expect(error.name).toBe(name);
      expect(error.current).toBe(current);
      expect(error.limit).toBe(limit);
    });
  });
});
