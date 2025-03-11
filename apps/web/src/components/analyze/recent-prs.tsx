import { GitBranch, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import GitlabIcon from '@/components/ui/icons/gitlab-icon';
import { formatRelativeDate } from '@/lib/utils';

interface RecentPRsProps {
  onSelect: (url: string) => void;
}

interface PullRequest {
  title?: string;
  repository: string;
  url: string;
  platform: string;
  lastAccessed: string;
}

export function RecentPRs({ onSelect }: RecentPRsProps) {
  const [recentPRs, setRecentPRs] = useState<PullRequest[]>([]);
  
  // Load PRs from localStorage on mount
  useEffect(() => {
    try {
      const storedPRs = localStorage.getItem('recentPRs');
      if (storedPRs) {
        setRecentPRs(JSON.parse(storedPRs));
      } else {
        // If there's no stored PRs, we can extract from repositories
        const storedRepos = localStorage.getItem('recentRepositories');
        if (storedRepos) {
          const repos = JSON.parse(storedRepos);
          // Convert repos to PRs if they have PR URLs
          const prs: PullRequest[] = repos
            .filter((repo: any) => {
              return (
                repo.url.includes('/pull/') || 
                repo.url.includes('/merge_requests/')
              );
            })
            .map((repo: any) => ({
              url: repo.url,
              repository: extractRepoName(repo.url),
              platform: repo.platform || determinePlatform(repo.url),
              lastAccessed: repo.lastAccessed,
              title: extractPRTitle(repo.url) || 'Pull Request'
            }));
            
          if (prs.length > 0) {
            setRecentPRs(prs);
            localStorage.setItem('recentPRs', JSON.stringify(prs));
          }
        }
      }
    } catch (error) {
      console.error('Error loading recent PRs:', error);
    }
  }, []);
  
  // Function to handle selection and update localStorage
  const handlePrSelect = (pr: PullRequest) => {
    try {
      // Update the lastAccessed timestamp
      const updatedPR = { ...pr, lastAccessed: new Date().toISOString() };
      
      // Find the PR in the current list
      const updatedPRs = recentPRs.filter(p => p.url !== pr.url);
      
      // Add the updated PR to the beginning of the list
      updatedPRs.unshift(updatedPR);
      
      // Limit to 5 most recent PRs
      const limitedPRs = updatedPRs.slice(0, 5);
      
      // Update state and localStorage
      setRecentPRs(limitedPRs);
      localStorage.setItem('recentPRs', JSON.stringify(limitedPRs));
      
      // Call the onSelect prop
      onSelect(pr.url);
    } catch (error) {
      console.error('Error updating recent PRs:', error);
      onSelect(pr.url); // Still call onSelect even if there's an error
    }
  };
  
  // Extract repo name from URL
  const extractRepoName = (url: string): string => {
    try {
      let match;
      if (url.includes('github.com')) {
        match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
      } else if (url.includes('gitlab.com')) {
        match = url.match(/gitlab\.com\/([^\/]+\/[^\/]+)/);
      }
      return match ? match[1] : url;
    } catch (error) {
      return url;
    }
  };
  
  // Determine platform from URL
  const determinePlatform = (url: string): string => {
    if (url.includes('github.com')) return 'github';
    if (url.includes('gitlab.com')) return 'gitlab';
    return 'github'; // Default
  };
  
  // Extract PR title (in a real app, this would come from API)
  const extractPRTitle = (url: string): string | null => {
    // In a real app, you would have the actual PR title
    // For now, just extract PR number as a placeholder
    try {
      let match;
      if (url.includes('github.com')) {
        match = url.match(/\/pull\/(\d+)/);
      } else if (url.includes('gitlab.com')) {
        match = url.match(/\/merge_requests\/(\d+)/);
      }
      return match ? `Pull Request #${match[1]}` : null;
    } catch (error) {
      return null;
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Recent Pull Requests
      </h2>
      
      <div className="space-y-2">
        {recentPRs.map((pr) => (
          <div 
            key={pr.url}
            className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700 cursor-pointer transition-colors"
            onClick={() => handlePrSelect(pr)}
          >
            <div className="flex items-start space-x-3">
              {/* Platform icon */}
              <div className="mt-0.5">
                {pr.platform === 'github' ? (
                  <Github className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                ) : (
                  <GitlabIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                )}
              </div>
              
              {/* PR details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {pr.title || 'Pull Request'}
                </p>
                <div className="flex items-center mt-1">
                  <GitBranch className="h-3 w-3 text-slate-400 dark:text-slate-500 mr-1" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">
                    {pr.repository}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formatRelativeDate(pr.lastAccessed)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {recentPRs.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
          No recent pull requests
        </p>
      )}
    </div>
  );
}
