import { useState } from 'react';
import { ChevronDown, ChevronUp, Sliders, Settings, Code } from 'lucide-react';

export function AnalysisOptions() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysisDepth, setAnalysisDepth] = useState(50); // Value between 0-100
  // Removed useCustomRules state as the feature is being simplified
  
  // Determine the analysis depth description based on the slider value
  const getDepthDescription = (value: number) => {
    if (value < 33) return "Quick";
    if (value < 66) return "Balanced";
    return "Thorough";
  };
  
  const analysisDepthDescription = getDepthDescription(analysisDepth);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'javascript', 'typescript', 'python', 'java'
  ]);
  
  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 dark:border-slate-700 p-6 mb-6">
      {/* Header with expand/collapse control */}
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <Sliders className="mr-2 h-5 w-5 text-blue-500" />
          Advanced Options
        </h2>
        <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      {/* Collapsible content */}
      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Analysis Type */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-center">
              <Code className="mr-2 h-4 w-4 text-blue-500" />
              Analysis Type
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 text-center">
              Select the types of analysis to perform on your code.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 justify-items-center max-w-xl mx-auto">
              {[
                { id: 'code_quality', label: 'Code Quality' },
                { id: 'security', label: 'Security' },
                { id: 'performance', label: 'Performance' },
                { id: 'best_practices', label: 'Best Practices' },
                { id: 'documentation', label: 'Documentation' },
                { id: 'tests', label: 'Tests' }
              ].map((type) => (
                <div 
                  key={type.id}
                  className={`flex items-center justify-center px-3 py-2 rounded-lg cursor-pointer border w-full bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700`}
                  onClick={() => {}}
                >
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-all duration-150"
                    checked={true}
                    onChange={() => {}}
                  />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {type.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Language Settings */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-center">
              <Code className="mr-2 h-4 w-4 text-blue-500" />
              Language Settings
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 text-center">
              Select which languages to analyze. Unselected languages will be ignored.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 justify-items-center">
              {[
                'javascript', 'typescript', 'python', 'java', 
                'c_cpp', 'csharp', 'go', 'rust', 
                'php', 'ruby', 'swift', 'kotlin'
              ].map((language) => (
                <div 
                  key={language}
                  className={`flex items-center justify-center px-3 py-2 rounded-lg cursor-pointer border w-full ${
                    selectedLanguages.includes(language)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  }`}
                  onClick={() => toggleLanguage(language)}
                >
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded transition-all duration-150"
                    checked={selectedLanguages.includes(language)}
                    onChange={() => toggleLanguage(language)}
                  />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">
                    {language === 'c_cpp' ? 'C/C++' : language}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Analysis Depth */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-center">
              <Sliders className="mr-2 h-4 w-4 text-blue-500" />
              Analysis Depth
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 text-center">
              Choose between faster analysis with less detail or deeper analysis with more thorough feedback.
            </p>
            
            <div className="relative mt-2 max-w-xl mx-auto">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
                <span>Quick</span>
                <span className="invisible">Balanced</span>
                <span>Thorough</span>
              </div>
              
              <div className="relative">
                <input 
                  type="range"
                  min={0}
                  max={100}
                  value={analysisDepth}
                  onChange={(e) => setAnalysisDepth(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-blue-500"
                />
                
                {/* Dynamic position indicator with improved visibility and no overlap */}
                <div 
                  className="absolute top-[-32px] text-white text-xs font-semibold transition-all duration-150 px-3 py-1.5 rounded-full bg-blue-600 dark:bg-blue-500 shadow-md transform -translate-x-1/2 z-10"
                  style={{ left: `${analysisDepth}%` }}
                >
                  {analysisDepthDescription}
                </div>
              </div>
              
              <div className="flex justify-between mt-4 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <span>Faster Analysis</span>
                <span>More Detailed Results</span>
              </div>
            </div>
          </div>
          
          {/* Repository-specific rules section removed to simplify the UI */}
        </div>
      )}
    </div>
  );
}
