import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function SubscriptionStatus() {
  // Mock data - in a real app this would come from an API or authentication context
  const freePRsUsed = 2;
  const freePRsTotal = 5;
  const isFreeTier = true;
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      {isFreeTier ? (
        <>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            Free Tier Status
          </h2>
          
          <div className="mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              You've used {freePRsUsed} of your {freePRsTotal} free PR analyses
            </p>
            
            {/* Progress bar */}
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(freePRsUsed / freePRsTotal) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <Button 
            className="w-full flex items-center justify-center text-base bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
          >
            <Sparkles className="h-4 w-4 mr-2 text-amber-300" />
            Upgrade to Pro
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3">
              P
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Pro Plan
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                20 PRs per month
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              You've used 12 of your 20 monthly PR analyses
            </p>
            
            {/* Progress bar */}
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(12 / 20) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Plan renews on <span className="font-medium">Mar 28, 2025</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
