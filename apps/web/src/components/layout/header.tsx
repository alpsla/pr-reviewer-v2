import { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';
import { BaseProps } from '@/types';
import { useTheme } from '@/components/theme-provider';

export interface HeaderProps extends BaseProps {}

export function Header({ className }: HeaderProps) {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-slate-900/90 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo (left) */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center h-12 w-12 bg-gradient-to-b from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 overflow-hidden border border-slate-200 dark:border-slate-700">
              <CodeQualLogoFinal className="w-10 h-10" />
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">CodeQual</span>
          </Link>
        </div>
        
        {/* Navigation (center) */}
        <nav className="mx-auto hidden md:block">
          <ul className="flex items-center space-x-10">
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
          
          {/* User Avatar */}
          <div className="relative cursor-pointer mx-2">
            <Avatar 
              size="md" 
              ring="md" 
              ringColor="blue" 
              useLogo={true} 
              src="/images/avatar-example.svg"
              alt="User" 
              className="cursor-pointer hover:ring-blue-400 transition-all duration-200 hover:scale-110"
            />
          </div>

          {/* Authentication/Join Us Button */}
          <Button 
            size="sm" 
            className="rounded-full px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white shadow-md shadow-blue-500/20 dark:shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300"
          >
            Join Us
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;