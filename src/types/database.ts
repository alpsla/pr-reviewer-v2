export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Analysis {
  id: string;
  title: string;
  description: string;
  result: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          github_id?: string;
          auth_provider: string;
          created_at: string;
          updated_at: string;
          last_sign_in?: string;
          status: 'active' | 'inactive';
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };
      repositories: {
        Row: {
          id: string;
          owner: string;
          name: string;
          full_name: string;
          description?: string;
          private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['repositories']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['repositories']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };
      pull_requests: {
        Row: {
          id: string;
          repository_id: string;
          number: number;
          title: string;
          description?: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pull_requests']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['pull_requests']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };
      analysis_queue: {
        Row: {
          id: string;
          pull_request_id: string;
          status: AnalysisStatus;
          result?: Record<string, unknown>;
          error?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['analysis_queue']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['analysis_queue']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: Record<string, {
      Row: Record<string, unknown>;
    }>;
    Functions: Record<string, {
      Args: Record<string, unknown>;
      Returns: unknown;
    }>;
    Enums: {
      analysis_status: AnalysisStatus;
    };
  };
}