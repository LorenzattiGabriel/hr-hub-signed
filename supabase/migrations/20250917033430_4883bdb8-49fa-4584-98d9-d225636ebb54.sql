-- Insert sample employees to test the modules
INSERT INTO public.employees (
  dni, nombres, apellidos, email, telefono, fecha_ingreso, puesto, departamento, estado
) VALUES 
(
  '12345678',
  'María José',
  'González Pérez', 
  'maria.gonzalez@avicola.com',
  '1234567890',
  '2023-01-15',
  'Supervisora de Granja',
  'Producción',
  'activo'
),
(
  '87654321',
  'Juan Carlos', 
  'Rodríguez Silva',
  'juan.rodriguez@avicola.com',
  '0987654321',
  '2022-06-10',
  'Técnico Veterinario',
  'Sanidad',
  'activo'
),
(
  '45678912',
  'Ana Sofía',
  'Martínez López',
  'ana.martinez@avicola.com', 
  '1122334455',
  '2023-03-20',
  'Operaria de Planta',
  'Producción',
  'activo'
);