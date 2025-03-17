'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, GitBranch, FileDiff, PlusCircle, MinusCircle, User, Loader } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DataCollectionStatus } from './data-collection-status';
import { PullRequestBasicDetails } from '@/lib/enhanced-repository';

interface PrPreviewSectionProps {
  prUrl: string;
  repoInfo?: { platform: string; owner: string; repo: string } | null;
  prNumber?: number | null;
}

export function PrPreviewSection({ prUrl, repoInfo, prNumber }: PrPreviewSectionProps) {
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>(["code_quality", "security"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prDetails, setPrDetails] = useState<PullRequestBasicDetails | null>(null);
  const [backgroundCollectionStarted, setBackgroundCollectionStarted] = useState<boolean>(false);
  
  // In your PR preview section component
async function fetchPrBasicDetails(prUrl: string): Promise<PullRequestBasicDetails> {
  console.log('fetchPrBasicDetails called with URL:', prUrl);
  try {
    // Parse the PR URL
    console.log('Parsing PR URL...');
    const { platform, owner, repo, number } = parsePrUrl(prUrl);
    console.log('Parsed PR URL:', { platform, owner, repo, number });
    
    if (!platform || !owner || !repo || !number) {
      console.error('Invalid PR URL format');
      throw new Error('Invalid PR URL format');
    }
    
    // Call the API
    const apiUrl = `/api/prs/${owner}/${repo}/${number}/basic-details?platform=${platform}`;
    console.log('Calling API:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch PR details');
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    if (!data || !data.prDetails) {
      console.error('No PR details in response');
      throw new Error('No PR details returned from API');
    }
    
    console.log('Returning PR details:', data.prDetails);
    return data.prDetails;
  } catch (error) {
    console.error('Error in fetchPrBasicDetails:', error);
    throw error;
  }
}

  

function parsePrUrl(url: string): { platform: string; owner: string; repo: string; number: string } {
  console.log('Parsing URL:', url);
  try {
    const urlObj = new URL(url);
    console.log('URL object:', urlObj);
    
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    console.log('Path parts:', pathParts);
    
    // GitHub URL format: github.com/owner/repo/pull/number
    if (urlObj.hostname === 'github.com' && pathParts.length >= 4 && pathParts[2] === 'pull') {
      const result = {
        platform: 'github',
        owner: pathParts[0],
        repo: pathParts[1],
        number: pathParts[3]
      };
      console.log('Parsed as GitHub PR:', result);
      return result;
    }
    
    // GitLab URL format: gitlab.com/owner/repo/-/merge_requests/number
    if (urlObj.hostname === 'gitlab.com' && pathParts.length >= 5 && pathParts[3] === 'merge_requests') {
      const result = {
        platform: 'gitlab',
        owner: pathParts[0],
        repo: pathParts[1],
        number: pathParts[4]
      };
      console.log('Parsed as GitLab PR:', result);
      return result;
    }
    
    console.error('Unsupported PR URL format');
    throw new Error('Unsupported PR URL format');
  } catch (error) {
    console.error('Error parsing PR URL:', error);
    return { platform: '', owner: '', repo: '', number: '' };
  }
}


  const startBackgroundDataCollection = async (repositoryId: string) => {
    if (backgroundCollectionStarted) return;
    
    try {
      console.log('Starting background data collection for repository:', repositoryId);
      
      const dataTypes: Array<'structure' | 'dependencies' | 'security' | 'performance'> = [
        'structure', 
        'dependencies', 
        'security', 
        'performance'
      ];
      
      // Call the data collection API
      const response = await fetch('/api/analysis/data-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repositoryId,
          dataTypes
        })
      });
      
      if (!response.ok) {
        console.error('Failed to start background data collection');
        return;
      }
      
      const data = await response.json();
      console.log('Background data collection started:', data);
      
      setBackgroundCollectionStarted(true);
    } catch (error) {
      console.error('Error starting background data collection:', error);
    }
  };
  
  useEffect(() => {
    console.log('PR Preview useEffect triggered with:', {
      prUrl,
      repoInfo: repoInfo ? `${repoInfo.platform}/${repoInfo.owner}/${repoInfo.repo}` : 'none',
      prNumber
    });
    
    // Clear any existing PR details to avoid stale data
    setPrDetails(null);
    setBackgroundCollectionStarted(false);
    
    // If we have repoInfo and prNumber, try to fetch
    if (repoInfo && prNumber) {
      // Add a delay to ensure UI is updated and to prevent too-frequent API calls
      const fetchTimeout = setTimeout(() => {
        fetchPrBasicDetails(prUrl);
      }, 1000); // Increase delay to 1 second to prevent constant refreshing
      
      return () => clearTimeout(fetchTimeout);
    }
  }, [prUrl, repoInfo, prNumber]);
  
  const toggleAnalysisType = (type: string) => {
    if (selectedAnalysisTypes.includes(type)) {
      setSelectedAnalysisTypes(selectedAnalysisTypes.filter(t => t !== type));
    } else {
      setSelectedAnalysisTypes([...selectedAnalysisTypes, type]);
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
        <span className="flex items-center">
          <GitBranch className="mr-2 h-5 w-5 text-blue-500" />
          PR Details
        </span>
      </h2>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-slate-600 dark:text-slate-300">Loading PR details...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
          {error.toLowerCase().includes('cross-platform authentication') ? (
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-red-700 dark:text-red-300 font-medium">Cross-Platform Authentication Error</p>
                <p className="text-red-600 dark:text-red-400 mt-1">You're signed in with a different platform than the repository you're trying to access.</p>
                <p className="text-red-600 dark:text-red-400 mt-1">Please sign in with a {repoInfo?.platform === 'github' ? 'GitHub' : 'GitLab'} account to analyze this repository.</p>
                <div className="mt-3">
                  <a href="/api/auth/logout" className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800/30 dark:hover:bg-red-700/30 text-red-700 dark:text-red-300 rounded-md text-sm font-medium transition-colors inline-block mr-2">
                    Sign Out
                  </a>
                  <a href={`/api/auth/login/${repoInfo?.platform === 'github' ? 'github' : 'gitlab'}`} className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800/30 dark:hover:bg-red-700/30 text-red-700 dark:text-red-300 rounded-md text-sm font-medium transition-colors inline-block">
                    Sign In with {repoInfo?.platform === 'github' ? 'GitHub' : 'GitLab'}
                  </a>
                </div>
              </div>
            </div>
          ) : error.toLowerCase().includes('private repository') || 
               error.toLowerCase().includes('access denied') || 
               error.toLowerCase().includes('authentication required') || 
               error.toLowerCase().includes('permission') ? (
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <div>
                <p className="text-red-700 dark:text-red-300 font-medium">Access Denied</p>
                <p className="text-red-600 dark:text-red-400 mt-1">
                  {error.toLowerCase().includes('private repository') ? 
                    'This is a private repository. Please sign in with an account that has proper permissions.' : 
                    'You don\'t have access to this repository. Please sign in with an account that has proper permissions.'}
                </p>
                <div className="mt-3">
                  <button 
                    onClick={() => fetchPrBasicDetails(prUrl)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800/30 dark:hover:bg-red-700/30 text-red-700 dark:text-red-300 rounded-md text-sm font-medium transition-colors">
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-700 dark:text-red-300">{error}</p>
          )}
        </div>
      )}
      
      {!loading && !error && prDetails && (
        <div className="mt-4">
          {/* Repository visibility indicator */}
          <div className="mb-3">
            {(prDetails as any)?.isPrivate ? (
              <div className="inline-flex items-center px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Private Repository
              </div>
            ) : (
              <div className="inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Public Repository
              </div>
            )}
          </div>
          
          {/* PR Title */}
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {prDetails.title}
          </h3>
          
          {/* PR Metadata */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {/* Repository */}
              <div className="flex items-center text-sm">
                <GitBranch className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Repository:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {prDetails.owner && prDetails.repo ? 
                    `${prDetails.owner}/${prDetails.repo}` : 
                    'Unknown Repository'}
                </span>
              </div>
              
              {/* Author */}
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Author:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {prDetails.author || 'Unknown Author'}
                </span>
              </div>
              
              {/* Created */}
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Created:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formatDate(prDetails.createdAt)}
                </span>
              </div>
              
              {/* Updated */}
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Updated:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formatDate(prDetails.updatedAt)}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {prDetails.filesChanged === 0 && prDetails.linesAdded === 0 && prDetails.linesRemoved === 0 ? (
                <div className="p-3 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center mt-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <span className="font-medium block mb-1">Access Denied</span>
                    <span className="block mb-3">You don't have access to this repository. Please sign out and sign in with an account that has access to this repository.</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Files Changed */}
                  <div className="flex items-center text-sm">
                    <FileDiff className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400 mr-2">Files Changed:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {(prDetails.filesChanged !== undefined ? prDetails.filesChanged : 0).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Lines Added */}
                  <div className="flex items-center text-sm">
                    <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-slate-500 dark:text-slate-400 mr-2">Lines Added:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {(prDetails.linesAdded !== undefined ? prDetails.linesAdded : 0).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Lines Removed */}
                  <div className="flex items-center text-sm">
                    <MinusCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-slate-500 dark:text-slate-400 mr-2">Lines Removed:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {(prDetails.linesRemoved !== undefined ? prDetails.linesRemoved : 0).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              
              {/* Branches */}
              <div className="flex items-center text-sm">
                <GitBranch className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Branches:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {prDetails.branch || 'Unknown Branch'} → 
                  {prDetails.baseBranch || 'Unknown Base Branch'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Background Data Collection Status with enhanced UI */}
          {backgroundCollectionStarted && prDetails.repositoryId && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Repository Data Collection
              </h4>
              <DataCollectionStatus 
                repositoryId={prDetails.repositoryId}
                className="mt-2"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                We're collecting detailed repository data in the background to enhance your analysis. This may take a few minutes for large repositories.
              </p>
            </div>
          )}
          
          {/* Analysis Type Selection */}
          <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Analysis Type
            </h4>
            
            <div className="flex flex-wrap gap-2">
              <div 
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                  selectedAnalysisTypes.includes('code_quality')
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => toggleAnalysisType('code_quality')}
              >
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  checked={selectedAnalysisTypes.includes('code_quality')}
                  onChange={() => toggleAnalysisType('code_quality')}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Code Quality</span>
              </div>
              
              <div 
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                  selectedAnalysisTypes.includes('security')
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => toggleAnalysisType('security')}
              >
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  checked={selectedAnalysisTypes.includes('security')}
                  onChange={() => toggleAnalysisType('security')}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Security</span>
              </div>
              
              <div 
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                  selectedAnalysisTypes.includes('performance')
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => toggleAnalysisType('performance')}
              >
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  checked={selectedAnalysisTypes.includes('performance')}
                  onChange={() => toggleAnalysisType('performance')}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Performance</span>
              </div>
              
              <div 
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                  selectedAnalysisTypes.includes('maintenance')
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
                onClick={() => toggleAnalysisType('maintenance')}
              >
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  checked={selectedAnalysisTypes.includes('maintenance')}
                  onChange={() => toggleAnalysisType('maintenance')}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Maintainability</span>
              </div>
            </div>
          </div>
          
          {/* Confirm Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              className="px-8 py-2.5 text-base font-medium rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl border-2 border-blue-700 dark:border-blue-600 transition-all duration-200"
            >
              Confirm Analysis
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && !prDetails && (
        <div className="py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">No PR details available</p>
        </div>
      )}
    </div>
  );
}
