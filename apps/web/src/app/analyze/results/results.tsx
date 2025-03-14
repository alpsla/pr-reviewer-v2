'use client';

import { Header, Footer } from '@/components/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  HelpCircle, 
  Download, 
  Share2, 
  Clipboard, 
  Filter, 
  CheckCircle, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  AlertTriangle,
  AlertCircle,
  ArrowUp,
  Code,
  ShieldAlert,
  Zap,
  FileCheck,
  Puzzle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResultsPage() {
  // This would come from URL params or context in a real app
  const [analysisId, setAnalysisId] = useState<string>('mock-analysis-123');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  
  // Mock data fetch
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // This would be an API call in a real app
      setAnalysisResults({
        id: 'mock-analysis-123',
        pr: {
          title: 'Update dependencies and fix layout issues',
          repository: 'acme/widget-service',
          url: 'https://github.com/acme/widget-service/pull/123',
          author: 'jane-doe',
          createdAt: '2025-02-15T10:30:00Z',
          updatedAt: '2025-02-25T14:22:00Z',
        },
        analysis: {
          completedAt: '2025-02-28T10:45:30Z',
          overallScore: 78,
          model: 'CodeQual LLM v2.1',
          confidence: 'high',
          categories: [
            {
              id: 'code_quality',
              name: 'Code Quality',
              score: 82,
              color: '#3B82F6', // blue
              icon: 'code',
              issues: {
                critical: 0,
                warnings: 3,
                enhancements: 7
              },
              subcategories: [
                {
                  id: 'code_style',
                  name: 'Code Style',
                  issues: [
                    {
                      id: 'issue-1',
                      title: 'Inconsistent naming convention',
                      severity: 'warning',
                      file: 'src/components/header.tsx',
                      line: 42,
                      description: 'The function "GetUserData" uses PascalCase instead of camelCase which is inconsistent with the rest of the codebase.',
                      solution: 'Rename the function to "getUserData" to follow the camelCase convention used throughout the project.',
                      snippet: {
                        code: 'export function GetUserData(userId) {\n  // implementation\n}',
                        highlight: [1, 1],
                        suggestedCode: 'export function getUserData(userId) {\n  // implementation\n}'
                      }
                    },
                    // More issues would be here
                  ]
                }
              ]
            },
            {
              id: 'security',
              name: 'Security',
              score: 65,
              color: '#EF4444', // red
              icon: 'shieldAlert',
              issues: {
                critical: 1,
                warnings: 2,
                enhancements: 3
              },
              subcategories: [
                {
                  id: 'auth',
                  name: 'Authentication',
                  issues: [
                    {
                      id: 'issue-2',
                      title: 'Insecure storage of user credentials',
                      severity: 'critical',
                      file: 'src/utils/auth.js',
                      line: 78,
                      description: 'User credentials are stored in localStorage which is vulnerable to XSS attacks.',
                      solution: 'Use httpOnly cookies for storing sensitive authentication information or consider using a token-based approach that refreshes regularly.',
                      snippet: {
                        code: 'localStorage.setItem("userCredentials", JSON.stringify(credentials));',
                        highlight: [1, 1],
                        suggestedCode: '// Instead of localStorage, use httpOnly cookies\n// or a token-based approach with refresh mechanism\nsetAuthCookie(credentials);'
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: 'performance',
              name: 'Performance',
              score: 88,
              color: '#10B981', // green
              icon: 'zap',
              issues: {
                critical: 0,
                warnings: 1,
                enhancements: 4
              },
              subcategories: [
                {
                  id: 'rendering',
                  name: 'Rendering Optimization',
                  issues: [
                    {
                      id: 'issue-3',
                      title: 'Missing React key prop in list',
                      severity: 'warning',
                      file: 'src/components/user-list.jsx',
                      line: 23,
                      description: 'The list items are rendered without unique "key" props which can cause performance issues with large lists.',
                      solution: 'Add a unique "key" prop to each item in the list, preferably using a stable identifier from the data.',
                      snippet: {
                        code: 'return (\n  <ul>\n    {users.map(user => (\n      <li>{user.name}</li>\n    ))}\n  </ul>\n);',
                        highlight: [4, 4],
                        suggestedCode: 'return (\n  <ul>\n    {users.map(user => (\n      <li key={user.id}>{user.name}</li>\n    ))}\n  </ul>\n);'
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: 'best_practices',
              name: 'Best Practices',
              score: 79,
              color: '#F59E0B', // amber
              icon: 'fileCheck',
              issues: {
                critical: 0,
                warnings: 2,
                enhancements: 5
              },
              subcategories: [
                {
                  id: 'documentation',
                  name: 'Documentation',
                  issues: []
                }
              ]
            },
            {
              id: 'dependencies',
              name: 'Dependencies',
              score: 72,
              color: '#8B5CF6', // purple
              icon: 'puzzlePiece',
              issues: {
                critical: 0,
                warnings: 1,
                enhancements: 2
              },
              subcategories: [
                {
                  id: 'outdated',
                  name: 'Outdated Packages',
                  issues: []
                }
              ]
            }
          ]
        }
      });
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [analysisId]);
  
  // Set active subcategory when a category is selected
  useEffect(() => {
    if (selectedCategory && analysisResults) {
      const category = analysisResults.analysis.categories.find(
        (c: any) => c.id === selectedCategory
      );
      if (category && category.subcategories.length > 0) {
        setActiveSubcategory(category.subcategories[0].id);
      }
    }
  }, [selectedCategory, analysisResults]);
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedIssue(null);
  };
  
  const handleBackToSummary = () => {
    setSelectedCategory(null);
    setSelectedIssue(null);
    setActiveSubcategory(null);
  };
  
  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };
  
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code />;
      case 'shieldAlert':
        return <ShieldAlert />;
      case 'zap':
        return <Zap />;
      case 'fileCheck':
        return <FileCheck />;
      case 'puzzlePiece':
        return <Puzzle />;
      default:
        return <Code />;
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'enhancement':
        return <ArrowUp className="h-5 w-5 text-blue-500" />;
      case 'info':
        return <HelpCircle className="h-5 w-5 text-slate-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-slate-500" />;
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb and title */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'PR Analysis', href: '/analyze' },
              { label: 'Results', href: `/analyze/results` }
            ]} 
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Analysis Results
            </h1>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
              >
                <Link href="/analyze">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to PR Input
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="text-sm"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                How to Read Results
              </Button>
            </div>
          </div>
          
          {analysisResults && (
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              {analysisResults.pr.title}
            </p>
          )}
        </div>
        
        {loading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading analysis results...</p>
          </div>
        ) : selectedCategory === null ? (
          // Summary view
          <div className="space-y-8">
            {/* Summary dashboard */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Overall score */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <svg className="w-32 h-32">
                      <circle
                        className="text-slate-200 dark:text-slate-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                        strokeDasharray="352"
                        strokeDashoffset={352 - (352 * analysisResults.analysis.overallScore) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">
                        {analysisResults.analysis.overallScore}
                      </span>
                    </div>
                  </div>
                  <span className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Overall Score
                  </span>
                </div>
                
                {/* Summary metrics */}
                <div className="flex flex-col items-start justify-center space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    Issues Summary
                  </h3>
                  
                  <div className="w-full grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {analysisResults.analysis.categories.reduce((total: number, cat: any) => 
                          total + cat.issues.critical, 0)}
                      </span>
                      <span className="text-xs text-red-600 dark:text-red-400">Critical</span>
                    </div>
                    
                    <div className="flex flex-col items-center bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {analysisResults.analysis.categories.reduce((total: number, cat: any) => 
                          total + cat.issues.warnings, 0)}
                      </span>
                      <span className="text-xs text-amber-600 dark:text-amber-400">Warnings</span>
                    </div>
                    
                    <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {analysisResults.analysis.categories.reduce((total: number, cat: any) => 
                          total + cat.issues.enhancements, 0)}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400">Enhancements</span>
                    </div>
                  </div>
                </div>
                
                {/* PR details */}
                <div className="flex flex-col space-y-2 md:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    PR Information
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Repository:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {analysisResults.pr.repository}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Author:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {analysisResults.pr.author}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Model Used:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {analysisResults.analysis.model}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Confidence:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-200 capitalize">
                        {analysisResults.analysis.confidence}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Analysis Completed:</span>
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {new Date(analysisResults.analysis.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto text-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto text-sm"
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      PR Comments
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto text-sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category cards */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Analysis Categories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisResults.analysis.categories.map((category: any) => (
                <div 
                  key={category.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                      >
                        {getCategoryIcon(category.icon)}
                      </div>
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Category score */}
                    <div className="relative w-12 h-12">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          className="text-slate-200 dark:text-slate-700"
                          strokeWidth="5"
                          stroke="currentColor"
                          fill="transparent"
                          r="20"
                          cx="24"
                          cy="24"
                        />
                        <circle
                          style={{ stroke: category.color, opacity: 0.9 }}
                          strokeWidth="5"
                          strokeLinecap="round"
                          fill="transparent"
                          r="20"
                          cx="24"
                          cy="24"
                          strokeDasharray="125.6"
                          strokeDashoffset={125.6 - (125.6 * category.score) / 100}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {category.score}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Summary metrics */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-red-500 dark:text-red-400">
                        {category.issues.critical}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Critical</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-amber-500 dark:text-amber-400">
                        {category.issues.warnings}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Warnings</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-green-500 dark:text-green-400">
                        {category.issues.enhancements}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Enhance</span>
                    </div>
                  </div>
                  
                  {/* View details link */}
                  <div className="mt-4 text-right">
                    <span 
                      className="text-sm font-medium hover:underline"
                      style={{ color: category.color }}
                    >
                      View details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedIssue === null ? (
          // Category detail view
          <div>
            {/* Category header */}
            <div className="mb-6">
              <button
                className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
                onClick={handleBackToSummary}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Summary
              </button>
              
              {(() => {
                const category = analysisResults.analysis.categories.find(
                  (c: any) => c.id === selectedCategory
                );
                return (
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {getCategoryIcon(category.icon)}
                        </div>
                        <h2 
                          className="text-2xl font-bold"
                          style={{ color: category.color }}
                        >
                          {category.name}
                        </h2>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Score:</span>
                        <div className="relative w-10 h-10">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              className="text-slate-200 dark:text-slate-700"
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="transparent"
                              r="16"
                              cx="20"
                              cy="20"
                            />
                            <circle
                              style={{ stroke: category.color }}
                              strokeWidth="4"
                              strokeLinecap="round"
                              fill="transparent"
                              r="16"
                              cx="20"
                              cy="20"
                              strokeDasharray="100.48"
                              strokeDashoffset={100.48 - (100.48 * category.score) / 100}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              {category.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Issues summary */}
                    <div className="mt-4 flex space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {category.issues.critical} Critical
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {category.issues.warnings} Warnings
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {category.issues.enhancements} Enhancements
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            {/* Subcategory tabs navigation */}
            <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex overflow-x-auto">
                  {analysisResults.analysis.categories
                    .find((c: any) => c.id === selectedCategory)
                    .subcategories.map((subcategory: any) => (
                      <button
                        key={subcategory.id}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                          activeSubcategory === subcategory.id
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                        onClick={() => setActiveSubcategory(subcategory.id)}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                </div>
              </div>
              
              {/* Filter controls */}
              <div className="p-4">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Filter:
                    </span>
                    
                    <select className="text-sm rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="warning">Warnings</option>
                      <option value="enhancement">Enhancements</option>
                    </select>
                    
                    <select className="text-sm rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      <option value="all">All Files</option>
                      <option value="js">JavaScript (.js)</option>
                      <option value="ts">TypeScript (.ts)</option>
                      <option value="jsx">React (.jsx)</option>
                      <option value="tsx">React TypeScript (.tsx)</option>
                    </select>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    More Filters
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Issues list */}
            <div className="space-y-4">
              {activeSubcategory && analysisResults.analysis.categories
                .find((c: any) => c.id === selectedCategory)
                .subcategories
                .filter((sub: any) => sub.id === activeSubcategory)
                .map((subcategory: any) => (
                  <div key={subcategory.id}>
                    {subcategory.issues.length > 0 ? (
                      <div className="space-y-4">
                        {subcategory.issues.map((issue: any) => (
                          <div
                            key={issue.id}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleIssueClick(issue)}
                          >
                            <div className="flex flex-wrap items-start justify-between">
  <div className="flex items-start space-x-3">
    <div 
      className={`h-6 w-6 rounded-full flex items-center justify-center text-white ${
        issue.severity === 'critical' 
          ? 'bg-red-500' 
          : issue.severity === 'warning'
          ? 'bg-amber-500'
          : 'bg-green-500'
      }`}
    >
      {issue.severity === 'critical' 
        ? '!' 
        : issue.severity === 'warning'
        ? '⚠'
        : '+'
      }
    </div>
    
    <div>
      <h4 className="text-base font-medium text-slate-800 dark:text-slate-100">
        {issue.title}
      </h4>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {issue.file}:{issue.line}
      </div>
    </div>
  </div>
  
  <span className="text-xs font-medium mt-2 md:mt-0 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
    {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
  </span>
</div>

<div className="mt-3">
  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
    {issue.description}
  </p>
</div>
</div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                        No issues found in this subcategory.
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          // Issue detail view
          <div>
            {/* Navigation */}
            <div className="mb-6">
              <button
                className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
                onClick={() => setSelectedIssue(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Issues
              </button>
              
              {/* Issue header */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-start space-x-4">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                      selectedIssue.severity === 'critical' 
                        ? 'bg-red-500' 
                        : selectedIssue.severity === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {selectedIssue.severity === 'critical' 
                      ? '!' 
                      : selectedIssue.severity === 'warning'
                      ? '⚠'
                      : '+'
                    }
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedIssue.title}
                    </h2>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {selectedIssue.file}:{selectedIssue.line}
                      </span>
                      <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {selectedIssue.severity.charAt(0).toUpperCase() + selectedIssue.severity.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Issue details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Code snippet */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
                      {selectedIssue.file}
                    </span>
                    <button 
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" 
                      onClick={() => handleCopyCode(selectedIssue.snippet.code)}
                    >
                      {copiedToClipboard ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-4 font-mono text-sm overflow-x-auto bg-slate-50 dark:bg-slate-800">
                    <pre className="text-slate-800 dark:text-slate-200">
                      {selectedIssue.snippet.code.split('\n').map((line: string, i: number) => (
                        <div 
                          key={i} 
                          className={`${
                            i+1 >= selectedIssue.snippet.highlight[0] && 
                            i+1 <= selectedIssue.snippet.highlight[1]
                              ? 'bg-red-100 dark:bg-red-900/30 border-l-2 border-red-500 pl-2 -ml-2'
                              : ''
                          }`}
                        >
                          <span className="inline-block w-8 text-slate-400 dark:text-slate-500">{i+1}</span>
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
                
                {/* Suggested solution */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
                    <span className="font-medium text-sm text-green-700 dark:text-green-400">
                      Suggested Solution
                    </span>
                    <button 
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" 
                      onClick={() => handleCopyCode(selectedIssue.snippet.suggestedCode)}
                    >
                      {copiedToClipboard ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-4 font-mono text-sm overflow-x-auto bg-green-50/50 dark:bg-green-900/10">
                    <pre className="text-slate-800 dark:text-slate-200">
                      {selectedIssue.snippet.suggestedCode.split('\n').map((line: string, i: number) => (
                        <div key={i}>
                          <span className="inline-block w-8 text-slate-400 dark:text-slate-500">{i+1}</span>
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* Issue description and actions */}
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                    Description
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {selectedIssue.description}
                  </p>
                </div>
                
                {/* Recommendation */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                    Recommendation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {selectedIssue.solution}
                  </p>
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400">
                    <p>
                      <strong>Note:</strong> This recommendation is based on automated analysis and may need adaptation to fit your specific codebase context.
                    </p>
                  </div>
                </div>
                
                {/* Feedback */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                    Feedback
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Was this suggestion helpful?
                  </p>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Not Helpful
                    </Button>
                  </div>
                </div>
                
                {/* Issue actions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                    Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <Button className="w-full justify-start text-sm">
                      <Clipboard className="h-4 w-4 mr-2" />
                      Add as PR Comment
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export This Issue
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600">
                      <Filter className="h-4 w-4 mr-2" />
                      Ignore Similar Issues
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}