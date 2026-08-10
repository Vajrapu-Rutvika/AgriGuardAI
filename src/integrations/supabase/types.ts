export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      field_events: {
        Row: {
          action_window: Json | null
          actions_taken: Json | null
          confidence: number | null
          created_at: string
          diagnosis: string | null
          event_type: string
          field_id: string
          follow_up: Json | null
          id: string
          image_url: string | null
          metadata: Json | null
          occurred_at: string
          recommendations: Json | null
          recovery_status: string | null
          risks: Json | null
          severity: string | null
          summary: string | null
          title: string | null
          updated_at: string
          user_id: string
          weather: Json | null
        }
        Insert: {
          action_window?: Json | null
          actions_taken?: Json | null
          confidence?: number | null
          created_at?: string
          diagnosis?: string | null
          event_type: string
          field_id: string
          follow_up?: Json | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          occurred_at?: string
          recommendations?: Json | null
          recovery_status?: string | null
          risks?: Json | null
          severity?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          weather?: Json | null
        }
        Update: {
          action_window?: Json | null
          actions_taken?: Json | null
          confidence?: number | null
          created_at?: string
          diagnosis?: string | null
          event_type?: string
          field_id?: string
          follow_up?: Json | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          occurred_at?: string
          recommendations?: Json | null
          recovery_status?: string | null
          risks?: Json | null
          severity?: string | null
          summary?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          weather?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "field_events_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          created_at: string
          crop: string | null
          crop_variety: string | null
          growth_stage: string | null
          health_status: string | null
          id: string
          is_active: boolean
          known_problem: string | null
          latitude: number | null
          location_text: string | null
          longitude: number | null
          name: string
          notes: string | null
          size: number | null
          size_unit: string
          sowing_date: string | null
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          created_at?: string
          crop?: string | null
          crop_variety?: string | null
          growth_stage?: string | null
          health_status?: string | null
          id?: string
          is_active?: boolean
          known_problem?: string | null
          latitude?: number | null
          location_text?: string | null
          longitude?: number | null
          name: string
          notes?: string | null
          size?: number | null
          size_unit?: string
          sowing_date?: string | null
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          created_at?: string
          crop?: string | null
          crop_variety?: string | null
          growth_stage?: string | null
          health_status?: string | null
          id?: string
          is_active?: boolean
          known_problem?: string | null
          latitude?: number | null
          location_text?: string | null
          longitude?: number | null
          name?: string
          notes?: string | null
          size?: number | null
          size_unit?: string
          sowing_date?: string | null
          updated_at?: string
          user_id?: string
          village?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          notifications_enabled: boolean
          preferred_language: string
          updated_at: string
          voice_enabled: boolean
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          notifications_enabled?: boolean
          preferred_language?: string
          updated_at?: string
          voice_enabled?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notifications_enabled?: boolean
          preferred_language?: string
          updated_at?: string
          voice_enabled?: boolean
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
