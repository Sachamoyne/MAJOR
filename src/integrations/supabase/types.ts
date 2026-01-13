export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role_primary: string | null;
          age: number | null;
          city: string | null;
          education: string | null;
          target_role: string | null;
          ambition_level: string | null;
          commitment_hours: string | null;
          has_project: boolean | null;
          project_description: string | null;
          onboarding_completed: boolean | null;
          user_id: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role_primary?: string | null;
          age?: number | null;
          city?: string | null;
          education?: string | null;
          target_role?: string | null;
          ambition_level?: string | null;
          commitment_hours?: string | null;
          has_project?: boolean | null;
          project_description?: string | null;
          onboarding_completed?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role_primary?: string | null;
          age?: number | null;
          city?: string | null;
          education?: string | null;
          target_role?: string | null;
          ambition_level?: string | null;
          commitment_hours?: string | null;
          has_project?: boolean | null;
          project_description?: string | null;
          onboarding_completed?: boolean | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
        };
        Relationships: [];
      };
      user_skills: {
        Row: {
          user_id: string;
          skill_id: string;
        };
        Insert: {
          user_id: string;
          skill_id: string;
        };
        Update: {
          user_id?: string;
          skill_id?: string;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          liked_user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          liked_user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          liked_user_id?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          created_at: string;
          user_1_id: string;
          user_2_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_1_id: string;
          user_2_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_1_id?: string;
          user_2_id?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          sender_id: string;
          receiver_id: string;
          content: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      recommended_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role_primary: string | null;
          avatar_url: string | null;
          city: string | null;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "Tech" | "Business" | "Design" | "Marketing" | "Product" | "Operations" | "Other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = Database["public"];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][PublicEnumNameOrOptions]
    : never;
