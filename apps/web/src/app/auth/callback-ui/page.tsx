'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState<string>('Completing authentication...');
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClientComponentClient();
        
        // Check if we have a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          return;
        }
        
        if (data?.session) {
          // We have a valid session
          setStatus('success');
          setMessage('Authentication successful!');
          
          // Redirect to dashboard after showing success message
          const redirectTimer = setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
          
          return () => {
            clearTimeout(redirectTimer);
          };
        } else {
          // No session found
          setStatus('processing');
          
          // Give some time for auth to complete in the background
          setTimeout(() => {
            // Check again after a short delay
            supabase.auth.getSession().then(({ data, error }) => {
              if (error || !data.session) {
                setStatus('error');
                setMessage('Authentication failed. Please try again.');
              } else {
                setStatus('success');
                setMessage('Authentication successful!');
                setTimeout(() => router.push('/dashboard'), 1500);
              }
            });
          }, 2000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };
    
    handleAuthCallback();
  }, [router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-8 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center h-20 w-20 bg-gradient-to-b from-gray-100 to-slate-100 dark:from-slate-700/30 dark:to-slate-800/30 rounded-full shadow-md overflow-hidden border border-slate-200 dark:border-slate-700/70">
            <CodeQualLogoFinal className="w-16 h-16" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">
          {status === 'processing' ? 'Signing In...' : status === 'success' ? 'Welcome!' : 'Error'}
        </h1>
        
        <div className="flex justify-center mb-6">
          {status === 'processing' && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          )}
          
          {status === 'success' && (
            <div className="rounded-full h-12 w-12 bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="rounded-full h-12 w-12 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
          {message}
        </p>
        
        {status === 'success' && (
          <div className="flex justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Redirecting you to your dashboard...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} CodeQual - Helping teams write better code
      </div>
    </div>
  );
}