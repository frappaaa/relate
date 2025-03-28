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
          encounter_type: Database["public"]["Enums"]["encounter_type"]
          id: string
          notes: string | null
          partner_name: string | null
          protection_used: boolean
          risk_level: Database["public"]["Enums"]["risk_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          encounter_type: Database["public"]["Enums"]["encounter_type"]
          id?: string
          notes?: string | null
          partner_name?: string | null
          protection_used?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          encounter_type?: Database["public"]["Enums"]["encounter_type"]
          id?: string
          notes?: string | null
          partner_name?: string | null
          protection_used?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
