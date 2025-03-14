'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function FingerprintTests() {
  const [platform, setPlatform] = useState('github');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [owner2, setOwner2] = useState('');
  const [repo2, setRepo2] = useState('');
  const [mode, setMode] = useState('single-repo');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const runTest = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      let url = '';
      
      switch (mode) {
        case 'single-repo':
          url = `/api/debug/fingerprint?action=info&platform=${platform}&owner=${owner}&name=${repo}`;
          break;
        case 'compare-repos':
          url = `/api/debug/fingerprint?action=compare&platform=${platform}&owner=${owner}&name=${repo}&owner2=${owner2}&name2=${repo2}`;
          break;
        case 'special-chars':
          url = `/api/debug/fingerprint?action=special-chars&platform=${platform}`;
          break;
        case 'public-private':
          url = `/api/debug/fingerprint?action=public-private&platform=${platform}&owner=${owner}&name=${repo}`;
          break;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error during test:', error);
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };
  
  // Handlers for the sample tests
  const testLowercase = () => {
    setMode('single-repo');
    setOwner('test-org');
    setRepo('test-repo');
    setTimeout(runTest, 100);
  };
  
  const testUppercase = () => {
    setMode('single-repo');
    setOwner('TEST-ORG');
    setRepo('TEST-REPO');
    setTimeout(runTest, 100);
  };
  
  const testCaseSensitivity = () => {
    setMode('compare-repos');
    setOwner('test-org');
    setRepo('test-repo');
    setOwner2('TEST-ORG');
    setRepo2('TEST-REPO');
    setTimeout(runTest, 100);
  };
  
  const testDifferentOwners = () => {
    setMode('compare-repos');
    setOwner('test-org');
    setRepo('test-repo');
    setOwner2('other-org');
    setRepo2('test-repo');
    setTimeout(runTest, 100);
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <h2 className="text-xl font-bold text-green-800">Edge Case Tests for Repository Fingerprinting</h2>
        <p className="text-green-700 mt-2">This tool helps verify that repository fingerprinting works correctly in edge cases such as:</p>
        <ul className="list-disc ml-6 mt-2 text-green-700">
          <li>Case sensitivity (Owner/Repo vs owner/repo)</li>
          <li>Special characters in repository names</li>
          <li>Different owners with same repository name</li>
          <li>Public/private repository switching</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setMode('single-repo')}
          className={`text-center py-2 px-4 rounded transition-colors ${
            mode === 'single-repo' 
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Single Repository
        </button>
        <button
          onClick={() => setMode('compare-repos')}
          className={`text-center py-2 px-4 rounded transition-colors ${
            mode === 'compare-repos' 
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Compare Repos
        </button>
        <button
          onClick={() => setMode('special-chars')}
          className={`text-center py-2 px-4 rounded transition-colors ${
            mode === 'special-chars' 
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Special Characters
        </button>
        <button
          onClick={() => setMode('public-private')}
          className={`text-center py-2 px-4 rounded transition-colors ${
            mode === 'public-private' 
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Public/Private
        </button>
        <a
          href="/large-pr-test"
          className="text-center py-2 px-4 rounded transition-colors bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Large PR Test
        </a>
      </div>
      
      {mode === 'single-repo' && (
        <Card className="mb-6 p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-blue-800">Single Repository Test</h2>
          <p className="mb-4 text-gray-600">Get detailed fingerprint information for a single repository</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g., facebook"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repository</label>
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="e.g., react"
                className="w-full"
              />
            </div>
          </div>
          
          <Button
            onClick={runTest}
            disabled={loading || !owner || !repo}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? 'Running Test...' : 'Test Repository Fingerprinting'}
          </Button>
        </Card>
      )}
      
      {mode === 'compare-repos' && (
        <Card className="mb-6 p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-blue-800">Compare Repositories Test</h2>
          <p className="mb-4 text-gray-600">Compare fingerprints between two repositories</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Repository 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  <Input
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="e.g., facebook"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repository</label>
                  <Input
                    value={repo}
                    onChange={(e) => setRepo(e.target.value)}
                    placeholder="e.g., react"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Repository 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  <Input
                    value={owner2}
                    onChange={(e) => setOwner2(e.target.value)}
                    placeholder="e.g., FACEBOOK"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repository</label>
                  <Input
                    value={repo2}
                    onChange={(e) => setRepo2(e.target.value)}
                    placeholder="e.g., React"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Button
            onClick={runTest}
            disabled={loading || !owner || !repo || !owner2 || !repo2}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-6"
          >
            {loading ? 'Comparing...' : 'Compare Repositories'}
          </Button>
        </Card>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 text-blue-800">Quick Test Samples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={testLowercase}
            className="bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
          >
            Test: test-org/test-repo (lowercase)
          </Button>
          
          <Button
            onClick={testUppercase}
            className="bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
          >
            Test: TEST-ORG/TEST-REPO (uppercase)
          </Button>
          
          <Button
            onClick={testCaseSensitivity}
            className="bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
          >
            Compare: Case Sensitivity Test
          </Button>
          
          <Button
            onClick={testDifferentOwners}
            className="bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
          >
            Compare: Different Owners Test
          </Button>
        </div>
      </div>
      
      {result && (
        <div className="mt-8 bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Test Results</h2>
          <div className="bg-black rounded-lg p-4 overflow-auto max-h-[500px]">
            <pre className="text-sm text-green-400 font-mono">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          For Large PR testing (1000+ files), please use the{" "}
          <a href="/large-pr-test" className="text-blue-600 hover:underline">
            Large PR Test Tool
          </a>
        </p>
      </div>
    </div>
  );
}
