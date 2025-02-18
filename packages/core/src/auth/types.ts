import type { Session, User } from "@supabase/supabase-js";

export type AuthProvider = "github" | "gitlab" | "google" | "microsoft" | "email";

export interface AuthUrlConfig {
  redirectUrl: string;
}

export interface AuthUser extends User {
  provider?: AuthProvider;
  providerUserId?: string;
  name?: string;
  avatarUrl?: string;
  providerScopes?: string[];
  providerToken?: string;
  auth_provider: AuthProvider;
  status: "active" | "inactive";
}

export interface AuthSession extends Session {
  provider?: AuthProvider;
}

export type GitLabAuthScopes =
  | "api"
  | "read_api"
  | "read_user"
  | "read_repository"
  | "write_repository"
  | "profile"
  | "email"
  | "openid";

export type GitHubAuthScopes = "repo" | "read:user" | "user:email" | "workflow";

export type MicrosoftAuthScopes =
  | "openid"
  | "email"
  | "profile"
  | "offline_access"
  | "User.Read";

export type GoogleAuthScopes =
  | "openid"
  | "email"
  | "profile"
  | "https://www.googleapis.com/auth/userinfo.profile"
  | "https://www.googleapis.com/auth/userinfo.email";

export interface DefaultScopes {
  github?: GitHubAuthScopes[];
  gitlab?: GitLabAuthScopes[];
  microsoft?: MicrosoftAuthScopes[];
  google?: GoogleAuthScopes[];
}

export interface AuthProviderConfig {
  provider: AuthProvider;
  defaultScopes?: DefaultScopes;
  urlConfig?: AuthUrlConfig;
}

export interface AuthOptions {
  redirectTo?: string;
  refreshToken?: boolean;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
}

// Define possible shapes of OAuth response
export type OAuthResponseWithUrl = {
  url: string;
  provider?: string;
  session?: undefined;
  user?: undefined;
};

export type OAuthResponseWithSession = {
  session: Session;
  user: User;
  url?: undefined;
  provider?: string;
};

export type OAuthResponse = {
  data: OAuthResponseWithUrl | OAuthResponseWithSession | null;
  error: Error | null;
};