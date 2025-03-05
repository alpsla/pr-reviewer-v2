'use client';

import Link from 'next/link';
import { BaseProps } from '@/types';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';

export interface FooterProps extends BaseProps {}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-blue-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10 mb-8 max-w-6xl mx-auto px-6 lg:px-8">
          {/* Column 1: Logo and description */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 bg-gradient-to-b from-slate-700/30 to-slate-800/30 rounded-full shadow-sm overflow-hidden border border-slate-700/70">
                <CodeQualLogoFinal className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white">CodeQual</span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              AI-powered code review to improve<br />
              quality and save development time.
            </p>
          </div>
          
          {/* Column 2: Platform Links */}
          <div className="col-span-1">
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
          <div className="col-span-1">
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
          <div className="col-span-1">
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
        
        {/* Bottom section with horizontal line */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © {currentYear} CodeQual, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;