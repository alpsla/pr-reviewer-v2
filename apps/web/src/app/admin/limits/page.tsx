'use client';

import { Header, Footer } from '@/components/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useState, useEffect } from 'react';
import { DEFAULT_FREE_TIER_ANALYSIS_LIMIT, TEST_REPOSITORIES } from '@/config/limits';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw, Settings } from 'lucide-react';

export default function AdminLimitsPage() {
  const [defaultLimit, setDefaultLimit] = useState<number>(DEFAULT_FREE_TIER_ANALYSIS_LIMIT);
  const [testRepoLimit, setTestRepoLimit] = useState<number>(TEST_REPOSITORIES.FREE_TIER_ANALYSIS_LIMIT);
  const [customLimits, setCustomLimits] = useState<{owner: string; repo: string; limit: number}[]>([]);
  const [newCustomLimit, setNewCustomLimit] = useState<{owner: string; repo: string; limit: number}>({
    owner: '',
    repo: '',
    limit: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
  
  // Load saved custom limits from localStorage
  useEffect(() => {
    try {
      const savedLimits = localStorage.getItem('customRepositoryLimits');
      if (savedLimits) {
        setCustomLimits(JSON.parse(savedLimits));
      }
      
      // Load saved default limit
      const savedDefaultLimit = localStorage.getItem('defaultFreeAnalysisLimit');
      if (savedDefaultLimit) {
        setDefaultLimit(parseInt(savedDefaultLimit, 10));
      }
      
      // Load saved test repo limit
      const savedTestLimit = localStorage.getItem('testRepoAnalysisLimit');
      if (savedTestLimit) {
        setTestRepoLimit(parseInt(savedTestLimit, 10));
      }
    } catch (error) {
      console.error('Error loading saved limits:', error);
    }
  }, []);
  
  // Save changes to localStorage and update config
  const saveChanges = () => {
    setIsLoading(true);
    
    try {
      // Save default limit
      localStorage.setItem('defaultFreeAnalysisLimit', defaultLimit.toString());
      
      // Save test repo limit
      localStorage.setItem('testRepoAnalysisLimit', testRepoLimit.toString());
      
      // Save custom limits
      localStorage.setItem('customRepositoryLimits', JSON.stringify(customLimits));
      
      // Show success message
      setMessage({text: 'Settings saved successfully!', type: 'success'});
      
      // In a real application, we would also update the server-side configuration
      // or database settings here
    } catch (error) {
      console.error('Error saving limits:', error);
      setMessage({text: 'Error saving settings', type: 'error'});
    } finally {
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };
  
  // Add new custom limit
  const addCustomLimit = () => {
    if (!newCustomLimit.owner || !newCustomLimit.repo) {
      setMessage({text: 'Owner and repository name are required', type: 'error'});
      return;
    }
    
    setCustomLimits([...customLimits, newCustomLimit]);
    setNewCustomLimit({owner: '', repo: '', limit: 10});
  };
  
  // Remove custom limit
  const removeCustomLimit = (index: number) => {
    const newLimits = [...customLimits];
    newLimits.splice(index, 1);
    setCustomLimits(newLimits);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb and title */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Admin', href: '/admin' },
              { label: 'Analysis Limits', href: '/admin/limits' }
            ]} 
          />
          <div className="flex items-center justify-between mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Repository Analysis Limits
            </h1>
            <Button
              onClick={saveChanges}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Configure free tier analysis limits for repositories
          </p>
        </div>
        
        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 mb-6 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}
        
        {/* Default Limits Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            Default Limits
          </h2>
          
          <div className="space-y-6">
            {/* Default Free Tier Limit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Default Free Tier Limit
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={defaultLimit}
                  onChange={(e) => setDefaultLimit(parseInt(e.target.value, 10) || 1)}
                  className="w-24 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  analyses per repository
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This limit applies to all repositories not covered by custom rules
              </p>
            </div>
            
            {/* Test Repository Limit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Test Repository Limit
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={testRepoLimit}
                  onChange={(e) => setTestRepoLimit(parseInt(e.target.value, 10) || 1)}
                  className="w-24 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  analyses per repository
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Applies to repositories with 'test' in their name or owner
              </p>
            </div>
          </div>
        </div>
        
        {/* Custom Limits Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Custom Repository Limits
          </h2>
          
          {/* Add new custom limit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Owner
              </label>
              <input
                type="text"
                value={newCustomLimit.owner}
                onChange={(e) => setNewCustomLimit({...newCustomLimit, owner: e.target.value})}
                placeholder="e.g., organization"
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Repository
              </label>
              <input
                type="text"
                value={newCustomLimit.repo}
                onChange={(e) => setNewCustomLimit({...newCustomLimit, repo: e.target.value})}
                placeholder="e.g., project"
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Limit
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={newCustomLimit.limit}
                  onChange={(e) => setNewCustomLimit({...newCustomLimit, limit: parseInt(e.target.value, 10) || 1})}
                  className="w-24 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button 
                  onClick={addCustomLimit}
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Custom limits list */}
          {customLimits.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              No custom repository limits defined
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2">Owner</th>
                    <th className="pb-2">Repository</th>
                    <th className="pb-2">Limit</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customLimits.map((limit, index) => (
                    <tr key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <td className="py-3 pr-4">{limit.owner}</td>
                      <td className="py-3 pr-4">{limit.repo}</td>
                      <td className="py-3 pr-4">{limit.limit}</td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomLimit(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Help Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-700 dark:text-blue-300 text-sm">
          <h3 className="font-medium mb-2">How Limits Are Applied</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Custom repository limits are checked first</li>
            <li>Repositories with 'test' in their name use the test repository limit</li>
            <li>All other repositories use the default free tier limit</li>
          </ol>
          <p className="mt-2">
            Note: These settings only affect new analyses. Existing repositories with analysis count data in the database
            will continue to use their previously configured limits.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
