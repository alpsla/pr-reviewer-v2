'use client';

import { Header, Footer } from '@/components/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Settings, Users, Database, Shield, Activity, BarChart } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb and title */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Admin', href: '/admin' }
            ]} 
          />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            Manage system settings and configurations
          </p>
        </div>
        
        {/* Admin menu cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Analysis Limits */}
          <Link href="/admin/limits" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors duration-200">
                  <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analysis Limits</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Configure repository analysis limits for free tier users
              </p>
            </div>
          </Link>
          
          {/* User Management (placeholder) */}
          <Link href="#" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors duration-200">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User Management</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Manage users, roles, and permissions
              </p>
              <div className="mt-3 inline-block text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">
                Coming soon
              </div>
            </div>
          </Link>
          
          {/* System Settings (placeholder) */}
          <Link href="#" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors duration-200">
                  <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">System Settings</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Configure system-wide settings and defaults
              </p>
              <div className="mt-3 inline-block text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">
                Coming soon
              </div>
            </div>
          </Link>
          
          {/* Database Management (placeholder) */}
          <Link href="#" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/40 transition-colors duration-200">
                  <Database className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Database</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Manage database connections and settings
              </p>
              <div className="mt-3 inline-block text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">
                Coming soon
              </div>
            </div>
          </Link>
          
          {/* Analytics (placeholder) */}
          <Link href="#" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-800/40 transition-colors duration-200">
                  <Activity className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analytics</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                View system usage statistics and analytics
              </p>
              <div className="mt-3 inline-block text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">
                Coming soon
              </div>
            </div>
          </Link>
          
          {/* Security (placeholder) */}
          <Link href="#" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors duration-200">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Security</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Configure security settings and access controls
              </p>
              <div className="mt-3 inline-block text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">
                Coming soon
              </div>
            </div>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
