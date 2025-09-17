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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      absences: {
        Row: {
          archivo_url: string | null
          certificado_medico: boolean
          created_at: string
          employee_id: string
          estado: string
          fecha_fin: string
          fecha_inicio: string
          id: string
          motivo: string | null
          observaciones: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          archivo_url?: string | null
          certificado_medico?: boolean
          created_at?: string
          employee_id: string
          estado?: string
          fecha_fin: string
          fecha_inicio: string
          id?: string
          motivo?: string | null
          observaciones?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          archivo_url?: string | null
          certificado_medico?: boolean
          created_at?: string
          employee_id?: string
          estado?: string
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          motivo?: string | null
          observaciones?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "absences_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          alergias: string | null
          apellidos: string
          contacto_emergencia: string | null
          created_at: string
          cuil: string | null
          departamento: string | null
          direccion: string | null
          dni: string
          email: string | null
          estado: string | null
          estado_civil: string | null
          fecha_ingreso: string
          fecha_nacimiento: string | null
          grupo_sanguineo: string | null
          id: string
          medicacion_habitual: string | null
          nivel_educativo: string | null
          nombres: string
          nombres_hijos: string | null
          obra_social: string | null
          observaciones: string | null
          otros_conocimientos: string | null
          parentesco_emergencia: string | null
          puesto: string | null
          salario: number | null
          telefono: string | null
          telefono_emergencia: string | null
          tiene_hijos: string | null
          tiene_licencia: string | null
          tipo_contrato: string | null
          tipo_licencia: string | null
          titulo: string | null
          updated_at: string
        }
        Insert: {
          alergias?: string | null
          apellidos: string
          contacto_emergencia?: string | null
          created_at?: string
          cuil?: string | null
          departamento?: string | null
          direccion?: string | null
          dni: string
          email?: string | null
          estado?: string | null
          estado_civil?: string | null
          fecha_ingreso: string
          fecha_nacimiento?: string | null
          grupo_sanguineo?: string | null
          id?: string
          medicacion_habitual?: string | null
          nivel_educativo?: string | null
          nombres: string
          nombres_hijos?: string | null
          obra_social?: string | null
          observaciones?: string | null
          otros_conocimientos?: string | null
          parentesco_emergencia?: string | null
          puesto?: string | null
          salario?: number | null
          telefono?: string | null
          telefono_emergencia?: string | null
          tiene_hijos?: string | null
          tiene_licencia?: string | null
          tipo_contrato?: string | null
          tipo_licencia?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          alergias?: string | null
          apellidos?: string
          contacto_emergencia?: string | null
          created_at?: string
          cuil?: string | null
          departamento?: string | null
          direccion?: string | null
          dni?: string
          email?: string | null
          estado?: string | null
          estado_civil?: string | null
          fecha_ingreso?: string
          fecha_nacimiento?: string | null
          grupo_sanguineo?: string | null
          id?: string
          medicacion_habitual?: string | null
          nivel_educativo?: string | null
          nombres?: string
          nombres_hijos?: string | null
          obra_social?: string | null
          observaciones?: string | null
          otros_conocimientos?: string | null
          parentesco_emergencia?: string | null
          puesto?: string | null
          salario?: number | null
          telefono?: string | null
          telefono_emergencia?: string | null
          tiene_hijos?: string | null
          tiene_licencia?: string | null
          tipo_contrato?: string | null
          tipo_licencia?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      performance_evaluations: {
        Row: {
          areas_desarrollo: string[] | null
          comp_comunicacion: number | null
          comp_liderazgo: number | null
          comp_puntualidad: number | null
          comp_tecnicas: number | null
          comp_trabajo_equipo: number | null
          created_at: string
          employee_id: string
          estado: string
          evaluador: string | null
          fecha_evaluacion: string
          fortalezas: string[] | null
          id: string
          obj_calidad: number | null
          obj_cumplimiento: number | null
          obj_eficiencia: number | null
          observaciones: string | null
          periodo: string
          puntuacion_general: number | null
          updated_at: string
        }
        Insert: {
          areas_desarrollo?: string[] | null
          comp_comunicacion?: number | null
          comp_liderazgo?: number | null
          comp_puntualidad?: number | null
          comp_tecnicas?: number | null
          comp_trabajo_equipo?: number | null
          created_at?: string
          employee_id: string
          estado?: string
          evaluador?: string | null
          fecha_evaluacion: string
          fortalezas?: string[] | null
          id?: string
          obj_calidad?: number | null
          obj_cumplimiento?: number | null
          obj_eficiencia?: number | null
          observaciones?: string | null
          periodo: string
          puntuacion_general?: number | null
          updated_at?: string
        }
        Update: {
          areas_desarrollo?: string[] | null
          comp_comunicacion?: number | null
          comp_liderazgo?: number | null
          comp_puntualidad?: number | null
          comp_tecnicas?: number | null
          comp_trabajo_equipo?: number | null
          created_at?: string
          employee_id?: string
          estado?: string
          evaluador?: string | null
          fecha_evaluacion?: string
          fortalezas?: string[] | null
          id?: string
          obj_calidad?: number | null
          obj_cumplimiento?: number | null
          obj_eficiencia?: number | null
          observaciones?: string | null
          periodo?: string
          puntuacion_general?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          calificacion: number | null
          certificado_url: string | null
          created_at: string
          descripcion: string | null
          duracion_horas: number | null
          employee_id: string
          estado: string
          fecha_fin: string | null
          fecha_inicio: string | null
          fecha_vencimiento: string | null
          id: string
          instructor: string | null
          modalidad: string | null
          observaciones: string | null
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          calificacion?: number | null
          certificado_url?: string | null
          created_at?: string
          descripcion?: string | null
          duracion_horas?: number | null
          employee_id: string
          estado?: string
          fecha_fin?: string | null
          fecha_inicio?: string | null
          fecha_vencimiento?: string | null
          id?: string
          instructor?: string | null
          modalidad?: string | null
          observaciones?: string | null
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          calificacion?: number | null
          certificado_url?: string | null
          created_at?: string
          descripcion?: string | null
          duracion_horas?: number | null
          employee_id?: string
          estado?: string
          fecha_fin?: string | null
          fecha_inicio?: string | null
          fecha_vencimiento?: string | null
          id?: string
          instructor?: string | null
          modalidad?: string | null
          observaciones?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      vacation_balances: {
        Row: {
          created_at: string
          dias_adeudados: number
          dias_totales: number
          dias_usados: number
          employee_id: string
          id: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          dias_adeudados?: number
          dias_totales?: number
          dias_usados?: number
          employee_id: string
          id?: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          dias_adeudados?: number
          dias_totales?: number
          dias_usados?: number
          employee_id?: string
          id?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vacation_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      vacation_requests: {
        Row: {
          created_at: string
          dias_solicitados: number
          employee_id: string
          estado: string | null
          fecha_fin: string
          fecha_inicio: string
          id: string
          motivo: string | null
          observaciones: string | null
          periodo: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dias_solicitados: number
          employee_id: string
          estado?: string | null
          fecha_fin: string
          fecha_inicio: string
          id?: string
          motivo?: string | null
          observaciones?: string | null
          periodo?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dias_solicitados?: number
          employee_id?: string
          estado?: string | null
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          motivo?: string | null
          observaciones?: string | null
          periodo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vacation_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_vacation_days: {
        Args: { fecha_ingreso: string }
        Returns: number
      }
      get_total_available_days: {
        Args: { employee_id: string; year: number }
        Returns: number
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
