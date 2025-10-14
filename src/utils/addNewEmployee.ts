import { supabase } from '@/integrations/supabase/client';

export const addNoeliaBelen = async () => {
  try {
    console.log('Agregando empleado: Noelia Belén Ludueña');

    const employeeData = {
      // Datos Personales
      dni: "35832688",
      nombres: "Noelia Belén",
      apellidos: "Ludueña",
      email: "belenludueña8@gmail.com",
      telefono: "3525406695",
      direccion: "Zona Rural. El Crispin",
      fecha_nacimiento: "1993-12-30",
      fecha_ingreso: "2024-05-25",
      puesto: "Operario de Producción",
      departamento: "Producción",
      salario: null,
      tipo_contrato: "CON PLAN SEMESTRAL",
      estado: "activo",
      
      // Extended fields
      cuil: null,
      contacto_emergencia: "Oscar Sánchez (Esposo)",
      telefono_emergencia: "3574638038",
      parentesco_emergencia: "esposo",
      nivel_educativo: "Secundario Incompleto",
      titulo: null,
      otros_conocimientos: "Peluquería",
      grupo_sanguineo: "AB+",
      alergias: null,
      medicacion_habitual: null,
      obra_social: null,
      observaciones: null,
      tiene_hijos: "si",
      nombres_hijos: "Thomas Benjamín Sánchez (8 años)\nIan Gael Sánchez (2 años)",
      tiene_licencia: "si",
      tipo_licencia: "B2",
      estado_civil: null,
    };

    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
      .single();

    if (error) throw error;

    console.log('Empleado creado exitosamente:', data);

    // Create initial vacation balance for current year
    const currentYear = new Date().getFullYear();
    
    // Calculate vacation days based on seniority (from 2024-05-25 to now)
    const { data: vacationDays, error: vacationError } = await supabase
      .rpc('calculate_vacation_days', { fecha_ingreso: '2024-05-25' });

    if (vacationError) {
      console.error('Error calculating vacation days:', vacationError);
    } else {
      await supabase
        .from('vacation_balances')
        .insert([{
          employee_id: data.id,
          year: currentYear,
          dias_totales: vacationDays || 14,
          dias_usados: 0
        }]);
      
      console.log('Vacation balance created for', vacationDays || 14, 'days');
    }

    return {
      success: true,
      message: 'Empleado Noelia Belén Ludueña agregado exitosamente',
      employee: data
    };

  } catch (error) {
    console.error('Error adding employee:', error);
    return {
      success: false,
      message: 'Error al agregar el empleado: ' + (error as any).message,
      error
    };
  }
};