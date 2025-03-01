import { FileText, UserCheck, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseProps } from '@/types';

export interface SecurityFeaturesProps extends BaseProps {}

export function SecurityFeatures({ className }: SecurityFeaturesProps) {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/90 z-0"></div>
      
      {/* Circuit pattern for background texture */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="securityPatternUnique" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M10 10 L50 10 M30 10 L30 50 M10 30 L50 30" stroke="currentColor" strokeWidth="1" className="text-primary dark:text-blue-500" />
            <circle cx="30" cy="30" r="3" className="fill-primary/60 dark:fill-blue-500/60" />
            <circle cx="10" cy="10" r="2" className="fill-primary/80 dark:fill-blue-500/80" />
            <circle cx="50" cy="10" r="2" className="fill-primary/80 dark:fill-blue-500/80" />
            <circle cx="10" cy="30" r="2" className="fill-primary/80 dark:fill-blue-500/80" />
            <circle cx="50" cy="30" r="2" className="fill-primary/80 dark:fill-blue-500/80" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#securityPatternUnique)" />
        </svg>
      </div>
      
      <div className="container relative z-10">
        <div className="mb-10 flex items-center justify-center">
          <div className="mr-4 rounded-full bg-blue-100 p-3 text-primary dark:bg-blue-500/20 dark:text-blue-300">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Enterprise-grade Security
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Data Protection */}
          <div className="rounded-lg border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 dark:from-blue-500/20 dark:to-blue-600/10 dark:text-blue-300">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold">Your Code Stays Private</h3>
            <p className="text-sm text-muted-foreground">
              Code never leaves your secure environment. Analysis occurs in isolated containers.
            </p>
          </div>
          
          {/* Card 2: Authentication */}
          <div className="rounded-lg border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 dark:from-indigo-500/20 dark:to-indigo-600/10 dark:text-indigo-300">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold">Secure Authentication</h3>
            <p className="text-sm text-muted-foreground">
              OAuth integration with GitHub/GitLab and email verification ensures only authorized access.
            </p>
          </div>
          
          {/* Card 3: Compliance */}
          <div className="rounded-lg border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600 dark:from-sky-500/20 dark:to-sky-600/10 dark:text-sky-300">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold">Compliance Ready</h3>
            <p className="text-sm text-muted-foreground">
              Built with SOC 2 and GDPR compliance in mind. Data retention controls available.
            </p>
          </div>
          
          {/* Card 4: LLM Isolation */}
          <div className="rounded-lg border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg dark:shadow-black/20 hover:shadow-xl transition-all duration-300 dark:border-slate-700">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-50 text-teal-600 dark:from-teal-500/20 dark:to-teal-600/10 dark:text-teal-300">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold">Isolated LLM Processing</h3>
            <p className="text-sm text-muted-foreground">
              AI processing occurs in secure environments with no data retention or model training.
            </p>
          </div>
        </div>
        
        {/* Security Certification Badges */}
        <div className="mt-10 rounded-lg border bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-4 text-center shadow-lg dark:shadow-black/20 dark:border-slate-700">
          <p className="mb-2 text-sm font-medium">Security is our priority</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="rounded-full bg-slate-100 border border-slate-200 px-4 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
              SOC 2 Compliance (In Progress)
            </div>
            <div className="rounded-full bg-slate-100 border border-slate-200 px-4 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
              GDPR Compliant
            </div>
            <div className="rounded-full bg-slate-100 border border-slate-200 px-4 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
              ISO 27001 (Planned)
            </div>
          </div>
          <Button variant="link" size="sm" className="mt-2 dark:text-blue-300 dark:hover:text-blue-200">
            Learn More About Our Security
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SecurityFeatures;
