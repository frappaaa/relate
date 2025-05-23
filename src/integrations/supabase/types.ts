export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      encounters: {
        Row: {
          created_at: string
          date: string
          encounter_name: string | null
          encounter_type: string
          id: string
          notes: string | null
          protection_used: boolean
          risk_level: Database["public"]["Enums"]["risk_level"]
          symptoms: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          encounter_name?: string | null
          encounter_type: string
          id?: string
          notes?: string | null
          protection_used?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
          symptoms?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          encounter_name?: string | null
          encounter_type?: string
          id?: string
          notes?: string | null
          protection_used?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
          symptoms?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          pronouns: string | null
          sexual_orientation: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          pronouns?: string | null
          sexual_orientation?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          pronouns?: string | null
          sexual_orientation?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      test_locations: {
        Row: {
          address: string
          category: string | null
          contacts: string | null
          coordinates: number[] | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          images: string[] | null
          last_verified_date: string | null
          name: string
          opening_hours: Json | null
          region: string | null
          services: string[] | null
          social: Json | null
          source: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          category?: string | null
          contacts?: string | null
          coordinates?: number[] | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          last_verified_date?: string | null
          name: string
          opening_hours?: Json | null
          region?: string | null
          services?: string[] | null
          social?: Json | null
          source?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          category?: string | null
          contacts?: string | null
          coordinates?: number[] | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          last_verified_date?: string | null
          name?: string
          opening_hours?: Json | null
          region?: string | null
          services?: string[] | null
          social?: Json | null
          source?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      tests: {
        Row: {
          created_at: string
          date: string
          id: string
          location: string | null
          notes: string | null
          result: Database["public"]["Enums"]["test_result"] | null
          specific_results: Json | null
          status: Database["public"]["Enums"]["test_status"]
          test_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          location?: string | null
          notes?: string | null
          result?: Database["public"]["Enums"]["test_result"] | null
          specific_results?: Json | null
          status?: Database["public"]["Enums"]["test_status"]
          test_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          notes?: string | null
          result?: Database["public"]["Enums"]["test_result"] | null
          specific_results?: Json | null
          status?: Database["public"]["Enums"]["test_status"]
          test_type?: string
          updated_at?: string
          user_id?: string
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
      encounter_type: "oral" | "vaginal" | "anal" | "other"
      risk_level: "low" | "medium" | "high"
      test_result: "negative" | "positive" | "pending"
      test_status: "scheduled" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      encounter_type: ["oral", "vaginal", "anal", "other"],
      risk_level: ["low", "medium", "high"],
      test_result: ["negative", "positive", "pending"],
      test_status: ["scheduled", "completed", "cancelled"],
    },
  },
} as const
