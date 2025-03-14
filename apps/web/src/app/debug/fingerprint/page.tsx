'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, GitPullRequest, RefreshCw, FileCode, Lock, Fingerprint } from 'lucide-react';

export default function FingerprintDebugPage() {
  // Repository info state
  const [platform, setPlatform] = useState<string>('github');
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');
  
  // Comparison state
  const [owner2, setOwner2] = useState<string>('');
  const [repo2, setRepo2] = useState<string>('');
  
  // Large PR state
  const [prNumber, setPrNumber] = useState<string>('');
  
  // Current mode
  const [mode, setMode] = useState<string>('single');
  
  // Results state
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch data from the debug API
  const fetchDebugData = async (action: string, params: Record<string, string>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build URL with params
      const queryParams = new URLSearchParams({
        action,
        platform,
        ...params
      });
      
      const response = await fetch(`/api/debug/fingerprint?${queryParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch debug data');
      }
      
      setResult(data);
    } catch (error) {
      console.error('Debug request error:', error);
      setError(error instanceof Error ? error.message : String(error));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Test single repository fingerprinting
  const testSingleRepo = () => {
    if (!owner || !repo) {
      setError('Owner and repo name are required');
      return;
    }
    
    fetchDebugData('info', {
      owner,
      name: repo
    });
  };
  
  // Test repository comparison
  const testRepoComparison = () => {
    if (!owner || !repo || !owner2 || !repo2) {
      setError('Both repositories require owner and name');
      return;
    }
    
    fetchDebugData('compare', {
      owner,
      name: repo,
      owner2,
      name2: repo2
    });
  };
  
  // Test special characters
  const testSpecialChars = () => {
    fetchDebugData('special-chars', {});
  };
  
  // Test public/private switch
  const testPublicPrivateSwitch = () => {
    if (!owner || !repo) {
      setError('Owner and repo name are required');
      return;
    }
    
    fetchDebugData('public-private', {
      owner,
      name: repo
    });
  };
  
  // Test large PR handling
  const testLargePR = () => {
    if (!owner || !repo || !prNumber) {
      setError('Owner, repo name, and PR number are required');
      return;
    }
    
    fetchDebugData('large-pr', {
      owner,
      name: repo,
      pr: prNumber
    });
  };
  
  // Format the JSON result for display
  const formatResult = (data: any) => {
    return <pre className="text-xs overflow-auto max-h-[500px] p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
      {JSON.stringify(data, null, 2)}
    </pre>;
  };
  
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Fingerprint className="h-8 w-8 mr-2 text-blue-500" />
        Repository Fingerprinting Debug - UPDATED VERSION
      </h1>
      
      <div className="mb-6 bg-green-100 border border-green-500 text-green-800 p-4 rounded-md">
        <p className="font-bold">NEW VERSION LOADED - MARCH 11, 2025</p>
        <p>This is the updated debugger interface with added edge case testing features.</p>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          This page contains debugging tools for testing repository fingerprinting edge cases. Use these tools to verify proper handling of special characters, public/private repository switches, and large PRs.
        </p>
      </div>
      
      {/* Mode selector buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant={mode === 'single' ? 'default' : 'outline'} 
          onClick={() => setMode('single')}
          className="flex items-center"
        >
          <GitBranch className="h-4 w-4 mr-2" />
          Single Repo
        </Button>
        <Button 
          variant={mode === 'compare' ? 'default' : 'outline'} 
          onClick={() => setMode('compare')}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Compare Repos
        </Button>
        <Button 
          variant={mode === 'special' ? 'default' : 'outline'} 
          onClick={() => setMode('special')}
          className="flex items-center"
        >
          <FileCode className="h-4 w-4 mr-2" />
          Special Chars
        </Button>
        <Button 
          variant={mode === 'privacy' ? 'default' : 'outline'} 
          onClick={() => setMode('privacy')}
          className="flex items-center"
        >
          <Lock className="h-4 w-4 mr-2" />
          Public/Private
        </Button>
        <Button 
          variant={mode === 'large-pr' ? 'default' : 'outline'} 
          onClick={() => setMode('large-pr')}
          className="flex items-center"
        >
          <GitPullRequest className="h-4 w-4 mr-2" />
          Large PR
        </Button>
      </div>
      
      {/* Single Repository View */}
      {mode === 'single' && (
        <Card>
          <CardHeader>
            <CardTitle>Single Repository Fingerprint Analysis</CardTitle>
            <CardDescription>
              Test fingerprinting on a single repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                </select>
              </div>
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g., facebook"
                />
              </div>
              <div>
                <Label htmlFor="repo">Repository</Label>
                <Input
                  id="repo"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="e.g., react"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={testSingleRepo}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Test Repository Fingerprinting'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Repository Comparison View */}
      {mode === 'compare' && (
        <Card>
          <CardHeader>
            <CardTitle>Compare Repository Fingerprints</CardTitle>
            <CardDescription>
              Compare two repositories to see if they generate the same fingerprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold mb-2">Repository 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner1">Owner</Label>
                    <Input
                      id="owner1"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      placeholder="e.g., facebook"
                    />
                  </div>
                  <div>
                    <Label htmlFor="repo1">Repository</Label>
                    <Input
                      id="repo1"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      placeholder="e.g., react"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Repository 2</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner2">Owner</Label>
                    <Input
                      id="owner2"
                      value={owner2}
                      onChange={(e) => setOwner2(e.target.value)}
                      placeholder="e.g., FACEBOOK"
                    />
                  </div>
                  <div>
                    <Label htmlFor="repo2">Repository</Label>
                    <Input
                      id="repo2"
                      value={repo2}
                      onChange={(e) => setRepo2(e.target.value)}
                      placeholder="e.g., React"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={testRepoComparison}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Compare Repositories'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Special Characters View */}
      {mode === 'special' && (
        <Card>
          <CardHeader>
            <CardTitle>Special Characters Test</CardTitle>
            <CardDescription>
              Test how the system handles repositories with special characters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              This test will generate fingerprints for various repository names containing
              special characters to ensure proper normalization.
            </p>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-xs">
                Tests include: uppercase vs lowercase, spaces, dots, hyphens, underscores,
                accents, emojis, control characters, multi-byte UTF-8 characters, and more.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={testSpecialChars}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Run Special Characters Test'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Public/Private Switch View */}
      {mode === 'privacy' && (
        <Card>
          <CardHeader>
            <CardTitle>Public/Private Switch Test</CardTitle>
            <CardDescription>
              Test how the system handles repositories changing between public and private
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="platform-privacy">Platform</Label>
                <select
                  id="platform-privacy"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                </select>
              </div>
              <div>
                <Label htmlFor="owner-privacy">Owner</Label>
                <Input
                  id="owner-privacy"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g., facebook"
                />
              </div>
              <div>
                <Label htmlFor="repo-privacy">Repository</Label>
                <Input
                  id="repo-privacy"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="e.g., react"
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-xs">
                This test simulates changing a repository from public to private and checks
                if the fingerprint and analysis count are preserved correctly.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={testPublicPrivateSwitch}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Test Public/Private Switch'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Large PR View */}
      {mode === 'large-pr' && (
        <Card>
          <CardHeader>
            <CardTitle>Large PR Test</CardTitle>
            <CardDescription>
              Test how the system handles very large pull requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="platform-pr">Platform</Label>
                <select
                  id="platform-pr"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                </select>
              </div>
              <div>
                <Label htmlFor="owner-pr">Owner</Label>
                <Input
                  id="owner-pr"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g., facebook"
                />
              </div>
              <div>
                <Label htmlFor="repo-pr">Repository</Label>
                <Input
                  id="repo-pr"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="e.g., react"
                />
              </div>
              <div>
                <Label htmlFor="pr-number">PR Number</Label>
                <Input
                  id="pr-number"
                  value={prNumber}
                  onChange={(e) => setPrNumber(e.target.value)}
                  placeholder="e.g., 1234"
                  type="number"
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
              <p className="text-xs">
                This test will attempt to fetch a PR with potentially many files
                and analyze how the system performs. It tracks pagination, memory usage,
                and time taken per batch.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={testLargePR}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Test Large PR Handling'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Results Section */}
      {error && (
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          {formatResult(result)}
        </div>
      )}
    </div>
  );
}
