import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseProps } from '@/types';
import { heroContent } from '@/content/welcome-page-content';
import Link from 'next/link';

export interface HeroSectionProps extends BaseProps {}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Large colorful gradient background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-900/30 opacity-70"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob dark:bg-blue-600 dark:opacity-10 dark:mix-blend-normal"></div>
        <div className="absolute top-20 left-40 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000 dark:bg-indigo-600 dark:opacity-10 dark:mix-blend-normal"></div>
        <div className="absolute bottom-40 right-40 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000 dark:bg-sky-600 dark:opacity-10 dark:mix-blend-normal"></div>
      </div>
      
      <div className="container relative z-10">
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
          
          {/* Call to action buttons */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Link href="/analyze">
              <Button size="lg" className="rounded-full font-semibold bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white shadow-lg shadow-blue-600/10 hover:shadow-xl hover:shadow-blue-600/20 dark:shadow-blue-900/20 transition-all duration-300">
                Try for Free
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="rounded-full font-semibold border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 shadow-lg shadow-blue-600/5 hover:shadow-xl hover:shadow-blue-600/10 dark:shadow-blue-900/10 transition-all duration-300">
                See How It Works
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;