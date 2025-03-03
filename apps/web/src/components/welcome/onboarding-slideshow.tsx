import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Github, GitPullRequest, Check, Code, Clock } from 'lucide-react';
import { BaseProps } from '@/types';

export interface OnboardingSlideshowProps extends BaseProps {}

export function OnboardingSlideshow({ className }: OnboardingSlideshowProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const slides = [
    {
      title: "Connect Your Repository",
      description: "Link your GitHub or GitLab account to get started in seconds. No complicated setup required.",
      time: "1 minute",
      icon: <Github className="h-12 w-12 text-blue-600 dark:text-blue-400" />,
      gradient: "from-blue-400/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-600/10"
    },
    {
      title: "Submit PR for Analysis",
      description: "Paste your pull request URL or select from your repositories to start the AI-powered analysis.",
      time: "30 seconds",
      icon: <GitPullRequest className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
      gradient: "from-indigo-400/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-indigo-600/10"
    },
    {
      title: "Review AI Suggestions",
      description: "Receive detailed feedback organized by category. Explore issues with context and suggested solutions.",
      time: "2-5 minutes",
      icon: <Code className="h-12 w-12 text-sky-600 dark:text-sky-400" />,
      gradient: "from-sky-400/10 to-sky-500/5 dark:from-sky-500/20 dark:to-sky-600/10"
    },
    {
      title: "Apply Fixes to Your Code",
      description: "Implement suggested improvements directly or export feedback to your pull request comments.",
      time: "Varies by complexity",
      icon: <Check className="h-12 w-12 text-teal-600 dark:text-teal-400" />,
      gradient: "from-teal-400/10 to-teal-500/5 dark:from-teal-500/20 dark:to-teal-600/10"
    },
  ];
  
  const nextSlide = useCallback(() => {
    setActiveSlide((current) => (current === slides.length - 1 ? 0 : current + 1));
  }, [slides.length]);
  
  const prevSlide = useCallback(() => {
    setActiveSlide((current) => (current === 0 ? slides.length - 1 : current - 1));
  }, [slides.length]);
  
  // Auto-advance slides
  useEffect(() => {
    if (!autoplay) {
      return;
    }
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, nextSlide]);
  
  // Pause autoplay on hover
  const pauseAutoplay = () => setAutoplay(false);
  const resumeAutoplay = () => setAutoplay(true);
  
  return (
    <section id="how-it-works" className="py-16 relative overflow-hidden">
      {/* Background overlay for the section */}
      <div className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-white dark:from-slate-800/50 dark:to-slate-800/30"></div>
      </div>
      
      <div className="container relative z-10">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl text-slate-800 dark:text-slate-100">
          How It Works
        </h2>
        
        <div 
          className={`mx-auto max-w-3xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-8 shadow-lg backdrop-blur-sm relative overflow-hidden dark:shadow-black/20
            ${activeSlide === 0 ? 'shadow-blue-100 dark:shadow-blue-900/10' : 
              activeSlide === 1 ? 'shadow-indigo-100 dark:shadow-indigo-900/10' : 
              activeSlide === 2 ? 'shadow-sky-100 dark:shadow-sky-900/10' : 
              'shadow-teal-100 dark:shadow-teal-900/10'}`}
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
        >
          {/* Gradient background for each slide */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slides[activeSlide].gradient} opacity-60`}></div>
        
          <div className="relative min-h-[250px] z-10">
            {/* Slide content */}
            <div className="text-center">
              <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full 
                bg-gradient-to-br ${activeSlide === 0 ? 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/20' : 
                  activeSlide === 1 ? 'from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/20' : 
                  activeSlide === 2 ? 'from-sky-100 to-sky-50 dark:from-sky-900/30 dark:to-sky-900/20' : 
                  'from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/20' }`}>
                {slides[activeSlide].icon}
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {slides[activeSlide].title}
              </h3>
              <p className="mx-auto max-w-lg text-slate-600 dark:text-slate-300">
                {slides[activeSlide].description}
              </p>
              
              {/* Time estimate badge */}
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/40 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 text-sm font-medium">
                <Clock className="h-4 w-4 mr-1" />
                <span>{slides[activeSlide].time}</span>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-600 dark:text-slate-300"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-600 dark:text-slate-300"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          {/* Slide indicators */}
          <div className="mt-8 flex justify-center space-x-2 relative z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-10 rounded-full transition-colors ${
                  index === activeSlide 
                    ? index === 0 ? 'bg-blue-500 dark:bg-blue-400' : 
                      index === 1 ? 'bg-indigo-500 dark:bg-indigo-400' :
                      index === 2 ? 'bg-sky-500 dark:bg-sky-400' :
                      'bg-teal-500 dark:bg-teal-400'
                    : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'
                }`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OnboardingSlideshow;
