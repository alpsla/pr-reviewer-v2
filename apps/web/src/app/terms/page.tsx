"use client";

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Example terms of service sections
const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: `
      These Terms of Service ("Terms") govern your access to and use of CodeQual services, including our website, APIs, 
      email notifications, applications, and our other covered services that link to these Terms (collectively, the "Services"), 
      and any information, text, graphics, photos or other materials uploaded, downloaded or appearing on the Services (collectively referred to as "Content").
      
      By using the Services, you agree to be bound by these Terms. If you are using the Services on behalf of an organization, 
      you are agreeing to these Terms on behalf of that organization and promising that you have the authority to bind that organization to these terms.
    `
  },
  {
    id: 'privacy',
    title: 'Privacy',
    content: `
      Our Privacy Policy describes how we handle the information you provide to us when you use our Services. You understand that through your use of the Services 
      you consent to the collection and use of this information in accordance with our Privacy Policy.
    `
  },
  {
    id: 'content',
    title: 'Your Content',
    content: `
      You are responsible for your use of the Services and for any Content you provide, including compliance with applicable laws, rules, and regulations. 
      You should only provide Content that you are comfortable sharing with others.
      
      Any use or reliance on any Content or materials posted via the Services or obtained by you through the Services is at your own risk. We do not endorse, 
      support, represent or guarantee the completeness, truthfulness, accuracy, or reliability of any Content or communications posted via the Services.
      
      By submitting, posting or displaying Content on or through the Services, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, 
      process, adapt, modify, publish, transmit, display and distribute such Content in any and all media or distribution methods now known or later developed.
    `
  },
  {
    id: 'api',
    title: 'API Usage',
    content: `
      If you use the CodeQual API, you agree to our API Terms, which form part of these Terms. 
      
      You may not use the Services in a manner that exceeds rate limits, or constitutes excessive or abusive usage. If we believe a user's integration negatively 
      impacts the performance of CodeQual, we may throttle or block their access to the API.
    `
  },
  {
    id: 'security',
    title: 'Security',
    content: `
      We care about the security of our users. While we work to protect the security of your content and account, CodeQual cannot guarantee that unauthorized 
      third parties will not be able to defeat our security measures. You are responsible for maintaining the security of your account and password.
      
      You must immediately notify CodeQual of any unauthorized uses of your account, or any other breaches of security. CodeQual will not be liable for any acts 
      or omissions by you, including any damages of any kind incurred as a result of such acts or omissions.
    `
  },
  {
    id: 'cancellation',
    title: 'Cancellation and Termination',
    content: `
      You may cancel your account at any time. We may suspend or terminate your access to the Services at any time for any reason, including if we believe that you 
      have violated these Terms. Upon termination, your right to use the Services will immediately cease.
      
      All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, 
      warranty disclaimers, indemnity, and limitations of liability.
    `
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  
  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
      
      // Scroll to section with offset for the header
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -120; // Increased offset to show more context
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header isAuthenticated={false} userType="free" />
      
      <div className="container mx-auto py-12 px-4">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Last updated: March 1, 2025
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Table of Contents Sidebar */}
          <div className="md:w-1/4">
            <Card className="p-4 sticky top-4">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Contents</h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`}
                        className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 flex items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSection(section.id);
                        }}
                      >
                        {activeSection === section.id ? (
                          <ChevronUp className="h-4 w-4 mr-1 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                        )}
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button 
                  onClick={scrollToTop}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Back to top
                </button>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <Card className="p-6">
              {sections.map((section) => (
                <section 
                  key={section.id} 
                  id={section.id}
                  className={`mb-8 pb-8 ${
                    section !== sections[sections.length - 1] ? 'border-b border-slate-200 dark:border-slate-700' : ''
                  }`}
                >
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{section.title}</h2>
                  <div className="prose dark:prose-invert prose-slate max-w-none">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 text-slate-700 dark:text-slate-300">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
              
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  If you have any questions about these Terms, please <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact us</Link>.
                </p>
              </div>
            </Card>
            
            <div className="mt-4 text-center">
              <button 
                onClick={scrollToTop}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}