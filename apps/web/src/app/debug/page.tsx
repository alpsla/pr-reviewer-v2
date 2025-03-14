import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fingerprint, GitBranch, GitPullRequest, ChevronsRight, Wrench } from 'lucide-react';

export default function DebugIndexPage() {
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Wrench className="h-8 w-8 mr-2 text-blue-500" />
        Debugging Tools
      </h1>
      
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          These debugging tools are intended for development and testing use only.
          They provide insights into system behavior and help verify edge cases.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fingerprint className="h-5 w-5 mr-2 text-blue-500" />
              Repository Fingerprinting
            </CardTitle>
            <CardDescription>
              Debug and test repository fingerprinting functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Test how repositories are fingerprinted, compare repositories with different names, 
              test special characters, and verify public/private repository switching.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <ChevronsRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>Repository Fingerprint Analysis</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <ChevronsRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>Special Characters Test</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <ChevronsRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>Public/Private Repository Switch</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/debug/fingerprint" className="w-full">
              <Button variant="default" className="w-full">
                Open Fingerprint Debug Tools
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GitPullRequest className="h-5 w-5 mr-2 text-blue-500" />
              Large PR Handling
            </CardTitle>
            <CardDescription>
              Test how the system handles very large pull requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Test fetching and processing large pull requests with hundreds or thousands of files.
              Analyze performance, memory usage, and verify proper pagination handling.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <ChevronsRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>Large PR File Fetching</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <ChevronsRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>Memory Usage Tracking</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <ChevronsRight className="h-4 w-4 mr-2 text-blue-500" />
                <span>Performance Analysis</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/debug/fingerprint?tab=large-pr" className="w-full">
              <Button variant="default" className="w-full">
                Open Large PR Debug Tools
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
