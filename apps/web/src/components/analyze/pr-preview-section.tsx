'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, GitBranch, FileDiff, PlusCircle, MinusCircle, User, Loader } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DataCollectionStatus } from './data-collection-status';
import { PullRequestBasicDetails } from '@pr-reviewer/core/src/repository/types';

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
  
  const fetchPrBasicDetails = async () => {
    if (!repoInfo || !prNumber) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching PR basic details from new API:', {
        platform: repoInfo.platform,
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        prNumber
      });
      
      // Call the new primary tier API
      const response = await fetch(
        `/api/prs/${repoInfo.owner}/${repoInfo.repo}/${prNumber}/basic-details?platform=${repoInfo.platform}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API returned error status:', response.status, errorData);
        throw new Error(errorData.message || 'Failed to fetch PR details');
      }
      
      const data = await response.json();
      console.log('PR basic details API response:', data);
      
      if (data.success && data.details) {
        console.log('Setting PR details from basic details API response');
        setPrDetails(data.details);
        
        // If PR details are valid (non-zero values), start background data collection
        if (
          data.details.filesChanged > 0 &&
          data.details.linesAdded > 0 &&
          data.details.linesRemoved > 0 &&
          !backgroundCollectionStarted
        ) {
          startBackgroundDataCollection(data.details.repositoryId);
        }
      } else {
        throw new Error('No PR details returned from API');
      }
    } catch (err) {
      console.error('Error fetching PR basic details:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  
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
      // Add a small delay to ensure UI is updated
      const fetchTimeout = setTimeout(() => {
        fetchPrBasicDetails();
      }, 100);
      
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
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {!loading && !error && prDetails && (
        <div className="mt-4">
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
                <span className="font-medium text-slate-800 dark:text-slate-200">{prDetails.owner}/{prDetails.repo}</span>
              </div>
              
              {/* Author */}
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Author:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{prDetails.author}</span>
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
              {/* Files Changed */}
              <div className="flex items-center text-sm">
                <FileDiff className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Files Changed:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {prDetails.filesChanged.toLocaleString()}
                </span>
              </div>
              
              {/* Lines Added */}
              <div className="flex items-center text-sm">
                <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Lines Added:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {prDetails.linesAdded.toLocaleString()}
                </span>
              </div>
              
              {/* Lines Removed */}
              <div className="flex items-center text-sm">
                <MinusCircle className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Lines Removed:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {prDetails.linesRemoved.toLocaleString()}
                </span>
              </div>
              
              {/* Branches */}
              <div className="flex items-center text-sm">
                <GitBranch className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 mr-2">Branches:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {prDetails.branch} → {prDetails.baseBranch}
                </span>
              </div>
            </div>
          </div>
          
          {/* Background Data Collection Status */}
          {backgroundCollectionStarted && prDetails.repositoryId && (
            <div className="mt-4">
              <DataCollectionStatus 
                repositoryId={prDetails.repositoryId}
                className="mt-4"
              />
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
