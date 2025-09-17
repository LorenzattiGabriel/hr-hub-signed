import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Absence {
  id: string;
  employee_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: string;
  motivo?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  certificado_medico: boolean;
  archivo_url?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  empleadoNombre?: string;
  empleadoDni?: string;
}

export const useAbsences = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAbsences = async () => {
    try {
      const { data, error } = await supabase
        .from('absences')
        .select(`
          *,
          employees (
            nombres,
            apellidos,
            dni
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedAbsences = (data || []).map(absence => ({
        ...absence,
        empleadoNombre: absence.employees ? 
          `${absence.employees.nombres} ${absence.employees.apellidos}` : 
          'Empleado no encontrado',
        empleadoDni: absence.employees?.dni || 'N/A'
      }));
      
      setAbsences(mappedAbsences);
    } catch (error) {
      console.error('Error fetching absences:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las ausencias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAbsence = async (absenceData: Omit<Absence, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('absences')
        .insert([absenceData])
        .select(`
          *,
          employees (
            nombres,
            apellidos,
            dni
          )
        `)
        .single();

      if (error) throw error;

      const newAbsence = {
        ...data,
        empleadoNombre: data.employees ? 
          `${data.employees.nombres} ${data.employees.apellidos}` : 
          'Empleado no encontrado',
        empleadoDni: data.employees?.dni || 'N/A'
      };

      setAbsences(prev => [newAbsence, ...prev]);
      
      toast({
        title: "Éxito",
        description: "Ausencia agregada correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding absence:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la ausencia",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAbsence = async (id: string, absenceData: Partial<Absence>) => {
    try {
      const { data, error } = await supabase
        .from('absences')
        .update(absenceData)
        .eq('id', id)
        .select(`
          *,
          employees (
            nombres,
            apellidos,
            dni
          )
        `)
        .single();

      if (error) throw error;

      const updatedAbsence = {
        ...data,
        empleadoNombre: data.employees ? 
          `${data.employees.nombres} ${data.employees.apellidos}` : 
          'Empleado no encontrado',
        empleadoDni: data.employees?.dni || 'N/A'
      };

      setAbsences(prev => prev.map(abs => abs.id === id ? updatedAbsence : abs));
      
      toast({
        title: "Éxito",
        description: "Ausencia actualizada correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating absence:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la ausencia",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAbsence = async (id: string) => {
    try {
      const { error } = await supabase
        .from('absences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAbsences(prev => prev.filter(abs => abs.id !== id));
      
      toast({
        title: "Éxito",
        description: "Ausencia eliminada correctamente",
      });
    } catch (error) {
      console.error('Error deleting absence:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la ausencia",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getAbsencesByStatus = (status: string) => {
    return absences.filter(abs => abs.estado === status);
  };

  const getAbsencesByType = (type: string) => {
    return absences.filter(abs => abs.tipo === type);
  };

  const getAbsencesWithCertificate = () => {
    return absences.filter(abs => abs.certificado_medico || abs.archivo_url);
  };

  useEffect(() => {
    fetchAbsences();
  }, []);

  return {
    absences,
    loading,
    addAbsence,
    updateAbsence,
    deleteAbsence,
    getAbsencesByStatus,
    getAbsencesByType,
    getAbsencesWithCertificate,
    refetch: fetchAbsences
  };
};