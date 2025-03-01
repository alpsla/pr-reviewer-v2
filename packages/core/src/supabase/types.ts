export interface Database {
  public: {
    Tables: {
      repositories: {
        Row: {
          id: string;
          github_id?: string | null;
          gitlab_id?: string | null;
          owner: string;
          name: string;
          description?: string | null;
          is_private: boolean;
          default_branch: string;
          url: string;
          language?: string | null;
          topics?: string[];
          created_at: string;
          updated_at: string;
          last_analyzed_at?: string;
          metadata?: Record<string, any>;
        };
        Insert: {
          id?: string;
          github_id?: string | null;
          gitlab_id?: string | null;
          owner: string;
          name: string;
          description?: string | null;
          is_private?: boolean;
          default_branch?: string;
          url?: string;
          language?: string | null;
          topics?: string[];
          created_at?: string;
          updated_at?: string;
          last_analyzed_at?: string;
          metadata?: Record<string, any>;
        };
        Update: {
          id?: string;
          github_id?: string | null;
          gitlab_id?: string | null;
          owner?: string;
          name?: string;
          description?: string | null;
          is_private?: boolean;
          default_branch?: string;
          url?: string;
          language?: string | null;
          topics?: string[];
          created_at?: string;
          updated_at?: string;
          last_analyzed_at?: string;
          metadata?: Record<string, any>;
        };
      };
      users: {
        Row: {
          id: string;
          github_id?: string | null;
          gitlab_id?: string | null;
          name: string;
          email?: string | null;
          avatar_url?: string | null;
          created_at: string;
          updated_at: string;
          last_login_at: string;
          metadata?: Record<string, any>;
          auth_provider?: string;
          status?: string;
        };
        Insert: {
          id?: string;
          github_id?: string | null;
          gitlab_id?: string | null;
          name: string;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string;
          metadata?: Record<string, any>;
          auth_provider?: string;
          status?: string;
        };
        Update: {
          id?: string;
          github_id?: string | null;
          gitlab_id?: string | null;
          name?: string;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string;
          metadata?: Record<string, any>;
          auth_provider?: string;
          status?: string;
        };
      };
      pull_requests: {
        Row: {
          id: string;
          repository_id: string;
          number: number;
          title: string;
          body?: string | null;
          state: string;
          author_id?: string | null;
          base_ref: string;
          base_sha: string;
          head_ref: string;
          head_sha: string;
          is_draft: boolean;
          url: string;
          created_at: string;
          updated_at: string;
          closed_at?: string | null;
          merged_at?: string | null;
          metadata?: Record<string, any>;
        };
        Insert: {
          id?: string;
          repository_id: string;
          number: number;
          title: string;
          body?: string | null;
          state: string;
          author_id?: string | null;
          base_ref: string;
          base_sha: string;
          head_ref: string;
          head_sha: string;
          is_draft?: boolean;
          url: string;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          merged_at?: string | null;
          metadata?: Record<string, any>;
        };
        Update: {
          id?: string;
          repository_id?: string;
          number?: number;
          title?: string;
          body?: string | null;
          state?: string;
          author_id?: string | null;
          base_ref?: string;
          base_sha?: string;
          head_ref?: string;
          head_sha?: string;
          is_draft?: boolean;
          url?: string;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          merged_at?: string | null;
          metadata?: Record<string, any>;
        };
      };
      analysis_queue: {
        Row: {
          id: string;
          pull_request_id: string;
          status: Database["public"]["Enums"]["analysis_status"];
          priority: number;
          attempts: number;
          last_attempt_at?: string | null;
          error?: string | null;
          created_at: string;
          updated_at: string;
          metadata?: Record<string, any>;
        };
        Insert: {
          id?: string;
          pull_request_id: string;
          status?: Database["public"]["Enums"]["analysis_status"];
          priority?: number;
          attempts?: number;
          last_attempt_at?: string | null;
          error?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, any>;
        };
        Update: {
          id?: string;
          pull_request_id?: string;
          status?: Database["public"]["Enums"]["analysis_status"];
          priority?: number;
          attempts?: number;
          last_attempt_at?: string | null;
          error?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, any>;
        };
      };
    };
    Enums: {
      analysis_status: "pending" | "in_progress" | "completed" | "failed";
    };
  };
}