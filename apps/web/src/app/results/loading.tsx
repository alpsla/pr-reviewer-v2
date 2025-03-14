import React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header isAuthenticated={true} userType="premium" />
      
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 text-slate-400">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'PR Analysis', href: '/analyze' },
              { label: 'Results', href: '/results' }
            ]}
          />
        </div>
        
        {/* Page Title Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-slate-700 rounded-md w-2/3 animate-pulse"></div>
          <div className="h-4 bg-slate-700 rounded-md w-1/3 mt-2 animate-pulse"></div>
        </div>
        
        {/* Summary Dashboard Skeleton */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-8 mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-slate-700 animate-pulse"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(4).fill(null).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-slate-700 animate-pulse"></div>
                    <div>
                      <div className="h-6 w-8 bg-slate-700 rounded-md animate-pulse"></div>
                      <div className="h-3 w-16 bg-slate-700 rounded-md mt-1 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="h-16 border-b border-slate-700 bg-slate-700"></div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4">
                    {Array(3).fill(null).map((_, j) => (
                      <div key={j} className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                        <div className="h-4 w-4 bg-slate-700 rounded-md"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-8 w-20 bg-slate-700 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Action Panel Skeleton */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-6">
          <div className="h-6 w-24 bg-slate-700 rounded-md mb-4 animate-pulse"></div>
          <div className="flex flex-wrap gap-3">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="h-10 w-40 bg-slate-700 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}