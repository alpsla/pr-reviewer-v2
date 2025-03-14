'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LargePrTestPage() {
  const [platform, setPlatform] = useState('github');
  const [owner, setOwner] = useState('torvalds');
  const [repo, setRepo] = useState('linux');
  const [prNumber, setPrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    
    if (!owner || !repo || !prNumber) {
      setResult({
        success: false,
        error: "Missing input fields",
        details: "Owner, repository name, and PR number are all required"
      });
      setLoading(false);
      return;
    }
    
    try {
      console.log(`Testing with: ${owner}/${repo} PR #${prNumber}`);
      
      // Let's try multiple parameter combinations to handle potential API differences
      let url = `/api/debug/fingerprint?action=large-pr&platform=${platform}&owner=${owner}`;
      
      // Add repo parameter in multiple formats to handle different API expectations
      url += `&repo=${repo}&name=${repo}`;
      
      // Add PR number
      url += `&pr=${prNumber}&prNumber=${prNumber}`;
      
      console.log('Fetching from:', url);
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Response received:', data);
      
      // Log the response structure to help debug
      console.log('Response structure:', {
        success: data.success,
        hasLargePrTest: !!data.largePrTest,
        hasTiming: !!(data.largePrTest?.timing || data.timing),
        fileCount: data.largePrTest?.fileCount || data.fileCount,
        topLevelKeys: Object.keys(data)
      });
      
      // Additional data sanitization
      if (data.success && !data.largePrTest && data.fileCount) {
        // If data is at the top level instead of in largePrTest
        data.largePrTest = {
          fileCount: data.fileCount,
          batchCount: data.batchCount,
          totalAdditions: data.totalAdditions,
          totalDeletions: data.totalDeletions,
          timing: data.timing,
          memoryUsage: data.memoryUsage
        };
      }
      
      setResult(data);
    } catch (error) {
      console.error('Error during test:', error);
      setResult({ 
        success: false,
        error: String(error),
        details: "An error occurred during the API request"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center text-blue-700">Large PR Testing Tool</h1>
      <p className="text-center mb-6 text-blue-600">Test Case FP-9: Verify handling of PRs with 1000+ files</p>
      
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
        <p className="text-blue-800">
          This tool helps verify that the system can handle large pull requests with many files.
          It tests performance, pagination, and memory management.
        </p>
      </div>
      
      <Card className="p-6 mb-6 border-2 border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Large PR Performance Test</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Owner</label>
            <Input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g., torvalds"
              className="border-2 border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">Repository owner or organization</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Repository</label>
            <Input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g., linux"
              className="border-2 border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">Repository name</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">PR Number</label>
            <Input
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              placeholder="e.g., 12345"
              className="border-2 border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">Pull request number to test</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded"
            >
              <option value="github">GitHub</option>
              <option value="gitlab">GitLab</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Version control platform</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
          <p className="font-bold text-yellow-800 mb-2">Suggested Test Examples:</p>
          <ul className="list-disc pl-5 text-yellow-800">
            <li>Linux Kernel: <span className="font-mono">torvalds/linux</span> with PRs like #19954</li>
            <li>VS Code: <span className="font-mono">microsoft/vscode</span> with PR #169533</li>
            <li>React: <span className="font-mono">facebook/react</span> with PR #25141</li>
          </ul>
        </div>
        
        <Button
          onClick={runTest}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
        >
          {loading ? 'Testing Large PR...' : 'Run Large PR Performance Test'}
        </Button>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button
          onClick={() => {
            setOwner('torvalds');
            setRepo('linux');
            setPrNumber('19954');
            setTimeout(() => {
              document.getElementById('run-test-btn')?.click();
            }, 100);
          }}
          className="bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
        >
          Test Linux Kernel PR #19954
        </Button>
        
        <Button
          onClick={() => {
            setOwner('microsoft');
            setRepo('vscode');
            setPrNumber('169533');
            setTimeout(() => {
              document.getElementById('run-test-btn')?.click();
            }, 100);
          }}
          className="bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
        >
          Test VS Code PR #169533
        </Button>
      </div>
      
      {result && (
        <div className="mt-6 border-t-2 border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Test Results</h2>
          
          {!result.success && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
              <p className="font-bold text-red-800">Error: {result.error}</p>
              {result.details && <p className="text-red-700 mt-2">{result.details}</p>}
              <p className="text-red-700 mt-2 italic">Make sure all fields are filled in correctly.</p>
            </div>
          )}
          
          {result.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-green-800 mb-4 text-lg">Performance Metrics</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
                  <p className="text-xs text-green-600">Files Processed</p>
                  <p className="text-xl font-bold text-green-700">
                    {result.largePrTest?.fileCount || result.fileCount || 'N/A'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
                  <p className="text-xs text-green-600">API Batches</p>
                  <p className="text-xl font-bold text-green-700">
                    {result.largePrTest?.batchCount || result.batchCount || 'N/A'}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
                  <p className="text-xs text-green-600">Lines Added</p>
                  <p className="text-xl font-bold text-green-700">
                    +{result.largePrTest?.totalAdditions || result.totalAdditions || 0}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
                  <p className="text-xs text-green-600">Lines Removed</p>
                  <p className="text-xl font-bold text-green-700">
                    -{result.largePrTest?.totalDeletions || result.totalDeletions || 0}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100 col-span-2">
                  <p className="text-xs text-green-600">Total Process Time</p>
                  <p className="text-xl font-bold text-green-700">
                    {(() => {
                      const total = result.largePrTest?.timing?.total || result.timing?.total;
                      if (total && !isNaN(total)) {
                        return `${Math.round(total / 1000)}s`;
                      }
                      return 'N/A';
                    })()}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100 col-span-2">
                  <p className="text-xs text-green-600">Memory Used</p>
                  <p className="text-xl font-bold text-green-700">
                    {(() => {
                      const heapUsed = 
                        result.largePrTest?.memoryUsage?.difference?.heapUsed || 
                        result.memoryUsage?.difference?.heapUsed;
                      if (heapUsed && !isNaN(heapUsed)) {
                        return `${Math.round(heapUsed / 1024 / 1024)}MB`;
                      }
                      return 'N/A';
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[400px]">
            <pre className="text-sm text-green-400 font-mono">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <a href="/fingerprint-edge-tests" className="text-blue-600 hover:underline">
          ← Back to Fingerprint Edge Tests
        </a>
      </div>
      
      {/* Hidden button for programmatic clicking */}
      <button 
        id="run-test-btn" 
        onClick={runTest} 
        className="hidden"
      />
    </div>
  );
}
