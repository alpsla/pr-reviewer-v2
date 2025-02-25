import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export function getSupabaseServerClient() {
  return createClient();
}

export function createClient() {
  try {
    const cookieStore = cookies();
    
    return createServerComponentClient<Database>(
      { cookies: () => cookieStore },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      }
    );
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Return a minimal client that won't cause runtime errors
    // This allows the app to render with a fallback UI instead of crashing
    throw new Error('Failed to initialize Supabase client');
  }
}

// Helper function to get user from supabase session
export async function getUser() {
  const supabase = createClient();
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Helper function to get authenticated session
export async function getSession() {
  const supabase = createClient();
  
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}
