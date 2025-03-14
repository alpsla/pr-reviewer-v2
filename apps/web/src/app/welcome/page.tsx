'use client';

import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ValueProposition,
  SecurityFeatures,
  TeamCollaboration,
  OnboardingSlideshow,
} from '@/components/welcome';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col relative bg-slate-100 dark:bg-slate-900">
      {/* Main background pattern - consistent across the entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-slate-100/80 to-slate-200/50 
                       dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900/95"></div>
        
        {/* Circuit pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-15">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="circuitPattern" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M30 30 L90 30 L90 90 L30 90 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500 dark:text-slate-400" />
              <circle cx="30" cy="30" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="90" cy="90" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="30" cy="90" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <circle cx="90" cy="30" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <path d="M10 60 L110 60 M60 10 L60 110" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-500" />
              <circle cx="60" cy="60" r="4" className="fill-blue-600/60 dark:fill-blue-400/60" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuitPattern)" />
          </svg>
        </div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10 overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Get Started Button - Fixed at the top */}
        <div className="sticky top-0 w-full bg-gradient-to-b from-slate-100/95 to-slate-100/80 dark:from-slate-900/95 dark:to-slate-900/80 backdrop-blur-sm z-20 py-3 shadow-sm">
          <div className="container mx-auto flex justify-center">
            <Link href="/">
              <Button 
                className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero Section - Modified to remove direct CTAs */}
        <div className="relative pt-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              {/* Main heading */}
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-800 dark:text-slate-100">
                <span className="block text-blue-600 dark:text-blue-400">AI-Powered</span>
                <span className="block">Code Reviews</span>
                <span className="block text-lg md:text-2xl mt-2 font-bold">That Save Development Time</span>
              </h1>
              
              {/* Subtitle */}
              <p className="mb-10 text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
                Get professional-quality feedback in minutes, reduce bugs by 30%, and ship code faster
              </p>
              
              {/* Link to Product Home */}
              <div className="space-x-4">
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="rounded-full font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/10 hover:shadow-xl hover:shadow-blue-600/20 transition-all duration-300"
                  >
                    Sign In to Get Started
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button 
                    size="lg" 
                    className="rounded-full font-semibold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-lg shadow-blue-600/5 hover:shadow-xl hover:shadow-blue-600/10 transition-all duration-300"
                  >
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why Choose PR Reviewer */}
        <div className="relative pt-24">
          {/* Soft gradient transition */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent dark:from-slate-900/30 dark:to-transparent z-10"></div>
          <div className="relative z-20">
            <ValueProposition />
          </div>
        </div>
        
        {/* How It Works - Moved up for better flow */}
        <OnboardingSlideshow />
        
        {/* Target Audience Sections */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-100/50 to-transparent dark:from-slate-800/50 dark:to-transparent z-10"></div>
          <div className="relative z-20">
            <TeamCollaboration />
          </div>
        </div>
        
        {/* Individual Developers Section with cards styled like the reference */}
        <div className="py-16 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-slate-800 dark:text-slate-100">
                Elevate Your Coding Skills at Any Level
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Supercharge your personal projects and accelerate your professional growth
              </p>
            </div>
            
            {/* Grid of benefits with enhanced styling */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-12">
              <div className="rounded-lg border bg-white dark:bg-slate-800 p-6 shadow-md hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700">
                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Clear Path to Growth</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Whether you're a beginner or seasoned developer, gain insights to level up your code quality through consistent, actionable feedback.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-white dark:bg-slate-800 p-6 shadow-md hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700">
                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="9" x2="9" y2="21"></line><line x1="15" y1="9" x2="15" y2="21"></line></svg>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Track Your Progress</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Visualize your coding journey with personalized dashboards showing improvement over time. Identify your strengths and areas for growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA with link to sign up */}
            <div className="text-center">
              <Link href="/">
                <Button className="rounded-full px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Security Features */}
        <SecurityFeatures />
        
        {/* Free Trial Section - Modified to link to home */}
        <section className="relative py-16 overflow-hidden">
          {/* Background overlay for the section */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 opacity-95"></div>
          
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start with 5 Free PR Analyses
              </h2>
              <p className="mb-8 text-lg text-blue-100">
                No credit card required. Experience the full power of PR Reviewer with 5 free analyses.
              </p>
              
              {/* PR Counter */}
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-6 py-2 border border-white/10">
                  <div className="mr-3 flex items-center">
                    <span className="mr-2 text-sm font-medium text-white">Free PRs:</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div
                        key={num}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      >
                        <span className="text-sm font-bold text-blue-700">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link href="/">
                <Button 
                  size="lg" 
                  className="rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-lg shadow-blue-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-105 border-2 border-white"
                >
                  Sign In to Begin
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer background with improved contrast */}
      <div className="relative z-10 mt-10 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-inner">
        <Footer />
      </div>
    </div>
  );
}
