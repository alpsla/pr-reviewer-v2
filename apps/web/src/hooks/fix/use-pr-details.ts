import { useState, useCallback } from 'react';

type RepositoryInfo = {
  platform: string;
  owner: string;
  repo: string;
};

export interface PrDetails {
  title: string;
  repository: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  branches: {
    source: string;
    target: string;
  };
  state: string;
  isPrivate: boolean;
}

export function usePrDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prDetails, setPrDetails] = useState<PrDetails | null>(null);

  /**
   * Try fetching PR details from multiple endpoints to ensure public repos work
   */
  const fetchPrDetails = useCallback(async (repoInfo: RepositoryInfo, prNumber: number): Promise<PrDetails | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // FIRST ATTEMPT: Try No-Auth-Fix endpoint for public repositories
      console.log('Trying no-auth-fix endpoint first...');
      try {
        const noAuthResponse = await fetch(
          `/api/no-auth-fix?platform=${repoInfo.platform}&owner=${repoInfo.owner}&repo=${repoInfo.repo}&prNumber=${prNumber}`
        );

        // If no-auth works, use it
        if (noAuthResponse.ok) {
          const data = await noAuthResponse.json();
          
          if (data.success && data.prDetails) {
            console.log('No-auth-fix endpoint successful!', data.prDetails);
            return data.prDetails;
          }
        }
      } catch (noAuthError) {
        console.log('No-auth-fix endpoint failed, continuing to next attempt', noAuthError);
      }

      // SECOND ATTEMPT: Try standard endpoint with authentication
      console.log('Trying standard PR details endpoint...');
      const standardResponse = await fetch(
        `/api/repository/pr-details?platform=${repoInfo.platform}&owner=${repoInfo.owner}&repo=${repoInfo.repo}&prNumber=${prNumber}`
      );

      if (!standardResponse.ok) {
        const errorData = await standardResponse.json();
        throw new Error(errorData.message || 'Failed to fetch PR details');
      }

      const standardData = await standardResponse.json();
      
      if (standardData.success && standardData.prDetails) {
        console.log('Standard endpoint successful!', standardData.prDetails);
        return standardData.prDetails;
      }

      throw new Error('No PR details available from any endpoint');
    } catch (error) {
      console.error('Error fetching PR details:', error);
      setError(error instanceof Error ? error.message : String(error));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get PR details, storing them in component state
   */
  const getPrDetails = useCallback(async (repoInfo: RepositoryInfo, prNumber: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await fetchPrDetails(repoInfo, prNumber);
      if (details) {
        setPrDetails(details);
      } else {
        throw new Error('Failed to fetch PR details');
      }
    } catch (error) {
      console.error('Error in getPrDetails:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, [fetchPrDetails]);

  return {
    isLoading,
    error,
    prDetails,
    getPrDetails,
    fetchPrDetails
  };
}
