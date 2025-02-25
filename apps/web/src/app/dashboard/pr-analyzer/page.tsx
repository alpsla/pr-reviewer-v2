import ClientOnly from '@/components/wrappers/client-only';
import React from 'react';
import { PRFetcher } from '@/components/repository/PRFetcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import dynamic from 'next/dynamic';

// Import locally to avoid server-client hydration issues
import { RepositoryService } from './repository-service';
import { DatabaseService } from './database-service';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const metadata = {
  title: 'PR Analyzer | PR Reviewer',
  description: 'Analyze your pull requests with AI'
};

const PRAnalyzerClientPage = dynamic(
  () => import('./pr-analyzer-client'),
  { ssr: false }
);

export default function PRAnalyzerPage() {
return (
  <ClientOnly>
    <PRAnalyzerClientPage />
  </ClientOnly>
);
}
