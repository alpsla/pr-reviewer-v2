"use client";

import React from 'react';
import { ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DarkModeButton } from '@/components/ui/dark-mode-button';
import { CodeBlock } from '@/components/ui/code-block';
import { CircularProgress } from './circular-progress';
import { StatusIndicator } from './status-indicator';

export interface Issue {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'enhancement' | 'info';
  file: string;
  line: number;
  description: string;
  recommendation: string;
  codeSnippet?: string;
}

export interface Subcategory {
  id: string;
  title: string;
  issues: Issue[];
  buttonText?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  score: number;
  criticalIssues: number;
  warnings: number;
  enhancements: number;
  subcategories: Subcategory[];
}

export interface CategoryCardProps {
  category: Category;
  isExpanded: boolean;
  onExpand: () => void;
}

export function CategoryCard({ 
  category, 
  isExpanded, 
  onExpand 
}: CategoryCardProps) {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'col-span-full' : 'col-span-1'} bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600`}
      onClick={() => !isExpanded && onExpand()}
    >
      <div 
        className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700"
        style={{ backgroundColor: `${category.color}15` }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: `${category.color}20` }}>
            <div style={{ color: category.color }}>
              {category.icon}
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">{category.title}</h3>
        </div>

        <div className="flex items-center space-x-6">
          {/* Historical mini-chart */}
          <div className="h-8 flex items-end space-x-1">
            {[65, 72, 68, 75, category.score].map((value, i) => (
              <div 
                key={i}
                className="w-1.5 rounded-t"
                style={{ 
                  height: `${(value/100) * 32}px`, 
                  backgroundColor: i === 4 ? category.color : `${category.color}50`
                }}
              ></div>
            ))}
          </div>
          
          {/* Score indicator */}
          <div className="relative w-12 h-12 flex flex-col items-center">
            <CircularProgress value={category.score} size="sm" color={category.color} />
            <div className="absolute inset-0 flex items-center justify-center text-base font-medium">
              {category.score}
            </div>
            <div className="flex items-center mt-1 text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span className="text-xs">7%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <StatusIndicator type="critical" size="sm" />
              <span className="text-sm text-slate-600 dark:text-slate-400">{category.criticalIssues}</span>
            </div>
            <div className="flex items-center space-x-1">
              <StatusIndicator type="warning" size="sm" />
              <span className="text-sm text-slate-600 dark:text-slate-400">{category.warnings}</span>
            </div>
            <div className="flex items-center space-x-1">
              <StatusIndicator type="enhancement" size="sm" />
              <span className="text-sm text-slate-600 dark:text-slate-400">{category.enhancements}</span>
            </div>
          </div>
          
          {!isExpanded && (
            <DarkModeButton 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              icon={<ChevronRight className="h-4 w-4 text-blue-400" />}
            >
              Expand
            </DarkModeButton>
          )}
        </div>
        
        {isExpanded && category.subcategories.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">Subcategories</h4>
            <div className="space-y-4">
              {category.subcategories.map(subcategory => (
                <div key={subcategory.id} className="border border-slate-200 dark:border-slate-700 rounded-md p-3 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-slate-900 dark:text-white">{subcategory.title}</h5>
                    {subcategory.buttonText && (
                      <DarkModeButton
                        size="sm"
                        icon={<ChevronRight className="h-4 w-4 text-blue-400" />}
                      >
                        {subcategory.buttonText}
                      </DarkModeButton>
                    )}
                  </div>
                  {subcategory.issues.map(issue => (
                    <div key={issue.id} className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3 bg-white dark:bg-slate-800 rounded-md p-4 shadow-sm overflow-hidden">
                      <div className="flex items-start space-x-2 mb-2">
                        <StatusIndicator type={issue.severity} />
                        <div>
                          <h6 className="font-medium text-slate-900 dark:text-white">{issue.title}</h6>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {issue.file}:{issue.line}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{issue.description}</p>
                      <div className="mb-2">
                        <h6 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Recommendation:</h6>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{issue.recommendation}</p>
                      </div>
                       {issue.codeSnippet && (
                        <div className="dark:bg-slate-900 bg-gray-100 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 m-0 p-0">
                          <div className="bg-inherit dark:bg-inherit">
                            <CodeBlock
                              code={issue.codeSnippet}
                              language="typescript"
                              variant="ghost"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {isExpanded && category.subcategories.length === 0 && (
          <div className="mt-4 text-center p-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-md">
            <p className="text-slate-600 dark:text-slate-400">No detailed issues found in this category.</p>
          </div>
        )}
      </div>
    </Card>
  );
}