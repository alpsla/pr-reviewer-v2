import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface DBUser extends SupabaseUser {
  github_id: string;
  name: string;
  avatar_url: string;
}

export interface DBRepository {
  id: string;
  owner: string;
  name: string;
  full_name: string;
  description: string;
}

export interface DBPullRequest {
  id: string;
  number: number;
  title: string;
  repository_id: string;
  status: string;
  author: string;
}

export interface DBAnalysisJob {
  id: string;
  status: AnalysisStatus;
  pull_request_id: string;
  created_at: string;
}

export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: DBUser;
        Insert: Omit<DBUser, keyof SupabaseUser> & { id?: string };
        Update: Partial<Omit<DBUser, keyof SupabaseUser>>;
      };
      repositories: {
        Row: DBRepository;
        Insert: DBRepository;
        Update: Partial<DBRepository>;
      };
      pull_requests: {
        Row: DBPullRequest;
        Insert: DBPullRequest;
        Update: Partial<DBPullRequest>;
      };
      analysis_queue: {
        Row: DBAnalysisJob;
        Insert: Omit<DBAnalysisJob, "id">;
        Update: Partial<DBAnalysisJob>;
      };
    };
    Enums: {
      analysis_status: AnalysisStatus;
    };
    Functions: Record<string, never>;
    Views: Record<string, never>;
  };
}

export type DatabaseSchema = Database["public"];

export interface MockData {
  users: DBUser;
  repositories: DBRepository;
  pull_requests: DBPullRequest;
  analysis_queue: DBAnalysisJob;
}
