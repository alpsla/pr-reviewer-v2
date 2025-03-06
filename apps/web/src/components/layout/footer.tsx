"use client";

import Link from 'next/link';
// No social media icons needed for now
import { BaseProps } from '@/types';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';
import { useAuth } from '@/context/auth-context';

export interface FooterProps extends BaseProps {}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  return (
    <footer className="border-t border-slate-700/20 dark:border-slate-700/30 py-12 mt-6 relative bg-white dark:bg-slate-900">
      <div className="container mx-auto px-8 lg:px-12 max-w-screen-2xl">
        {/* Main Footer Grid with flexbox for better control */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-16 gap-y-10 md:px-12 lg:px-16">
          {/* Column 1: Logo and description */}
          <div className="mb-8 md:mb-0 pl-0">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Link href={isAuthenticated ? "/dashboard" : "/"}>
                  <div className="flex items-center justify-center h-12 w-12 bg-gradient-to-b from-gray-100 to-slate-100 dark:from-slate-700/30 dark:to-slate-800/30 rounded-full shadow-md shadow-blue-500/10 dark:shadow-blue-900/20 overflow-hidden border border-slate-200 dark:border-slate-700/70">
                    <CodeQualLogoFinal className="w-10 h-10" />
                  </div>
                </Link>
                <Link href={isAuthenticated ? "/dashboard" : "/"} className="ml-3 font-bold text-lg text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  CodeQual
                </Link>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2 max-w-xs">
              AI-powered code review to improve
              quality and save development time.
            </p>
          </div>
          
          {/* Column 2: Platform Links */}
          <div className="lg:ml-16 md:ml-8 mb-8 md:mb-0">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              PLATFORM
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Company Links */}
          <div className="lg:ml-12 md:ml-6 mb-8 md:mb-0">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              COMPANY
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Legal Links */}
          <div className="lg:ml-8 md:ml-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              LEGAL
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-700">
          <div className="flex justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {currentYear} CodeQual, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;