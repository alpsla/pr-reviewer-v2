'use client';

import { Header, Footer } from '@/components/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PrInputSection } from '@/components/analyze/pr-input-section-simplified';
import { PrPreviewSection } from '@/components/analyze/pr-preview-section';
import { Repositories } from '@/components/analyze/repositories';
import { AnalysisOptions } from '@/components/analyze/analysis-options';
import { useState } from 'react';

export default function AnalyzePageSimplified() {
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* PR Input with integrated Free Tier Status */}
            <PrInputSection 
              prUrl={prUrl}
              onChange={handlePrUrlChange}
              validationStatus={validationStatus}
              validationMessage={validationMessage}
              freeAnalysesUsed={freeAnalysesUsed}
              freeAnalysesTotal={freeAnalysesTotal}
            />
            
            {/* PR Preview - only show when we have details */}
            {prDetails && (
              <PrPreviewSection prDetails={prDetails} />
            )}
            
            {/* Analysis Options - only show when we have details */}
            {prDetails && (
              <AnalysisOptions />
            )}
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-8">
            {/* Unified Repositories component */}
            <Repositories onSelect={handlePrUrlChange} />
            
            {/* Tips and best practices card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
}