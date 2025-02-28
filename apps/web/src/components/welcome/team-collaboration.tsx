import { Network, Users, Puzzle, CheckSquare, Key, Lock, Sliders, FileBarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseProps } from '@/types';

export interface TeamCollaborationProps extends BaseProps {}

export function TeamCollaboration({ className }: TeamCollaborationProps) {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-slate-50/70 dark:bg-slate-800/50 z-0"></div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3 blur-3xl dark:bg-blue-600 dark:opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full opacity-20 translate-y-1/2 -translate-x-1/3 blur-3xl dark:bg-indigo-600 dark:opacity-10"></div>
      
      <div className="container relative z-10 max-w-6xl mx-auto">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Teams and Organizations
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Transform individual code reviews into organizational knowledge
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Card 1: Knowledge Sharing */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/10 dark:text-blue-300 group-hover:scale-110 transition-transform duration-300">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Collective Intelligence</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Turn individual PR reviews into a shared knowledge base of best practices specific to your codebase.
              Establish patterns and conventions unique to your team.
            </p>
          </div>
          
          {/* Card 2: Team Performance */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-500/20 dark:to-indigo-600/10 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Team Performance Analytics</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Track team progress, identify skill gaps, and celebrate quality improvements across projects.
              Get insights into team strengths and areas for growth.
            </p>
          </div>
          
          {/* Card 3: Resource Optimization */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600 dark:from-sky-500/20 dark:to-sky-600/10 dark:text-sky-300 group-hover:scale-110 transition-transform duration-300">
              <Puzzle className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Intelligent Work Assignment</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Match developers to tasks based on skill profiles and expertise areas, optimizing team velocity.
              Ensure the right people work on the right code.
            </p>
          </div>
          
          {/* Card 4: Standardization */}
          <div className="rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700 group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 dark:from-teal-500/20 dark:to-teal-600/10 dark:text-teal-300 group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">Consistent Code Standards</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Ensure uniform quality across the organization with customizable rule sets and standards enforcement.
              Maintain consistency even as teams grow and change.
            </p>
          </div>
        </div>
        
        {/* Enterprise Features */}
        <div className="mt-12">
          <h3 className="mb-6 text-center text-xl font-bold text-slate-800 dark:text-slate-100">Enterprise Features</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-600">
              <Key className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">SSO Integration</span>
            </div>
            <div className="flex items-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-600">
              <Lock className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Advanced Permissions</span>
            </div>
            <div className="flex items-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-600">
              <Sliders className="mr-2 h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Custom Rule Enforcement</span>
            </div>
            <div className="flex items-center rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-600">
              <FileBarChart className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Audit Reports</span>
            </div>
          </div>
        </div>
        
        {/* Case Study Preview */}
        <div className="mx-auto mt-12 max-w-2xl rounded-lg border bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-8 text-center shadow-xl dark:shadow-black/20 dark:border-slate-700">
          <h3 className="mb-6 text-xl font-bold text-slate-800 dark:text-slate-100">Results Our Customers Are Seeing</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-md dark:from-blue-900/40 dark:to-blue-800/30 dark:shadow-black/10">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">25%</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Reduced Onboarding Time</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 shadow-md dark:from-indigo-900/40 dark:to-indigo-800/30 dark:shadow-black/10">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">30%</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Fewer Production Bugs</p>
            </div>
          </div>
          <div className="mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/20 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white dark:shadow-blue-900/30">
              Explore Enterprise Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamCollaboration;