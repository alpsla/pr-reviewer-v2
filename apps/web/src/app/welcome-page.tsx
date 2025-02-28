'use client';

import { Header, Footer } from '@/components/layout';
import {
  HeroSection,
  ValueProposition,
  SecurityFeatures,
  TeamCollaboration,
  OnboardingSlideshow,
  FreeTrialSection,
  IndividualDevelopers
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
        {/* Hero Section */}
        <HeroSection />
        
        {/* Why Choose PR Reviewer */}
        <div className="relative">
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
        
        {/* New Individual Developers Section */}
        <IndividualDevelopers />
        
        {/* Security Features */}
        <SecurityFeatures />
        
        {/* Free Trial CTA */}
        <FreeTrialSection />
      </main>
      
      {/* Footer background with improved contrast */}
      <div className="relative z-10 mt-10 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-inner">
        <Footer />
      </div>
    </div>
  );
}
