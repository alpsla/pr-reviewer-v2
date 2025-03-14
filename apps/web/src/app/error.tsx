'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { DarkModeButton } from '@/components/ui/dark-mode-button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';

export default function Error({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset: () => void;
}) {
  // Use the theme to ensure the background color is applied properly
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header isAuthenticated={false} userType="free" />
      
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-8 max-w-2xl mx-auto w-full">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full text-red-500 dark:text-red-400 mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Something Went Wrong</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We encountered an error while processing your request.
              </p>
              
              {error?.message && (
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-700 mb-6 w-full text-left">
                  <p className="font-mono text-sm text-red-500 dark:text-red-400 break-words">
                    {error.message}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <DarkModeButton 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="w-full sm:w-auto"
                >
                  Return Home
                </DarkModeButton>
                <DarkModeButton 
                  variant="default"
                  onClick={reset}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  Try Again
                </DarkModeButton>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}