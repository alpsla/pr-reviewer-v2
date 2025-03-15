# Example Catch Blocks for Error Handling System

This document provides examples of how to implement the error handling system in different parts of the application. You can use these as templates when updating existing catch blocks.

## API Route Error Handling

```typescript
// In API route files
import { NextRequest, NextResponse } from 'next/server';
import { createError, ErrorCode } from '@/lib/errors/error-handler';
import { errorLogger } from '@/lib/errors/error-logger';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string; number: string } }
) {
  try {
    // Regular API logic
    const { owner, repo, number } = params;
    
    // Rest of the function
    return NextResponse.json({ success: true, data: {} });
    
  } catch (error) {
    // Convert to application error
    const appError = error instanceof Error 
      ? createError(
          ErrorCode.DATA_GENERIC, 
          error.message, 
          error.stack
        )
      : createError(
          ErrorCode.SYSTEM_GENERIC, 
          String(error), 
          null
        );
    
    // Get the session to log user information
    const session = await getServerSession();
    
    // Log the error with context for support
    await errorLogger.logError(
      appError,
      {
        userId: session?.user?.id,
        repository: `${params.owner}/${params.repo}`,
        requestPath: request.url,
        requestMethod: request.method,
        requestParams: {
          query: Object.fromEntries(new URL(request.url).searchParams.entries()),
          // Don't include request body to avoid leaking sensitive information
        }
      }
    );
    
    // Return a user-friendly error to the client
    return NextResponse.json(
      {
        success: false,
        error: appError.message,
        suggestion: appError.suggestion,
        reference: `${appError.code}-${appError.id}`
      },
      { status: 500 }
    );
  }
}
```

## React Component Error Handling

```typescript
// In React component files
import React, { useState } from 'react';
import { createError, ErrorCode, getUserErrorMessage } from '@/lib/errors/error-handler';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logClientError } from '@/lib/errors/client-logger';

export function RepositorySelector() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleLoadRepositories = async () => {
    setIsLoading(true);
    
    try {
      // Regular component logic
      const response = await fetch('/api/repositories');
      
      if (!response.ok) {
        throw new Error(`Failed to load repositories: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Process data
      
    } catch (error) {
      // Convert to application error
      const appError = error instanceof Error 
        ? createError(
            ErrorCode.DATA_GENERIC, 
            error.message, 
            error.stack
          )
        : createError(
            ErrorCode.SYSTEM_GENERIC, 
            String(error), 
            null
          );
      
      // Log client-side error to server
      await logClientError(appError, {
        component: 'RepositorySelector',
        action: 'loadRepositories'
      });
      
      // Show user-friendly toast with reference ID
      toast({
        title: "Error Loading Repositories",
        description: getUserErrorMessage(appError),
        variant: "destructive"
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button onClick={handleLoadRepositories} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Load Repositories'}
    </Button>
  );
}
```

## Server Action Error Handling

```typescript
// In server action files
'use server';

import { createError, ErrorCode } from '@/lib/errors/error-handler';
import { errorLogger } from '@/lib/errors/error-logger';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function performAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; reference?: string }> {
  try {
    // Regular server action logic
    const data = Object.fromEntries(formData.entries());
    
    // Process data, perform operations, etc.
    
    return { success: true };
  } catch (error) {
    // Convert to application error
    const appError = error instanceof Error 
      ? createError(
          ErrorCode.SYSTEM_GENERIC, 
          error.message, 
          error.stack
        )
      : createError(
          ErrorCode.SYSTEM_GENERIC, 
          String(error), 
          null
        );
    
    // Log the error with context
    await errorLogger.logError(
      appError,
      {
        requestPath: 'serverAction/performAction',
        requestMethod: 'SERVER_ACTION',
        requestParams: {
          // Include safe parameters only
          action: 'performAction'
        }
      }
    );
    
    // Return error info to the client
    return { 
      success: false, 
      error: appError.message, 
      reference: `${appError.code}-${appError.id}`
    };
  }
}
```

## Database Operation Error Handling

```typescript
// In database operation files
import { createError, ErrorCode } from '@/lib/errors/error-handler';
import { errorLogger } from '@/lib/errors/error-logger';
import { createClient } from '@supabase/supabase-js';

export async function databaseOperation(data: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    // Regular database operation
    const { data: result, error } = await supabase
      .from('some_table')
      .insert(data)
      .select('id')
      .single();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return { success: true, id: result.id };
    
  } catch (error) {
    // Create application error
    const appError = error instanceof Error 
      ? createError(
          ErrorCode.SYSTEM_DATABASE_ERROR,
          error.message,
          error.stack
        )
      : createError(
          ErrorCode.SYSTEM_DATABASE_ERROR,
          String(error),
          null
        );
    
    // Log error with context
    await errorLogger.logError(
      appError,
      {
        requestPath: 'database/databaseOperation',
        requestMethod: 'DB_OPERATION',
        requestParams: {
          // Include safe parameters only, not full data
          dataKeys: Object.keys(data || {})
        }
      }
    );
    
    // Rethrow with user-friendly message and reference ID
    throw new Error(`Operation failed. Please try again or contact support with reference: ${appError.code}-${appError.id}`);
  }
}
```

## VCS Client Error Handling

```typescript
// In VCS client files
import { createError, ErrorCode } from '@/lib/errors/error-handler';
import { errorLogger } from '@/lib/errors/error-logger';

// Inside a VCS client method
async getPullRequest(owner: string, repo: string, number: number) {
  try {
    // Regular API call logic
    const response = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: number
    });
    
    // Process and return the data
    return processPullRequest(response.data);
    
  } catch (error) {
    // Determine appropriate error code based on the error
    let errorCode = ErrorCode.DATA_GENERIC;
    
    if (error.status === 404) {
      errorCode = ErrorCode.DATA_PR_NOT_FOUND;
    } else if (error.status === 403) {
      errorCode = ErrorCode.DATA_ACCESS_DENIED;
    } else if (error.status === 429) {
      errorCode = ErrorCode.DATA_API_RATE_LIMIT;
    }
    
    // Create application error
    const appError = createError(
      errorCode,
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : null
    );
    
    // Log error with context
    await errorLogger.logError(
      appError,
      {
        requestPath: `vcs/${this.platform}/getPullRequest`,
        requestMethod: 'API_CALL',
        requestParams: {
          owner,
          repo,
          number
        }
      }
    );
    
    // Throw with reference ID
    throw appError;
  }
}
```

## Middleware Error Handling

```typescript
// In middleware files
import { NextResponse } from 'next/server';
import { createError, ErrorCode } from '@/lib/errors/error-handler';
import { errorLogger } from '@/lib/errors/error-logger';

export function withErrorLogging(handler) {
  return async (req, res) => {
    try {
      // Call the original handler
      return await handler(req, res);
    } catch (error) {
      // Convert to application error
      const appError = error instanceof Error 
        ? createError(
            ErrorCode.SYSTEM_GENERIC, 
            error.message, 
            error.stack
          )
        : createError(
            ErrorCode.SYSTEM_GENERIC, 
            String(error), 
            null
          );
      
      // Log the error with context
      await errorLogger.logError(
        appError,
        {
          requestPath: req.url,
          requestMethod: req.method,
          requestParams: {
            query: req.query,
            // Don't include full body to avoid logging sensitive data
            bodyKeys: Object.keys(req.body || {})
          }
        }
      );
      
      // Return error response
      return NextResponse.json(
        {
          success: false,
          error: appError.message,
          suggestion: appError.suggestion,
          reference: `${appError.code}-${appError.id}`
        },
        { status: 500 }
      );
    }
  };
}
```

## Recommended Implementation Order

When implementing this error handling system, follow this order:

1. Start with API routes - they're server-side and impact all users
2. Move to database operations - ensure data integrity and error tracking
3. Update VCS clients - they're critical for core functionality
4. Implement React components - improve user experience
5. Add server actions - for complete coverage

Focus on high-traffic and error-prone areas first to get the most benefit from your implementation efforts.
