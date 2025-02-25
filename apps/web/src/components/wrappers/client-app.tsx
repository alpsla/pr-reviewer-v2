'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import dynamic from 'next/dynamic';

const DashboardContent = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4">Welcome to PR Reviewer!</p>
      <p>You can use the PR Analyzer to get AI-powered feedback on your code changes.</p>
    </div>
  );
};

const PRAnalyzerContent = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">PR Analyzer</h1>
      <p>
        Enter a GitHub or GitLab pull request URL to analyze it with AI.
        <br />
        <em>(Functionality coming soon)</em>
      </p>
    </div>
  );
};

export default function ClientApp() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>('home');
  const router = useRouter();
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setCurrentUser(data.session.user);
          setActivePage('dashboard');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Get active page from URL
    const path = window.location.pathname;
    if (path.includes('pr-analyzer')) {
      setActivePage('pr-analyzer');
    } else if (path.includes('dashboard')) {
      setActivePage('dashboard');
    } else {
      setActivePage('home');
    }
    
    checkAuth();
  }, []);
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    
    // Update browser URL without full page reload
    if (page === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else if (page === 'pr-analyzer') {
      window.history.pushState({}, '', '/dashboard/pr-analyzer');
    } else {
      window.history.pushState({}, '', '/');
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // If logged in, show dashboard
  if (currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          {activePage === 'dashboard' && <DashboardContent />}
          {activePage === 'pr-analyzer' && <PRAnalyzerContent />}
        </div>
      </div>
    );
  }
  
  // If not logged in, show home page with sign-in option
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">PR Reviewer</h1>
          <p className="text-xl mb-8">AI-powered code review for your pull requests</p>
          <p className="mb-8">
            Sign in to get started with PR Reviewer. Connect your GitHub or GitLab
            account to start analyzing your pull requests.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.push('/auth/signin')}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
