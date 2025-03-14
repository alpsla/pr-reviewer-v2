'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardNewPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

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
                  <span className="font-medium">Free PRs Used:</span> 0 of 5
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Last Analysis:</span> None
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
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors">
                  Analyze New PR
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors">
                  View History
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-3 rounded-md transition-colors">
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
