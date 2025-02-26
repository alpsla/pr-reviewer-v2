"use client";

import * as React from "react";
import { Stack, Divider, Logo, Button, Link } from "@/components/ui";

export function LayoutExample() {
  return (
    <div className="bg-white dark:bg-primary-900 shadow-sm">
      {/* Header */}
      <header className="py-4 border-b border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo size="sm" withText textPosition="right" greenCheckmark />
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#" variant="nav">Dashboard</Link>
              <Link href="#" variant="nav">Repositories</Link>
              <Link href="#" variant="nav">Pull Requests</Link>
              <Link href="#" variant="nav">Settings</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="outline">Login</Button>
              <Button size="sm" className="text-white">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-primary-50 dark:bg-primary-800">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                AI-Powered Code Review for your Pull Requests
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                CodeQual.dev helps your team maintain high code quality with automated, 
                intelligent reviews that catch issues before they reach production.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-white">Get Started</Button>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Logo size="3xl" greenCheckmark />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" withText textPosition="right" greenCheckmark />
              <p className="mt-4 text-sm text-muted-foreground">
                AI-Powered Code Reviews for GitHub and GitLab
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <Stack spacing={2}>
                <Link href="#" variant="subtle">Features</Link>
                <Link href="#" variant="subtle">Pricing</Link>
                <Link href="#" variant="subtle">Documentation</Link>
                <Link href="#" variant="subtle">Changelog</Link>
              </Stack>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <Stack spacing={2}>
                <Link href="#" variant="subtle">About</Link>
                <Link href="#" variant="subtle">Blog</Link>
                <Link href="#" variant="subtle">Careers</Link>
                <Link href="#" variant="subtle">Contact</Link>
              </Stack>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <Stack spacing={2}>
                <Link href="#" variant="subtle">Privacy Policy</Link>
                <Link href="#" variant="subtle">Terms of Service</Link>
                <Link href="#" variant="subtle">Cookie Policy</Link>
              </Stack>
            </div>
          </div>
          <Divider className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CodeQual.dev. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {/* GitHub Icon */}
              <Link href="#" variant="subtle" title="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              
              {/* GitLab Icon */}
              <Link href="#" variant="subtle" title="GitLab">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>
                </svg>
              </Link>
              
              {/* Azure DevOps Icon */}
              <Link href="#" variant="subtle" title="Azure DevOps">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M0 8.877L2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
