import { TrendingUp, BarChart2, Briefcase, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseProps } from '@/types';

export interface IndividualDevelopersProps extends BaseProps {}

export function IndividualDevelopers({ className }: IndividualDevelopersProps) {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-white/80 to-indigo-50/50 dark:from-indigo-900/20 dark:via-slate-900/50 dark:to-indigo-900/20 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000 dark:bg-indigo-600 dark:opacity-10 dark:mix-blend-normal"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000 dark:bg-indigo-600 dark:opacity-10 dark:mix-blend-normal"></div>
      
      <div className="container relative z-10">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Elevate Your Coding Skills at Any Level
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Supercharge your personal projects and accelerate your professional growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Benefit 1: Clear Path to Growth */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-500/20 dark:to-indigo-600/10 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Clear Path to Growth</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Whether you're a beginner or seasoned developer, gain insights to level up your code quality through consistent, actionable feedback.
            </p>
          </div>
          
          {/* Benefit 2: Track Your Progress */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-500/20 dark:to-indigo-600/10 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-300">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Track Your Progress</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Visualize your coding journey with personalized dashboards showing improvement over time. Identify your strengths and areas for growth.
            </p>
          </div>
          
          {/* Benefit 3: Build Your Portfolio */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-500/20 dark:to-indigo-600/10 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Build Your Portfolio</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Create a history of improvements that demonstrates your commitment to quality code. Perfect for freelancers and open-source contributors.
            </p>
          </div>
          
          {/* Benefit 4: Learn Best Practices */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-500/20 dark:to-indigo-600/10 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Learn Best Practices</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Discover industry-standard patterns and techniques through practical examples in your own code. Learn faster by doing.
            </p>
          </div>
        </div>
        
        {/* Code Example */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-4xl rounded-lg border border-indigo-200 dark:border-indigo-600/40 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm p-4 shadow-2xl dark:shadow-black/30">
            <div className="flex items-center border-b border-indigo-200 dark:border-indigo-600/40 pb-2">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-2 text-xs text-slate-500 dark:text-slate-400">calculateTotal.js</div>
            </div>
            
            <div className="mt-3 font-mono text-xs">
              <pre className="overflow-x-auto p-2 rounded bg-slate-50 dark:bg-slate-900/80">
                <code>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">1</span>
                    <span className="text-blue-600 dark:text-blue-400">function</span> <span className="text-yellow-600 dark:text-yellow-300">calculateTotal</span>(items) {'{'}
                  </span>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">2</span>
                    <span className="text-slate-500 dark:text-slate-400">{'  // This could be optimized'}</span>
                  </span>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">3</span>
                    <span className="bg-red-100 px-1 dark:bg-red-900/40">{'  let total = 0;'}</span>
                  </span>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">4</span>
                    <span className="bg-red-100 px-1 dark:bg-red-900/40">{'  for (var i = 0; i < items.length; i++) {'}</span>
                  </span>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">5</span>
                    <span className="bg-red-100 px-1 dark:bg-red-900/40">{'    total = total + items[i].price;'}</span>
                  </span>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">6</span>
                    <span>{'  }'}</span>
                  </span>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">7</span>
                    <span>{'  return total;'}</span>
                  </span>
                  <span className="line flex">
                    <span className="mr-4 inline-block w-4 text-right text-slate-400 dark:text-slate-500">8</span>
                    <span>{'}'}</span>
                  </span>
                </code>
              </pre>
              
              <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50/80 p-3 text-xs dark:border-indigo-700/50 dark:bg-indigo-900/20 backdrop-blur-sm">
                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">AI Suggestion:</p>
                <p className="mt-1 text-indigo-700 dark:text-indigo-300">
                  Use Array.reduce() for better performance and readability. 
                  Consider using const instead of let for immutability.
                </p>
                <pre className="mt-2 overflow-x-auto rounded bg-white p-2 text-xs dark:bg-slate-800/90 shadow-sm">
                  <code>
                    <span className="text-blue-600 dark:text-blue-400">const</span> <span className="text-yellow-600 dark:text-yellow-300">calculateTotal</span> = (items) {'=>'} {'{'}
                    <br />
                    {'  return items.reduce((total, item) => total + item.price, 0);'}
                    <br />
                    {'};'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-12 text-center">
          <Button className="rounded-full px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Start Your Growth Journey
          </Button>
        </div>
      </div>
    </section>
  );
}

export default IndividualDevelopers;