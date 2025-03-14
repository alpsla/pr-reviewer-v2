'use client';

import React, { useEffect, useState } from 'react';
import { PRFetcher } from '@/components/repository/PRFetcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DatabaseService } from './database-service';
import { RepositoryService } from './repository-service';

export default function PRAnalyzerClient() {
  const [repositoryService, setRepositoryService] = useState<RepositoryService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function initializeServices() {
      try {
        // Initialize Supabase
        const supabase = createClientComponentClient();
        
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/auth/signin');
          return;
        }
        
        // Get tokens
        const githubToken = session.user.app_metadata?.provider_token;
        const gitlabToken = session.user.app_metadata?.gitlab_token;
        
        if (!githubToken && !gitlabToken) {
          router.replace('/auth/connect');
          return;
        }
        
        // Initialize services
        const databaseService = new DatabaseService(supabase);
        const repoService = new RepositoryService(
          databaseService,
          {
            github: githubToken,
            gitlab: gitlabToken
          }
        );
        
        setRepositoryService(repoService);
      } catch (error) {
        console.error('Error initializing PR analyzer:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeServices();
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading PR analyzer...</p>
        </div>
      </div>
    );
  }

  if (!repositoryService) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Could not initialize PR analyzer. Please try refreshing the page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">PR Analyzer</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze a Pull Request</CardTitle>
            <CardDescription>
              Enter a GitHub or GitLab pull request URL to analyze it with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PRFetcher 
              repositoryService={repositoryService} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">1. Enter a PR URL</h3>
              <p className="text-muted-foreground">
                Paste a GitHub or GitLab pull request URL, or use the simplified format:
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  github/owner/repo/pull/123
                </code> or <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  gitlab/owner/repo/merge_requests/123
                </code>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">2. Review PR Details</h3>
              <p className="text-muted-foreground">
                The system will fetch the pull request details and display a summary
                of the changes, including files modified and PR metadata.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">3. Run Analysis</h3>
              <p className="text-muted-foreground">
                Click the &quot;Analyze&quot; button to start the AI-powered code review.
                The system will examine the code changes and provide feedback on:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                <li>Code quality and best practices</li>
                <li>Potential bugs and issues</li>
                <li>Security vulnerabilities</li>
                <li>Performance considerations</li>
                <li>Documentation and test coverage</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
