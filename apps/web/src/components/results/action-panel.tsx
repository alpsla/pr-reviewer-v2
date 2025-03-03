"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DarkModeButton } from '@/components/ui/dark-mode-button';
import { Card } from '@/components/ui/card';

export interface ActionPanelProps {
  onExportToComments: () => void;
  onDownloadReport: () => void;
  onDismissMinorIssues: () => void;
}

export function ActionPanel({
  onExportToComments,
  onDownloadReport,
  onDismissMinorIssues
}: ActionPanelProps) {
  const [helpfulRating, setHelpfulRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  
  return (
    <Card className="mt-8 p-6">
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Actions</h2>
      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex flex-wrap gap-3">
          <DarkModeButton
            onClick={onExportToComments}
          >
            Export to PR Comments
          </DarkModeButton>
          <DarkModeButton
            onClick={onDownloadReport}
          >
            Download Report
          </DarkModeButton>
          <DarkModeButton
            onClick={onDismissMinorIssues}
          >
            Dismiss Minor Issues
          </DarkModeButton>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center justify-center">
            <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">How helpful was this analysis?</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(rating => (
                <Button 
                  key={rating} 
                  variant={helpfulRating === rating ? "default" : "ghost"} 
                  size="sm" 
                  className="p-1 h-8 flex items-center justify-center"
                  onClick={() => setHelpfulRating(rating)}
                >
                  <span className={helpfulRating && rating <= helpfulRating ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}>
                    ★
                  </span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Feedback textarea appears when rating is selected */}
          {helpfulRating !== null && (
            <div className="mt-3 w-full max-w-md">
              <textarea
                className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                placeholder="Share your thoughts on this analysis and how we can improve it..."
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              
              <DarkModeButton 
                size="sm" 
                className="mt-2" 
                onClick={() => console.log('Feedback submitted:', { rating: helpfulRating, feedback })}
              >
                Submit Feedback
              </DarkModeButton>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}