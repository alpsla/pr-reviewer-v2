export interface BaseProviderUser {
  id: string;
  email?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  provider_token?: string;
}

export interface BaseProviderScope {
  name: string;
  description: string;
}

export interface BaseProviderConfig {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUrl: string;
}