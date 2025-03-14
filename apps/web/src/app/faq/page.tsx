"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { DarkModeButton } from '@/components/ui/dark-mode-button';
import Link from 'next/link';

const faqCategories = [
  {
    id: 'general',
    name: 'General',
    questions: [
      {
        id: 'what-is',
        question: "What is CodeQual PR Reviewer?",
        answer: "CodeQual PR Reviewer is an AI-powered code review tool that helps developers improve code quality by automatically analyzing pull requests for potential issues, best practices, and optimization opportunities. It works with GitHub, GitLab, and other popular code repositories."
      },
      {
        id: 'how-works',
        question: "How does the PR Reviewer work?",
        answer: "Our tool analyzes your pull request by examining the code changes, identifying potential issues, and providing actionable feedback across multiple categories including code quality, dependencies, performance, security, and best practices. The analysis is powered by advanced AI models that have been trained on millions of code examples."
      },
      {
        id: 'supported-languages',
        question: "What languages and frameworks are supported?",
        answer: "We currently support JavaScript, TypeScript, Python, Java, Go, Ruby, PHP, C#, and Rust. Our framework support includes React, Vue, Angular, Express, Django, Spring, Ruby on Rails, Laravel, and .NET Core. We continuously expand our support for new languages and frameworks."
      }
    ]
  },
  {
    id: 'billing',
    name: 'Pricing & Billing',
    questions: [
      {
        id: 'free-tier',
        question: "What's included in the free tier?",
        answer: "The free tier includes 5 pull request analyses per repository, basic code quality checks, security vulnerability detection, and the ability to export reports. To access advanced features and unlimited analyses, you'll need to upgrade to our Premium or Team plans."
      },
      {
        id: 'pricing-plans',
        question: "What are the pricing plans?",
        answer: "We offer three plans: Free, Premium ($12/month), and Team ($29/month per user). The Premium plan includes unlimited PR analyses, advanced code quality checks, detailed performance analysis, and priority support. The Team plan adds team analytics, custom rule configuration, and enterprise features."
      },
      {
        id: 'payment-methods',
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal. For Team and Enterprise plans, we also offer invoice-based payment options. All payments are processed securely through Stripe."
      }
    ]
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    questions: [
      {
        id: 'data-security',
        question: "How do you handle my code security?",
        answer: "Your code's security is our top priority. We use bank-level encryption for all data in transit and at rest. Our systems are designed with a zero-persistence model for code analysis, meaning that once the analysis is complete, your code is removed from our systems. We never store your full codebase, only metadata related to the analysis."
      },
      {
        id: 'access-permissions',
        question: "What permissions do you need for my repositories?",
        answer: "We request read-only access to the repositories you want to analyze. This allows us to fetch the PR data and file contents for analysis without the ability to make any changes to your code. You can revoke this access at any time through your GitHub or GitLab settings."
      },
      {
        id: 'compliance',
        question: "Do you comply with privacy regulations?",
        answer: "Yes, we fully comply with GDPR, CCPA, and other privacy regulations. We maintain detailed records of all processing activities, implement data minimization practices, and provide users with control over their data. Our complete privacy policy is available for review on our website."
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical Questions',
    questions: [
      {
        id: 'integration',
        question: "How do I integrate with my CI/CD pipeline?",
        answer: "We provide native GitHub Actions and GitLab CI integrations that can be added to your workflows with minimal configuration. For other CI/CD systems, you can use our REST API. Detailed integration guides are available in our documentation."
      },
      {
        id: 'custom-rules',
        question: "Can I define custom analysis rules?",
        answer: "Yes, Premium and Team plans support custom rule configuration. You can define organization-specific best practices, ignore certain types of warnings, adjust severity levels, and create custom checks specific to your codebase."
      },
      {
        id: 'api-access',
        question: "Do you offer an API?",
        answer: "Yes, our comprehensive REST API allows you to trigger analyses, fetch results, and integrate with other tools in your development ecosystem. API access is included in all paid plans, with rate limits based on your subscription tier."
      }
    ]
  },
  {
    id: 'support',
    name: 'Support',
    questions: [
      {
        id: 'support-hours',
        question: "What are your support hours?",
        answer: "Our customer support team is available Monday through Friday from 9am to 5pm Pacific Time. Premium and Team customers receive priority support with faster response times. We also offer 24/7 emergency support for critical issues on Enterprise plans."
      },
      {
        id: 'issue-reporting',
        question: "How do I report an issue or bug?",
        answer: "You can report issues through our in-app feedback system, by emailing support@codequal.com, or by opening an issue on our GitHub repository. For the fastest resolution, please include detailed steps to reproduce the issue, screenshots, and your account information."
      },
      {
        id: 'feature-requests',
        question: "Can I request new features?",
        answer: "Absolutely! We welcome feature requests and actively incorporate user feedback into our development roadmap. You can submit feature requests through our feedback system or by contacting our support team. Premium and Team customers' requests receive priority consideration."
      }
    ]
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Toggle question expansion
  const toggleQuestion = (questionId: string) => {
    if (expandedQuestions.includes(questionId)) {
      setExpandedQuestions(expandedQuestions.filter(id => id !== questionId));
    } else {
      setExpandedQuestions([...expandedQuestions, questionId]);
      
      // Add a small delay before scrolling to ensure the DOM has updated
      setTimeout(() => {
        const element = document.getElementById(questionId);
        if (element) {
          const yOffset = -120; // Increased offset to show more context
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
  // Filter questions based on search query
  const filteredCategories = searchQuery.trim() === ''
    ? faqCategories
    : faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0);
  
  // Set active category or show all if search is active
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };
  
  // Determine which categories to display
  const displayedCategories = activeCategory 
    ? filteredCategories.filter(c => c.id === activeCategory)
    : filteredCategories;
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header isAuthenticated={false} userType="free" />
      
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions about our PR Reviewer service.
            Cannot find what you are looking for? <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact us</Link>.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          {/* Category Sidebar */}
          {searchQuery.trim() === '' && (
            <div className="md:w-1/4">
              <Card className="p-4 sticky top-4">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Categories</h2>
                <nav>
                  <ul className="space-y-1">
                    <li className="mb-2">
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeCategory === null
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        onClick={() => setActiveCategory(null)}
                      >
                        All Categories
                      </button>
                    </li>
                    {faqCategories.map((category) => (
                      <li key={category.id} className="mb-2">
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            activeCategory === category.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Card>
            </div>
          )}
          
          {/* FAQ Content */}
          <div className={searchQuery.trim() === '' ? 'md:w-3/4' : 'w-full'}>
            {displayedCategories.length === 0 ? (
              <Card className="p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No results found</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We could not find any questions matching your search. Try different keywords or browse by category.
                </p>
                <DarkModeButton onClick={() => setSearchQuery('')}>
                  Clear Search
                </DarkModeButton>
              </Card>
            ) : (
              displayedCategories.map((category) => (
                <div key={category.id} className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    {category.name}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((question) => (
                      <Card
                        key={question.id}
                        id={question.id}
                        className={`overflow-hidden transition-all duration-200 ${
                          expandedQuestions.includes(question.id) ? 'shadow-md' : ''
                        }`}
                      >
                        <button
                          className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                          onClick={() => toggleQuestion(question.id)}
                        >
                          <h3 className="text-lg font-medium text-slate-900 dark:text-white pr-8">
                            {question.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {expandedQuestions.includes(question.id) ? (
                              <ChevronUp className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            )}
                          </div>
                        </button>
                        
                        {expandedQuestions.includes(question.id) && (
                          <div className="px-4 pb-4 text-slate-700 dark:text-slate-300">
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                              <p>{question.answer}</p>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            {/* Still need help section */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Still need help?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                  If you could not find the answer to your question, our support team is here to help.
                </p>
                <a href="/contact">
                  <DarkModeButton 
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Contact Support
                  </DarkModeButton>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}