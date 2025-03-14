'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Globe, ChevronDown, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';
import { BaseProps } from '@/types';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/context/auth-context';

export interface HeaderProps extends BaseProps {
  userType?: 'free' | 'premium';
}

export function Header({ 
  className, 
  userType = 'free' 
}: HeaderProps) {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  const isAuthenticated = !!user;
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Main header component - NO CONTAINER CLASS
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="w-full px-4 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo (left) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center justify-center h-12 w-12 bg-gradient-to-b from-gray-100 to-slate-100 dark:from-slate-700/30 dark:to-slate-800/30 rounded-full shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 overflow-hidden border border-slate-200 dark:border-slate-700/70">
              <CodeQualLogoFinal className="w-10 h-10" />
            </div>
            <span className="ml-3 font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">CodeQual</span>
          </Link>
        </div>
        
        {/* Navigation (center) */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <Link href="/dashboard" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors flex items-center">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
              Dashboard
            </Link>
          )}
          <Link href="/services" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors">
            Services
          </Link>
          <Link href="/pricing" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors">
            About
          </Link>
        </nav>
        
        {/* UI Controls (right) */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              aria-label="Change language"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline-block font-medium">EN</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {languageMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    role="menuitem"
                    onClick={() => setLanguageMenuOpen(false)}
                  >
                    English
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    role="menuitem"
                    onClick={() => setLanguageMenuOpen(false)}
                  >
                    Español
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Theme Toggle */}
          <button
            className="rounded-full p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {/* Sign Out Button (Only when authenticated) */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <Button 
                variant="default" 
                onClick={handleSignOut}
                className="rounded-md px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
                disabled={isLoading}
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
              
              <div className="relative cursor-pointer">
                <Avatar 
                  size="md" 
                  ring="md" 
                  ringColor={userType === 'premium' ? 'gold' : 'blue'} 
                  useLogo={true} 
                  src="/images/avatar-example.svg"
                  alt="User" 
                  className="cursor-pointer hover:ring-blue-400 transition-all duration-200 hover:scale-110"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;