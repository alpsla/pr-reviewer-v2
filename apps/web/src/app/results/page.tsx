"use client";

// Action panel styles are handled by the Button component

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, Package, Zap, Shield, BookOpen, Beaker } from 'lucide-react';
import { SummaryDashboard } from '@/components/results/summary-dashboard';
import { CategoryCard, Category } from '@/components/results/category-card';
import { ActionPanel } from '@/components/results/action-panel';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DarkModeButton } from '@/components/ui/dark-mode-button';

// Mock data for development
const mockAnalysisData = {
  prTitle: "Add user authentication and fix API headers",
  overallScore: 78,
  metrics: {
    critical: 2,
    warnings: 8,
    enhancements: 15,
    info: 5
  },
  completionTime: "2025-02-28T14:32:15Z",
  llmModel: "Claude 3.7 Sonnet",
  confidence: 0.92,
  categories: [
    {
      id: "code-quality",
      title: "Code Quality",
      icon: <FileText />,
      color: "#3B82F6", // Blue
      score: 82,
      criticalIssues: 0,
      warnings: 3,
      enhancements: 5,
      subcategories: [
        {
          id: "readability",
          title: "Readability",
          buttonText: "Explore Readability",
          issues: [
            {
              id: "cq-rb-001",
              title: "Complex conditional logic",
              severity: "warning",
              file: "src/auth/controller.ts",
              line: 48,
              description: "The conditional statement is overly complex with multiple nested conditions, making it hard to follow the execution path.",
              recommendation: "Refactor using early returns or extracting conditions into named variables.",
              codeSnippet: `if (user && user.isActive && 
  (user.roles.includes('admin') || 
    (user.permissions && 
      user.permissions.includes('manage:users')))) {
  // Complex logic here
  doSomething();
} else if (user && !user.isActive) {
  // Different logic
  doSomethingElse();
}`
            }
          ]
        }
      ]
    },
    {
      id: "dependencies",
      title: "Dependencies",
      icon: <Package />,
      color: "#8B5CF6", // Purple
      score: 65,
      criticalIssues: 1,
      warnings: 2,
      enhancements: 3,
      subcategories: []
    },
    {
      id: "performance",
      title: "Performance",
      icon: <Zap />,
      color: "#10B981", // Green
      score: 75,
      criticalIssues: 0,
      warnings: 1,
      enhancements: 4,
      subcategories: []
    },
    {
      id: "security",
      title: "Security",
      icon: <Shield />,
      color: "#EF4444", // Red
      score: 60,
      criticalIssues: 1,
      warnings: 2,
      enhancements: 0,
      subcategories: []
    },
    {
      id: "best-practices",
      title: "Best Practices",
      icon: <BookOpen />,
      color: "#F59E0B", // Amber
      score: 85,
      criticalIssues: 0,
      warnings: 0,
      enhancements: 3,
      subcategories: []
    },
    {
      id: "testing",
      title: "Testing",
      icon: <Beaker />,
      color: "#06B6D4", // Cyan
      score: 70,
      criticalIssues: 0,
      warnings: 0,
      enhancements: 0,
      subcategories: []
    }
  ]
};

export default function ResultsPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  // Action handlers
  const handleExportToComments = () => {
    console.log('Exporting to PR comments...');
    // Implementation would connect to GitHub/GitLab API
  };
  
  const handleDownloadReport = () => {
    console.log('Downloading report...');
    // Implementation would generate PDF or Markdown
  };
  
  const handleDismissMinorIssues = () => {
    console.log('Dismissing minor issues...');
    // Implementation would filter out minor issues
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <Header isAuthenticated={true} userType="premium" />
      
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-slate-600 dark:text-slate-400">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'PR Analysis', href: '/analyze' },
              { label: 'Results', href: '/results' }
            ]}
          />
        </div>
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Results: {mockAnalysisData.prTitle}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Analyzed on {new Date(mockAnalysisData.completionTime).toLocaleString()}
          </p>
        </div>
        
        {/* Summary Dashboard */}
        <SummaryDashboard
          overallScore={mockAnalysisData.overallScore}
          metrics={mockAnalysisData.metrics}
          completionTime={mockAnalysisData.completionTime}
          llmModel={mockAnalysisData.llmModel}
          confidence={mockAnalysisData.confidence}
        />
        
        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expandedCategory ? (
            <>
              <div className="col-span-full mb-4">
                <button
                  onClick={() => setExpandedCategory(null)}
                  className="flex items-center px-4 py-2 rounded-md font-medium transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700 shadow-md hover:shadow-lg dark:text-slate-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to overview
                </button>
              </div>
              
              {mockAnalysisData.categories
                .filter(category => category.id === expandedCategory)
                .map(category => (
                  <CategoryCard 
                    key={category.id} 
                    category={category as Category}
                    isExpanded={true}
                    onExpand={() => {}}
                  />
                ))
              }
            </>
          ) : (
            mockAnalysisData.categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category as Category}
                isExpanded={false}
                onExpand={() => setExpandedCategory(category.id)}
              />
            ))
          )}
        </div>
        
        {/* Action Panel */}
        <ActionPanel
          onExportToComments={handleExportToComments}
          onDownloadReport={handleDownloadReport}
          onDismissMinorIssues={handleDismissMinorIssues}
        />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}