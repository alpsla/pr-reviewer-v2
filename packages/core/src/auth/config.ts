import { getAuthRedirectUrl } from '../config/urls';

export interface AuthUrlConfig {
  redirectUrl: string;
}

export function getAuthCallbackUrl(config: AuthUrlConfig): string {
  return config.redirectUrl;
}

export function getDefaultAuthConfig(): AuthUrlConfig {
  return {
    redirectUrl: getAuthRedirectUrl()
  };
}