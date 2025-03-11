import { GitBranch, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RecentRepositoriesProps {
  onSelect: (url: string) => void;
}

interface Repository {
  name: string;
  owner: string;
  url: string;
  platform: string;
  lastAccessed: string;
  starred?: boolean;
}

export function RecentRepositories({ onSelect }: RecentRepositoriesProps) {
  const [recentRepos, setRecentRepos] = useState<Repository[]>([]);
  
  // Load repositories from localStorage on mount
  useEffect(() => {
    try {
      const storedRepos = localStorage.getItem('recentRepositories');
      if (storedRepos) {
        setRecentRepos(JSON.parse(storedRepos));
      }
    } catch (error) {
      console.error('Error loading recent repositories:', error);
    }
  }, []);
  
  // Function to handle selection and update localStorage
  const handleRepoSelect = (repo: Repository) => {
    try {
      // Update the lastAccessed timestamp
      const updatedRepo = { ...repo, lastAccessed: new Date().toISOString() };
      
      // Find the repo in the current list
      const updatedRepos = recentRepos.filter(r => r.url !== repo.url);
      
      // Add the updated repo to the beginning of the list
      updatedRepos.unshift(updatedRepo);
      
      // Limit to 5 most recent repos
      const limitedRepos = updatedRepos.slice(0, 5);
      
      // Update state and localStorage
      setRecentRepos(limitedRepos);
      localStorage.setItem('recentRepositories', JSON.stringify(limitedRepos));
      
      // Call the onSelect prop
      onSelect(repo.url);
    } catch (error) {
      console.error('Error updating recent repositories:', error);
      onSelect(repo.url); // Still call onSelect even if there's an error
    }
  };
  
  // Parse URL to extract owner/repo format
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
        Recent Repositories
      </h2>
      
      <div className="space-y-2">
        {recentRepos.map((repo) => (
          <div 
            key={repo.url}
            className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700 cursor-pointer transition-colors"
            onClick={() => handleRepoSelect(repo)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GitBranch className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {extractRepoName(repo.url)}
                </span>
              </div>
              {repo.starred && (
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              )}
            </div>
            
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {repo.platform === 'github' ? 'GitHub' : 'GitLab'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(repo.lastAccessed)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {recentRepos.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
          No recent repositories
        </p>
      )}
    </div>
  );
}
