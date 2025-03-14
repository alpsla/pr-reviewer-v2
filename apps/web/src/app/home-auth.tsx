'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Header, Footer } from '@/components/layout';
import Link from 'next/link';
import { Github } from 'lucide-react';
import GitlabIcon from '@/components/ui/icons/gitlab-icon';
import { useAuth } from '@/context/auth-context';
import { EmailSignInModal } from '@/components/auth/email-sign-in-modal';

export default function HomePage() {
  // Email authentication removed
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  
  const handleAuthClick = async (method: 'github' | 'gitlab') => {
    
    try {
      setIsLoading(true);
      await signIn(method);
    } catch (error) {
      console.error(`Error signing in with ${method}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Email authentication removed
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-4 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Subtle code pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
        
        <div className="max-w-md w-full mx-auto text-center relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to PR Reviewer
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 mb-8">
            Get AI-powered code reviews for your GitHub and GitLab pull requests.
            Start with 5 free PR analyses before deciding on a subscription.
          </p>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-lg mb-8 relative overflow-hidden">
            {/* Card subtle highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-60"></div>
            
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Sign in to get started
            </h2>
            
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-center gap-2 p-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm hover:shadow"
                onClick={() => handleAuthClick('github')}
                disabled={isLoading}
              >
                <Github className="h-5 w-5" />
                <span>{isLoading ? 'Loading...' : 'Continue with GitHub'}</span>
              </button>
              
              <button 
                className="w-full flex items-center justify-center gap-2 p-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm hover:shadow"
                onClick={() => handleAuthClick('gitlab')}
                disabled={isLoading}
              >
                <GitlabIcon className="h-5 w-5" />
                <span>{isLoading ? 'Loading...' : 'Continue with GitLab'}</span>
              </button>
              
              {/* Email authentication removed */}
            </div>
            
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
              By signing in, you agree to our 
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">Terms</Link>
              and
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">Privacy Policy</Link>
            </div>
          </div>
          
          <div className="text-center text-sm space-y-4">
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Not ready to sign in yet?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/welcome" 
                className="text-blue-600 dark:text-blue-400 border border-blue-200 rounded-full px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-1 transition-colors"
              >
                Learn more about PR Reviewer
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
              
              <Link 
                href="/demo"
                className="text-blue-600 dark:text-blue-400 border border-blue-200 rounded-full px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-1 transition-colors"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Email authentication removed */}
    </div>
  );
}