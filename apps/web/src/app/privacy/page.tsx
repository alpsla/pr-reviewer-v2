"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Example privacy policy sections
const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: `
      This Privacy Policy describes how CodeQual ("we", "our", or "us") collects, uses, and discloses your information when you use our website, PR Reviewer service, and other related services (collectively, the "Services").
      
      We take your privacy seriously and are committed to protecting your personal information. By accessing or using our Services, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
      
      This Privacy Policy may change from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
    `
  },
  {
    id: 'information-collect',
    title: 'Information We Collect',
    content: `
      We collect several types of information from and about users of our Services, including:

      **Personal Information**: Information that identifies you personally, such as your name, email address, and billing information.

      **Account Information**: Information related to your account with us, including your authentication credentials, organization details, and preferences.

      **Usage Data**: Information about how you interact with our Services, including the features you use, the actions you take, and the pages you visit.

      **Repository Data**: Information about the repositories you submit for analysis, including repository metadata, pull request content, and file contents.

      **Device Information**: Information about the devices you use to access our Services, including IP address, browser type, operating system, and device identifiers.

      **Cookies and Similar Technologies**: We use cookies and similar technologies to collect information about your browsing activities and preferences. For more information about our use of cookies, please see our Cookie Policy.
    `
  },
  {
    id: 'how-use',
    title: 'How We Use Your Information',
    content: `
      We use the information we collect for various purposes, including:

      **Providing and Improving Our Services**: To operate, maintain, and enhance the Services we offer to users.

      **Processing Transactions**: To process payments and billing for our Services.

      **Responding to Requests**: To respond to your inquiries, support requests, and feedback.

      **Analyzing Code**: To analyze your pull requests and provide code review suggestions. Our analysis is automated and focused on code quality, not personal information.

      **Analytics and Research**: To understand how users interact with our Services and improve user experience.

      **Marketing and Communications**: To send you updates, newsletters, and marketing communications about our Services (you can opt out of these communications at any time).

      **Security and Fraud Prevention**: To protect our Services and users from fraudulent, unauthorized, or illegal activity.

      **Compliance with Legal Obligations**: To comply with applicable laws, regulations, and legal processes.
    `
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing and Disclosure',
    content: `
      We may share your information in the following circumstances:

      **With Service Providers**: We may share your information with third-party service providers who help us operate our business, process payments, provide customer support, and improve our Services.

      **For Business Transfers**: If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.

      **For Legal Compliance**: We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).

      **With Your Consent**: We may share your information with third parties when you have given us your consent to do so.

      **Aggregated Data**: We may share aggregated, anonymized data with third parties for industry analysis, demographic profiling, and other purposes. This data does not identify individual users.

      We do not sell your personal information to third parties.
    `
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: `
      We implement appropriate technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, and destruction. These measures include encryption, secure coding practices, regular security assessments, and access controls.

      For repository and code data specifically, we employ a "zero-persistence" model where code is analyzed and then promptly deleted from our systems once analysis is complete. We retain only the metadata necessary to provide our Services.

      However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
    `
  },
  {
    id: 'user-rights',
    title: 'Your Rights and Choices',
    content: `
      Depending on your location, you may have certain rights regarding your personal information, including:

      **Access**: You may request access to the personal information we hold about you.

      **Correction**: You may request that we correct inaccurate or incomplete information about you.

      **Deletion**: You may request that we delete your personal information in certain circumstances.

      **Restriction**: You may request that we restrict the processing of your information in certain circumstances.

      **Data Portability**: You may request a copy of your personal information in a structured, commonly used, and machine-readable format.

      **Objection**: You may object to our processing of your personal information in certain circumstances.

      To exercise these rights, please contact us using the information provided in the "Contact Us" section. Please note that we may require specific information from you to help us verify your identity and process your request.
    `
  },
  {
    id: 'retention',
    title: 'Data Retention',
    content: `
      We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.

      For repository and code data, we employ a zero-persistence model, meaning:
      - Code submitted for analysis is automatically deleted after the analysis is complete
      - We retain only metadata about repositories and pull requests, not the actual code content
      - Analysis results are retained only for as long as you maintain an account with us

      You can delete your account at any time, which will remove all personal information associated with your account within 30 days, except where retention is required by law.
    `
  },
  {
    id: 'international',
    title: 'International Data Transfers',
    content: `
      We are based in the United States, and the information we collect may be stored and processed in the United States and other countries where we or our service providers operate.

      If you are located outside the United States, your information may be transferred to, stored, and processed in a country that may not have the same data protection laws as your jurisdiction. By using our Services, you consent to the transfer of your information to the United States or any other country where we or our service providers operate.

      For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we comply with applicable data protection laws when transferring your personal information outside these regions, including by using Standard Contractual Clauses or other appropriate safeguards.
    `
  },
  {
    id: 'children',
    title: "Children's Privacy",
    content: `
      Our Services are not intended for children under the age of 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will take steps to delete that information as quickly as possible.

      If you believe that we might have any information from or about a child under 16, please contact us using the information provided in the "Contact Us" section.
    `
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: `
      If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:

      Email: privacy@codequal.com
      Address: 123 Tech Avenue, Suite 200, San Francisco, CA 94107
      
      We will respond to your inquiry within 30 days.
    `
  }
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
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
                    {section.content.split('\n').map((paragraph, i) => {
                      // Skip empty paragraphs
                      if (!paragraph.trim()) return null;
                      
                      // Check if paragraph starts with asterisks for bold formatting
                      const isBold = paragraph.trim().startsWith('**') && paragraph.trim().includes('**:');
                      
                      if (isBold) {
                        const parts = paragraph.split('**:');
                        const boldText = parts[0].replace('**', '');
                        const remainingText = parts[1] || '';
                        
                        return (
                          <p key={i} className="mb-4 text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">{boldText}:</span>{remainingText}
                          </p>
                        );
                      }
                      
                      return (
                        <p key={i} className="mb-4 text-slate-700 dark:text-slate-300">
                          {paragraph.trim()}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}
              
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  If you have any questions about our Privacy Policy, please <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact us</Link>.
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