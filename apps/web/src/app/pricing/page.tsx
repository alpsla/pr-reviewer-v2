'use client';

import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { freeTrialContent } from '@/content/welcome-page-content';

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col relative bg-slate-100 dark:bg-slate-900">
      {/* Main background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-slate-100/80 to-slate-200/50 
                       dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900/95"></div>
        
        <div className="absolute inset-0 opacity-5 dark:opacity-15">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pricingPattern" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M30 30 L90 30 L90 90 L30 90 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500 dark:text-slate-400" />
              <circle cx="30" cy="30" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="90" cy="90" r="3" className="fill-blue-500/70 dark:fill-blue-500/60" />
              <circle cx="30" cy="90" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <circle cx="90" cy="30" r="3" className="fill-indigo-500/70 dark:fill-indigo-500/60" />
              <path d="M10 60 L110 60 M60 10 L60 110" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-slate-500" />
              <circle cx="60" cy="60" r="4" className="fill-blue-600/60 dark:fill-blue-400/60" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pricingPattern)" />
          </svg>
        </div>
      </div>
      
      <Header />
      
      <main className="flex-1 relative z-10 overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Page Header */}
        <section className="py-16 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="container mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100">
              Choose the plan that works best for you. Start with 5 free PRs, no credit card required.
            </p>
          </div>
        </section>
        
        {/* Pricing Table */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold mb-3">{freeTrialContent.pricingTable.title}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">{freeTrialContent.pricingTable.note}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {freeTrialContent.pricingTable.plans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                    index === 1 
                      ? 'border-2 border-blue-500 shadow-xl transform hover:scale-105 bg-white dark:bg-slate-800' 
                      : 'border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl bg-white dark:bg-slate-800'
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  )}
                  
                  <div className={`p-6 text-center ${
                    index === 1 
                      ? 'bg-blue-50 dark:bg-slate-700/50' 
                      : 'bg-white dark:bg-slate-800'
                  }`}>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {plan.highlight}
                    </span>
                    <h3 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">${plan.price}</span>
                      {plan.period && <span className="ml-1 text-xl text-slate-500 dark:text-slate-400">/{plan.period}</span>}
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-slate-100 dark:border-slate-700 space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full py-6 ${
                        index === 1 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : index === 0
                            ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white'
                            : 'bg-white hover:bg-slate-50 text-blue-600 border border-blue-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-blue-400 dark:border-blue-400'
                      }`}
                    >
                      {index === 0 ? 'Start Free' : index === 3 ? 'Contact Us' : 'Choose Plan'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-2">What's included in the free tier?</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  The free tier includes 5 PR analyses total, with support for JavaScript, Python, Java, C#, and TypeScript. It's a great way to try out our service before committing to a subscription.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">What happens if I use all my monthly PR credits?</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Once you've used all your monthly PR credits, you'll need to wait until the next billing cycle for your credits to refresh or upgrade to a higher plan for additional credits.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Do you offer discounts for annual billing?</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes, we offer a 15% discount for annual billing on all paid plans. Contact our sales team for more information.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to improve your code quality?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Start with 5 free PR analyses, no credit card required. Experience the power of AI-driven code reviews.
            </p>
            <Button size="lg" className="rounded-full bg-white text-blue-700 font-bold hover:bg-blue-50 px-8 py-6">
              Start Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
