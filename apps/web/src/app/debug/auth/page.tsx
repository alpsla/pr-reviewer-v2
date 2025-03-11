"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';


export default function AuthDebugPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [testRepo, setTestRepo] = useState('octokit/octokit.js');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/repository/test-auth');
        if (!response.ok) {
          throw new Error('Failed to fetch auth status');
        }
        const data = await response.json();
        setTokenInfo(data.auth);
        setSessionInfo(data.session);
      } catch (error) {
        console.error('Auth check error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleTestRepo = async () => {
    if (!testRepo.includes('/')) {
      setError('Invalid Repository Format: Please use the format: owner/repo');
      return;
    }

    setTestLoading(true);
    try {
      const response = await fetch(`/api/repository/test-auth?repo=${testRepo}`);
      if (!response.ok) {
        throw new Error('Failed to test repository access');
      }
      const data = await response.json();
      setTestResult(data);
      
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Repository test error:', error);
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="container py-10">
      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8">Authentication Debug Tool</h1>
      
      {loading ? (
        <p>Loading authentication status...</p>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Current authentication details</CardDescription>
            </CardHeader>
            <CardContent>
              {tokenInfo ? (
                <div className="space-y-4">
                  <div>
                    <strong>Provider:</strong> {tokenInfo.provider || 'None'}
                  </div>
                  <div>
                    <strong>Token Available:</strong> {tokenInfo.hasToken ? '✅' : '❌'}
                    {tokenInfo.hasToken && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Starting with: {tokenInfo.tokenFirstChars})
                      </span>
                    )}
                  </div>
                  <div>
                    <strong>Token Locations:</strong>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                      {JSON.stringify(tokenInfo.tokenLocations, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <strong>OAuth Scopes:</strong>
                    {tokenInfo.scopes && tokenInfo.scopes.length > 0 ? (
                      <ul className="list-disc pl-5 mt-1">
                        {tokenInfo.scopes.map((scope: string) => (
                          <li key={scope} className="text-sm">
                            {scope}
                            {scope === 'repo' && (
                              <span className="ml-2 text-green-600 font-medium">
                                (Required for private repos ✓)
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-500 mt-1">No scopes found!</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-red-500">Not authenticated</p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/signout')}
                className="mr-2"
              >
                Sign Out
              </Button>
              <Button onClick={() => router.push('/auth/signin')}>
                Sign In
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
              <CardDescription>Current session details</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionInfo ? (
                <div className="space-y-4">
                  <div>
                    <strong>User ID:</strong> {sessionInfo.userId || 'None'}
                  </div>
                  <div>
                    <strong>Email:</strong> {sessionInfo.userEmail || 'None'}
                  </div>
                  <div>
                    <strong>Session Expires:</strong> {sessionInfo.expiresAt 
                      ? new Date(sessionInfo.expiresAt * 1000).toLocaleString()
                      : 'Unknown'
                    }
                  </div>
                  <div>
                    <strong>Provider Info:</strong>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                      {JSON.stringify(sessionInfo.providerInfo, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">No active session</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Repository Access</CardTitle>
              <CardDescription>Check if you can access a GitHub repository</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="repo">Repository (owner/name)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="repo"
                      placeholder="e.g., octokit/octokit.js"
                      value={testRepo}
                      onChange={(e) => setTestRepo(e.target.value)}
                    />
                    <Button 
                      onClick={handleTestRepo}
                      disabled={testLoading}
                    >
                      {testLoading ? 'Testing...' : 'Test Access'}
                    </Button>
                  </div>
                </div>

                {testResult && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                    <div className="bg-gray-100 p-4 rounded">
                      {testResult.error ? (
                        <div className="text-red-500">
                          <strong>Error:</strong> {testResult.error}
                        </div>
                      ) : (
                        <div>
                          <div className="mb-2">
                            <strong>Access Result:</strong>{' '}
                            {testResult.publicRepoAccess?.hasAccess ? (
                              <span className="text-green-600">Success ✅</span>
                            ) : (
                              <span className="text-red-600">Failed ❌</span>
                            )}
                          </div>
                          
                          <div className="mb-2">
                            <strong>Repository Privacy:</strong>{' '}
                            {testResult.publicRepoAccess?.private ? 'Private' : 'Public'}
                          </div>
                          
                          <div className="mb-2">
                            <strong>Permissions:</strong>
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1">
                              {JSON.stringify(testResult.publicRepoAccess?.permissions, null, 2)}
                            </pre>
                          </div>
                          
                          {testResult.publicRepoAccess?.error && (
                            <div className="mt-2 text-red-500">
                              <strong>Error Details:</strong> {testResult.publicRepoAccess.error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
