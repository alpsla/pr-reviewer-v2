import { GitBranch, Star } from 'lucide-react';

interface RecentRepositoriesProps {
  onSelect: (url: string) => void;
}

export function RecentRepositories({ onSelect }: RecentRepositoriesProps) {
  // Mock data - in a real app this would come from an API or local storage
  const recentRepos = [
    {
      name: 'acme/widget-service',
      url: 'https://github.com/acme/widget-service/pull/123',
      platform: 'github',
      lastAccessed: '2025-02-25T14:22:00Z',
      starred: true
    },
    {
      name: 'acme/user-api',
      url: 'https://github.com/acme/user-api/pull/87',
      platform: 'github',
      lastAccessed: '2025-02-20T09:15:00Z',
      starred: false
    },
    {
      name: 'personal/side-project',
      url: 'https://gitlab.com/personal/side-project/merge_requests/12',
      platform: 'gitlab',
      lastAccessed: '2025-02-18T16:40:00Z',
      starred: true
    }
  ];
  
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
            onClick={() => onSelect(repo.url)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GitBranch className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-2" />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {repo.name}
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
