import { useState } from 'react';
import { Search, Github, GitBranch } from 'lucide-react';
import GitlabIcon from '@/components/ui/icons/gitlab-icon';
import { formatRelativeDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RepositoriesProps {
  onSelect: (url: string) => void;
}

export function Repositories({ onSelect }: RepositoriesProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mock data - in a real app this would come from an API
  const repositories = [
    {
      name: 'acme/widget-service',
      platform: 'github',
      lastAccessed: '2025-02-25T14:22:00Z',
      recent: true,
      prs: [
        {
          id: 123,
          title: 'Update dependencies and fix layout issues',
          url: 'https://github.com/acme/widget-service/pull/123',
          createdAt: '2025-02-15T10:30:00Z'
        }
      ]
    },
    {
      name: 'acme/user-api',
      platform: 'github',
      lastAccessed: '2025-02-20T09:15:00Z',
      recent: true,
      prs: [
        {
          id: 87,
          title: 'Fix API rate limiting',
          url: 'https://github.com/acme/user-api/pull/87',
          createdAt: '2025-02-20T09:10:00Z'
        }
      ]
    },
    {
      name: 'personal/side-project',
      platform: 'gitlab',
      lastAccessed: '2025-02-18T16:40:00Z',
      recent: true,
      prs: [
        {
          id: 12,
          title: 'Implement new dashboard',
          url: 'https://gitlab.com/personal/side-project/merge_requests/12',
          createdAt: '2025-02-18T16:35:00Z'
        }
      ]
    },
    {
      name: 'acme/design-system',
      platform: 'github',
      lastAccessed: '2025-01-15T11:20:00Z',
      recent: false,
      prs: []
    },
    {
      name: 'acme/analytics-dashboard',
      platform: 'github',
      lastAccessed: '2025-01-10T14:30:00Z',
      recent: false,
      prs: []
    }
  ];
  
  // Filter repositories based on search query
  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get recent repositories (those accessed in the last 30 days)
  const recentRepositories = filteredRepositories.filter(repo => repo.recent);
  
  // Get other repositories (not recently accessed)
  const otherRepositories = filteredRepositories.filter(repo => !repo.recent);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-4">
      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search repositories..."
          className="w-full pl-10 pr-4 py-2 rounded-md text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm focus:shadow-md transition-all duration-200"
        />
      </div>
      
      {/* Recent repositories section */}
      {recentRepositories.length > 0 && (
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Recently Accessed
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {formatRelativeDate(recentRepositories[0].lastAccessed)}
            </span>
          </div>
          
          <div className="space-y-2">
            {recentRepositories.map((repo) => (
              <div key={repo.name} className="space-y-1">
                {/* Repository header */}
                <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 mb-1">
                  {repo.platform === 'github' ? (
                    <Github className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <GitlabIcon className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                  )}
                  <span className="font-medium">{repo.name}</span>
                </div>
                
                {/* Recent PRs */}
                {repo.prs.length > 0 && (
                  <div className="pl-6 space-y-1.5">
                    {repo.prs.map((pr) => (
                      <div 
                        key={pr.id}
                        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-start transition-colors hover:shadow-sm"
                        onClick={() => onSelect(pr.url)}
                      >
                        <GitBranch className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
                            {pr.title}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            #{pr.id} • {formatRelativeDate(pr.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* All Connected Repositories section */}
      {otherRepositories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            All Connected Repositories
          </h3>
          
          <div className="space-y-1">
            {otherRepositories.map((repo) => (
              <div 
                key={repo.name}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center transition-colors hover:shadow-sm"
                onClick={() => {
                  // In a real app, this would navigate to the repository's PRs
                  // or open a modal to select a PR
                  console.log(`Selected repository: ${repo.name}`);
                }}
              >
                {repo.platform === 'github' ? (
                  <Github className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                ) : (
                  <GitlabIcon className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                )}
                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                  {repo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {filteredRepositories.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchQuery ? (
              `No repositories matching "${searchQuery}"`
            ) : (
              "No repositories connected"
            )}
          </p>
          {searchQuery && (
            <button 
              className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          )}
        </div>
      )}
      
      {/* Connect New Repository button */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button 
          className="w-full py-2 px-3 text-sm text-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border-none shadow-sm hover:shadow-md transition-all duration-200"
        >
          Connect New Repository
        </Button>
      </div>
    </div>
  );
}