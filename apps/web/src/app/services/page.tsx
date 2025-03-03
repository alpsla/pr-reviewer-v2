'use client';

import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Code, ShieldCheck, Zap, Clock, BarChart3, RefreshCw, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col relative bg-slate-100 dark:bg-slate-900">
      {/* Main background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-slate-100/80 to-slate-200/50 
                       dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900/95"></div>
        
        <div className="absolute inset-0 opacity-5 dark:opacity-15">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="servicesPattern" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M30 30 L90 30 L90 90 L30 90 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500 dark:text-slate-400" />
              <circle cx="30" cy="30" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="90" cy="90" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="30" cy="90" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <circle cx="90" cy="30" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <path d="M10 60 L110 60 M60 10 L60 110" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-500" />
              <circle cx="60" cy="60" r="4" className="fill-blue-600/60 dark:fill-blue-400/60" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#servicesPattern)" />
          </svg>
        </div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10 overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Our Services
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-8">
                Comprehensive code review solutions powered by AI to help your team ship better code faster, reduce bugs, and increase productivity.
              </p>
              <Link href="/">
                <Button 
                  size="lg" 
                  className="rounded-full font-semibold bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-transparent"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Core Services */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-800 dark:text-slate-100 mb-4">
                Core Services
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Our AI-powered platform provides comprehensive code review services to help teams deliver better software.
              </p>
            </div>
            
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Automated Code Reviews */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Automated Code Reviews</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                  Our AI analyzes your pull requests to identify code issues, security vulnerabilities, and performance bottlenecks without the wait.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="mt-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                    Try It Now
                  </Button>
                </Link>
              </div>
              
              {/* Enhanced Security */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Enhanced Security</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                  Detect security vulnerabilities, authentication issues, and encryption gaps before they make it to production.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="mt-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              {/* Performance Optimization */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Performance Optimization</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                  Identify performance bottlenecks and optimization opportunities with our detailed analysis and recommendations.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="mt-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                    Explore
                  </Button>
                </Link>
              </div>
              
              {/* Time Savings */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Time Savings</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                  Reduce review time by up to 80% with instant, automated feedback that identifies issues in seconds, not hours.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="mt-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
              
              {/* Team Analytics */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Team Analytics</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                  Track improvement over time, identify training opportunities, and measure the impact on your development efficiency.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="mt-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                    View Demo
                  </Button>
                </Link>
              </div>
              
              {/* Continuous Integration */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                <div className="rounded-full w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Continuous Integration</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">
                  Seamlessly integrate into your CI/CD pipeline to maintain consistent code quality standards across all PRs.
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="mt-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                    See Integrations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to improve your code quality?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Start with our free tier and experience the power of AI-driven code reviews.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-2 border-white"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 hover:text-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-2 border-blue-100"
                  >
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
