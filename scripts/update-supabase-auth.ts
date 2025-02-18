import { createClient } from '@supabase/supabase-js';

async function updateSupabaseAuthSettings() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { error } = await supabase
    .from('auth.providers')
    .update({
      redirect_url: process.env.NODE_ENV === 'production'
        ? `${supabaseUrl}/auth/v1/callback`
        : 'http://localhost:3000/auth/callback'
    })
    .eq('provider', 'gitlab');

  if (error) {
    throw error;
  }

  console.log('Successfully updated Supabase auth settings');
}

// Run this script during deployment
if (require.main === module) {
  updateSupabaseAuthSettings()
    .catch(console.error);
}

export { updateSupabaseAuthSettings };