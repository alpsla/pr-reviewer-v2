'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Globe, ChevronDown, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';
import { BaseProps } from '@/types';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/context/auth-context';
import { ProvidersMenu } from '@/components/auth/providers-menu';

export interface HeaderProps extends BaseProps {
  isAuthenticated?: boolean;
  userType?: 'free' | 'premium';
}

export function Header({ 
  className, 
  isAuthenticated: initialAuthState = false, 
  userType = 'free' 
}: HeaderProps) {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  const isAuthenticated = !!user || initialAuthState;
  
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
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-slate-900/90 shadow-sm">
      <div className="container mx-auto px-8 lg:px-12 max-w-screen-2xl flex h-16 items-center justify-between">
        {/* Logo (left) */}
        <div className="flex items-center pl-0">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group">
            <div className="flex items-center justify-center h-12 w-12 bg-gradient-to-b from-gray-100 to-slate-100 dark:from-slate-700/30 dark:to-slate-800/30 rounded-full shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 overflow-hidden border border-slate-200 dark:border-slate-700/70">
              <CodeQualLogoFinal className="w-10 h-10" />
            </div>
            <span className="ml-3 font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">CodeQual</span>
          </Link>
        </div>
        
        {/* Navigation (center) */}
        <nav className="mx-auto hidden md:block">
          <ul className="flex items-center space-x-10">
            {isAuthenticated && (
              <li>
                <Link href="/dashboard" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors flex items-center">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link href="/services" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors">
                About
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* UI Controls (right) */}
        <div className="flex items-center space-x-5">
          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            className="md:hidden rounded-full p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

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
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                    role="menuitem"
                    onClick={() => setLanguageMenuOpen(false)}
                  >
                    <span>English</span>
                    <span>✓</span>
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                    role="menuitem"
                    onClick={() => setLanguageMenuOpen(false)}
                  >
                    <span>Español</span>
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
          
          {/* User Avatar or Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-5">
              <button 
              onClick={handleSignOut}
              disabled={isLoading}
              className="rounded-md p-3 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
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
          ) : null}
        </div>
      </div>

      {/* Mobile Navigation Menu - Only shown when mobileMenuOpen is true */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 py-4">
          <nav className="container mx-auto px-4">
            <ul className="flex flex-col space-y-4">
              {isAuthenticated && (
                <li>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center py-2 text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  href="/services" 
                  className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="block py-2 text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>

              {isAuthenticated && (
                <li className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    className="flex items-center py-2 text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoading ? 'Signing out...' : 'Sign Out'}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;