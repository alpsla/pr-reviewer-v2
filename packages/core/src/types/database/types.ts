export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AnalysisStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          created_at: string
          updated_at: string
          auth_provider: string
          status: string
          github_id: string | null
          gitlab_id: string | null
          google_id: string | null
          azure_id: string | null
          github_login: string | null
          gitlab_username: string | null
          google_email: string | null
          azure_email: string | null
          name: string | null
          avatar_url: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string
          updated_at?: string
          auth_provider: string
          status?: string
          github_id?: string | null
          gitlab_id?: string | null
          google_id?: string | null
          azure_id?: string | null
          github_login?: string | null
          gitlab_username?: string | null
          google_email?: string | null
          azure_email?: string | null
          name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string
          updated_at?: string
          auth_provider?: string
          status?: string
          github_id?: string | null
          gitlab_id?: string | null
          google_id?: string | null
          azure_id?: string | null
          github_login?: string | null
          gitlab_username?: string | null
          google_email?: string | null
          azure_email?: string | null
          name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
      }
      repositories: {
        Row: {
          id: string
          github_id: string | null
          owner: string
          name: string
          description: string | null
          is_private: boolean
          default_branch: string
          created_at: string
          updated_at: string
          last_analyzed_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          github_id?: string | null
          owner: string
          name: string
          description?: string | null
          is_private?: boolean
          default_branch?: string
          created_at?: string
          updated_at?: string
          last_analyzed_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          github_id?: string | null
          owner?: string
          name?: string
          description?: string | null
          is_private?: boolean
          default_branch?: string
          created_at?: string
          updated_at?: string
          last_analyzed_at?: string | null
          metadata?: Json | null
        }
      }
      pull_requests: {
        Row: {
          id: string
          repository_id: string
          number: number
          title: string
          description: string | null
          state: string
          author: string
          base_branch: string
          head_branch: string
          merge_commit_sha: string | null
          created_at: string
          updated_at: string
          last_analyzed_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          repository_id: string
          number: number
          title: string
          description?: string | null
          state: string
          author: string
          base_branch: string
          head_branch: string
          merge_commit_sha?: string | null
          created_at?: string
          updated_at?: string
          last_analyzed_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          repository_id?: string
          number?: number
          title?: string
          description?: string | null
          state?: string
          author?: string
          base_branch?: string
          head_branch?: string
          merge_commit_sha?: string | null
          created_at?: string
          updated_at?: string
          last_analyzed_at?: string | null
          metadata?: Json | null
        }
      }
      analysis_queue: {
        Row: {
          id: string
          repository_id: string
          pull_request_id: string
          status: AnalysisStatus
          priority: number
          started_at: string | null
          completed_at: string | null
          error: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          repository_id: string
          pull_request_id: string
          status?: AnalysisStatus
          priority?: number
          started_at?: string | null
          completed_at?: string | null
          error?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          repository_id?: string
          pull_request_id?: string
          status?: AnalysisStatus
          priority?: number
          started_at?: string | null
          completed_at?: string | null
          error?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      analysis_status: AnalysisStatus
    }
  }
}