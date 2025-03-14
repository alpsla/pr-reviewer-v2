"use client";

import React, { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// This component manually renders the Results Error page with simulated error data
export default function ResultsErrorDemo() {
  // Import the error component dynamically
  const ResultsError = React.lazy(() => 
    import('@/app/results/error').then(mod => ({
      default: mod.default
    }))
  );
  
  // We're using server components, so we need to handle the client-side rendering
  const errorObject = new Error("This is a demonstration of the results error page");
  
  // Create a reset function
  const reset = () => {
    alert("Reset function called - in a real error, this would retry the operation");
    window.location.href = '/demo';
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <ResultsError error={errorObject} reset={reset} />
      </React.Suspense>
    </div>
  );
}