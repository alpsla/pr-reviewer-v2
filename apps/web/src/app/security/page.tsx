"use client";

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Lock, Database, Users, FileCheck, Server, Globe } from 'lucide-react';
import Link from 'next/link';

// Security categories
const securityCategories = [
  {
    id: 'data-protection',
    title: 'Data Protection',
    icon: <Database className="h-6 w-6" />,
    description: 'How we secure your data and code',
    points: [
      "Zero-persistence model for code analysis - your code is never stored after analysis is complete",
      "End-to-end encryption for all data in transit using TLS 1.3",
      "AES-256 encryption for all data at rest",
      "Strict access controls with role-based permissions",
      "Regular security audits and vulnerability assessments"
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication & Access',
    icon: <Lock className="h-6 w-6" />,
    description: 'Secure authentication and access controls',
    points: [
      "OAuth 2.0 integration with GitHub and GitLab",
      "Multi-factor authentication support",
      "Secure password policies with bcrypt hashing",
      "Session management with automatic timeouts",
      "Granular permission controls for team accounts",
      "JWT tokens with short expiration times"
    ]
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure Security',
    icon: <Server className="h-6 w-6" />,
    description: 'Our secure hosting and infrastructure practices',
    points: [
      "SOC 2 Type II compliant cloud infrastructure",
      "Isolated environments for code analysis",
      "Automated security scanning and monitoring",
      "DDoS protection and WAF implementation",
      "Regular penetration testing by third-party security firms",
      "Comprehensive disaster recovery procedures"
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance & Certifications',
    icon: <FileCheck className="h-6 w-6" />,
    description: 'Our compliance with industry standards',
    points: [
      "SOC 2 Type II certification",
      "GDPR compliance for EU data subjects",
      "CCPA compliance for California residents",
      "ISO 27001 certification in progress",
      "Regular independent security audits",
      "Transparent incident response procedures"
    ]
  },
  {
    id: 'organizational',
    title: 'Organizational Security',
    icon: <Users className="h-6 w-6" />,
    description: 'Our internal security practices',
    points: [
      "Comprehensive security awareness training for all employees",
      "Background checks for all team members",
      "Strict access control policies for internal systems",
      "Formal security policies and procedures",
      "Regular security review of all code changes",
      "Dedicated security team"
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy Protection',
    icon: <ShieldCheck className="h-6 w-6" />,
    description: 'How we protect your privacy',
    points: [
      "Detailed privacy policy specifying data usage",
      "Minimization of data collection principles",
      "User control over data retention",
      "Anonymization of usage statistics",
      "No selling or sharing of your personal data",
      "Transparent data processing practices"
    ]
  }
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header isAuthenticated={false} userType="free" />
      
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full">
              <Globe className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Security and Trust</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            At CodeQual, security is our top priority. We take comprehensive measures to protect your code and data.
            Learn about our security practices and commitments below.
          </p>
        </div>
        
        {/* Main Security Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {securityCategories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full text-blue-600 dark:text-blue-400">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{category.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{category.description}</p>
                </div>
              </div>
              
              <ul className="space-y-2 pl-4">
                {category.points.map((point, index) => (
                  <li key={index} className="text-slate-700 dark:text-slate-300 flex items-start">
                    <span className="text-green-500 mr-2 text-lg leading-none">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        
        {/* Additional Security Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Our Security Commitment</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Security is not just a feature at CodeQual—it's a fundamental principle that guides everything we do. We understand that your code contains your intellectual property and sensitive information, and we take the responsibility of handling it with the utmost care.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Our zero-persistence model means that your code is analyzed in isolated environments and is completely removed from our systems once analysis is complete. We only retain metadata necessary for providing our services, not your actual code.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We regularly undergo independent security audits and maintain compliance with industry standards to ensure that our security practices remain at the highest level.
            </p>
            
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">Security Reporting</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              If you discover a potential security vulnerability within our systems, we encourage you to report it to our security team at <span className="text-blue-600 dark:text-blue-400">security@codequal.com</span>. We have a formal responsible disclosure program with a commitment to respond to security reports within 24 hours.
            </p>
            
            <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                For more detailed information about how we handle your data, please review our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}