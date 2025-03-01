import { Button } from '@/components/ui/button';
import { BaseProps } from '@/types';

export interface FreeTrialSectionProps extends BaseProps {}

export function FreeTrialSection({ className }: FreeTrialSectionProps) {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background overlay for the section */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 opacity-95"></div>
      
      {/* Circuit pattern overlay for texture */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="freeTrialCircuitBg" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M20 20 L60 20 M40 0 L40 40" stroke="white" strokeWidth="1" />
            <circle cx="40" cy="20" r="3" fill="white" />
            <path d="M0 60 L20 60 L20 80" stroke="white" strokeWidth="1" />
            <circle cx="20" cy="60" r="2" fill="white" />
            <path d="M60 40 L60 60 L80 60" stroke="white" strokeWidth="1" />
            <circle cx="60" cy="60" r="2" fill="white" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#freeTrialCircuitBg)" />
        </svg>
      </div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start with 5 Free PRs
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            No credit card required. Experience the full power of PR Reviewer with 5 free analyses.
          </p>
          
          {/* PR Counter */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-6 py-2 border border-white/10">
              <div className="mr-3 flex items-center">
                <span className="mr-2 text-sm font-medium text-white">Free PRs remaining:</span>
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
          
          <Button 
            size="lg" 
            className="rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-lg shadow-blue-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-105"
          >
            Start Now
          </Button>
          
          <div className="mt-8">
            <a href="/pricing" className="text-white underline hover:text-blue-200 transition-colors">View Pricing Details</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FreeTrialSection;