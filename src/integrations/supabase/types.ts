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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ad_pricing: {
        Row: {
          ad_type: string
          created_at: string
          description: string | null
          duration_days: number
          features: string[] | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          ad_type: string
          created_at?: string
          description?: string | null
          duration_days: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          ad_type?: string
          created_at?: string
          description?: string | null
          duration_days?: number
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      admin_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          name: string
          template_data: Json
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_data?: Json
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_data?: Json
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          ad_type: string
          advertiser_email: string
          advertiser_name: string
          advertiser_phone: string | null
          clicks_count: number | null
          created_at: string
          description: string | null
          duration_days: number
          end_date: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          link_url: string | null
          price: number
          start_date: string | null
          status: string
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          ad_type?: string
          advertiser_email: string
          advertiser_name: string
          advertiser_phone?: string | null
          clicks_count?: number | null
          created_at?: string
          description?: string | null
          duration_days?: number
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          link_url?: string | null
          price: number
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          ad_type?: string
          advertiser_email?: string
          advertiser_name?: string
          advertiser_phone?: string | null
          clicks_count?: number | null
          created_at?: string
          description?: string | null
          duration_days?: number
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          link_url?: string | null
          price?: number
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key_value: string
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          key_name: string
          key_type: string
          service_name: string
          updated_at: string
        }
        Insert: {
          api_key_value: string
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          key_name: string
          key_type?: string
          service_name: string
          updated_at?: string
        }
        Update: {
          api_key_value?: string
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          key_name?: string
          key_type?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          content: Json
          created_at: string
          id: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          name: string
          pages: Json
          published_url: string | null
          settings: Json
          template_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          name: string
          pages?: Json
          published_url?: string | null
          settings?: Json
          template_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          name?: string
          pages?: Json
          published_url?: string | null
          settings?: Json
          template_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          advanced_analytics: boolean
          advanced_automation: boolean
          api_access: boolean
          automation_limit: number | null
          created_at: string
          custom_domain: boolean
          display_order: number
          email_limit_per_month: number
          id: string
          is_active: boolean
          is_default: boolean
          landing_page_limit: number | null
          monthly_price: number
          name: string
          remove_branding: boolean
          subscriber_limit: number | null
          updated_at: string
          user_limit: number
        }
        Insert: {
          advanced_analytics?: boolean
          advanced_automation?: boolean
          api_access?: boolean
          automation_limit?: number | null
          created_at?: string
          custom_domain?: boolean
          display_order?: number
          email_limit_per_month?: number
          id?: string
          is_active?: boolean
          is_default?: boolean
          landing_page_limit?: number | null
          monthly_price?: number
          name: string
          remove_branding?: boolean
          subscriber_limit?: number | null
          updated_at?: string
          user_limit?: number
        }
        Update: {
          advanced_analytics?: boolean
          advanced_automation?: boolean
          api_access?: boolean
          automation_limit?: number | null
          created_at?: string
          custom_domain?: boolean
          display_order?: number
          email_limit_per_month?: number
          id?: string
          is_active?: boolean
          is_default?: boolean
          landing_page_limit?: number | null
          monthly_price?: number
          name?: string
          remove_branding?: boolean
          subscriber_limit?: number | null
          updated_at?: string
          user_limit?: number
        }
        Relationships: []
      }
      template_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          template_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          template_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          template_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      uploaded_templates: {
        Row: {
          assets: Json | null
          category: string
          created_at: string | null
          created_by: string | null
          css_content: string | null
          description: string | null
          html_content: string
          id: string
          is_active: boolean | null
          js_content: string | null
          name: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          assets?: Json | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          css_content?: string | null
          description?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          js_content?: string | null
          name: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          assets?: Json | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          css_content?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          js_content?: string | null
          name?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          automations_count: number
          billing_period_start: string
          created_at: string
          emails_sent: number
          id: string
          landing_pages_count: number
          subscribers_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          automations_count?: number
          billing_period_start?: string
          created_at?: string
          emails_sent?: number
          id?: string
          landing_pages_count?: number
          subscribers_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          automations_count?: number
          billing_period_start?: string
          created_at?: string
          emails_sent?: number
          id?: string
          landing_pages_count?: number
          subscribers_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_cycle_start: string
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          trial_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle_start?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle_start?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          trial_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_usage_limit: {
        Args: { p_action: string; p_user_id: string }
        Returns: Json
      }
      decrypt_api_key: {
        Args: { encrypted_text: string; secret_key?: string }
        Returns: string
      }
      encrypt_api_key: {
        Args: { plain_text: string; secret_key?: string }
        Returns: string
      }
      get_or_create_current_usage: {
        Args: { p_user_id: string }
        Returns: {
          automations_count: number
          billing_period_start: string
          created_at: string
          emails_sent: number
          id: string
          landing_pages_count: number
          subscribers_count: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "usage_tracking"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_usage: {
        Args: { p_amount?: number; p_field: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
