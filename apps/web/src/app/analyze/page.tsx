'use client';

import { Header, Footer } from '@/components/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PrPreviewSection } from '@/components/analyze/pr-preview-section';
import { Repositories } from '@/components/analyze/repositories';
import { AnalysisOptions } from '@/components/analyze/analysis-options';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle, Zap, Shield, Clock } from 'lucide-react';
import { useRepositoryAnalysis } from '@/hooks/use-repository-analysis';
import { RepositoryAccessError } from '@/components/repository-access';
import { useAuth } from '@/context/auth-context';

export default function AnalyzePage() {
  // Get user info from auth context
  const { user } = useAuth();
  const [prUrl, setPrUrl] = useState<string>('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [notification, setNotification] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({ visible: false, message: '', type: 'success' });
  
  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
        
        if (notification.type === 'success' && analysisState === 'processing') {
          // Leave the processing state as-is
        } else if (notification.type === 'error') {
          // Reset analysis state on error notification dismissal
          setAnalysisState('idle');
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.visible, notification.type, analysisState]);
  
  const { 
    isLoading, 
    limits, 
    parseRepositoryUrl, 
    parsePullRequestNumber, 
    getAnalysisLimits, 
    incrementAnalysisCount 
  } = useRepositoryAnalysis();
  
  // Update the free analyses tracking to use real data
  const freeAnalysesUsed = limits?.current || 0;
  const freeAnalysesTotal = limits?.limit || 5;
  const hasReachedLimit = limits?.hasReachedLimit || false;
  
  const freeTierMessage = hasReachedLimit 
    ? `This repository has reached the free analysis limit (${freeAnalysesUsed}/${freeAnalysesTotal})` 
    : `This repository has used ${freeAnalysesUsed} of ${freeAnalysesTotal} free analyses`;
  
  const handlePrUrlChange = async (url: string) => {
    setPrUrl(url);
    
    // Basic validation
    if (!url) {
      setValidationStatus('idle');
      setValidationMessage('');
      return;
    }
    
    // Start validation
    setValidationStatus('validating');
    
    // Parse repository and PR info
    const repoInfo = parseRepositoryUrl(url);
    const prNumber = parsePullRequestNumber(url);
    
    if (!repoInfo || !prNumber) {
      setValidationStatus('error');
      setValidationMessage(
        !repoInfo 
          ? 'URL must be from GitHub or GitLab' 
          : 'URL does not appear to be a pull request'
      );
      return;
    }
    
    try {
      // Store the URL in recent repositories for future use
      try {
        // First check if we already have this in localStorage
        const recentReposString = localStorage.getItem('recentRepositories');
        let recentRepos = recentReposString ? JSON.parse(recentReposString) : [];
        
        // Create repository object
        const newRepo = {
          url: url,
          owner: repoInfo.owner,
          name: repoInfo.repo,
          platform: repoInfo.platform,
          lastAccessed: new Date().toISOString()
        };
        
        // Remove any existing entries with the same URL
        recentRepos = recentRepos.filter((repo: any) => repo.url !== url);
        
        // Add new entry at the beginning
        recentRepos.unshift(newRepo);
        
        // Limit to 5 entries
        recentRepos = recentRepos.slice(0, 5);
        
        // Save back to localStorage
        localStorage.setItem('recentRepositories', JSON.stringify(recentRepos));
        
        // Also store in recent PRs
        const recentPRsString = localStorage.getItem('recentPRs');
        let recentPRs = recentPRsString ? JSON.parse(recentPRsString) : [];
        
        // Create PR object
        const newPR = {
          url: url,
          repository: `${repoInfo.owner}/${repoInfo.repo}`,
          platform: repoInfo.platform,
          lastAccessed: new Date().toISOString(),
          title: `Pull Request #${prNumber}`
        };
        
        // Remove any existing entries with the same URL
        recentPRs = recentPRs.filter((pr: any) => pr.url !== url);
        
        // Add new entry at the beginning
        recentPRs.unshift(newPR);
        
        // Limit to 5 entries
        recentPRs = recentPRs.slice(0, 5);
        
        // Save back to localStorage
        localStorage.setItem('recentPRs', JSON.stringify(recentPRs));
      } catch (storageError) {
        console.error('Error storing recent repositories:', storageError);
        // Continue with validation regardless of storage error
      }
      
      // Get analysis limits
      const limits = await getAnalysisLimits(repoInfo);
      
      if (limits) {
        // Check if reached limit
        if (limits.hasReachedLimit) {
          setValidationStatus('error');
          setValidationMessage('URL validation successful but analysis limit reached');
          return;
        }
      }
      
      // Set success status
      setValidationStatus('success');
      setValidationMessage('PR URL is valid');
    } catch (error) {
      setValidationStatus('error');
      setValidationMessage(error instanceof Error ? error.message : String(error));
    }
  };
  
  const handleAnalyze = async () => {
    // DEFENSE 1: Block if no URL or invalid URL
    if (!prUrl || !parseRepositoryUrl(prUrl)) {
      console.error('Cannot analyze: Invalid PR URL');
      setNotification({ 
        visible: true, 
        message: "Cannot analyze: Invalid PR URL", 
        type: 'error' 
      });
      return;
    }
    
    // DEFENSE 2: Block if already processing
    if (isLoading || analysisState === 'processing') {
      console.log('Cannot analyze: Already processing');
      return;
    }
    
    // DEFENSE 3: Block if reached limit
    if (hasReachedLimit) {
      console.error('Cannot analyze: Analysis limit reached');
      setNotification({ 
        visible: true, 
        message: "Analysis limit reached for this repository", 
        type: 'error' 
      });
      return;
    }
    
    console.log('Starting analysis for PR URL:', prUrl);
    setValidationStatus('validating');
    setAnalysisState('processing');
    
    try {
      // Increment analysis count
      console.log('Calling incrementAnalysisCount with URL:', prUrl);
      const newCount = await incrementAnalysisCount(prUrl);
      console.log('Analysis result:', newCount);
      
      // Reset validation status after analysis completes
      setValidationStatus('success');
      
      if (newCount !== null) {
        // Here you would typically navigate to the results page or show the analysis
        console.log(`Analysis count incremented to ${newCount}`);
        
        // Force refresh the limits
        const repoInfo = parseRepositoryUrl(prUrl);
        if (repoInfo) {
          console.log('Refreshing limits after successful analysis...');
          const updatedLimits = await getAnalysisLimits(repoInfo);
          console.log('Updated limits:', updatedLimits);
        }
        
        setAnalysisState('completed');
        setNotification({ visible: true, message: "Analysis started successfully! Processing your PR...", type: "success" });
      } else {
        console.error('Analysis returned null but no error was thrown');
        setValidationStatus('error');
        setValidationMessage("Analysis could not be completed. Please try again.");
        setAnalysisState('error');
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      setValidationStatus('error');
      
      // Determine if this is an access error
      const isAccessError = 
        (error instanceof Error && 
         (error.message.includes("Access denied") || 
          error.message.includes("access denied") || 
          error.message.includes("sign in") ||
          error.message.includes("Cannot access private repository") ||
          error.message.includes("private repository") ||
          error.message.includes("PRIVATE_REPOSITORY_ACCESS_DENIED") ||
          error.message.includes("ACCESS_DENIED") ||
          error.message.includes("Authentication required") ||
          error.message.includes("insufficient permissions"))) ||
        (typeof error === 'object' && error !== null && 'message' in error && 
         typeof error.message === 'string' && 
         (error.message.includes("Access denied") || 
          error.message.includes("access denied") || 
          error.message.includes("sign in") ||
          error.message.includes("Cannot access private repository") ||
          error.message.includes("private repository") ||
          error.message.includes("PRIVATE_REPOSITORY_ACCESS_DENIED") ||
          error.message.includes("ACCESS_DENIED") ||
          error.message.includes("Authentication required") ||
          error.message.includes("insufficient permissions")));
      
      // Check type of error for appropriate message
      if (isAccessError) {
        if (validationMessage.toLowerCase().includes('private')) {
          setValidationMessage('Access denied. This is a private repository. Please sign in with an account that has proper permissions.');
        } else {
          setValidationMessage('Access denied. Please sign in with an account that has proper permissions.');
        }
      } else if (error instanceof Error && error.message && error.message.includes('limit')) {
        setValidationMessage('Analysis limit reached');
      } else if (typeof error === 'object' && error !== null && 'message' in error && 
                typeof error.message === 'string' && error.message.includes('limit')) {
        setValidationMessage('Analysis limit reached');
      } else {
        setValidationMessage(error instanceof Error ? error.message : String(error));
      }
      
      setAnalysisState('error');
      setNotification({ 
        visible: true, 
        message: isAccessError
          ? validationMessage.toLowerCase().includes('private') 
            ? `Access denied to private repository. Sign in with an account that has proper permissions`
            : `Access denied. Sign in with an account that has proper permissions`
          : `Analysis failed: ${error instanceof Error ? error.message : String(error)}`, 
        type: 'error' 
      });
    }
  };
  
  // Load repository limits when the page loads (if there's a URL in state)
  useEffect(() => {
    if (prUrl) {
      const repoInfo = parseRepositoryUrl(prUrl);
      if (repoInfo) {
        console.log('Loading initial limits for:', repoInfo);
        getAnalysisLimits(repoInfo).catch(err => {
          console.error('Error loading initial limits:', err);
        });
      }
    }
  }, [prUrl, parseRepositoryUrl, getAnalysisLimits]);
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {/* Custom notification */}
      {notification.visible && (
        <div 
          className={`fixed top-16 right-8 z-[1000] p-3 rounded-md shadow-lg transition-all duration-300 transform ${
            notification.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'} ${
            notification.type === 'success' 
              ? 'bg-blue-500 dark:bg-blue-600' 
              : 'bg-red-500 dark:bg-red-600'
          }`}
        >
          <div className="flex items-center">
            <div className="h-4 w-4 text-white mr-2 flex-shrink-0">
              {notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <div>
              {notification.type === 'error' && (
                notification.message.toLowerCase().includes('sign in') || 
                notification.message.toLowerCase().includes('access denied') ||
                notification.message.toLowerCase().includes('authentication required') ||
                notification.message.toLowerCase().includes('permissions')
              ) ? (
                <>
                  <p className="text-white text-sm font-medium">Access denied</p>
                  <p className="text-white text-xs opacity-90">{notification.message}</p>
                </>
              ) : (
                <p className="text-white text-sm font-medium">{notification.message}</p>
              )}
            </div>
            <button 
              onClick={() => setNotification({ ...notification, visible: false })}
              className="ml-3 text-white hover:text-white/90 focus:outline-none transition-colors"
              aria-label="Close notification"
            >
              <span className="text-lg font-bold text-white">&times;</span>
            </button>
          </div>
        </div>
      )}
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb and title */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/dashboard' },
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
        <div className={`mb-6 p-3 ${
          hasReachedLimit 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        } border rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${hasReachedLimit ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${(freeAnalysesUsed / freeAnalysesTotal) * 100}%` }}
                ></div>
              </div>
              <span className={`ml-3 text-sm ${
                hasReachedLimit 
                  ? 'text-red-600 dark:text-red-300 font-medium' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
                {freeTierMessage}
              </span>
            </div>
            <Link
              href="#upgrade"
              className={`text-xs ${
                hasReachedLimit ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium p-2 rounded-md transition-colors flex items-center gap-1`}
            >
              <Sparkles className="h-3 w-3 text-amber-300" />
              Upgrade
            </Link>
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
                    {(validationStatus === 'validating' || (isLoading && analysisState !== 'processing')) && (
                      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {validationStatus === 'error' && (
                      <div className="h-5 w-5 text-red-500">❌</div>
                    )}
                    {validationStatus === 'success' && !isLoading && analysisState !== 'processing' && (
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Validation feedback */}
              {validationMessage && !validationMessage.includes('limit') && validationStatus !== 'success' && (
                <div className="mt-2">
                  {validationStatus === 'error' && 
                   (validationMessage.toLowerCase().includes('access denied') ||
                    validationMessage.toLowerCase().includes('private repository')) ? (
                    <RepositoryAccessError
                      error={validationMessage}
                      isPrivate={validationMessage.toLowerCase().includes('private')}
                      platform={parseRepositoryUrl(prUrl)?.platform as 'github' | 'gitlab'}
                      owner={parseRepositoryUrl(prUrl)?.owner}
                      repo={parseRepositoryUrl(prUrl)?.repo}
                      currentUser={{
                        username: user?.email?.split('@')[0] || user?.user_metadata?.preferred_username || user?.user_metadata?.user_name || user?.user_metadata?.name,
                        provider: user?.app_metadata?.provider
                      }}
                      onRetry={() => {
                        if (prUrl) {
                          handlePrUrlChange(prUrl);
                        }
                      }}
                    />
                  ) : (
                    <p className={`text-sm ${
                      validationStatus === 'error' 
                        ? "text-red-500 font-medium" 
                        : "text-green-500 dark:text-green-400 font-medium"
                    }`}>
                      {validationMessage}
                    </p>
                  )}
                </div>
              )}
              
              {/* Submit button - ULTRA DEFENSIVE VERSION */}
              <div className="flex justify-end mt-2">
                {validationStatus === 'success' && !hasReachedLimit &&
                 !isLoading && analysisState !== 'processing' ? (
                  // ONLY show active button if ALL conditions are met
                  <button
                    onClick={handleAnalyze}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors text-center"
                  >
                    {isLoading ? 'Processing...' : 'Analyze PR'}
                  </button>
                ) : (
                  // In ALL other cases, show a disabled button with appropriate message
                  <span className="inline-block px-6 py-3 bg-slate-400 text-white font-medium rounded-md opacity-60 cursor-not-allowed">
                    {hasReachedLimit ? 'Limit Reached' : 
                     validationStatus !== 'success' ? 'Enter Valid PR URL' :
                     isLoading || analysisState === 'processing' ? 'Processing...' : 
                     'Analyze PR'}
                  </span>
                )}
              </div>
              
              {/* Cross-platform notice for GitLab users looking at GitHub PRs or vice versa */}
              {prUrl && validationStatus === 'validating' && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <span>
                      <span className="font-medium">Cross-platform support:</span> We now support analyzing GitHub repositories with GitLab authentication (and vice versa).
                    </span>
                  </p>
                </div>
              )}

              {/* Only show upgrade prompt if we've reached the limit */}
              {hasReachedLimit && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm">
                  <p className="text-red-700 dark:text-red-300 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-amber-300" />
                    <span>
                      Upgrade to <Link href="#upgrade" className="font-medium underline">Premium</Link> for unlimited analyses.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* PR Preview - Full Width, only shown when we have details */}
        {validationStatus === 'success' && (
          <div className="mb-8 w-full" key={prUrl}>
            <PrPreviewSection 
              prUrl={prUrl}
              repoInfo={parseRepositoryUrl(prUrl)}
              prNumber={parsePullRequestNumber(prUrl)}
            />
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
                <Link 
                  href="#upgrade" 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors text-center px-8"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
