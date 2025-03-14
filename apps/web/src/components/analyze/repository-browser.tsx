import { useState } from 'react';
import { Search, GitBranch, ChevronDown, ChevronUp, Github } from 'lucide-react';
import GitlabIcon from '@/components/ui/icons/gitlab-icon';

interface RepoType {
  id: string;
  name: string;
  fullName: string;
  platform: 'github' | 'gitlab';
  openPRs: {
    id: string;
    title: string;
    url: string;
    updatedAt: string;
  }[];
}

interface RepositoryBrowserProps {
  onSelect: (url: string) => void;
}

export function RepositoryBrowser({ onSelect }: RepositoryBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRepos, setExpandedRepos] = useState<string[]>([]);
  
  // Mock data - in a real app this would come from an API
  const connectedRepositories: RepoType[] = [
    {
      id: 'repo1',
      name: 'widget-service',
      fullName: 'acme/widget-service',
      platform: 'github',
      openPRs: [
        {
          id: 'pr1',
          title: 'Update dependencies and fix layout issues',
          url: 'https://github.com/acme/widget-service/pull/123',
          updatedAt: '2025-02-25T14:22:00Z'
        },
        {
          id: 'pr2',
          title: 'Add user authentication flow',
          url: 'https://github.com/acme/widget-service/pull/124',
          updatedAt: '2025-02-26T11:15:00Z'
        }
      ]
    },
    {
      id: 'repo2',
      name: 'user-api',
      fullName: 'acme/user-api',
      platform: 'github',
      openPRs: [
        {
          id: 'pr3',
          title: 'Fix API rate limiting',
          url: 'https://github.com/acme/user-api/pull/87',
          updatedAt: '2025-02-20T09:15:00Z'
        }
      ]
    },
    {
      id: 'repo3',
      name: 'side-project',
      fullName: 'personal/side-project',
      platform: 'gitlab',
      openPRs: [
        {
          id: 'pr4',
          title: 'Implement new dashboard',
          url: 'https://gitlab.com/personal/side-project/merge_requests/12',
          updatedAt: '2025-02-18T16:40:00Z'
        }
      ]
    }
  ];
  
  const toggleRepoExpansion = (repoId: string) => {
    if (expandedRepos.includes(repoId)) {
      setExpandedRepos(expandedRepos.filter(id => id !== repoId));
    } else {
      setExpandedRepos([...expandedRepos, repoId]);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  // Filter repositories based on search query
  const filteredRepos = connectedRepositories.filter(repo => 
    repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
        Browse Connected Repositories
      </h2>
      
      {/* Search bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Repository list */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <div 
              key={repo.id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
            >
              {/* Repository header */}
              <div 
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 cursor-pointer"
                onClick={() => toggleRepoExpansion(repo.id)}
              >
                <div className="flex items-center">
                  {repo.platform === 'github' ? (
                    <Github className="h-4 w-4 text-slate-700 dark:text-slate-300 mr-2" />
                  ) : (
                    <GitlabIcon className="h-4 w-4 text-slate-700 dark:text-slate-300 mr-2" />
                  )}
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {repo.fullName}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full px-2 py-1 mr-2">
                    {repo.openPRs.length} PR{repo.openPRs.length !== 1 ? 's' : ''}
                  </span>
                  {expandedRepos.includes(repo.id) ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </div>
              
              {/* Expanded PR list */}
              {expandedRepos.includes(repo.id) && (
                <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                  {repo.openPRs.length > 0 ? (
                    <div className="space-y-2">
                      {repo.openPRs.map((pr) => (
                        <div 
                          key={pr.id}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer"
                          onClick={() => onSelect(pr.url)}
                        >
                          <div className="flex items-start">
                            <GitBranch className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                                {pr.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Updated {formatDate(pr.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
                      No open pull requests
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            No repositories found
          </p>
        )}
      </div>
    </div>
  );
}
