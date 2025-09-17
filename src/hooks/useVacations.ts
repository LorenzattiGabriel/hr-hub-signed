import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VacationRequest {
  id: string;
  employee_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_solicitados: number;
  motivo?: string;
  periodo?: string;
  observaciones?: string;
  estado: string;
  created_at: string;
  updated_at: string;
  employee?: {
    nombres: string;
    apellidos: string;
    dni: string;
  };
}

export interface VacationBalance {
  id: string;
  employee_id: string;
  year: number;
  dias_totales: number;
  dias_adeudados: number;
  dias_usados: number;
  created_at: string;
  updated_at: string;
}

export const useVacations = () => {
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [vacationBalances, setVacationBalances] = useState<VacationBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVacationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('vacation_requests')
        .select(`
          *,
          employee:employees (
            nombres,
            apellidos,
            dni
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVacationRequests(data || []);
    } catch (error) {
      console.error('Error fetching vacation requests:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las solicitudes de vacaciones",
        variant: "destructive",
      });
    }
  };

  const fetchVacationBalances = async () => {
    try {
      const { data, error } = await supabase
        .from('vacation_balances')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setVacationBalances(data || []);
    } catch (error) {
      console.error('Error fetching vacation balances:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los balances de vacaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVacationRequest = async (requestData: Omit<VacationRequest, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vacation_requests')
        .insert([requestData])
        .select(`
          *,
          employee:employees (
            nombres,
            apellidos,
            dni
          )
        `)
        .single();

      if (error) throw error;

      setVacationRequests(prev => [data, ...prev]);
      
      toast({
        title: "Éxito",
        description: "Solicitud de vacaciones creada correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding vacation request:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud de vacaciones",
        variant: "destructive",
      });
      throw error;
    }
  };

  const approveVacationRequest = async (requestId: string) => {
    try {
      // Get the request details first
      const { data: request, error: requestError } = await supabase
        .from('vacation_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Update request status
      const { error: updateError } = await supabase
        .from('vacation_requests')
        .update({ estado: 'aprobado' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Update vacation balance - subtract days from available
      const currentYear = new Date().getFullYear();
      const { data: balance, error: balanceError } = await supabase
        .from('vacation_balances')
        .select('*')
        .eq('employee_id', request.employee_id)
        .eq('year', currentYear)
        .single();

      if (balanceError && balanceError.code !== 'PGRST116') throw balanceError;

      if (balance) {
        await supabase
          .from('vacation_balances')
          .update({ 
            dias_usados: balance.dias_usados + request.dias_solicitados 
          })
          .eq('id', balance.id);
      }

      // Refresh data
      await Promise.all([fetchVacationRequests(), fetchVacationBalances()]);
      
      toast({
        title: "Éxito",
        description: "Solicitud de vacaciones aprobada",
      });
    } catch (error) {
      console.error('Error approving vacation request:', error);
      toast({
        title: "Error",
        description: "No se pudo aprobar la solicitud",
        variant: "destructive",
      });
    }
  };

  const rejectVacationRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('vacation_requests')
        .update({ estado: 'rechazado' })
        .eq('id', requestId);

      if (error) throw error;

      await fetchVacationRequests();
      
      toast({
        title: "Éxito",
        description: "Solicitud de vacaciones rechazada",
      });
    } catch (error) {
      console.error('Error rejecting vacation request:', error);
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud",
        variant: "destructive",
      });
    }
  };

  const updateVacationBalance = async (
    employeeId: string, 
    year: number, 
    balanceData: Partial<Pick<VacationBalance, 'dias_totales' | 'dias_adeudados' | 'dias_usados'>>
  ) => {
    try {
      const { data, error } = await supabase
        .from('vacation_balances')
        .upsert([
          {
            employee_id: employeeId,
            year,
            ...balanceData
          }
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchVacationBalances();
      
      toast({
        title: "Éxito",
        description: "Balance de vacaciones actualizado",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating vacation balance:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el balance de vacaciones",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getTotalAvailableDays = async (employeeId: string, year: number): Promise<number> => {
    try {
      const { data, error } = await supabase
        .rpc('get_total_available_days', { 
          employee_id: employeeId, 
          year 
        });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting total available days:', error);
      return 0;
    }
  };

  const getEmployeeVacationBalance = (employeeId: string, year?: number) => {
    const targetYear = year || new Date().getFullYear();
    return vacationBalances.find(
      balance => balance.employee_id === employeeId && balance.year === targetYear
    );
  };

  useEffect(() => {
    Promise.all([fetchVacationRequests(), fetchVacationBalances()]);
  }, []);

  return {
    vacationRequests,
    vacationBalances,
    loading,
    addVacationRequest,
    approveVacationRequest,
    rejectVacationRequest,
    updateVacationBalance,
    getTotalAvailableDays,
    getEmployeeVacationBalance,
    refetch: () => Promise.all([fetchVacationRequests(), fetchVacationBalances()])
  };
};