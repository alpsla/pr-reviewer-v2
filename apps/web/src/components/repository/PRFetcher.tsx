'use client';

import React, { useState } from 'react';
// Import existing interfaces instead of redefining
import { VCSPlatform, PullRequest, PRAuthor as PullRequestAuthor } from '../../app/_dashboard_old/pr-analyzer/types';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Spinner } from '../../components/ui/spinner';
import { ExternalLink } from 'lucide-react';
import { RepositoryService } from '../../app/_dashboard_old/pr-analyzer/repository-service';

// Using imported interfaces instead of local definitions

interface PRFetcherProps {
  repositoryService: RepositoryService;
  onPRFetched?: (pr: PullRequest) => void;
  onError?: (error: Error) => void;
}

export const PRFetcher: React.FC<PRFetcherProps> = ({ 
  repositoryService,
  onPRFetched,
  onError
}) => {
  const [prUrl, setPrUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pr, setPR] = useState<PullRequest | null>(null);
  const [repoInfo, setRepoInfo] = useState<{owner: string, name: string} | null>(null);

  const parsePRUrl = (url: string): { platform: VCSPlatform; owner: string; repo: string; number: number } | null => {
    // GitHub patterns
    const githubPatterns = [
      // Full URL: https://github.com/owner/repo/pull/123
      /https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i,
      // Shortened: github/owner/repo/pull/123
      /github\/([^/]+)\/([^/]+)\/pull\/(\d+)/i,
      // github.com/owner/repo/pull/123
      /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i
    ];

    // GitLab patterns
    const gitlabPatterns = [
      // Full URL: https://gitlab.com/owner/repo/-/merge_requests/123
      /https?:\/\/gitlab\.com\/([^/]+)\/([^/]+)\/-\/merge_requests\/(\d+)/i,
      // Full URL without dash: https://gitlab.com/owner/repo/merge_requests/123
      /https?:\/\/gitlab\.com\/([^/]+)\/([^/]+)\/merge_requests\/(\d+)/i,
      // Shortened: gitlab/owner/repo/merge_requests/123
      /gitlab\/([^/]+)\/([^/]+)\/merge_requests\/(\d+)/i,
      // gitlab.com/owner/repo/merge_requests/123
      /gitlab\.com\/([^/]+)\/([^/]+)\/merge_requests\/(\d+)/i
    ];

    // Try GitHub patterns
    for (const pattern of githubPatterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[2] && match[3]) {
        return {
          platform: 'github' as VCSPlatform,
          owner: match[1],
          repo: match[2],
          number: parseInt(match[3], 10)
        };
      }
    }

    // Try GitLab patterns
    for (const pattern of gitlabPatterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[2] && match[3]) {
        return {
          platform: 'gitlab' as VCSPlatform,
          owner: match[1],
          repo: match[2],
          number: parseInt(match[3], 10)
        };
      }
    }

    return null;
  };

  // Helper function to safely format date values to strings
  const formatDateValue = (value: any): string => {
    if (!value) {return ''}
    // Use type guard to check for Date objects
    if (Object.prototype.toString.call(value) === '[object Date]') {
      return (value as Date).toISOString();
    }
    if (typeof value === 'string') {return value}
    return String(value);
  };

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case 'open':
        return 'success';
      case 'closed':
        return 'destructive';
      case 'merged':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleFetchPR = async () => {
    setIsLoading(true);
    setError(null);
    setPR(null);

    try {
      const parsed = parsePRUrl(prUrl);
      
      if (!parsed) {
        setError('Invalid PR URL format. Please use format: github/owner/repo/pull/123 or gitlab/owner/repo/merge_requests/123');
        return;
      }
      
      const { platform, owner, repo, number } = parsed;
      setRepoInfo({ owner, name: repo });

      const pullRequestResponse = await repositoryService.getPullRequest(platform, owner, repo, number);
      
      // Create a properly formatted repository object
      const formattedRepository = {
        id: pullRequestResponse.repository.id,
        owner: pullRequestResponse.repository.owner,
        name: pullRequestResponse.repository.name,
        description: '',  // Default value
        isPrivate: false, // Default value
        defaultBranch: 'main' // Default value
      };
      
      // Transform response to match PullRequest interface
      const completeRequest: PullRequest = {
        ...pullRequestResponse,
        files: [],
        additions: 0,
        deletions: 0,
        changedFiles: 0,
        repository: formattedRepository,
        // Format dates
        createdAt: formatDateValue(pullRequestResponse.createdAt),
        updatedAt: formatDateValue(pullRequestResponse.updatedAt),
        closedAt: pullRequestResponse.closedAt ? formatDateValue(pullRequestResponse.closedAt) : undefined,
        mergedAt: pullRequestResponse.mergedAt ? formatDateValue(pullRequestResponse.mergedAt) : undefined
      };
      
      setPR(completeRequest);
      
      if (onPRFetched) {
        onPRFetched(completeRequest);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch PR data';
      setError(errorMessage);
      if (onError) {
        onError(e instanceof Error ? e : new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!pr) {
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      await repositoryService.analyzePR(pr);
      // Show success message or update UI
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to analyze PR';
      setError(errorMessage);
      if (onError) {
        onError(e instanceof Error ? e : new Error(errorMessage));
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <div className="flex gap-2">
        <Input
          value={prUrl}
          onChange={e => setPrUrl(e.target.value)}
          placeholder="github/owner/repo/pull/123 or gitlab/owner/repo/merge_requests/123"
          disabled={isLoading || isAnalyzing}
          className="flex-1"
        />
        <Button
          onClick={handleFetchPR}
          disabled={isLoading || isAnalyzing || !prUrl.trim()}
          className="whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Fetching...
            </>
          ) : (
            'Fetch PR'
          )}
        </Button>
      </div>
      
      {(isLoading || isAnalyzing) && (
        <div className="flex items-center justify-center py-8">
          <Spinner className="h-8 w-8 text-primary" />
          <span className="ml-3 text-sm text-muted-foreground">
            {isAnalyzing ? 'Analyzing pull request...' : 'Fetching pull request data...'}
          </span>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {pr && !error && !isLoading && !isAnalyzing && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant={pr.platform === 'github' ? 'default' : 'outline'}>
                {pr.platform}
              </Badge>
              <CardTitle>{pr.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <a 
                  href={pr.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  {pr.platform === 'github' ? 'Pull Request' : 'Merge Request'} #{pr.number}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-muted-foreground">
                  in {repoInfo?.owner}/{repoInfo?.name}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <Badge variant={getStateBadgeVariant(pr.state)}>
                    {pr.state}
                  </Badge>
                  <span className="text-muted-foreground">
                    by {pr.author.login}
                  </span>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Branches:</span>{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {pr.headRef}
                </code>{' '}
                →{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {pr.baseRef}
                </code>
              </div>
              
              {pr.labels && pr.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pr.labels.map(label => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
              
              {pr.description && (
                <div className="mt-4 text-sm text-muted-foreground line-clamp-3">
                  {pr.description}
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="default" 
                  className="ml-auto"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};