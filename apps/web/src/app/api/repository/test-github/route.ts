import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Ensure this route is always dynamic and not statically generated
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Setup Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the authenticated user's tokens
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - No session found' },
        { status: 401 }
      );
    }

    // Get provider token
    const githubToken = session.provider_token;
    
    if (!githubToken) {
      return NextResponse.json(
        { error: 'No GitHub token found in session' },
        { status: 400 }
      );
    }

    // Test direct GitHub API connection using fetch
    console.log('Testing GitHub API connection with token...');
    
    const url = new URL(request.url);
    const owner = url.searchParams.get('owner') || 'alpsla';
    const repo = url.searchParams.get('repo') || 'pr-reviewer-v2';
    
    try {
      // First get user info
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!userResponse.ok) {
        throw new Error(`GitHub API error: ${userResponse.status} ${userResponse.statusText}`);
      }
      
      const userData = await userResponse.json();
      
      // Now get repo info
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!repoResponse.ok) {
        return NextResponse.json({
          success: true,
          github: {
            user: {
              login: userData.login,
              id: userData.id,
              name: userData.name
            },
            repository: {
              error: `GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`
            }
          }
        });
      }
      
      const repoData = await repoResponse.json();
      
      return NextResponse.json({
        success: true,
        github: {
          user: {
            login: userData.login,
            id: userData.id,
            name: userData.name
          },
          repository: {
            id: repoData.id,
            name: repoData.name,
            full_name: repoData.full_name,
            private: repoData.private,
            owner: {
              login: repoData.owner.login
            }
          }
        }
      });
    } catch (apiError) {
      console.error('GitHub API error:', apiError);
      return NextResponse.json(
        { 
          error: 'GitHub API error',
          message: apiError instanceof Error ? apiError.message : String(apiError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing GitHub API:', error);
    return NextResponse.json(
      { 
        error: 'Error testing GitHub API',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}