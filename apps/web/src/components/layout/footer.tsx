"use client";

import Link from 'next/link';
// No social media icons needed for now
import { BaseProps } from '@/types';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';

export interface FooterProps extends BaseProps {}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-12 relative">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Main Footer Grid with flexbox for better control */}
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Column 1: Logo and description */}
          <div className="md:w-1/4 mb-8 md:mb-0 md:pr-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 invisible">
              {/* Invisible header for alignment */}
              CodeQual
            </h3>
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-8 w-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                <CodeQualLogoFinal className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-100">CodeQual</span>
            </Link>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              AI-powered code review to improve quality and save development time.
            </p>
          </div>
          
          {/* Column 2: Platform Links */}
          <div className="md:w-1/5 mb-8 md:mb-0">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Company Links */}
          <div className="md:w-1/5 mb-8 md:mb-0">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Legal Links */}
          <div className="md:w-1/5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 border-t border-slate-300 pt-8 dark:border-slate-700">
          <div className="flex justify-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              &copy; {currentYear} CodeQual, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;