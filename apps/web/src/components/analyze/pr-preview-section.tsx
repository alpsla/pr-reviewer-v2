import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, GitBranch, FileDiff, PlusCircle, MinusCircle, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PrDetails {
  title: string;
  repository: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  branches: {
    source: string;
    target: string;
  };
}

interface PrPreviewSectionProps {
  prDetails: PrDetails;
}

export function PrPreviewSection({ prDetails }: PrPreviewSectionProps) {
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>(["code_quality", "security"]);
  
  const toggleAnalysisType = (type: string) => {
    if (selectedAnalysisTypes.includes(type)) {
      setSelectedAnalysisTypes(selectedAnalysisTypes.filter(t => t !== type));
    } else {
      setSelectedAnalysisTypes([...selectedAnalysisTypes, type]);
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
        <GitBranch className="mr-2 h-5 w-5 text-blue-500" />
        PR Details
      </h2>
      
      <div className="mt-4">
        {/* PR Title */}
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          {prDetails.title}
        </h3>
        
        {/* PR Metadata */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {/* Repository */}
            <div className="flex items-center text-sm">
              <GitBranch className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Repository:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{prDetails.repository}</span>
            </div>
            
            {/* Author */}
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Author:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{prDetails.author}</span>
            </div>
            
            {/* Created */}
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Created:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(prDetails.createdAt)}</span>
            </div>
            
            {/* Updated */}
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Updated:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(prDetails.updatedAt)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Files Changed */}
            <div className="flex items-center text-sm">
              <FileDiff className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Files Changed:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{prDetails.filesChanged}</span>
            </div>
            
            {/* Lines Added */}
            <div className="flex items-center text-sm">
              <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Lines Added:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{prDetails.linesAdded}</span>
            </div>
            
            {/* Lines Removed */}
            <div className="flex items-center text-sm">
              <MinusCircle className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Lines Removed:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{prDetails.linesRemoved}</span>
            </div>
            
            {/* Branches */}
            <div className="flex items-center text-sm">
              <GitBranch className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400 mr-2">Branches:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {prDetails.branches.source} → {prDetails.branches.target}
              </span>
            </div>
          </div>
        </div>
        
        {/* Analysis Type Selection */}
        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Analysis Type
          </h4>
          
          <div className="flex flex-wrap gap-2">
            <div 
              className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                selectedAnalysisTypes.includes('code_quality')
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => toggleAnalysisType('code_quality')}
            >
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                checked={selectedAnalysisTypes.includes('code_quality')}
                onChange={() => toggleAnalysisType('code_quality')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Code Quality</span>
            </div>
            
            <div 
              className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                selectedAnalysisTypes.includes('security')
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => toggleAnalysisType('security')}
            >
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                checked={selectedAnalysisTypes.includes('security')}
                onChange={() => toggleAnalysisType('security')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Security</span>
            </div>
            
            <div 
              className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                selectedAnalysisTypes.includes('performance')
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => toggleAnalysisType('performance')}
            >
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                checked={selectedAnalysisTypes.includes('performance')}
                onChange={() => toggleAnalysisType('performance')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Performance</span>
            </div>
            
            <div 
              className={`flex items-center px-3 py-2 rounded-lg cursor-pointer border ${
                selectedAnalysisTypes.includes('maintenance')
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => toggleAnalysisType('maintenance')}
            >
              <input 
                type="checkbox" 
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                checked={selectedAnalysisTypes.includes('maintenance')}
                onChange={() => toggleAnalysisType('maintenance')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Maintainability</span>
            </div>
          </div>
        </div>
        
        {/* Confirm Button */}
        <div className="mt-6 flex justify-end">
          <Button 
            className="px-8 py-2.5 text-base font-medium rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl border-2 border-blue-700 dark:border-blue-600 transition-all duration-200"
          >
            Confirm Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
