'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzeResultsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/results');
  }, [router]);
  
  return null; // No UI needed for redirect
}
