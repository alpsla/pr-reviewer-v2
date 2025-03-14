"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { DarkModeButton } from '@/components/ui/dark-mode-button';
import { Mail, Phone, MessageSquare, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header isAuthenticated={false} userType="free" />
      
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about our services? We're here to help with any inquiries about our code review platform.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:w-1/3">
            <Card className="bg-white dark:bg-slate-800 h-full p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full text-blue-600 dark:text-blue-400 mr-4">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Email</h3>
                    <p className="text-slate-600 dark:text-slate-400">support@codequal.com</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">We respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-50 dark:bg-green-900/20 p-3 rounded-full text-green-600 dark:text-green-400 mr-4">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Phone</h3>
                    <p className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Monday-Friday, 9am-5pm PT</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-full text-amber-600 dark:text-amber-400 mr-4">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Live Chat</h3>
                    <p className="text-slate-600 dark:text-slate-400">Available for Premium users</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Instant support during business hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Location</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      123 Tech Avenue, Suite 200<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div className="lg:w-2/3">
            <Card className="bg-white dark:bg-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <p className="text-green-700 dark:text-green-300">
                    Your message has been sent successfully! We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feedback">Product Feedback</option>
                      <option value="partnership">Partnership Opportunity</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <DarkModeButton
                      type="submit"
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </DarkModeButton>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
        
        {/* FAQ Section - Could be added in the future */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Have More Questions?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Check out our extensive <Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQ section</Link> for quick answers.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}