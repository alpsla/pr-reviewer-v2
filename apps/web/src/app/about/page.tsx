'use client';

import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, HeartHandshake, Globe, Terminal, Brain, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col relative bg-slate-100 dark:bg-slate-900">
      {/* Main background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-slate-100/80 to-slate-200/50 
                       dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900/95"></div>
        
        <div className="absolute inset-0 opacity-5 dark:opacity-15">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="aboutPattern" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M30 30 L90 30 L90 90 L30 90 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500 dark:text-slate-400" />
              <circle cx="30" cy="30" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="90" cy="90" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="30" cy="90" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <circle cx="90" cy="30" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <path d="M10 60 L110 60 M60 10 L60 110" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-500" />
              <circle cx="60" cy="60" r="4" className="fill-blue-600/60 dark:fill-blue-400/60" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#aboutPattern)" />
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
                About CodeQual
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-8">
                We're on a mission to elevate code quality and improve development workflows through intelligent, AI-powered code reviews.
              </p>
              <div className="flex justify-center">
                <Link href="/">
                  <button 
                    className="rounded-full px-8 py-3 bg-indigo-800 text-white font-bold hover:bg-indigo-700 dark:bg-slate-900 dark:hover:bg-slate-800 shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5 transition-all duration-300 border-2 border-indigo-800/30 dark:border-slate-700"
                  >
                    Get Started
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="transform group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-800 dark:text-slate-100 mb-8 text-center">
                Our Story
              </h2>
              
              <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <p>
                  CodeQual began in 2023 when a group of seasoned developers became frustrated with the time-consuming nature of code reviews. We knew there had to be a better way to maintain code quality without slowing down development.
                </p>
                
                <p>
                  Our team had experienced the pain points firsthand: waiting for peer reviews, inconsistent feedback, missed bugs, and the challenge of maintaining standards across growing teams. We saw an opportunity to leverage AI to solve these problems.
                </p>
                
                <p>
                  We built the first version of PR Reviewer as an internal tool for our own projects. When we saw how much time it saved and how it improved our code quality, we knew we had to share it with the wider development community.
                </p>
                
                <p>
                  Today, CodeQual is helping teams of all sizes ship better code faster. Our platform continues to evolve with new features and improvements, but our mission remains the same: to make high-quality code the standard, not the exception.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-800 dark:text-slate-100 mb-4">
                Our Values
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                These core principles guide everything we do at CodeQual.
              </p>
            </div>
            
            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Value Card Examples */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Terminal className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Quality First</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We believe that code quality is the foundation of successful software projects. Every feature we build prioritizes improving code quality.
                </p>
              </div>
              
              {/* Developer Experience */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <HeartHandshake className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Developer Experience</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We design every feature with developers in mind, focusing on creating tools that enhance productivity and reduce friction.
                </p>
              </div>
              
              {/* Community Driven */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Community Driven</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We actively engage with our user community to shape our roadmap, incorporating feedback to build features that truly matter.
                </p>
              </div>
              
              {/* Continuous Improvement */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <RefreshCw className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Continuous Improvement</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We constantly iterate on our platform, embracing feedback and new technologies to provide ever-better solutions.
                </p>
              </div>
              
              {/* AI Ethics */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">AI Ethics</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We develop AI capabilities responsibly, with transparency about capabilities and limitations, prioritizing human oversight.
                </p>
              </div>
              
              {/* Global Mindset */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Global Mindset</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We design our platform for developers worldwide, with internationalization support and inclusive design principles.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Stat 1 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
                  <div className="text-lg text-slate-700 dark:text-slate-300">Active Users</div>
                </div>
                
                {/* Stat 2 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
                  <div className="text-lg text-slate-700 dark:text-slate-300">PRs Analyzed</div>
                </div>
                
                {/* Stat 3 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">98%</div>
                  <div className="text-lg text-slate-700 dark:text-slate-300">Customer Satisfaction</div>
                </div>
                
                {/* Stat 4 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">25+</div>
                  <div className="text-lg text-slate-700 dark:text-slate-300">Team Members</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Improve Your Code Quality?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Start with our free tier and experience the power of AI-driven code reviews.
              </p>
              <div className="flex justify-center">
                <Link href="/">
                  <button 
                    className="rounded-full px-8 py-3 bg-indigo-800 text-white font-bold hover:bg-indigo-700 dark:bg-slate-900 dark:hover:bg-slate-800 shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5 transition-all duration-300 border-2 border-indigo-800/30 dark:border-slate-700"
                  >
                    Get Started Free
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="transform group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
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
