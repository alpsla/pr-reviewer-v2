"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Monitor, Users, Clock, CheckCircle, Zap, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { availableWeeks, getTimeSlotsForWeek, TimeSlot } from '@/config/demo-schedule';
import StyledSelect from '@/components/StyledSelect';

export default function DemoPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    date: '',
    time: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
  // Update available time slots when the selected week changes
  useEffect(() => {
    if (formState.date) {
      setAvailableSlots(getTimeSlotsForWeek(formState.date));
      
      // Reset the time selection if the currently selected time isn't available in the new week
      const selectedTimeIsAvailable = getTimeSlotsForWeek(formState.date)
        .some(slot => slot.id === formState.time);
      
      if (!selectedTimeIsAvailable) {
        setFormState(prev => ({
          ...prev,
          time: ''
        }));
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formState.date]);
  
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
        company: '',
        teamSize: '',
        date: '',
        time: '',
        notes: ''
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Schedule a Demo</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See CodeQual in action with a personalized demo tailored to your team's specific needs.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Demo Information */}
          <div className="lg:w-1/3">
            <Card className="bg-white dark:bg-slate-800 h-full p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">What to Expect</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full text-blue-600 dark:text-blue-400 mr-4">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Duration</h3>
                    <p className="text-slate-600 dark:text-slate-400">30-45 minutes</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Tailored to your needs with Q&A</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-50 dark:bg-green-900/20 p-3 rounded-full text-green-600 dark:text-green-400 mr-4">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Format</h3>
                    <p className="text-slate-600 dark:text-slate-400">Virtual Meeting</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Via Zoom or Microsoft Teams</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-full text-amber-600 dark:text-amber-400 mr-4">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Live Demo</h3>
                    <p className="text-slate-600 dark:text-slate-400">See all features in action</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">With real-world examples</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Follow-up</h3>
                    <p className="text-slate-600 dark:text-slate-400">Personalized resources</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Custom implementation plan</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Demo Request Form */}
          <div className="lg:w-2/3">
            <Card className="bg-white dark:bg-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Request Your Demo</h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <p className="text-green-700 dark:text-green-300">
                    Your demo request has been submitted! We'll contact you shortly to confirm your demo time.
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <StyledSelect
                        label="Team Size"
                        name="teamSize"
                        value={formState.teamSize}
                        onChange={handleChange}
                        required={true}
                        options={[
                          { value: "", label: "Select team size" },
                          { value: "1-5", label: "1-5 developers" },
                          { value: "6-20", label: "6-20 developers" },
                          { value: "21-50", label: "21-50 developers" },
                          { value: "51-100", label: "51-100 developers" },
                          { value: "100+", label: "100+ developers" }
                        ]}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <StyledSelect
                        label="Week of"
                        name="date"
                        value={formState.date}
                        onChange={handleChange}
                        required={true}
                        options={[
                          { value: "", label: "Select a week" },
                          ...availableWeeks.map(week => ({
                            value: week.id, 
                            label: `${week.label} (${week.dateRange})`
                          }))
                        ]}
                      />
                    </div>
                    
                    <div>
                      <StyledSelect
                        label="Available Time Slots"
                        name="time"
                        value={formState.time}
                        onChange={handleChange}
                        required={true}
                        options={[
                          { value: "", label: "Select a time slot" },
                          ...availableSlots.map(slot => ({
                            value: slot.id,
                            label: `${slot.day}, ${slot.time} (${slot.duration})`
                          }))
                        ]}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      What would you like to see in the demo?
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formState.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="Specific features, integrations, or use cases you're interested in..."
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Schedule Demo'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
        
        {/* FAQ Link */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Have Questions Before Scheduling?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Check out our <Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQ section</Link> or <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact us</Link> directly.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}