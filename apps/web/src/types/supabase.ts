export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      repositories: {
        Row: {
          created_at: string
          default_branch: string | null
          description: string | null
          github_id: string | null
          gitlab_id: string | null
          id: string
          is_private: boolean
          last_analyzed_at: string | null
          last_synced_at: string | null
          metadata: Json | null
          name: string
          owner: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          default_branch?: string | null
          description?: string | null
          github_id?: string | null
          gitlab_id?: string | null
          id?: string
          is_private?: boolean
          last_analyzed_at?: string | null
          last_synced_at?: string | null
          metadata?: Json | null
          name: string
          owner: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          default_branch?: string | null
          description?: string | null
          github_id?: string | null
          gitlab_id?: string | null
          id?: string
          is_private?: boolean
          last_analyzed_at?: string | null
          last_synced_at?: string | null
          metadata?: Json | null
          name?: string
          owner?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pull_requests: {
        Row: {
          author: string | null
          base_branch: string | null
          created_at: string
          description: string | null
          head_branch: string | null
          id: string
          metadata: Json | null
          number: number
          repository_id: string
          state: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          base_branch?: string | null
          created_at?: string
          description?: string | null
          head_branch?: string | null
          id?: string
          metadata?: Json | null
          number: number
          repository_id: string
          state: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          base_branch?: string | null
          created_at?: string
          description?: string | null
          head_branch?: string | null
          id?: string
          metadata?: Json | null
          number?: number
          repository_id?: string
          state?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pull_requests_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          github_id: string | null
          github_token: string | null
          github_username: string | null
          gitlab_id: string | null
          gitlab_token: string | null
          gitlab_username: string | null
          id: string
          last_login: string | null
          metadata: Json | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          github_id?: string | null
          github_token?: string | null
          github_username?: string | null
          gitlab_id?: string | null
          gitlab_token?: string | null
          gitlab_username?: string | null
          id?: string
          last_login?: string | null
          metadata?: Json | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          github_id?: string | null
          github_token?: string | null
          github_username?: string | null
          gitlab_id?: string | null
          gitlab_token?: string | null
          gitlab_username?: string | null
          id?: string
          last_login?: string | null
          metadata?: Json | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
