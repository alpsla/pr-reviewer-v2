export interface EnvironmentConfig {
  appUrl: string;
  apiUrl: string;
  supabaseUrl: string;
  authCallbackUrl: string;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  // Required environment variables
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const authCallbackUrl = process.env.AUTH_CALLBACK_URL;

  // Validate required variables
  if (!appUrl) throw new Error('NEXT_PUBLIC_APP_URL is required');
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is required');
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  if (!authCallbackUrl) throw new Error('AUTH_CALLBACK_URL is required');

  return {
    appUrl,
    apiUrl,
    supabaseUrl,
    authCallbackUrl
  };
}

export function getAuthRedirectUrl(): string {
  const config = getEnvironmentConfig();
  return config.authCallbackUrl;
}

export function getSupabaseUrl(): string {
  const config = getEnvironmentConfig();
  return config.supabaseUrl;
}

// This is what needs to be configured in Supabase dashboard
export function getSupabaseCallbackUrl(): string {
  const config = getEnvironmentConfig();
  return `${config.supabaseUrl}/auth/v1/callback`;
}