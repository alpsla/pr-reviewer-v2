'use client';

import { useState, useEffect } from 'react';

interface DataCollectionStatusProps {
  repositoryId: string;
  className?: string;
}

export function DataCollectionStatus({ repositoryId, className = '' }: DataCollectionStatusProps) {
  const [status, setStatus] = useState<{
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    completionPercentage: number;
    collectedDataTypes: string[];
    pendingDataTypes: string[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch data collection status
  const fetchStatus = async () => {
    try {
      // Fetch status from API
      const response = await fetch(`/api/analysis/data-collection/${repositoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch collection status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.status) {
        setStatus(data.status);
      } else {
        throw new Error(data.message || 'Failed to get collection status');
      }
    } catch (err) {
      console.error('Error fetching collection status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch status on component mount and periodically if in progress
  useEffect(() => {
    fetchStatus();
    
    // Poll for updates if status is pending or in_progress
    let interval: NodeJS.Timeout | null = null;
    
    if (!error && status && (status.status === 'pending' || status.status === 'in_progress')) {
      interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [repositoryId, status?.status, error]);
  
  if (loading) {
    return (
      <div className={`rounded-md border border-slate-200 dark:border-slate-700 p-3 ${className}`}>
        <div className="flex items-center">
          <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading data collection status...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3 ${className}`}>
        <p className="text-sm text-red-700 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }
  
  if (!status) {
    return (
      <div className={`rounded-md border border-slate-200 dark:border-slate-700 p-3 ${className}`}>
        <p className="text-sm text-slate-600 dark:text-slate-400">No data collection status available</p>
      </div>
    );
  }
  
  return (
    <div className={`rounded-md border border-slate-200 dark:border-slate-700 p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {status.status === 'pending' && 'Pending Collection'}
          {status.status === 'in_progress' && 'Collecting Data...'}
          {status.status === 'completed' && 'Collection Complete'}
          {status.status === 'failed' && 'Collection Failed'}
        </p>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {status.completionPercentage}%
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className={`h-full rounded-full ${
            status.status === 'failed' 
              ? 'bg-red-500' 
              : status.status === 'completed'
                ? 'bg-green-500'
                : 'bg-blue-500'
          }`}
          style={{ width: `${status.completionPercentage}%` }}
        ></div>
      </div>
      
      {/* Data type indicators */}
      <div className="mt-3 flex flex-wrap gap-2">
        {[...status.collectedDataTypes, ...status.pendingDataTypes].map((dataType) => {
          const isCollected = status.collectedDataTypes.includes(dataType);
          return (
            <div
              key={dataType}
              className={`rounded-full px-2 py-1 text-xs ${
                isCollected
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
              {isCollected && ' ✓'}
            </div>
          );
        })}
      </div>
    </div>
  );
}
