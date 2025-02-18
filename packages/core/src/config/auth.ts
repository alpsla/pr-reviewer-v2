interface EnvironmentConfig {
  development: {
    callbackUrl: string;
    supabaseUrl: string;
  };
  production: {
    callbackUrl: string;
    supabaseUrl: string;
  };
}

const ENV_CONFIG: EnvironmentConfig = {
  development: {
    callbackUrl: 'http://localhost:3000/auth/callback',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  },
  production: {
    callbackUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  },
};

export const getAuthConfig = () => {
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  return ENV_CONFIG[env];
};

export const getCallbackUrl = () => {
  return getAuthConfig().callbackUrl;
};

export const getSupabaseUrl = () => {
  return getAuthConfig().supabaseUrl;
};