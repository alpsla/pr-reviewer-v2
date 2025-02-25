import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This endpoint checks if an email is already registered
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if the user exists by sending a password reset
    // This is a workaround since Supabase doesn't have a direct "checkUserExists" API
    const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/auth/callback`,
    });
    
    // If there's no error, the user exists
    // If there's an error about the user not being found, they don't exist
    const userExists = !error || !error.message.includes('user not found');
    
    return NextResponse.json({ 
      exists: userExists,
      message: userExists ? 'User exists' : 'User not found' 
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Failed to check user status' },
      { status: 500 }
    );
  }
}