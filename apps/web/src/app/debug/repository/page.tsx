"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RepositoryDebugPage() {
  const [repoUrl, setRepoUrl] = useState('facebook/react');
  const [platform, setPlatform] = useState('github');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [directResult, setDirectResult] = useState<any>(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [bypassResult, setBypassResult] = useState<any>(null);
  const [bypassLoading, setBypassLoading] = useState(false);

  const testRepository = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Use the debug endpoint
      const response = await fetch(`/api/debug/repo?platform=${platform}&repo=${repoUrl}`);
      const data = await response.json();
      
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const directIncrementTest = async () => {
    setDirectLoading(true);
    setDirectResult(null);
    
    try {
      // Call the increment API directly
      const [owner, repo] = repoUrl.split('/');
      
      const response = await fetch('/api/repository/increment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          owner,
          repo,
          bypassLimit: false
        })
      });
      
      const data = await response.json();
      setDirectResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data
      });
    } catch (error) {
      setDirectResult({
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setDirectLoading(false);
    }
  };

  const bypassTest = async () => {
    setBypassLoading(true);
    setBypassResult(null);
    
    try {
      // Generate a fake repository fingerprint and directly insert to database
      const [owner, repo] = repoUrl.split('/');
      const response = await fetch('/api/repository/manual-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          owner,
          repo
        })
      });
      
      const data = await response.json();
      setBypassResult({
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data
      });
    } catch (error) {
      setBypassResult({
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setBypassLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Repository Debug Tool</h1>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Input 
            value={repoUrl} 
            onChange={e => setRepoUrl(e.target.value)} 
            placeholder="owner/repo"
            className="flex-1" 
          />
          <select 
            value={platform} 
            onChange={e => setPlatform(e.target.value)}
            className="border rounded p-2"
          >
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
          </select>
          <Button 
            onClick={testRepository} 
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Repository'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Repository Access Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={testRepository} disabled={loading} className="mb-4">
                {loading ? 'Testing...' : 'Test Repository Access'}
              </Button>
              
              <Button onClick={directIncrementTest} disabled={directLoading} className="mb-4">
                {directLoading ? 'Testing...' : 'Test Increment Analysis'}
              </Button>
              
              <Button onClick={bypassTest} disabled={bypassLoading} className="mb-4">
                {bypassLoading ? 'Testing...' : 'Test Manual Add'}
              </Button>
            </div>
            
            {result && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Repository Access Results:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            
            {directResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Increment Analysis Results:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80 whitespace-pre-wrap">
                  {JSON.stringify(directResult, null, 2)}
                </pre>
              </div>
            )}
            
            {bypassResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Manual Add Results:</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80 whitespace-pre-wrap">
                  {JSON.stringify(bypassResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
