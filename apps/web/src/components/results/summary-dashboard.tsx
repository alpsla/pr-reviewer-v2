"use client";

import React from 'react';
import { CircularProgress } from './circular-progress';
import { StatusIndicator } from './status-indicator';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SummaryMetrics {
  critical: number;
  warnings: number;
  enhancements: number;
  info: number;
}

export interface SummaryDashboardProps {
  overallScore: number;
  metrics: SummaryMetrics;
  completionTime: string;
  llmModel: string;
  confidence: number;
}

export function SummaryDashboard({
  overallScore,
  metrics,
  completionTime,
  llmModel,
  confidence
}: SummaryDashboardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-12">
          {/* Score section with trend */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <CircularProgress 
                value={overallScore} 
                color="#3B82F6" 
                size="lg"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{overallScore}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Score</span>
              </div>
            </div>

            {/* Historical mini-chart */}
            <div className="flex flex-col items-center space-y-1">
              <div className="h-12 flex items-end space-x-1">
                {[69, 73, 71, 74, overallScore].map((value, i) => (
                  <div 
                    key={i}
                    className="w-2 rounded-t"
                    style={{ 
                      height: `${(value/100) * 48}px`, 
                      backgroundColor: i === 4 ? '#3B82F6' : '#3B82F650'
                    }}
                  ></div>
                ))}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Trend</div>
            </div>
            
            {/* Trend indicator for overall score */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center text-green-400 mb-1">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">12%</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">vs. avg</div>
            </div>
          </div>
          
          {/* Metrics section */}
          <div className="flex space-x-8">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <StatusIndicator type="critical" />
                <div className="flex flex-col">
                  <div className="text-lg font-medium text-slate-900 dark:text-white">{metrics.critical}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Critical</div>
                </div>
              </div>
              <div className="flex items-center mt-1 text-red-400">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span className="text-xs">5%</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <StatusIndicator type="warning" />
                <div className="flex flex-col">
                  <div className="text-lg font-medium text-slate-900 dark:text-white">{metrics.warnings}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Warnings</div>
                </div>
              </div>
              <div className="flex items-center mt-1 text-green-400">
                <ArrowDown className="h-3 w-3 mr-1" />
                <span className="text-xs">8%</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <StatusIndicator type="enhancement" />
                <div className="flex flex-col">
                  <div className="text-lg font-medium text-slate-900 dark:text-white">{metrics.enhancements}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Enhancements</div>
                </div>
              </div>
              <div className="flex items-center mt-1 text-green-400">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span className="text-xs">15%</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <StatusIndicator type="info" />
                <div className="flex flex-col">
                  <div className="text-lg font-medium text-slate-900 dark:text-white">{metrics.info}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Info</div>
                </div>
              </div>
              <div className="flex items-center mt-1 text-slate-400">
                <span className="text-xs">No change</span>
              </div>
            </div>
          </div>

          {/* LLM Model Info */}
          <div className="flex items-center justify-center ml-auto mr-6 h-16 border-l border-slate-200 dark:border-slate-700 pl-6">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Analyzed with</div>
              <div className="font-medium text-slate-900 dark:text-white">{llmModel}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Confidence: {(confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}