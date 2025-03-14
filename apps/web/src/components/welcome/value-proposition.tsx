import { Clock, Shield, BarChart } from 'lucide-react';
import { BaseProps } from '@/types';

export interface ValuePropositionProps extends BaseProps {}

export function ValueProposition({ className }: ValuePropositionProps) {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 via-white/80 to-slate-50/50 dark:from-slate-800/50 dark:via-slate-900/50 dark:to-slate-800/50 z-0"></div>
      
      <div className="container relative z-10">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl text-slate-800 dark:text-slate-100">
          Why Choose PR Reviewer
        </h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1: Save Time */}
          <div className="group flex flex-col items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 dark:shadow-black/10 hover:-translate-y-1">
            <div className="mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-3 text-blue-600 group-hover:scale-110 transition-transform duration-300 dark:from-blue-500/20 dark:to-blue-600/10 dark:text-blue-300">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">40% Faster Reviews</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Cut your review cycles from days to hours with instant AI feedback. Stop waiting for manual reviews.
            </p>
          </div>
          
          {/* Card 2: Improve Quality */}
          <div className="group flex flex-col items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 dark:shadow-black/10 hover:-translate-y-1">
            <div className="mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 p-3 text-indigo-600 group-hover:scale-110 transition-transform duration-300 dark:from-indigo-500/20 dark:to-indigo-600/10 dark:text-indigo-300">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Reduce Bugs by 30%</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Catch bugs, security issues, and performance bottlenecks early. Build more reliable software.
            </p>
          </div>
          
          {/* Card 3: Track Progress */}
          <div className="group flex flex-col items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 dark:shadow-black/10 hover:-translate-y-1">
            <div className="mb-4 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 p-3 text-sky-600 group-hover:scale-110 transition-transform duration-300 dark:from-sky-500/20 dark:to-sky-600/10 dark:text-sky-300">
              <BarChart className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Track Progress</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Monitor your code quality improvement over time with powerful analytics. Identify trends and celebrate wins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ValueProposition;
