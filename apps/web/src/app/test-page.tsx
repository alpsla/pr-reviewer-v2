'use client';

import { Header } from '@/components/layout';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary">Test Page</h1>
        <p className="mt-4 text-lg">This is a test page to verify imports.</p>
      </main>
    </div>
  );
}
