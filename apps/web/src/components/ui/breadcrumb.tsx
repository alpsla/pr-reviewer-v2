import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            <li>
              {index === items.length - 1 ? (
                <span className="font-medium text-slate-700 dark:text-slate-300" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
            {index < items.length - 1 && (
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
