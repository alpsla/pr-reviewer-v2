// Path: /Users/alpinro/Code Prjects/pr-reviewer-v2/apps/web/src/components/analyze/repositories.tsx

import { useState, useEffect } from 'react';
import { Search, Github, GitBranch, Fingerprint, BarChart, Database, Wrench, PlusCircle, RefreshCw } from 'lucide-react';
import GitlabIcon from '@/components/ui/icons/gitlab-icon';
import { formatRelativeDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRepositoryAnalysis } from '@/hooks/use-repository-analysis';

interface Repository {
  id: string;
  name: string;
  platform: string;
  owner: string;
  repoName: string;
  lastAccessed: string;
  isPrivate?: boolean;
  analysisCount: number;
  analysisLimit: number;
  fingerprint: string;
  url?: string;
  prs?: Array<{
    id: number;
    title: string;
    url: string;
    createdAt: string;
  }>;
}

interface RepositoriesProps {
  onSelect: (url: string) => void;
}

export function Repositories({ onSelect }: RepositoriesProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [recentRepositories, setRecentRepositories] = useState<Repository[]>([]);
  const [olderRepositories, setOlderRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [schemaInfo, setSchemaInfo] = useState<any>(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [createTestResult, setCreateTestResult] = useState<any>(null);
  const [createTestLoading, setCreateTestLoading] = useState(false);
  const [createTestError, setCreateTestError] = useState<string | null>(null);
  const [addColumnLoading, setAddColumnLoading] = useState(false);
  const [addColumnResult, setAddColumnResult] = useState<any>(null);
  const [addColumnError, setAddColumnError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<{
    github?: boolean;
    gitlab?: boolean;
  }>({});
  const [checkingAuth, setCheckingAuth] = useState(false);
  
  // Use the repository analysis hook
  const { getAnalysisLimits } = useRepositoryAnalysis();

  // Make fetchRepositories a reusable function outside of useEffect
  const fetchRepositories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/repository/list');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch repositories');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRepositories(data.repositories || []);
        setRecentRepositories(data.recentRepositories || []);
        setOlderRepositories(data.olderRepositories || []);
      } else {
        throw new Error(data.message || 'Failed to fetch repositories');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching repositories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch repositories when component mounts
  useEffect(() => {
    fetchRepositories();
    checkAuthStatus();
    // No automatic refresh - let the user control when to refresh
  }, []);

  // Direct increment utility function
  const testDirectIncrement = async (repo: Repository) => {
    try {
      // Update repository limits first
      if (repo.owner && repo.repoName) {
        try {
          const updatedLimits = await getAnalysisLimits({
            platform: repo.platform || 'github',
            owner: repo.owner,
            repo: repo.repoName
          });
          
          if (updatedLimits) {
            // Update the repository in state with new limits
            const updatedRepo = {
            ...repo,
            analysisCount: updatedLimits.current || 0,
            analysisLimit: updatedLimits.limit || 5
            };
            
            // Update recentRepositories and olderRepositories
            setRecentRepositories(prev => prev.map(r => r.id === repo.id ? updatedRepo : r));
            setOlderRepositories(prev => prev.map(r => r.id === repo.id ? updatedRepo : r));
          }
        } catch (err) {
          console.error('Error fetching updated limits:', err);
        }
      }
      
      // Then increment directly
      const response = await fetch('/api/repository/direct-increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: repo.platform || 'github',
          owner: repo.owner,
          repo: repo.repoName
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to increment repository');
      }
      
      const data = await response.json();
      console.log('Direct increment success:', data);
      
      // Refresh the limits again after incrementation
      if (repo.owner && repo.repoName) {
        try {
          const updatedLimits = await getAnalysisLimits({
            platform: repo.platform || 'github',
            owner: repo.owner,
            repo: repo.repoName
          });
          
          if (updatedLimits) {
            // Update the repository in state with new limits
            const updatedRepo = {
            ...repo,
            analysisCount: updatedLimits.current || 0,
            analysisLimit: updatedLimits.limit || 5
            };
            
            // Update recentRepositories and olderRepositories
            setRecentRepositories(prev => prev.map(r => r.id === repo.id ? updatedRepo : r));
            setOlderRepositories(prev => prev.map(r => r.id === repo.id ? updatedRepo : r));
          }
        } catch (err) {
          console.error('Error fetching updated limits after increment:', err);
        }
      }
      
      // Continue with the original action
      onSelect(createPrUrl(repo));
    } catch (error) {
      console.error('Error in direct increment:', error);
      // Continue with original action anyway
      onSelect(createPrUrl(repo));
    }
  };

  // Check authentication status
  const checkAuthStatus = async () => {
    setCheckingAuth(true);
    
    try {
      const response = await fetch('/api/repository/test-token');
      
      if (!response.ok) {
        setAuthStatus({});
        return;
      }
      
      const data = await response.json();
      
      setAuthStatus({
        github: !!data.tokens?.github,
        gitlab: !!data.tokens?.gitlab
      });
    } catch (err) {
      console.error('Error checking auth status:', err);
      setAuthStatus({});
    } finally {
      setCheckingAuth(false);
    }
  };
  
  // Fix duplicates in the database
  const fixDuplicates = async () => {
    try {
      const response = await fetch('/api/database/fix-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fix duplicates');
      }
      
      const data = await response.json();
      console.log('Fix duplicates response:', data);
      
      alert(`Fixed duplicates: ${data.message}\n\nYou may need to refresh the page to see the changes.`);
    } catch (error) {
      console.error('Error fixing duplicates:', error);
      alert(`Error fixing duplicates: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Check database schema
  const checkSchema = async () => {
    setSchemaLoading(true);
    
    try {
      const response = await fetch('/api/repository/schema-info');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch schema info');
      }
      
      const data = await response.json();
      setSchemaInfo(data);
    } catch (err) {
      console.error('Error fetching schema info:', err);
    } finally {
      setSchemaLoading(false);
    }
  };
  
  // Create test repository
  const createTestRepository = async (platform: string, owner: string, repo: string) => {
    setCreateTestLoading(true);
    setCreateTestResult(null);
    setCreateTestError(null);
    
    try {
      const response = await fetch('/api/repository/create-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, owner, repo }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create test repository');
      }
      
      setCreateTestResult(data);
    } catch (err) {
      setCreateTestError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error creating test repository:', err);
    } finally {
      setCreateTestLoading(false);
    }
  };

  // Add platform column to repositories table
  const addPlatformColumn = async () => {
    setAddColumnLoading(true);
    setAddColumnResult(null);
    setAddColumnError(null);
    
    try {
      // First try the add-platform-column endpoint
      let response = await fetch('/api/repository/add-platform-column');
      
      if (!response.ok) {
        // If that fails, try the execute-sql endpoint
        response = await fetch('/api/database/execute-sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            sql: 'ALTER TABLE repositories ADD COLUMN IF NOT EXISTS platform text DEFAULT \'github\'' 
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.error || 'Failed to add platform column');
        }
      }
      
      const data = await response.json();
      setAddColumnResult(data);
      
      // Refresh schema info to confirm the column was added
      await checkSchema();
    } catch (err) {
      setAddColumnError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error adding platform column:', err);
    } finally {
      setAddColumnLoading(false);
    }
  };

  // Handle login with GitHub
  const loginWithGitHub = () => {
    window.location.href = '/api/auth/login/github?redirect=' + encodeURIComponent(window.location.pathname);
  };
  
  // Filter repositories based on search query
  const filteredRecentRepos = recentRepositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredOlderRepos = olderRepositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDetails = (repoId: string) => {
    if (showDetails === repoId) {
      setShowDetails(null);
    } else {
      setShowDetails(repoId);
    }
  };
  
  // Create sample PR URL for testing
  const createPrUrl = (repo: Repository) => {
    if (repo.platform === 'github') {
      return `https://github.com/${repo.owner}/${repo.repoName}/pull/1`;
    } else {
      return `https://gitlab.com/${repo.owner}/${repo.repoName}/merge_requests/1`;
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-4">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Repositories
        </h3>
        <button 
          onClick={() => fetchRepositories()}
          className="text-xs flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="h-3 w-3 mr-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></span>
              Refreshing...
            </span>
          ) : (
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </span>
          )}
        </button>
      </div>

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

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">
            {error}
          </p>
          <button 
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Recent repositories section */}
      {!isLoading && !error && filteredRecentRepos.length > 0 && (
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Recently Accessed
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {filteredRecentRepos.length > 0 && 
                formatRelativeDate(filteredRecentRepos[0].lastAccessed)}
            </span>
          </div>
          
          <div className="space-y-2">
            {filteredRecentRepos.map((repo) => (
              <div key={repo.id} className="space-y-1">
                {/* Repository header */}
                <div 
                  className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 mb-1 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer"
                  onClick={() => toggleDetails(repo.id)}
                >
                  <div className="flex items-center">
                    {repo.platform === 'github' ? (
                      <Github className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                    ) : (
                      <GitlabIcon className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                    )}
                    <span className="font-medium">{repo.name}</span>
                    {repo.isPrivate && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        Private
                      </span>
                    )}
                  </div>
                  
                  {/* Analysis usage indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs">
                      <BarChart className="h-3 w-3 mr-1 text-slate-400" />
                      <span>
                      {repo.analysisCount !== undefined ? repo.analysisCount : 0}/{repo.analysisLimit !== undefined ? repo.analysisLimit : 5}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Repository details (visible when expanded) */}
                {showDetails === repo.id && (
                  <div className="pl-6 space-y-2 py-2 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                    {/* Analysis stats */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Analysis count:</span>
                      <span className="font-medium">{repo.analysisCount !== undefined ? repo.analysisCount : 0} of {repo.analysisLimit !== undefined ? repo.analysisLimit : 5}</span>
                    </div>
                    
                    {/* Platform info */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Platform:</span>
                      <span className="font-medium">{repo.platform || 'github'}</span>
                    </div>
                    
                    {/* Fingerprint info */}
                    <div className="flex items-start text-xs text-slate-500">
                      <Fingerprint className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <div className="break-all">
                        <span className="block mb-0.5">Fingerprint:</span>
                        <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded block">
                          {repo.fingerprint}
                        </code>
                      </div>
                    </div>
                    
                    {/* Test PR link */}
                    <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-600">
                      <button
                        className="text-xs text-blue-500 hover:text-blue-600 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          testDirectIncrement(repo);
                        }}
                      >
                        <GitBranch className="h-3 w-3 mr-1" />
                        Test with sample PR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* All Connected Repositories section */}
      {!isLoading && !error && filteredOlderRepos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            All Connected Repositories
          </h3>
          
          <div className="space-y-1">
            {filteredOlderRepos.map((repo) => (
              <div key={repo.id}>
                <div 
                  className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between transition-colors hover:shadow-sm"
                  onClick={() => toggleDetails(repo.id)}
                >
                  <div className="flex items-center">
                    {repo.platform === 'github' ? (
                      <Github className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    ) : (
                      <GitlabIcon className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    )}
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                      {repo.name}
                    </span>
                    {repo.isPrivate && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        Private
                      </span>
                    )}
                  </div>
                  
                  {/* Analysis usage indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs">
                      <BarChart className="h-3 w-3 mr-1 text-slate-400" />
                      <span>
                        {repo.analysisCount !== undefined ? repo.analysisCount : 0}/{repo.analysisLimit !== undefined ? repo.analysisLimit : 5}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Repository details */}
                {showDetails === repo.id && (
                  <div className="pl-6 space-y-2 py-2 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-md mx-2 mt-1">
                    {/* Analysis stats */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Analysis count:</span>
                      <span className="font-medium">{repo.analysisCount !== undefined ? repo.analysisCount : 0} of {repo.analysisLimit !== undefined ? repo.analysisLimit : 5}</span>
                    </div>
                    
                    {/* Platform info */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Platform:</span>
                      <span className="font-medium">{repo.platform || 'github'}</span>
                    </div>
                    
                    {/* Fingerprint info */}
                    <div className="flex items-start text-xs text-slate-500">
                      <Fingerprint className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      <div className="break-all">
                        <span className="block mb-0.5">Fingerprint:</span>
                        <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded block">
                          {repo.fingerprint}
                        </code>
                      </div>
                    </div>
                    
                    {/* Test PR link */}
                    <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-600">
                      <button
                        className="text-xs text-blue-500 hover:text-blue-600 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          testDirectIncrement(repo);
                        }}
                      >
                        <GitBranch className="h-3 w-3 mr-1" />
                        Test with sample PR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !error && filteredRecentRepos.length === 0 && filteredOlderRepos.length === 0 && (
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
      
      {/* Database Tools Section */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center">
          <Wrench className="h-4 w-4 mr-1" />
          Database Tools
        </h3>
        
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <p>Use these tools to debug database issues:</p>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={checkSchema}
              disabled={schemaLoading}
            >
              <Database className="h-3 w-3 mr-1" />
              {schemaLoading ? 'Checking...' : 'Check Schema'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => createTestRepository('github', 'test-org', 'test-repo')}
              disabled={createTestLoading}
            >
              <Wrench className="h-3 w-3 mr-1" />
              {createTestLoading ? 'Creating...' : 'Create Test Repo'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={addPlatformColumn}
              disabled={addColumnLoading}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              {addColumnLoading ? 'Adding...' : 'Add Platform Column'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300"
              onClick={fixDuplicates}
            >
              <Wrench className="h-3 w-3 mr-1" />
              Fix Duplicates
            </Button>
          </div>
          
          <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md">
            <div className="flex items-center">
              <PlusCircle className="h-3 w-3 mr-1" />
              <p className="font-medium">SQL to run in SQL Editor:</p>
            </div>
            <pre className="text-[10px] mt-1 p-2 bg-white dark:bg-slate-800 rounded overflow-auto">
              ALTER TABLE repositories ADD COLUMN IF NOT EXISTS platform text DEFAULT 'github';
              UPDATE repositories SET platform = 'github' WHERE platform IS NULL;
              -- If you're experiencing duplicate key errors, run this SQL to fix owner/name constraint issues:
              UPDATE repositories
              SET name = name || '-' || id
              WHERE id IN (
                SELECT id FROM repositories
                WHERE (owner, name) IN (
                  SELECT owner, name
                  FROM repositories
                  GROUP BY owner, name
                  HAVING COUNT(*) {'>'} 1
                )
              );
            </pre>
          </div>
          
          {schemaInfo && (
            <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
              <h4 className="font-medium mb-1">Schema Info:</h4>
              {schemaInfo.schemaInfo ? (
                <pre className="text-[10px] max-h-32 overflow-auto p-1">
                  {JSON.stringify(schemaInfo.schemaInfo, null, 2)}
                </pre>
              ) : (
                <div>
                  <p className="font-medium mt-1">Sample Repository:</p>
                  <pre className="text-[10px] max-h-32 overflow-auto p-1">
                    {JSON.stringify(schemaInfo.sampleRepo, null, 2)}
                  </pre>
                </div>
              )}
              
              {schemaInfo.reposWithFingerprints?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium mb-1">Repositories with Fingerprints:</p>
                  <div className="max-h-32 overflow-auto p-1">
                    {schemaInfo.reposWithFingerprints.map((repo: any) => (
                      <div key={repo.id} className="text-[10px] border-b border-slate-300 dark:border-slate-700 pb-1 mb-1 last:pb-0 last:mb-0 last:border-0">
                        <strong>{repo.owner}/{repo.name}</strong>: {repo.fingerprint?.slice(0, 10)}...
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {createTestResult && (
            <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
              <h4 className="font-medium mb-1">Test Repository Created:</h4>
              <pre className="text-[10px] max-h-32 overflow-auto p-1">
                {JSON.stringify(createTestResult, null, 2)}
              </pre>
            </div>
          )}
          
          {createTestError && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
              <h4 className="font-medium mb-1">Error Creating Test Repository:</h4>
              <p className="text-[10px]">{createTestError}</p>
            </div>
          )}
          
          {addColumnResult && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
              <h4 className="font-medium mb-1">Column Added Successfully:</h4>
              <pre className="text-[10px] max-h-32 overflow-auto p-1">
                {JSON.stringify(addColumnResult, null, 2)}
              </pre>
            </div>
          )}
          
          {addColumnError && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
              <h4 className="font-medium mb-1">Error Adding Column:</h4>
              <p className="text-[10px]">{addColumnError}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Fingerprint Testing Guide */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <span>Test Repository Fingerprinting</span>
          <a
            href="/fingerprint-edge-tests"
            target="_blank"
            className="text-blue-500 hover:text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded"
          >
            NEW Edge Test Tool &rarr;
          </a>
        </h3>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-xs text-blue-700 dark:text-blue-300 space-y-2">
          <p className="font-medium">How to test fingerprinting:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click one of the test buttons below</li>
            <li>The URL will be populated in the input field and copied to your clipboard</li>
            <li>Click "Analyze PR" to analyze the repository</li>
            <li>Look at "Recently Accessed" to see the analyzed repository and its fingerprint</li>
            <li>Try different variants (uppercase/lowercase, different owner) to test fingerprinting</li>
          </ol>
          <p className="italic mt-1">For example: "Owner/Repo" should get the same fingerprint as "owner/repo" (case insensitive), but "different-owner/repo" should get a different fingerprint.</p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={() => {
              // Copy to clipboard for easy testing
              navigator.clipboard.writeText('https://github.com/test-org/test-repo/pull/1');
              onSelect('https://github.com/test-org/test-repo/pull/1');
            }}
            className="w-full py-2 px-3 text-sm text-center bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700/30 border-none shadow-sm hover:shadow-md transition-all duration-200"
          >
            Test: test-org/test-repo (lowercase)
          </Button>
          
          <Button 
            onClick={() => {
              // Copy to clipboard for easy testing
              navigator.clipboard.writeText('https://github.com/TEST-ORG/TEST-REPO/pull/1');
              onSelect('https://github.com/TEST-ORG/TEST-REPO/pull/1');
            }}
            className="w-full py-2 px-3 text-sm text-center bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-700/30 border-none shadow-sm hover:shadow-md transition-all duration-200"
          >
            Test: TEST-ORG/TEST-REPO (uppercase)
          </Button>
          
          <Button 
            onClick={() => {
              // Copy to clipboard for easy testing
              navigator.clipboard.writeText('https://github.com/other-org/test-repo/pull/1');
              onSelect('https://github.com/other-org/test-repo/pull/1');
            }}
            className="w-full py-2 px-3 text-sm text-center bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-700/30 border-none shadow-sm hover:shadow-md transition-all duration-200"
          >
            Test: other-org/test-repo (different owner)
          </Button>
        </div>
      </div>
    </div>
  );
}