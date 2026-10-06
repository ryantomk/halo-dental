
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "appointments": {
                  Row: {
                    "admin_notes": string | null,"appointment_date": string,"appointment_time": string,"clinic_id": string | null,"created_at": string,"doctor_id": string | null,"duration_minutes": number,"id": string,"patient_id": string,"patient_notes": string | null,"reference_code": string,"service_id": string,"source": string,"status": string,"updated_at": string
                  }
                  Insert: {
                    "admin_notes"?: string | null,"appointment_date": string,"appointment_time": string,"clinic_id"?: string | null,"created_at"?: string,"doctor_id"?: string | null,"duration_minutes"?: number,"id"?: string,"patient_id": string,"patient_notes"?: string | null,"reference_code": string,"service_id": string,"source"?: string,"status"?: string,"updated_at"?: string
                  }
                  Update: {
                    "admin_notes"?: string | null,"appointment_date"?: string,"appointment_time"?: string,"clinic_id"?: string | null,"created_at"?: string,"doctor_id"?: string | null,"duration_minutes"?: number,"id"?: string,"patient_id"?: string,"patient_notes"?: string | null,"reference_code"?: string,"service_id"?: string,"source"?: string,"status"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "appointments_clinic_id_fkey"
      columns: ["clinic_id"]
isOneToOne: false
      referencedRelation: "clinics"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "appointments_doctor_id_fkey"
      columns: ["doctor_id"]
isOneToOne: false
      referencedRelation: "doctors"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "appointments_patient_id_fkey"
      columns: ["patient_id"]
isOneToOne: false
      referencedRelation: "patients"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "appointments_service_id_fkey"
      columns: ["service_id"]
isOneToOne: false
      referencedRelation: "services"
      referencedColumns: ["id"]
    }
                  ]
                },"audit_logs": {
                  Row: {
                    "action": string,"created_at": string,"details": NonNullable<Json>,"entity_id": string | null,"entity_type": string,"id": string,"ip_address": string | null,"staff_user_id": string | null
                  }
                  Insert: {
                    "action": string,"created_at"?: string,"details"?: NonNullable<Json>,"entity_id"?: string | null,"entity_type": string,"id"?: string,"ip_address"?: string | null,"staff_user_id"?: string | null
                  }
                  Update: {
                    "action"?: string,"created_at"?: string,"details"?: NonNullable<Json>,"entity_id"?: string | null,"entity_type"?: string,"id"?: string,"ip_address"?: string | null,"staff_user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_logs_staff_user_id_fkey"
      columns: ["staff_user_id"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    }
                  ]
                },"blog_posts": {
                  Row: {
                    "author_id": string | null,"category": string,"content_en": string,"content_ml": string | null,"cover_image_url": string | null,"created_at": string,"excerpt_en": string | null,"excerpt_ml": string | null,"id": string,"published_at": string | null,"slug": string,"status": string,"title_en": string,"title_ml": string | null,"updated_at": string
                  }
                  Insert: {
                    "author_id"?: string | null,"category"?: string,"content_en": string,"content_ml"?: string | null,"cover_image_url"?: string | null,"created_at"?: string,"excerpt_en"?: string | null,"excerpt_ml"?: string | null,"id"?: string,"published_at"?: string | null,"slug": string,"status"?: string,"title_en": string,"title_ml"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "author_id"?: string | null,"category"?: string,"content_en"?: string,"content_ml"?: string | null,"cover_image_url"?: string | null,"created_at"?: string,"excerpt_en"?: string | null,"excerpt_ml"?: string | null,"id"?: string,"published_at"?: string | null,"slug"?: string,"status"?: string,"title_en"?: string,"title_ml"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "blog_posts_author_id_fkey"
      columns: ["author_id"]
isOneToOne: false
      referencedRelation: "doctors"
      referencedColumns: ["id"]
    }
                  ]
                },"clinics": {
                  Row: {
                    "address_line1": string,"address_line2": string | null,"city": string,"country": string,"created_at": string,"email": string,"google_maps_url": string | null,"id": string,"is_active": boolean,"name": string,"opening_hours": NonNullable<Json>,"phone": string,"postal_code": string,"slug": string,"state": string,"updated_at": string,"whatsapp": string
                  }
                  Insert: {
                    "address_line1": string,"address_line2"?: string | null,"city"?: string,"country"?: string,"created_at"?: string,"email": string,"google_maps_url"?: string | null,"id"?: string,"is_active"?: boolean,"name": string,"opening_hours"?: NonNullable<Json>,"phone": string,"postal_code": string,"slug": string,"state"?: string,"updated_at"?: string,"whatsapp": string
                  }
                  Update: {
                    "address_line1"?: string,"address_line2"?: string | null,"city"?: string,"country"?: string,"created_at"?: string,"email"?: string,"google_maps_url"?: string | null,"id"?: string,"is_active"?: boolean,"name"?: string,"opening_hours"?: NonNullable<Json>,"phone"?: string,"postal_code"?: string,"slug"?: string,"state"?: string,"updated_at"?: string,"whatsapp"?: string
                  }
                  Relationships: [
                    
                  ]
                },"doctors": {
                  Row: {
                    "bio_en": string | null,"bio_ml": string | null,"clinic_id": string | null,"created_at": string,"display_order": number,"experience_years": number,"id": string,"is_active": boolean,"name": string,"photo_url": string | null,"qualifications": string,"slug": string,"specialization": string,"title": string,"updated_at": string,"working_days": (number)[]
                  }
                  Insert: {
                    "bio_en"?: string | null,"bio_ml"?: string | null,"clinic_id"?: string | null,"created_at"?: string,"display_order"?: number,"experience_years"?: number,"id"?: string,"is_active"?: boolean,"name": string,"photo_url"?: string | null,"qualifications": string,"slug": string,"specialization": string,"title"?: string,"updated_at"?: string,"working_days"?: (number)[]
                  }
                  Update: {
                    "bio_en"?: string | null,"bio_ml"?: string | null,"clinic_id"?: string | null,"created_at"?: string,"display_order"?: number,"experience_years"?: number,"id"?: string,"is_active"?: boolean,"name"?: string,"photo_url"?: string | null,"qualifications"?: string,"slug"?: string,"specialization"?: string,"title"?: string,"updated_at"?: string,"working_days"?: (number)[]
                  }
                  Relationships: [
                    {
      foreignKeyName: "doctors_clinic_id_fkey"
      columns: ["clinic_id"]
isOneToOne: false
      referencedRelation: "clinics"
      referencedColumns: ["id"]
    }
                  ]
                },"gallery_items": {
                  Row: {
                    "after_image_url": string,"before_image_url": string,"created_at": string,"description_en": string | null,"description_ml": string | null,"display_order": number,"id": string,"is_published": boolean,"service_id": string | null,"title_en": string,"title_ml": string | null,"treatment_duration": string | null,"updated_at": string
                  }
                  Insert: {
                    "after_image_url": string,"before_image_url": string,"created_at"?: string,"description_en"?: string | null,"description_ml"?: string | null,"display_order"?: number,"id"?: string,"is_published"?: boolean,"service_id"?: string | null,"title_en": string,"title_ml"?: string | null,"treatment_duration"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "after_image_url"?: string,"before_image_url"?: string,"created_at"?: string,"description_en"?: string | null,"description_ml"?: string | null,"display_order"?: number,"id"?: string,"is_published"?: boolean,"service_id"?: string | null,"title_en"?: string,"title_ml"?: string | null,"treatment_duration"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "gallery_items_service_id_fkey"
      columns: ["service_id"]
isOneToOne: false
      referencedRelation: "services"
      referencedColumns: ["id"]
    }
                  ]
                },"patients": {
                  Row: {
                    "created_at": string,"date_of_birth": string | null,"email": string | null,"full_name": string,"gender": string | null,"id": string,"notes": string | null,"phone": string,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"date_of_birth"?: string | null,"email"?: string | null,"full_name": string,"gender"?: string | null,"id"?: string,"notes"?: string | null,"phone": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"date_of_birth"?: string | null,"email"?: string | null,"full_name"?: string,"gender"?: string | null,"id"?: string,"notes"?: string | null,"phone"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"services": {
                  Row: {
                    "category": string,"created_at": string,"description_en": string | null,"description_ml": string | null,"duration_minutes": number,"id": string,"image_url": string | null,"is_active": boolean,"is_featured": boolean,"name_en": string,"name_ml": string,"price_display": string | null,"price_starting_at": number | null,"short_description_en": string | null,"short_description_ml": string | null,"slug": string,"sort_order": number,"updated_at": string
                  }
                  Insert: {
                    "category": string,"created_at"?: string,"description_en"?: string | null,"description_ml"?: string | null,"duration_minutes"?: number,"id"?: string,"image_url"?: string | null,"is_active"?: boolean,"is_featured"?: boolean,"name_en": string,"name_ml": string,"price_display"?: string | null,"price_starting_at"?: number | null,"short_description_en"?: string | null,"short_description_ml"?: string | null,"slug": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "category"?: string,"created_at"?: string,"description_en"?: string | null,"description_ml"?: string | null,"duration_minutes"?: number,"id"?: string,"image_url"?: string | null,"is_active"?: boolean,"is_featured"?: boolean,"name_en"?: string,"name_ml"?: string,"price_display"?: string | null,"price_starting_at"?: number | null,"short_description_en"?: string | null,"short_description_ml"?: string | null,"slug"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"site_settings": {
                  Row: {
                    "description": string | null,"id": string,"is_public": boolean,"key": string,"updated_at": string,"updated_by": string | null,"value": NonNullable<Json>
                  }
                  Insert: {
                    "description"?: string | null,"id"?: string,"is_public"?: boolean,"key": string,"updated_at"?: string,"updated_by"?: string | null,"value": NonNullable<Json>
                  }
                  Update: {
                    "description"?: string | null,"id"?: string,"is_public"?: boolean,"key"?: string,"updated_at"?: string,"updated_by"?: string | null,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    {
      foreignKeyName: "site_settings_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "staff_users"
      referencedColumns: ["id"]
    }
                  ]
                },"staff_users": {
                  Row: {
                    "clinic_id": string | null,"created_at": string,"email": string,"full_name": string,"id": string,"is_active": boolean,"role": string,"updated_at": string
                  }
                  Insert: {
                    "clinic_id"?: string | null,"created_at"?: string,"email": string,"full_name": string,"id": string,"is_active"?: boolean,"role"?: string,"updated_at"?: string
                  }
                  Update: {
                    "clinic_id"?: string | null,"created_at"?: string,"email"?: string,"full_name"?: string,"id"?: string,"is_active"?: boolean,"role"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "staff_users_clinic_id_fkey"
      columns: ["clinic_id"]
isOneToOne: false
      referencedRelation: "clinics"
      referencedColumns: ["id"]
    }
                  ]
                },"testimonials": {
                  Row: {
                    "created_at": string,"display_order": number,"id": string,"is_approved": boolean,"is_featured": boolean,"patient_name": string,"photo_url": string | null,"quote_en": string,"quote_ml": string | null,"rating": number,"service_id": string | null,"treatment": string,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"display_order"?: number,"id"?: string,"is_approved"?: boolean,"is_featured"?: boolean,"patient_name": string,"photo_url"?: string | null,"quote_en": string,"quote_ml"?: string | null,"rating": number,"service_id"?: string | null,"treatment": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"display_order"?: number,"id"?: string,"is_approved"?: boolean,"is_featured"?: boolean,"patient_name"?: string,"photo_url"?: string | null,"quote_en"?: string,"quote_ml"?: string | null,"rating"?: number,"service_id"?: string | null,"treatment"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "testimonials_service_id_fkey"
      columns: ["service_id"]
isOneToOne: false
      referencedRelation: "services"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_staff":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const

