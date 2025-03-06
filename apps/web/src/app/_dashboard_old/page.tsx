'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/layout/header-fullwidth';
import { Footer } from '@/components/layout/footer';
import { fixDashboardLayout } from './layout-fix';
import '@/styles/layout-fix.css';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect to home if not authenticated and apply layout fixes
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
    
    // Apply layout fixes
    fixDashboardLayout();
    
    // Run layout fixes again after a delay to ensure all elements are loaded
    const timeoutId = setTimeout(fixDashboardLayout, 500);
    
    return () => clearTimeout(timeoutId);
  }, [user, isLoading, router]);

  // Component rendering
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header userType="free" />
      
      <main className="w-full px-4 py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User info card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
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
            
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
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
            
            {/* Actions */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md transition-colors font-medium">
                  Analyze New PR
                </button>
                <button className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white p-3 rounded-md transition-colors">
                  View History
                </button>
                <button className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white p-3 rounded-md transition-colors">
                  Account Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}