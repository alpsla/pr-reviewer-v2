import { GitBranch, Github } from 'lucide-react';
import GitlabIcon from '@/components/ui/icons/gitlab-icon';
import { formatRelativeDate } from '@/lib/utils';

interface RecentPRsProps {
  onSelect: (url: string) => void;
}

export function RecentPRs({ onSelect }: RecentPRsProps) {
  // Mock data - in a real app this would come from an API or local storage
  const recentPRs = [
    {
      title: 'Update dependencies and fix layout issues',
      repository: 'acme/widget-service',
      url: 'https://github.com/acme/widget-service/pull/123',
      platform: 'github',
      lastAccessed: '2025-02-25T14:22:00Z',
    },
    {
      title: 'Fix API rate limiting',
      repository: 'acme/user-api',
      url: 'https://github.com/acme/user-api/pull/87',
      platform: 'github',
      lastAccessed: '2025-02-20T09:15:00Z',
    },
    {
      title: 'Implement new dashboard',
      repository: 'personal/side-project',
      url: 'https://gitlab.com/personal/side-project/merge_requests/12',
      platform: 'gitlab',
      lastAccessed: '2025-02-18T16:40:00Z',
    }
  ];
  
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
            onClick={() => onSelect(pr.url)}
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
                  {pr.title}
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
