'use client';

import { useState, useEffect } from 'react';
// @ts-ignore - Temporarily ignore any missing type definitions
import { DataType, DataCollectionStatusInfo } from '@pr-reviewer/core/src/repository/types';

interface DataCollectionStatusProps {
  repositoryId: string;
  onComplete?: () => void;
  className?: string;
}

export function DataCollectionStatus({ 
  repositoryId, 
  onComplete,
  className = ''
}: DataCollectionStatusProps) {
  const [status, setStatus] = useState<DataCollectionStatusInfo | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get data collection status
  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/analysis/data-collection/${repositoryId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch data collection status');
      }
      
      const data = await response.json();
      setStatus(data.status);
      
      // If data collection is complete, stop polling
      if (data.status.completionPercentage === 100) {
        setIsPolling(false);
        if (onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      console.error('Error fetching data collection status:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsPolling(false);
    }
  };

  // Start polling when component mounts
  useEffect(() => {
    if (repositoryId) {
      setIsPolling(true);
      fetchStatus();
    }

    return () => {
      setIsPolling(false);
    };
  }, [repositoryId]);

  // Set up polling interval
  useEffect(() => {
    if (isPolling) {
      const interval = setInterval(() => {
        fetchStatus();
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPolling]);

  // If there's no status yet, show loading
  if (!status) {
    return (
      <div className={`p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg ${className}`}>
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Loading data collection status...
          </p>
        </div>
      </div>
    );
  }

  // If there's an error, show it
  if (error) {
    return (
      <div className={`p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
        <p className="text-sm text-red-700 dark:text-red-300">
          Error: {error}
        </p>
      </div>
    );
  }

  // Get readable status for display
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  // Get data type label for display
  const getDataTypeLabel = (type: DataType) => {
    switch (type) {
      case 'structure':
        return 'Repository Structure';
      case 'dependencies':
        return 'Dependencies';
      case 'security':
        return 'Security Scan';
      case 'performance':
        return 'Performance Analysis';
      default:
        return type;
    }
  };

  return (
    <div className={`p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg ${className}`}>
      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
        Repository Data Collection: {getStatusLabel(status.status)}
      </h3>
      
      <div className="mb-2">
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${status.completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {status.completionPercentage}% complete
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-blue-700 dark:text-blue-300">Collected:</p>
          {status.collectedDataTypes.length > 0 ? (
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
              {status.collectedDataTypes.map(type => (
                <li key={type}>{getDataTypeLabel(type)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">None yet</p>
          )}
        </div>
        <div>
          <p className="text-blue-700 dark:text-blue-300">Pending:</p>
          {status.pendingDataTypes.length > 0 ? (
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
              {status.pendingDataTypes.map(type => (
                <li key={type}>{getDataTypeLabel(type)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">None</p>
          )}
        </div>
      </div>
    </div>
  );
}
