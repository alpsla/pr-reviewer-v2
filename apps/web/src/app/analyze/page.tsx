'use client';

import { Header, Footer } from '@/components/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { PrInputSection } from '@/components/analyze/pr-input-section-simplified';
import { PrPreviewSection } from '@/components/analyze/pr-preview-section';
import { Repositories } from '@/components/analyze/repositories';
import { AnalysisOptions } from '@/components/analyze/analysis-options';
import { useState } from 'react';
import { Sparkles, CheckCircle, Zap, Shield, Clock } from 'lucide-react';

export default function AnalyzePage() {
  const [prUrl, setPrUrl] = useState<string>('');
  const [prDetails, setPrDetails] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // Free analyses tracking (mock for now)
  const freeAnalysesUsed = 3;
  const freeAnalysesTotal = 5;
  
  const handlePrUrlChange = (url: string) => {
    setPrUrl(url);
    
    // Basic validation
    if (!url) {
      setValidationStatus('idle');
      setValidationMessage('');
      setPrDetails(null);
      return;
    }
    
    // Start validation
    setValidationStatus('validating');
    
    // Mock validation - in a real app this would check the URL with an API
    setTimeout(() => {
      if (url.includes('github.com') || url.includes('gitlab.com')) {
        if (url.includes('/pull/') || url.includes('/merge_requests/')) {
          setValidationStatus('success');
          setValidationMessage('PR URL is valid');
          
          // Mock PR details - in a real app this would come from an API
          setPrDetails({
            title: 'Update dependencies and fix layout issues',
            repository: 'acme/widget-service',
            author: 'jane-doe',
            createdAt: '2025-02-15T10:30:00Z',
            updatedAt: '2025-02-25T14:22:00Z',
            filesChanged: 12,
            linesAdded: 156,
            linesRemoved: 43,
            branches: {
              source: 'feature/dependency-updates',
              target: 'main'
            }
          });
        } else {
          setValidationStatus('error');
          setValidationMessage('URL does not appear to be a pull request');
          setPrDetails(null);
        }
      } else {
        setValidationStatus('error');
        setValidationMessage('URL must be from GitHub or GitLab');
        setPrDetails(null);
      }
    }, 1000);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb and title */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'PR Analysis', href: '/analyze' }
            ]} 
          />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Analyze Your Pull Request
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            Get AI-powered feedback on your code changes
          </p>
        </div>
        
        {/* Free tier status banner */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(freeAnalysesUsed / freeAnalysesTotal) * 100}%` }}
                ></div>
              </div>
              <span className="ml-3 text-sm text-slate-600 dark:text-slate-300">
                You've used {freeAnalysesUsed} of {freeAnalysesTotal} free analyses
              </span>
            </div>
            <Button
            size="sm"
            variant="outline"
            className="text-xs bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm"
            >
              <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
              Upgrade
            </Button>
          </div>
        </div>
        
        {/* PR Input - Full Width */}
        <div className="mb-8 w-full">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Enter a Pull Request URL
            </h2>
            
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                Enter a GitHub or GitLab pull request URL to analyze
              </p>
              
              {/* URL Input with platform icons */}
              <div className="relative">
                <input
                  type="text"
                  value={prUrl}
                  onChange={(e) => handlePrUrlChange(e.target.value)}
                  placeholder="https://github.com/username/repo/pull/123"
                  className={`block w-full px-4 py-3 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 border
                    focus:ring-2 focus:outline-none focus:ring-blue-500/50 shadow-sm focus:shadow-md transition-all duration-200
                    ${validationStatus === 'error'
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500"
                      : validationStatus === 'success'
                      ? "border-green-300 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500"
                      : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500"
                    }`}
                />
                
                {/* Status indicator */}
                {validationStatus !== 'idle' && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {validationStatus === 'validating' && (
                      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {validationStatus === 'error' && (
                      <div className="h-5 w-5 text-red-500">❌</div>
                    )}
                    {validationStatus === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Validation feedback */}
              {validationMessage && (
                <p className={`text-sm ${validationStatus === 'error' ? "text-red-500" : "text-green-500 dark:text-green-400 font-medium"}`}>
                  {validationMessage}
                </p>
              )}
              
              {/* Submit button */}
              <div className="flex justify-end mt-2">
                <Button 
                  disabled={validationStatus !== 'success'}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Analyze PR
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* PR Preview - Full Width, only shown when we have details */}
        {prDetails && (
          <div className="mb-8 w-full">
            <PrPreviewSection prDetails={prDetails} />
          </div>
        )}
        
        {/* Analysis Options - Full Width, only shown when we have details */}
        {prDetails && (
          <div className="mb-8 w-full">
            <AnalysisOptions />
          </div>
        )}
        
        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Tips Card - 2/3 width */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Tips for Better Analysis
              </h2>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium text-xs">1</span>
                  <span>Submit PRs with a clearly defined purpose and scope</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium text-xs">2</span>
                  <span>Include meaningful commit messages and PR descriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium text-xs">3</span>
                  <span>Keep PRs reasonably sized (under 500 lines when possible)</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium text-xs">4</span>
                  <span>Use conventional commit formats for better categorization</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Repositories - 1/3 width */}
          <div className="md:col-span-1">
            <Repositories onSelect={handlePrUrlChange} />
          </div>
        </div>
        
        {/* Upgrade to Pro - Full Width */}
        <div className="w-full">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600/80 dark:to-indigo-700/80 dark:bg-opacity-80 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 p-6 text-white overflow-hidden relative">
            {/* Overlay pattern for dark mode */}
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-0"></div>
            
            {/* Content with relative positioning to appear above the overlay */}
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-amber-300" />
              Upgrade to Pro
              </h2>
              
              <p className="mb-6 text-white/90 dark:text-white">
              Get unlimited PR analyses, detailed reports, and advanced features
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 mr-2 text-amber-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Unlimited Analysis</h3>
                    <p className="text-sm text-white/90 dark:text-white/80">No more restrictions on PR analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-2 text-amber-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Private Repositories</h3>
                    <p className="text-sm text-white/90 dark:text-white/80">Full support for private code</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-amber-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Faster Analysis</h3>
                    <p className="text-sm text-white/90 dark:text-white/80">Priority queue for your PRs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-amber-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Advanced Reports</h3>
                    <p className="text-sm text-white/90 dark:text-white/80">More detailed insights</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button className="bg-white dark:bg-white/90 text-blue-600 dark:text-blue-700 hover:bg-blue-50 dark:hover:bg-white px-8 py-2 shadow-md hover:shadow-lg transition-all duration-200">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}