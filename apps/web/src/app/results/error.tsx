"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeButton } from '@/components/ui/dark-mode-button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';

export default function ResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header isAuthenticated={true} userType="premium" />
      
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-slate-400">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'PR Analysis', href: '/analyze' },
              { label: 'Results', href: '/results' }
            ]}
          />
        </div>
        
        <div className="flex justify-center">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-8 max-w-2xl mx-auto w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full text-red-500 dark:text-red-400 mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Analysis Error</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              There was a problem processing your pull request analysis.
            </p>
            
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-700 mb-6 w-full text-left">
              <p className="font-mono text-sm text-red-500 dark:text-red-400 break-words">
                {error.message || "An unexpected error occurred"}
              </p>
            </div>
            
            <div className="flex space-x-4 flex-col sm:flex-row gap-3">
              <DarkModeButton 
                variant="outline" 
                onClick={() => window.location.href = '/analyze'}
                className="text-slate-700 border-slate-300 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 w-full sm:w-auto"
              >
                Try Another PR
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