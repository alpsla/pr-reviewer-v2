import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    // Sign out on the server
    await supabase.auth.signOut();
    
    // Clear auth cookies by setting them to expired
    cookies().getAll().forEach((cookie) => {
      if (cookie.name.includes('supabase') || 
          cookie.name.includes('auth') || 
          cookie.name.includes('token')) {
        cookies().set({
          name: cookie.name,
          value: '',
          expires: new Date(0),
          path: '/',
        });
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during server-side sign out:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}