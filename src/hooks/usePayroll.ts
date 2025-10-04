import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PayrollRecord {
  id: string;
  employee_id: string;
  type: "salary" | "advance" | "commission" | "deduction";
  amount: number;
  period: string;
  payment_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const usePayroll = () => {
  const queryClient = useQueryClient();

  const { data: payrollRecords = [], isLoading } = useQuery({
    queryKey: ["payroll"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll")
        .select("*")
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data as PayrollRecord[];
    },
  });

  const createPayroll = useMutation({
    mutationFn: async (payrollData: Omit<PayrollRecord, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("payroll")
        .insert([payrollData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Registro de pago guardado correctamente");
    },
    onError: (error) => {
      console.error("Error creating payroll:", error);
      toast.error("Error al guardar el registro de pago");
    },
  });

  const updatePayroll = useMutation({
    mutationFn: async ({ id, ...payrollData }: Partial<PayrollRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from("payroll")
        .update(payrollData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Registro de pago actualizado correctamente");
    },
    onError: (error) => {
      console.error("Error updating payroll:", error);
      toast.error("Error al actualizar el registro de pago");
    },
  });

  const deletePayroll = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payroll")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Registro de pago eliminado correctamente");
    },
    onError: (error) => {
      console.error("Error deleting payroll:", error);
      toast.error("Error al eliminar el registro de pago");
    },
  });

  return {
    payrollRecords,
    isLoading,
    createPayroll,
    updatePayroll,
    deletePayroll,
  };
};
