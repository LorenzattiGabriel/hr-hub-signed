import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  fecha_ingreso: string;
  puesto?: string;
  departamento?: string;
  salario?: number;
  tipo_contrato?: string;
  estado: string;
  // Legacy fields for compatibility
  fechaIngreso?: string;
  cuil?: string;
  cargo?: string;
  sector?: string;
  tipoContrato?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  parentescoEmergencia?: string;
  nivelEducativo?: string;
  titulo?: string;
  otrosConocimientos?: string;
  grupoSanguineo?: string;
  alergias?: string;
  medicacionHabitual?: string;
  obraSocial?: string;
  observaciones?: string;
  tieneHijos?: string;
  nombresHijos?: string;
  tieneLicencia?: string;
  tipoLicencia?: string;
  fotoDni?: any;
  fotoCarnet?: any;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const toDbEmployee = (input: Partial<Employee>) => {
    const db: Record<string, any> = {
      dni: input.dni,
      nombres: input.nombres,
      apellidos: input.apellidos,
      email: input.email,
      telefono: input.telefono,
      direccion: input.direccion,
      fecha_nacimiento: input.fecha_nacimiento || input.fechaNacimiento || null,
      fecha_ingreso: input.fecha_ingreso || input.fechaIngreso || null,
      puesto: input.puesto || input.cargo,
      departamento: input.departamento || input.sector,
      salario: input.salario ?? null,
      tipo_contrato: input.tipo_contrato || input.tipoContrato,
      estado: input.estado || 'activo',
    };
    // Remove undefined keys
    Object.keys(db).forEach((k) => db[k] === undefined && delete db[k]);
    return db;
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('apellidos', { ascending: true });

      if (error) throw error;
      
      // Map database fields to include legacy compatibility
      const mappedEmployees = (data || []).map(emp => ({
        ...emp,
        fechaIngreso: emp.fecha_ingreso, // Legacy compatibility
        fechaNacimiento: emp.fecha_nacimiento, // Legacy compatibility
        cargo: emp.puesto, // Legacy compatibility
        sector: emp.departamento, // Legacy compatibility
        tipoContrato: emp.tipo_contrato // Legacy compatibility
      }));
      
      setEmployees(mappedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los empleados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      const dbEmployee = toDbEmployee(employeeData);
      const { data, error } = await supabase
        .from('employees')
        .insert([dbEmployee] as any)
        .select()
        .single();

      if (error) throw error;

      setEmployees(prev => [...prev, { ...data, fechaIngreso: data.fecha_ingreso, fechaNacimiento: data.fecha_nacimiento, cargo: data.puesto, sector: data.departamento, tipoContrato: data.tipo_contrato }]);
      
      // Create initial vacation balance for current year
      const currentYear = new Date().getFullYear();
      const vacationDays = await calculateVacationDays(dbEmployee.fecha_ingreso);
      
      await supabase
        .from('vacation_balances')
        .insert([{
          employee_id: data.id,
          year: currentYear,
          dias_totales: vacationDays,
          dias_adeudados: 0,
          dias_usados: 0
        }]);

      toast({
        title: "Éxito",
        description: "Empleado agregado correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el empleado",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      const dbUpdate = toDbEmployee(employeeData);
      const { data, error } = await supabase
        .from('employees')
        .update(dbUpdate as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEmployees(prev => prev.map(emp => emp.id === id ? data : emp));
      
      toast({
        title: "Éxito",
        description: "Empleado actualizado correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el empleado",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmployees(prev => prev.filter(emp => emp.id !== id));
      
      toast({
        title: "Éxito",
        description: "Empleado eliminado correctamente",
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el empleado",
        variant: "destructive",
      });
      throw error;
    }
  };

  const importEmployees = async (employeesData: Omit<Employee, 'id'>[]) => {
    try {
      const dbEmployees = employeesData.map((e) => toDbEmployee(e));
      const { data, error } = await supabase
        .from('employees')
        .insert(dbEmployees as any)
        .select();

      if (error) throw error;

      // Create vacation balances for imported employees
      const currentYear = new Date().getFullYear();
      const balancesToInsert = await Promise.all(
        (data || []).map(async (employee) => {
          const vacationDays = await calculateVacationDays(employee.fecha_ingreso);
          return {
            employee_id: employee.id,
            year: currentYear,
            dias_totales: vacationDays,
            dias_adeudados: 0,
            dias_usados: 0
          };
        })
      );

      await supabase
        .from('vacation_balances')
        .insert(balancesToInsert as any);

      const mapped = (data || []).map(emp => ({
        ...emp,
        fechaIngreso: emp.fecha_ingreso,
        fechaNacimiento: emp.fecha_nacimiento,
        cargo: emp.puesto,
        sector: emp.departamento,
        tipoContrato: emp.tipo_contrato
      }));
      setEmployees(prev => [...prev, ...mapped]);
      
      toast({
        title: "Éxito",
        description: `${data?.length || 0} empleados importados correctamente`,
      });
      
      return data?.length || 0;
    } catch (error) {
      console.error('Error importing employees:', error);
      toast({
        title: "Error",
        description: "No se pudieron importar los empleados",
        variant: "destructive",
      });
      throw error;
    }
  };

  const calculateVacationDays = async (fechaIngreso: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_vacation_days', { fecha_ingreso: fechaIngreso });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error calculating vacation days:', error);
      return 0;
    }
  };

  const getActiveEmployees = () => {
    return employees.filter(emp => emp.estado === 'activo');
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    importEmployees,
    getActiveEmployees,
    calculateVacationDays,
    refetch: fetchEmployees
  };
};