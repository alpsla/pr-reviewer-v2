'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRepositoryAnalysis } from '@/hooks/use-repository-analysis';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [analysisStats, setAnalysisStats] = useState({
    totalAnalyses: 0,
    freeUsed: 0,
    freeLimit: 5,
    lastAnalysis: null
  });
  
  // Get the repository analysis hook for getting stats
  const { getAnalysisLimits } = useRepositoryAnalysis();
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch analysis stats
  useEffect(() => {
    if (!isLoading && user) {
      // In a real implementation, you would call an API to get the user's analysis stats
      // For this example, we'll use localStorage to simulate recently accessed repositories
      try {
        // Get recent repositories from localStorage
        const recentRepos = localStorage.getItem('recentRepositories');
        if (recentRepos) {
          const repos = JSON.parse(recentRepos);
          if (repos.length > 0) {
            // Get the most recent repository
            const mostRecent = repos[0];
            
            // Use the repository analysis hook to get statistics
            if (mostRecent && mostRecent.owner && mostRecent.name) {
              getAnalysisLimits({
                platform: mostRecent.platform || 'github',
                owner: mostRecent.owner,
                repo: mostRecent.name
              }).then(limits => {
                if (limits) {
                  setAnalysisStats(prev => ({
                    ...prev,
                    freeUsed: limits.current,
                    freeLimit: limits.limit,
                    totalAnalyses: limits.current,
                    lastAnalysis: mostRecent.lastAccessed || new Date().toISOString()
                  }));
                }
              }).catch(err => {
                console.error('Error fetching repository limits:', err);
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading analysis stats:', error);
      }
    }
  }, [user, isLoading, getAnalysisLimits]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col relative bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col relative bg-slate-50 dark:bg-slate-900 dark:border-none">
      <Header />
      
      <main className="flex-1 relative z-10 overflow-hidden max-w-[1800px] mx-auto w-full">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User info card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">User Info</h2>
              <div className="space-y-3">
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">ID:</span> {user?.id?.substring(0, 8)}...
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Provider:</span> {user?.app_metadata?.provider || 'github'}
                </p>
              </div>
            </div>
            
            {/* Analysis Stats */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Analysis Stats</h2>
              <div className="space-y-3">
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Free PRs Used:</span> {analysisStats.freeUsed} of {analysisStats.freeLimit}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Last Analysis:</span> {analysisStats.lastAnalysis ? new Date(analysisStats.lastAnalysis).toLocaleDateString() : 'None'}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Account Status:</span> Free Tier
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  href="/analyze" 
                  className="w-full block bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors text-center"
                >
                  Analyze New PR
                </Link>
                <Link 
                  href="/history" 
                  className="w-full block bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors text-center"
                >
                  View History
                </Link>
                <Link 
                  href="/settings" 
                  className="w-full block bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors text-center"
                >
                  Account Settings
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
