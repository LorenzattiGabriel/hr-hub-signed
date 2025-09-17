import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UniformDelivery {
  id: string;
  employee_id: string;
  uniform_type: string;
  size: string;
  quantity: number;
  delivery_date: string;
  next_delivery_date: string | null;
  season: string;
  condition: string;
  notes: string | null;
  status: 'entregado' | 'pendiente' | 'devuelto';
  created_at: string;
  updated_at: string;
  employeeName?: string;
  employeeDni?: string;
}

export const useUniforms = () => {
  const [uniforms, setUniforms] = useState<UniformDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUniforms = async () => {
    try {
      const { data, error } = await supabase
        .from('uniforms')
        .select(`
          *,
          employees:employees (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((row: any) => {
        const emp = row.employees;
        const uniform: UniformDelivery = {
          id: row.id,
          employee_id: row.employee_id,
          uniform_type: row.uniform_type,
          size: row.size,
          quantity: row.quantity,
          delivery_date: row.delivery_date,
          next_delivery_date: row.next_delivery_date,
          season: row.season,
          condition: row.condition,
          notes: row.notes,
          status: row.status as 'entregado' | 'pendiente' | 'devuelto',
          created_at: row.created_at,
          updated_at: row.updated_at,
          employeeName: emp ? `${emp.nombres || ''} ${emp.apellidos || ''}`.trim() : 'Empleado',
          employeeDni: emp?.dni || ''
        };
        return uniform;
      });

      setUniforms(mapped);
    } catch (error) {
      console.error('Error fetching uniforms:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las entregas de uniformes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addUniform = async (uniformData: Omit<UniformDelivery, 'id' | 'created_at' | 'updated_at' | 'employeeName' | 'employeeDni' | 'next_delivery_date'>) => {
    try {
      const insertPayload = {
        employee_id: uniformData.employee_id,
        uniform_type: uniformData.uniform_type,
        size: uniformData.size,
        quantity: uniformData.quantity,
        delivery_date: uniformData.delivery_date,
        season: uniformData.season,
        condition: uniformData.condition,
        notes: uniformData.notes,
        status: uniformData.status
      };

      const { data, error } = await supabase
        .from('uniforms')
        .insert([insertPayload])
        .select(`*, employees:employees(*)`)
        .single();

      if (error) throw error;

      const emp = data.employees;
      const newUniform: UniformDelivery = {
        id: data.id,
        employee_id: data.employee_id,
        uniform_type: data.uniform_type,
        size: data.size,
        quantity: data.quantity,
        delivery_date: data.delivery_date,
        next_delivery_date: data.next_delivery_date,
        season: data.season,
        condition: data.condition,
        notes: data.notes,
        status: data.status as 'entregado' | 'pendiente' | 'devuelto',
        created_at: data.created_at,
        updated_at: data.updated_at,
        employeeName: emp ? `${emp.nombres || ''} ${emp.apellidos || ''}`.trim() : 'Empleado',
        employeeDni: emp?.dni || ''
      };

      setUniforms(prev => [newUniform, ...prev]);
      toast({ 
        title: 'Éxito',
        description: 'Entrega de uniforme registrada correctamente' 
      });
      return data;
    } catch (error) {
      console.error('Error adding uniform:', error);
      toast({ 
        title: 'Error', 
        description: 'No se pudo registrar la entrega de uniforme', 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const updateUniform = async (id: string, uniformData: Partial<UniformDelivery>) => {
    try {
      const updatePayload = { ...uniformData };
      delete (updatePayload as any).employeeName;
      delete (updatePayload as any).employeeDni;

      const { data, error } = await supabase
        .from('uniforms')
        .update(updatePayload)
        .eq('id', id)
        .select(`*, employees:employees(*)`)
        .single();

      if (error) throw error;

      const emp = data.employees;
      const updated: UniformDelivery = {
        id: data.id,
        employee_id: data.employee_id,
        uniform_type: data.uniform_type,
        size: data.size,
        quantity: data.quantity,
        delivery_date: data.delivery_date,
        next_delivery_date: data.next_delivery_date,
        season: data.season,
        condition: data.condition,
        notes: data.notes,
        status: data.status as 'entregado' | 'pendiente' | 'devuelto',
        created_at: data.created_at,
        updated_at: data.updated_at,
        employeeName: emp ? `${emp.nombres || ''} ${emp.apellidos || ''}`.trim() : 'Empleado',
        employeeDni: emp?.dni || ''
      };

      setUniforms(prev => prev.map(u => u.id === id ? updated : u));
      toast({ 
        title: 'Éxito',
        description: 'Entrega de uniforme actualizada correctamente' 
      });
      return data;
    } catch (error) {
      console.error('Error updating uniform:', error);
      toast({ 
        title: 'Error', 
        description: 'No se pudo actualizar la entrega de uniforme', 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const deleteUniform = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uniforms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setUniforms(prev => prev.filter(u => u.id !== id));
      toast({ 
        title: 'Éxito', 
        description: 'Entrega de uniforme eliminada correctamente' 
      });
    } catch (error) {
      console.error('Error deleting uniform:', error);
      toast({ 
        title: 'Error', 
        description: 'No se pudo eliminar la entrega de uniforme', 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  const updateUniformStatus = async (id: string, newStatus: UniformDelivery['status']) => {
    await updateUniform(id, { status: newStatus });
  };

  useEffect(() => {
    fetchUniforms();

    // Set up real-time subscription
    const channel = supabase
      .channel('uniforms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'uniforms'
        },
        () => {
          fetchUniforms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    uniforms,
    loading,
    addUniform,
    updateUniform,
    deleteUniform,
    updateUniformStatus,
    refetch: fetchUniforms
  };
};