'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugTestPage() {
  const [platform, setPlatform] = useState('github');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const testFingerprint = async () => {
    try {
      const response = await fetch(`/api/debug/fingerprint?action=info&platform=${platform}&owner=${owner}&name=${repo}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: String(error) });
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Debug Test Page</h1>
      <p className="mb-8">This is a simple test page for the new debugging API.</p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Repository Fingerprinting</CardTitle>
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
          <Button onClick={testFingerprint} className="w-full">
            Test Fingerprinting
          </Button>
        </CardFooter>
      </Card>
      
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <pre className="text-xs overflow-auto max-h-[500px] p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
