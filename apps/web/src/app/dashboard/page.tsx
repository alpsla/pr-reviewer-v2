'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/layout/header-fullwidth';
import { Footer } from '@/components/layout/footer';
import '@/styles/container-fix.css';
import { fixFooterLayout } from './footer-fix';
import { fixTopContainer } from './top-container-fix';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
    
    // Call the footer fix function
    fixFooterLayout();
    
    // Call the specific fix for the top container
    fixTopContainer();
  }, [user, isLoading, router]);

  // Targeted container fix
  useEffect(() => {
    // This function will apply fixes to the container structure
    const applyContainerFixes = () => {
      // Find the main container with the grid layout
      const mainContainer = document.querySelector('.container.flex-1.items-start');
      
      if (mainContainer) {
        // Modify the container to use block layout instead of grid
        mainContainer.classList.remove('md:grid');
        mainContainer.classList.remove('lg:grid-cols-[240px_minmax(0,1fr)]');
        mainContainer.classList.remove('md:grid-cols-[220px_minmax(0,1fr)]');
        mainContainer.style.display = 'block';
        
        // Find and hide the side navigation
        const sideNav = mainContainer.querySelector('aside');
        if (sideNav) {
          sideNav.style.display = 'none';
        }
        
        // Ensure main content takes full width
        const mainContent = mainContainer.querySelector('main');
        if (mainContent) {
          mainContent.style.width = '100%';
        }
      }
      
      // Fix header and footer width
      const headerElement = document.querySelector('header');
      const footerElement = document.querySelector('footer');
      
      if (headerElement) {
        headerElement.style.width = '100vw';
        headerElement.style.maxWidth = '100vw';
        headerElement.style.marginLeft = '0';
        headerElement.style.marginRight = '0';
        
        // Fix header content container
        const headerDiv = headerElement.querySelector('div');
        if (headerDiv) {
          headerDiv.style.width = '100%';
          headerDiv.style.maxWidth = '100%';
          headerDiv.style.paddingLeft = '1.5rem';
          headerDiv.style.paddingRight = '1.5rem';
        }
      }
      
      if (footerElement) {
        footerElement.style.width = '100vw';
        footerElement.style.maxWidth = '100vw';
        footerElement.style.marginLeft = '0';
        footerElement.style.marginRight = '0';
        
        // Fix footer containers
        const footerContainer = footerElement.querySelector('.container');
        if (footerContainer) {
          footerContainer.style.width = '100%';
          footerContainer.style.maxWidth = '100%';
          footerContainer.style.paddingLeft = '2rem';
          footerContainer.style.paddingRight = '2rem';
        }
        
        // Fix grid layout in footer
        const footerGrid = footerElement.querySelector('.grid');
        if (footerGrid) {
          footerGrid.style.width = '100%';
          footerGrid.style.display = 'grid';
          footerGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        }
      }
    };
    
    // Run the fix after the DOM is loaded
    if (document.readyState === 'complete') {
      applyContainerFixes();
    } else {
      window.addEventListener('load', applyContainerFixes);
    }
    
    // Also run after a delay as a fallback
    const timeoutId = setTimeout(applyContainerFixes, 100);
    
    return () => {
      window.removeEventListener('load', applyContainerFixes);
      clearTimeout(timeoutId);
    };
  }, []);

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