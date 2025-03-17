import { useState, useCallback } from 'react';

type RepositoryInfo = {
  platform: string;
  owner: string;
  repo: string;
};

type AnalysisLimits = {
  current: number;
  limit: number;
  hasReachedLimit: boolean;
};

export function useRepositoryAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limits, setLimits] = useState<AnalysisLimits | null>(null);
  
  // Parse GitHub or GitLab URL into platform, owner, and repo
  const parseRepositoryUrl = useCallback((url: string): RepositoryInfo | null => {
    try {
      // Match GitHub URLs
      let match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(\/.*)?/i);
      if (match) {
        return {
          platform: 'github',
          owner: match[1],
          repo: match[2].replace(/\.git$/, '') // Remove .git if present
        };
      }
      
      // Match GitLab URLs
      match = url.match(/gitlab\.com\/([^\/]+)\/([^\/]+)(\/.*)?/i);
      if (match) {
        return {
          platform: 'gitlab',
          owner: match[1],
          repo: match[2].replace(/\.git$/, '') // Remove .git if present
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing repository URL:', error);
      return null;
    }
  }, []);
  
  // Parse PR URL to get PR number
  const parsePullRequestNumber = useCallback((url: string): number | null => {
    try {
      // Match GitHub PR URLs
      let match = url.match(/github\.com\/[^\/]+\/[^\/]+\/pull\/(\d+)/i);
      if (match) {
        return parseInt(match[1], 10);
      }
      
      // Match GitLab MR URLs
      match = url.match(/gitlab\.com\/[^\/]+\/[^\/]+\/merge_requests\/(\d+)/i);
      if (match) {
        return parseInt(match[1], 10);
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing PR number:', error);
      return null;
    }
  }, []);
  
  // Get repository analysis limits
  const getAnalysisLimits = useCallback(async (urlOrInfo: string | RepositoryInfo): Promise<AnalysisLimits | null> => {
    setIsLoading(true);
    setError(null);
    
    let repoInfo: RepositoryInfo | null;
    
    try {
      if (typeof urlOrInfo === 'string') {
        repoInfo = parseRepositoryUrl(urlOrInfo);
        if (!repoInfo) {
          setError('Invalid repository URL');
          setIsLoading(false);
          return null;
        }
      } else {
        repoInfo = urlOrInfo;
      }
      
      const { platform, owner, repo } = repoInfo;
      
      console.log('Fetching repo limits:', { platform, owner, repo });
      
      let response;
      try {
        response = await fetch(`/api/repository/limits?platform=${platform}&owner=${owner}&repo=${repo}`);
        console.log('Limits response status:', response.status);
      } catch (fetchError) {
        console.error('Fetch error during getAnalysisLimits:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'}`);
      }
      
      const data = await response.json();
      console.log('Limits response data:', data);
      
      if (!response || !response.ok) {
        throw new Error((data && data.message) || 'Failed to fetch repository limits');
      }
      
      if (!data || !data.success) {
        throw new Error((data && data.message) || 'Failed to fetch repository limits');
      }
      
      if (data && data.limits) {
        setLimits(data.limits);
      }
      setIsLoading(false);
      return data && data.limits ? data.limits : null;
    } catch (error) {
      console.error('Error in getAnalysisLimits:', error);
      setError(error instanceof Error ? error.message : String(error));
      setIsLoading(false);
      return null;
    }
  }, [parseRepositoryUrl]);
  
  // Increment analysis count
  const incrementAnalysisCount = useCallback(async (urlOrInfo: string | RepositoryInfo, bypassLimit: boolean = false): Promise<number | null> => {
    setIsLoading(true);
    setError(null);
    
    let repoInfo: RepositoryInfo | null;
    let response;
    let data;
    
    try {
      if (typeof urlOrInfo === 'string') {
        // If URL is provided, check for PR number as well
        repoInfo = parseRepositoryUrl(urlOrInfo);
        const prNumber = parsePullRequestNumber(urlOrInfo);
        
        if (!repoInfo) {
          setError('Invalid repository URL');
          setIsLoading(false);
          return null;
        }
        
        if (!prNumber) {
          setError('URL does not contain a valid PR number');
          setIsLoading(false);
          return null;
        }
        
        console.log('Parsed PR information:', { ...repoInfo, prNumber });
      } else {
        repoInfo = urlOrInfo;
      }
      
      const { platform, owner, repo } = repoInfo;
      
      console.log('Calling increment-analysis API with:', { platform, owner, repo, bypassLimit });
      
      try {
        // First try our debug endpoint to check access
        console.log('Testing repository access with debug endpoint...');
        const debugResponse = await fetch(`/api/debug/repo?platform=${platform}&repo=${owner}/${repo}`);
        const debugData = await debugResponse.json();
        console.log('Debug endpoint result:', debugData);
        
        // Even if debug fails, continue with the main request
        
        // Detect cross-platform access by including auth provider in the request
        response = await fetch('/api/repository/increment-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            platform,
            owner,
            repo,
            bypassLimit
          })
        });
        
        console.log('Response received:', { 
          status: response.status, 
          ok: response.ok,
          statusText: response.statusText 
        });
        
        data = await response.json();
        console.log('API response data:', data);
        
      } catch (fetchError) {
        console.error('Fetch error during incrementAnalysisCount:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'}`);
      }
      
      if (!response || !response.ok) {
        if (response && response.status === 403 && data && data.error === 'ANALYSIS_LIMIT_REACHED') {
        // Special handling for limit reached
        if (data && data.current !== undefined && data.limit !== undefined) {
        setLimits({
        current: data.current,
        limit: data.limit,
        hasReachedLimit: true
        });
          
          // Return null but don't throw an error - the UI will handle this case
            console.warn(`Analysis limit reached: ${data.current}/${data.limit}`);
              setError(`Repository '${owner}/${repo}' has reached the free tier analysis limit (${data.current}/${data.limit})`);
              setIsLoading(false);
              return null;
            }
          }
        
        if (response && response.status === 403 && data && data.error === 'REPOSITORY_ACCESS_ERROR') {
          // This is a proper access denied error - throw with appropriate message
          throw new Error(`Access denied. Please sign out and sign in with an account that has proper permissions.`);
        }
        
        if (response && response.status === 401 && data && data.error === 'AUTHENTICATION_ERROR') {
          // This is an authentication error - throw with appropriate message
          throw new Error(`Access denied. Please sign out and sign in with an account that has proper permissions.`);
        }
        
        throw new Error((data && data.message) || 'Failed to increment analysis count');
      }
      
      if (!data || !data.success) {
        throw new Error((data && data.message) || 'Failed to increment analysis count');
      }
      
      // Update limits
      if (limits && data && data.newCount !== undefined) {
        setLimits({
          current: data.newCount,
          limit: limits.limit,
          hasReachedLimit: data.newCount >= limits.limit
        });
      }
      
      setIsLoading(false);
      return data && data.newCount !== undefined ? data.newCount : null;
    } catch (error) {
      console.error('Error in incrementAnalysisCount:', error);
      setError(error instanceof Error ? error.message : String(error));
      setIsLoading(false);
      return null;
    }
  }, [parseRepositoryUrl, parsePullRequestNumber, limits]);
  
  return {
    isLoading,
    error,
    limits,
    parseRepositoryUrl,
    parsePullRequestNumber,
    getAnalysisLimits,
    incrementAnalysisCount
  };
}
