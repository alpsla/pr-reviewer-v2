import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Lock, AlertCircle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import GitlabIcon from '@/components/ui/icons/gitlab-icon';
import { cn } from '@/lib/utils';

interface PrInputSectionProps {
  prUrl: string;
  onChange: (url: string) => void;
  validationStatus: 'idle' | 'validating' | 'success' | 'error';
  validationMessage: string;
  freeAnalysesUsed: number;
  freeAnalysesTotal: number;
}

export function PrInputSection({ 
  prUrl, 
  onChange, 
  validationStatus, 
  validationMessage,
  freeAnalysesUsed,
  freeAnalysesTotal
}: PrInputSectionProps) {
  const [isPrivateRepo, setIsPrivateRepo] = useState(false);
  
  // Auto-detect private repository status - in a real app this would be more complex
  useEffect(() => {
    if (prUrl && prUrl.includes('private') || prUrl.includes('internal')) {
      setIsPrivateRepo(true);
    } else {
      setIsPrivateRepo(false);
    }
  }, [prUrl]);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Enter a Pull Request URL
          </h2>
          
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              Enter a GitHub or GitLab pull request URL to analyze
            </p>
            
            {/* URL Input with platform icons */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <div className="flex space-x-2">
                  <Github className="h-5 w-5 text-slate-400" />
                  <GitlabIcon className="h-5 w-5 text-slate-400" />
                </div>
              </div>
              
              <input
                type="text"
                value={prUrl}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://github.com/username/repo/pull/123"
                className={cn(
                  "block w-full pl-16 pr-12 py-3 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 border",
                  "focus:ring-2 focus:outline-none focus:ring-blue-500/50",
                  validationStatus === 'error'
                    ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500"
                    : validationStatus === 'success'
                    ? "border-green-300 dark:border-green-700 focus:border-green-500 dark:focus:border-green-500"
                    : "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500"
                )}
              />
              
              {/* Status indicator */}
              {validationStatus !== 'idle' && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {validationStatus === 'validating' && (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  )}
                  {validationStatus === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {validationStatus === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            
            {/* Validation feedback */}
            {validationMessage && (
              <p className={cn(
                "text-sm",
                validationStatus === 'error' ? "text-red-500" : "text-green-500"
              )}>
                {validationMessage}
              </p>
            )}
            
            {/* Private repository handling */}
            {isPrivateRepo && (
              <div className="flex items-start space-x-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4">
                <Lock className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Private Repository Detected
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    To analyze private repositories, you'll need to grant additional permissions.
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-white dark:bg-slate-800 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/40"
                  >
                    Grant Access
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Free Tier Status - combined with input section */}
        <div className="lg:w-64 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Free Tier Status
          </h3>
          
          <div className="mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              You've used {freeAnalysesUsed} of your {freeAnalysesTotal} free PR analyses
            </p>
            
            {/* Progress bar */}
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(freeAnalysesUsed / freeAnalysesTotal) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <Button 
            size="sm"
            className="w-full flex items-center justify-center text-sm bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
          >
            <Sparkles className="h-4 w-4 mr-2 text-amber-300" />
            Upgrade to Pro
          </Button>
        </div>
      </div>
      
      {/* Submit button */}
      <div className="flex justify-end mt-6">
        <Button 
          disabled={validationStatus !== 'success'}
          className="px-8 py-6 text-base font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Analyze PR
        </Button>
      </div>
    </div>
  );
}
