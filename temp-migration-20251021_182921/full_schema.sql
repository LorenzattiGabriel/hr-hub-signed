-- Migración Completa HR Hub
-- Generado automáticamente
-- Este script aplica todas las migraciones en orden

BEGIN;

-- Migration: 20250917032044_5bd1872c-0b57-415d-83ce-04b196dc4044.sql
-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dni VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  fecha_nacimiento DATE,
  fecha_ingreso DATE NOT NULL,
  puesto VARCHAR(100),
  departamento VARCHAR(100),
  salario DECIMAL(10,2),
  tipo_contrato VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vacation balances table
CREATE TABLE public.vacation_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  dias_totales INTEGER NOT NULL DEFAULT 0,
  dias_adeudados INTEGER NOT NULL DEFAULT 0,
  dias_usados INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, year)
);

-- Create vacation requests table
CREATE TABLE public.vacation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  dias_solicitados INTEGER NOT NULL,
  motivo TEXT,
  periodo VARCHAR(50),
  observaciones TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for employees (public access for now)
CREATE POLICY "Anyone can view employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Anyone can insert employees" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update employees" ON public.employees FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete employees" ON public.employees FOR DELETE USING (true);

-- Create policies for vacation balances
CREATE POLICY "Anyone can view vacation balances" ON public.vacation_balances FOR SELECT USING (true);
CREATE POLICY "Anyone can insert vacation balances" ON public.vacation_balances FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update vacation balances" ON public.vacation_balances FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete vacation balances" ON public.vacation_balances FOR DELETE USING (true);

-- Create policies for vacation requests
CREATE POLICY "Anyone can view vacation requests" ON public.vacation_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert vacation requests" ON public.vacation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update vacation requests" ON public.vacation_requests FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete vacation requests" ON public.vacation_requests FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vacation_balances_updated_at
  BEFORE UPDATE ON public.vacation_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vacation_requests_updated_at
  BEFORE UPDATE ON public.vacation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate vacation days based on seniority
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso DATE)
RETURNS INTEGER AS $$
DECLARE
  antiguedad_anios INTEGER;
BEGIN
  antiguedad_anios := EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_ingreso));
  
  CASE 
    WHEN antiguedad_anios < 1 THEN RETURN 0;
    WHEN antiguedad_anios < 5 THEN RETURN 14;
    WHEN antiguedad_anios < 10 THEN RETURN 21;
    WHEN antiguedad_anios < 20 THEN RETURN 28;
    ELSE RETURN 35;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create function to get total available vacation days (including adeudados)
CREATE OR REPLACE FUNCTION public.get_total_available_days(employee_id UUID, year INTEGER)
RETURNS INTEGER AS $$
DECLARE
  balance_record public.vacation_balances%ROWTYPE;
  total_available INTEGER;
BEGIN
  SELECT * INTO balance_record 
  FROM public.vacation_balances 
  WHERE vacation_balances.employee_id = get_total_available_days.employee_id 
    AND vacation_balances.year = get_total_available_days.year;
  
  IF balance_record IS NULL THEN
    RETURN 0;
  END IF;
  
  total_available := balance_record.dias_totales + balance_record.dias_adeudados - balance_record.dias_usados;
  RETURN GREATEST(total_available, 0);
END;
$$ LANGUAGE plpgsql;
-- Migration: 20250917032103_d3a264ff-6531-4ff7-b390-0e37bd3d26f6.sql
-- Fix function search path for calculate_vacation_days
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso DATE)
RETURNS INTEGER AS $$
DECLARE
  antiguedad_anios INTEGER;
BEGIN
  antiguedad_anios := EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_ingreso));
  
  CASE 
    WHEN antiguedad_anios < 1 THEN RETURN 0;
    WHEN antiguedad_anios < 5 THEN RETURN 14;
    WHEN antiguedad_anios < 10 THEN RETURN 21;
    WHEN antiguedad_anios < 20 THEN RETURN 28;
    ELSE RETURN 35;
  END CASE;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix function search path for get_total_available_days  
CREATE OR REPLACE FUNCTION public.get_total_available_days(employee_id UUID, year INTEGER)
RETURNS INTEGER AS $$
DECLARE
  balance_record public.vacation_balances%ROWTYPE;
  total_available INTEGER;
BEGIN
  SELECT * INTO balance_record 
  FROM public.vacation_balances 
  WHERE vacation_balances.employee_id = get_total_available_days.employee_id 
    AND vacation_balances.year = get_total_available_days.year;
  
  IF balance_record IS NULL THEN
    RETURN 0;
  END IF;
  
  total_available := balance_record.dias_totales + balance_record.dias_adeudados - balance_record.dias_usados;
  RETURN GREATEST(total_available, 0);
END;
$$ LANGUAGE plpgsql SET search_path = public;
-- Migration: 20250917033430_4883bdb8-49fa-4584-98d9-d225636ebb54.sql
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
-- Migration: 20250917033446_c00ff677-73f1-430d-a375-815f392018e8.sql
-- Insert initial vacation balances for the sample employees
INSERT INTO public.vacation_balances (employee_id, year, dias_totales, dias_adeudados, dias_usados)
SELECT 
  e.id,
  2025 as year,
  public.calculate_vacation_days(e.fecha_ingreso) as dias_totales,
  CASE 
    WHEN e.dni = '12345678' THEN 5  -- María has 5 owed days from previous year
    WHEN e.dni = '87654321' THEN 3  -- Juan has 3 owed days
    ELSE 0
  END as dias_adeudados,
  CASE 
    WHEN e.dni = '12345678' THEN 2  -- María has used 2 days
    ELSE 0
  END as dias_usados
FROM public.employees e
WHERE e.dni IN ('12345678', '87654321', '45678912');
-- Migration: 20250917034421_fca46575-6273-4899-a9cd-4afc8c546632.sql
-- Add missing columns to employees table for complete employee information
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS cuil VARCHAR(20),
ADD COLUMN IF NOT EXISTS contacto_emergencia VARCHAR(255),
ADD COLUMN IF NOT EXISTS telefono_emergencia VARCHAR(20),
ADD COLUMN IF NOT EXISTS parentesco_emergencia VARCHAR(100),
ADD COLUMN IF NOT EXISTS nivel_educativo VARCHAR(100),
ADD COLUMN IF NOT EXISTS titulo VARCHAR(255),
ADD COLUMN IF NOT EXISTS otros_conocimientos TEXT,
ADD COLUMN IF NOT EXISTS grupo_sanguineo VARCHAR(10),
ADD COLUMN IF NOT EXISTS alergias TEXT,
ADD COLUMN IF NOT EXISTS medicacion_habitual TEXT,
ADD COLUMN IF NOT EXISTS obra_social VARCHAR(255),
ADD COLUMN IF NOT EXISTS observaciones TEXT,
ADD COLUMN IF NOT EXISTS tiene_hijos VARCHAR(10),
ADD COLUMN IF NOT EXISTS nombres_hijos TEXT,
ADD COLUMN IF NOT EXISTS tiene_licencia VARCHAR(10),
ADD COLUMN IF NOT EXISTS tipo_licencia VARCHAR(50),
ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(50);
-- Migration: 20250917035059_5d95d249-0fe1-403e-bdd7-5f0c4589361e.sql
-- Create absences table
CREATE TABLE public.absences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('enfermedad', 'personal', 'familiar', 'vacaciones', 'licencia', 'otro')),
  motivo TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
  certificado_medico BOOLEAN NOT NULL DEFAULT false,
  archivo_url TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

-- Create policies for absences
CREATE POLICY "Anyone can view absences" 
ON public.absences 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert absences" 
ON public.absences 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update absences" 
ON public.absences 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete absences" 
ON public.absences 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_absences_updated_at
BEFORE UPDATE ON public.absences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_absences_employee_id ON public.absences(employee_id);
CREATE INDEX idx_absences_fecha_inicio ON public.absences(fecha_inicio);
CREATE INDEX idx_absences_estado ON public.absences(estado);
CREATE INDEX idx_absences_tipo ON public.absences(tipo);
-- Migration: 20250917035609_424952b7-1774-4411-9a63-fe5c781398c2.sql
-- Align allowed absence types with UI options
ALTER TABLE public.absences DROP CONSTRAINT IF EXISTS absences_tipo_check;

ALTER TABLE public.absences
ADD CONSTRAINT absences_tipo_check
CHECK (
  tipo IN (
    'enfermedad',
    'personal',
    'familiar',
    'vacaciones',
    'licencia',
    'otro',
    'accidente',
    'maternidad',
    'paternidad',
    'estudio'
  )
);
-- Migration: 20250917035818_57aa377e-038d-481a-a380-37eacc70438d.sql
-- Create trainings table
CREATE TABLE public.trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('tecnica', 'seguridad', 'calidad', 'liderazgo', 'administrativa', 'otro')),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'cancelado')),
  fecha_inicio DATE,
  fecha_fin DATE,
  fecha_vencimiento DATE,
  instructor VARCHAR(255),
  modalidad VARCHAR(20) CHECK (modalidad IN ('presencial', 'virtual', 'mixta')),
  duracion_horas INTEGER,
  calificacion INTEGER CHECK (calificacion >= 0 AND calificacion <= 100),
  certificado_url TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

-- Create policies for trainings
CREATE POLICY "Anyone can view trainings" 
ON public.trainings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert trainings" 
ON public.trainings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update trainings" 
ON public.trainings 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete trainings" 
ON public.trainings 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trainings_updated_at
BEFORE UPDATE ON public.trainings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_trainings_employee_id ON public.trainings(employee_id);
CREATE INDEX idx_trainings_estado ON public.trainings(estado);
CREATE INDEX idx_trainings_tipo ON public.trainings(tipo);
CREATE INDEX idx_trainings_fecha_vencimiento ON public.trainings(fecha_vencimiento);
-- Migration: 20250917040322_933f93ae-0b71-4642-a351-65ad68f1fc8c.sql
-- Create performance_evaluations table
CREATE TABLE public.performance_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  periodo VARCHAR(20) NOT NULL,
  fecha_evaluacion DATE NOT NULL,
  evaluador VARCHAR(255),
  puntuacion_general INTEGER CHECK (puntuacion_general >= 0 AND puntuacion_general <= 100),
  
  -- Competencias (1-100)
  comp_tecnicas INTEGER CHECK (comp_tecnicas >= 0 AND comp_tecnicas <= 100),
  comp_liderazgo INTEGER CHECK (comp_liderazgo >= 0 AND comp_liderazgo <= 100),
  comp_comunicacion INTEGER CHECK (comp_comunicacion >= 0 AND comp_comunicacion <= 100),
  comp_puntualidad INTEGER CHECK (comp_puntualidad >= 0 AND comp_puntualidad <= 100),
  comp_trabajo_equipo INTEGER CHECK (comp_trabajo_equipo >= 0 AND comp_trabajo_equipo <= 100),
  
  -- Objetivos (1-100)
  obj_cumplimiento INTEGER CHECK (obj_cumplimiento >= 0 AND obj_cumplimiento <= 100),
  obj_calidad INTEGER CHECK (obj_calidad >= 0 AND obj_calidad <= 100),
  obj_eficiencia INTEGER CHECK (obj_eficiencia >= 0 AND obj_eficiencia <= 100),
  
  estado VARCHAR(20) NOT NULL DEFAULT 'en_progreso' CHECK (estado IN ('borrador', 'en_progreso', 'completado', 'cancelado')),
  observaciones TEXT,
  fortalezas TEXT[],
  areas_desarrollo TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.performance_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view performance evaluations" 
ON public.performance_evaluations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert performance evaluations" 
ON public.performance_evaluations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update performance evaluations" 
ON public.performance_evaluations 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete performance evaluations" 
ON public.performance_evaluations 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_performance_evaluations_updated_at
BEFORE UPDATE ON public.performance_evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_performance_evaluations_employee_id ON public.performance_evaluations(employee_id);
CREATE INDEX idx_performance_evaluations_periodo ON public.performance_evaluations(periodo);
CREATE INDEX idx_performance_evaluations_estado ON public.performance_evaluations(estado);
CREATE INDEX idx_performance_evaluations_fecha ON public.performance_evaluations(fecha_evaluacion);
-- Migration: 20250917040753_b4cc4c21-6e8d-46bc-9b79-ddd41099bb0c.sql
-- Create attendance table for proper Excel file processing
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora_entrada TIME,
  hora_salida TIME,
  horas_trabajadas NUMERIC(4,2),
  llegada_tarde BOOLEAN DEFAULT false,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view attendance" 
ON public.attendance 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert attendance" 
ON public.attendance 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update attendance" 
ON public.attendance 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete attendance" 
ON public.attendance 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_attendance_employee_id ON public.attendance(employee_id);
CREATE INDEX idx_attendance_fecha ON public.attendance(fecha);
CREATE UNIQUE INDEX idx_attendance_employee_fecha ON public.attendance(employee_id, fecha);
-- Migration: 20250917041147_f9a7f946-db46-42aa-ab2d-35114f5bedda.sql
-- Create uniforms table for proper data persistence
CREATE TABLE public.uniforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  uniform_type VARCHAR(100) NOT NULL,
  size VARCHAR(10) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  delivery_date DATE NOT NULL,
  season VARCHAR(20) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'entregado' CHECK (status IN ('entregado', 'pendiente', 'devuelto')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uniforms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view uniforms" 
ON public.uniforms 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert uniforms" 
ON public.uniforms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update uniforms" 
ON public.uniforms 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete uniforms" 
ON public.uniforms 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_uniforms_updated_at
BEFORE UPDATE ON public.uniforms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_uniforms_employee_id ON public.uniforms(employee_id);
CREATE INDEX idx_uniforms_status ON public.uniforms(status);
CREATE INDEX idx_uniforms_delivery_date ON public.uniforms(delivery_date);
-- Migration: 20250917174821_cc5c95e1-199a-431d-a539-559d2e767593.sql
-- Update the vacation calculation function to follow Argentine law correctly
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  meses_trabajados INTEGER;
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
BEGIN
  -- Calcular meses trabajados desde ingreso hasta 31 de diciembre
  meses_trabajados := EXTRACT(MONTH FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, calcular basado en meses trabajados
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Si tiene menos de 6 meses, calcular vacaciones proporcionales
    IF meses_trabajados < 6 THEN
      -- Calcular días trabajados desde ingreso hasta 31 de diciembre
      dias_trabajados := fecha_corte - fecha_ingreso + 1;
      -- 1 día de vacaciones cada 20 días trabajados (proporcional)
      RETURN GREATEST(FLOOR(dias_trabajados / 20.0), 0);
    ELSE
      -- Si tiene 6 meses o más en el año, le corresponden 14 días
      RETURN 14;
    END IF;
  END IF;
  
  -- Para empleados con antigüedad de años completos
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  CASE 
    WHEN antiguedad_anios < 0 THEN RETURN 0; -- Fecha futura
    WHEN antiguedad_anios < 5 THEN RETURN 14;
    WHEN antiguedad_anios < 10 THEN RETURN 21;
    WHEN antiguedad_anios < 20 THEN RETURN 28;
    ELSE RETURN 35;
  END CASE;
END;
$function$
-- Migration: 20250917182543_6c2df4b7-32c5-47d5-98f2-ca3fee9fd981.sql
-- Add next_delivery_date column to uniforms table
ALTER TABLE public.uniforms 
ADD COLUMN next_delivery_date date;

-- Create function to calculate next delivery date based on uniform type
CREATE OR REPLACE FUNCTION public.calculate_next_delivery_date(
  uniform_type_param text,
  delivery_date_param date
) RETURNS date AS $$
BEGIN
  CASE uniform_type_param
    WHEN 'Remera', 'Pantalón cargo', 'Campera', 'Buzo' THEN
      -- Uniformes: cada 6 meses
      RETURN delivery_date_param + INTERVAL '6 months';
    WHEN 'Zapatos punta de acero' THEN
      -- Zapatos: cada 1 año
      RETURN delivery_date_param + INTERVAL '1 year';
    ELSE
      -- Elementos de protección (Barbijo, Guantes, Mameluco, Sordina, Gafas de seguridad): cuando se rompen
      RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update existing records to calculate next delivery date
UPDATE public.uniforms 
SET next_delivery_date = calculate_next_delivery_date(uniform_type, delivery_date)
WHERE next_delivery_date IS NULL;

-- Create trigger to automatically calculate next_delivery_date on insert/update
CREATE OR REPLACE FUNCTION public.trigger_calculate_next_delivery_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_delivery_date = calculate_next_delivery_date(NEW.uniform_type, NEW.delivery_date);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_next_delivery_date_trigger
  BEFORE INSERT OR UPDATE ON public.uniforms
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_calculate_next_delivery_date();
-- Migration: 20250917182600_b7ec838e-1e33-4fdd-b1ba-59a6edc489e3.sql
-- Fix security warnings by setting search_path for new functions
DROP FUNCTION IF EXISTS public.calculate_next_delivery_date(text, date);
DROP FUNCTION IF EXISTS public.trigger_calculate_next_delivery_date();

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_next_delivery_date(
  uniform_type_param text,
  delivery_date_param date
) RETURNS date 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  CASE uniform_type_param
    WHEN 'Remera', 'Pantalón cargo', 'Campera', 'Buzo' THEN
      -- Uniformes: cada 6 meses
      RETURN delivery_date_param + INTERVAL '6 months';
    WHEN 'Zapatos punta de acero' THEN
      -- Zapatos: cada 1 año
      RETURN delivery_date_param + INTERVAL '1 year';
    ELSE
      -- Elementos de protección (Barbijo, Guantes, Mameluco, Sordina, Gafas de seguridad): cuando se rompen
      RETURN NULL;
  END CASE;
END;
$$;

-- Recreate trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.trigger_calculate_next_delivery_date()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  NEW.next_delivery_date = calculate_next_delivery_date(NEW.uniform_type, NEW.delivery_date);
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS calculate_next_delivery_date_trigger ON public.uniforms;
CREATE TRIGGER calculate_next_delivery_date_trigger
  BEFORE INSERT OR UPDATE ON public.uniforms
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_calculate_next_delivery_date();

-- Update existing records again to calculate next delivery date
UPDATE public.uniforms 
SET next_delivery_date = calculate_next_delivery_date(uniform_type, delivery_date)
WHERE next_delivery_date IS NULL;
-- Migration: 20250917182622_356382fa-03f0-46a4-858b-a2ce9b228f3d.sql
-- Fix security warnings by setting search_path for new functions
DROP FUNCTION IF EXISTS public.calculate_next_delivery_date(text, date);
DROP FUNCTION IF EXISTS public.trigger_calculate_next_delivery_date();

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_next_delivery_date(
  uniform_type_param text,
  delivery_date_param date
) RETURNS date 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  CASE uniform_type_param
    WHEN 'Remera', 'Pantalón cargo', 'Campera', 'Buzo' THEN
      -- Uniformes: cada 6 meses
      RETURN delivery_date_param + INTERVAL '6 months';
    WHEN 'Zapatos punta de acero' THEN
      -- Zapatos: cada 1 año
      RETURN delivery_date_param + INTERVAL '1 year';
    ELSE
      -- Elementos de protección (Barbijo, Guantes, Mameluco, Sordina, Gafas de seguridad): cuando se rompen
      RETURN NULL;
  END CASE;
END;
$$;

-- Recreate trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.trigger_calculate_next_delivery_date()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  NEW.next_delivery_date = calculate_next_delivery_date(NEW.uniform_type, NEW.delivery_date);
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS calculate_next_delivery_date_trigger ON public.uniforms;
CREATE TRIGGER calculate_next_delivery_date_trigger
  BEFORE INSERT OR UPDATE ON public.uniforms
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_calculate_next_delivery_date();

-- Update existing records again to calculate next delivery date
UPDATE public.uniforms 
SET next_delivery_date = calculate_next_delivery_date(uniform_type, delivery_date)
WHERE next_delivery_date IS NULL;
-- Migration: 20250917182643_63965ee6-850b-469e-b50e-a13ddba0696a.sql
-- Fix security warnings by setting search_path for new functions
-- First drop the trigger that depends on the function
DROP TRIGGER IF EXISTS calculate_next_delivery_date_trigger ON public.uniforms;

-- Now drop the functions
DROP FUNCTION IF EXISTS public.trigger_calculate_next_delivery_date();
DROP FUNCTION IF EXISTS public.calculate_next_delivery_date(text, date);

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_next_delivery_date(
  uniform_type_param text,
  delivery_date_param date
) RETURNS date 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  CASE uniform_type_param
    WHEN 'Remera', 'Pantalón cargo', 'Campera', 'Buzo' THEN
      -- Uniformes: cada 6 meses
      RETURN delivery_date_param + INTERVAL '6 months';
    WHEN 'Zapatos punta de acero' THEN
      -- Zapatos: cada 1 año
      RETURN delivery_date_param + INTERVAL '1 year';
    ELSE
      -- Elementos de protección (Barbijo, Guantes, Mameluco, Sordina, Gafas de seguridad): cuando se rompen
      RETURN NULL;
  END CASE;
END;
$$;

-- Recreate trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.trigger_calculate_next_delivery_date()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  NEW.next_delivery_date = calculate_next_delivery_date(NEW.uniform_type, NEW.delivery_date);
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER calculate_next_delivery_date_trigger
  BEFORE INSERT OR UPDATE ON public.uniforms
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_calculate_next_delivery_date();

-- Update existing records to calculate next delivery date
UPDATE public.uniforms 
SET next_delivery_date = calculate_next_delivery_date(uniform_type, delivery_date);
-- Migration: 20250919004429_b72f0dea-84d0-441b-9738-bf81f3bee2ef.sql
-- Crear tabla para declaraciones juradas de domicilio
CREATE TABLE public.declaraciones_domicilio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  domicilio TEXT NOT NULL,
  calle_paralela_1 TEXT,
  calle_paralela_2 TEXT,
  fecha_declaracion DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para visitas de consultores
CREATE TABLE public.visitas_consultores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha_consulta DATE NOT NULL,
  detalle TEXT NOT NULL,
  consultor TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.declaraciones_domicilio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitas_consultores ENABLE ROW LEVEL SECURITY;

-- Crear políticas para declaraciones_domicilio
CREATE POLICY "Todos pueden ver declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR SELECT 
USING (true);

CREATE POLICY "Todos pueden crear declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos pueden actualizar declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR UPDATE 
USING (true);

CREATE POLICY "Todos pueden eliminar declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR DELETE 
USING (true);

-- Crear políticas para visitas_consultores
CREATE POLICY "Todos pueden ver visitas de consultores" 
ON public.visitas_consultores 
FOR SELECT 
USING (true);

CREATE POLICY "Todos pueden crear visitas de consultores" 
ON public.visitas_consultores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos pueden actualizar visitas de consultores" 
ON public.visitas_consultores 
FOR UPDATE 
USING (true);

CREATE POLICY "Todos pueden eliminar visitas de consultores" 
ON public.visitas_consultores 
FOR DELETE 
USING (true);

-- Crear trigger para actualizar updated_at en declaraciones_domicilio
CREATE TRIGGER update_declaraciones_domicilio_updated_at
BEFORE UPDATE ON public.declaraciones_domicilio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear trigger para actualizar updated_at en visitas_consultores
CREATE TRIGGER update_visitas_consultores_updated_at
BEFORE UPDATE ON public.visitas_consultores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Migration: 20250919004621_8383e35f-7cfa-4f62-bd7f-097873e9c6cb.sql
-- Crear tabla para declaraciones juradas de domicilio
CREATE TABLE public.declaraciones_domicilio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  domicilio TEXT NOT NULL,
  calle_paralela_1 TEXT,
  calle_paralela_2 TEXT,
  fecha_declaracion DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para visitas de consultores
CREATE TABLE public.visitas_consultores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha_consulta DATE NOT NULL,
  detalle TEXT NOT NULL,
  consultor TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.declaraciones_domicilio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitas_consultores ENABLE ROW LEVEL SECURITY;

-- Crear políticas para declaraciones_domicilio
CREATE POLICY "Todos pueden ver declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR SELECT 
USING (true);

CREATE POLICY "Todos pueden crear declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos pueden actualizar declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR UPDATE 
USING (true);

CREATE POLICY "Todos pueden eliminar declaraciones de domicilio" 
ON public.declaraciones_domicilio 
FOR DELETE 
USING (true);

-- Crear políticas para visitas_consultores
CREATE POLICY "Todos pueden ver visitas de consultores" 
ON public.visitas_consultores 
FOR SELECT 
USING (true);

CREATE POLICY "Todos pueden crear visitas de consultores" 
ON public.visitas_consultores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos pueden actualizar visitas de consultores" 
ON public.visitas_consultores 
FOR UPDATE 
USING (true);

CREATE POLICY "Todos pueden eliminar visitas de consultores" 
ON public.visitas_consultores 
FOR DELETE 
USING (true);

-- Crear trigger para actualizar updated_at en declaraciones_domicilio
CREATE TRIGGER update_declaraciones_domicilio_updated_at
BEFORE UPDATE ON public.declaraciones_domicilio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Crear trigger para actualizar updated_at en visitas_consultores
CREATE TRIGGER update_visitas_consultores_updated_at
BEFORE UPDATE ON public.visitas_consultores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Migration: 20250919013744_2ca70af0-ccf9-4dcd-aeda-a7fc0b4d44a3.sql
-- Create tabla de candidatos para el módulo de selección
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_apellido TEXT,
  fecha_nacimiento DATE,
  edad INTEGER,
  sexo TEXT,
  localidad TEXT,
  vacante_postulada TEXT,
  mail TEXT,
  numero_contacto TEXT,
  experiencia_laboral TEXT,
  conocimientos_habilidades TEXT,
  observaciones_reclutador TEXT,
  tipo_jornada_buscada TEXT,
  disponibilidad TEXT,
  referencias_laborales TEXT,
  estado TEXT NOT NULL DEFAULT 'no_entrevistado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para historial de estados y notas
CREATE TABLE public.candidate_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  estado_anterior TEXT,
  estado_nuevo TEXT NOT NULL,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_history ENABLE ROW LEVEL SECURITY;

-- Create policies for candidates
CREATE POLICY "Anyone can view candidates" 
ON public.candidates 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create candidates" 
ON public.candidates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update candidates" 
ON public.candidates 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete candidates" 
ON public.candidates 
FOR DELETE 
USING (true);

-- Create policies for candidate_history
CREATE POLICY "Anyone can view candidate history" 
ON public.candidate_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create candidate history" 
ON public.candidate_history 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update candidate history" 
ON public.candidate_history 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete candidate history" 
ON public.candidate_history 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Migration: 20250919042131_f45e8e5e-eaea-4b67-9cc3-bcb32660d70a.sql
-- Eliminar todos los registros del historial de candidatos
DELETE FROM candidate_history;

-- Eliminar todos los candidatos
DELETE FROM candidates;
-- Migration: 20250924013903_d8f8ae5b-c223-4e52-8e87-ad6310afc898.sql
-- Update vacation days calculation function to follow Argentine Labor Law exactly
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
RETURNS integer
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
  dias_habiles_anio INTEGER := 261; -- Aproximadamente 261 días hábiles por año en Argentina
  dias_trabajados_anio INTEGER;
BEGIN
  -- Calcular antigüedad en años completos al 31 de diciembre
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, verificar casos especiales
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Calcular días trabajados desde ingreso hasta 31 de diciembre
    dias_trabajados := fecha_corte - fecha_ingreso + 1;
    
    -- Estimar días hábiles trabajados (asumiendo 5 días hábiles por semana)
    dias_trabajados_anio := ROUND(dias_trabajados * 5.0 / 7.0);
    
    -- Verificar si trabajó menos de 6 meses (aproximadamente 130 días hábiles)
    IF dias_trabajados_anio < 130 THEN
      -- Menos de 6 meses: 1 día de vacaciones por cada 20 días de trabajo efectivo
      RETURN GREATEST(FLOOR(dias_trabajados_anio / 20.0), 0);
    ELSE
      -- Trabajó más de 6 meses: debe haber trabajado al menos la mitad de los días hábiles del año
      -- Si cumple la condición, le corresponden 14 días
      IF dias_trabajados_anio >= (dias_habiles_anio / 2) THEN
        RETURN 14;
      ELSE
        -- No cumple la condición para vacaciones completas
        RETURN FLOOR(dias_trabajados_anio / 20.0);
      END IF;
    END IF;
  END IF;
  
  -- Para empleados con antigüedad de años completos (según Ley de Contrato de Trabajo N° 20.744)
  CASE 
    WHEN antiguedad_anios < 0 THEN RETURN 0; -- Fecha futura
    WHEN antiguedad_anios <= 5 THEN RETURN 14;  -- Hasta 5 años: 14 días corridos
    WHEN antiguedad_anios <= 10 THEN RETURN 21; -- Más de 5 hasta 10 años: 21 días corridos  
    WHEN antiguedad_anios <= 20 THEN RETURN 28; -- Más de 10 hasta 20 años: 28 días corridos
    ELSE RETURN 35; -- Más de 20 años: 35 días corridos
  END CASE;
END;
$function$;
-- Migration: 20250924014417_b11d9367-2f79-4a5a-a63a-2605485a2190.sql
-- Corregir cálculo de vacaciones para empleados con menos de 6 meses
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
RETURNS integer
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
  meses_trabajados NUMERIC;
BEGIN
  -- Calcular antigüedad en años completos al 31 de diciembre
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, verificar casos especiales
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Calcular días trabajados desde ingreso hasta 31 de diciembre (días calendario)
    dias_trabajados := fecha_corte - fecha_ingreso + 1;
    
    -- Calcular meses trabajados
    meses_trabajados := EXTRACT(EPOCH FROM AGE(fecha_corte, fecha_ingreso)) / (30.44 * 24 * 60 * 60); -- Promedio días por mes
    
    -- Si trabajó menos de 6 meses: 1 día de vacaciones por cada 20 días de trabajo efectivo
    IF meses_trabajados < 6 THEN
      RETURN FLOOR(dias_trabajados / 20.0);
    ELSE
      -- Si trabajó 6 meses o más en el año, le corresponden 14 días
      RETURN 14;
    END IF;
  END IF;
  
  -- Para empleados con antigüedad de años completos (según Ley de Contrato de Trabajo N° 20.744)
  CASE 
    WHEN antiguedad_anios < 0 THEN RETURN 0; -- Fecha futura
    WHEN antiguedad_anios <= 5 THEN RETURN 14;  -- Hasta 5 años: 14 días corridos
    WHEN antiguedad_anios <= 10 THEN RETURN 21; -- Más de 5 hasta 10 años: 21 días corridos  
    WHEN antiguedad_anios <= 20 THEN RETURN 28; -- Más de 10 hasta 20 años: 28 días corridos
    ELSE RETURN 35; -- Más de 20 años: 35 días corridos
  END CASE;
END;
$function$;
-- Migration: 20250924014533_f582f59a-7783-44b5-b449-1dba399e6a44.sql
-- Corregir cálculo de vacaciones para empleados con menos de 6 meses
CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
RETURNS integer
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
  meses_trabajados NUMERIC;
BEGIN
  -- Calcular antigüedad en años completos al 31 de diciembre
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, verificar casos especiales
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Calcular días trabajados desde ingreso hasta 31 de diciembre (días calendario)
    dias_trabajados := fecha_corte - fecha_ingreso + 1;
    
    -- Calcular meses trabajados
    meses_trabajados := EXTRACT(EPOCH FROM AGE(fecha_corte, fecha_ingreso)) / (30.44 * 24 * 60 * 60); -- Promedio días por mes
    
    -- Si trabajó menos de 6 meses: 1 día de vacaciones por cada 20 días de trabajo efectivo
    IF meses_trabajados < 6 THEN
      RETURN FLOOR(dias_trabajados / 20.0);
    ELSE
      -- Si trabajó 6 meses o más en el año, le corresponden 14 días
      RETURN 14;
    END IF;
  END IF;
  
  -- Para empleados con antigüedad de años completos (según Ley de Contrato de Trabajo N° 20.744)
  CASE 
    WHEN antiguedad_anios < 0 THEN RETURN 0; -- Fecha futura
    WHEN antiguedad_anios <= 5 THEN RETURN 14;  -- Hasta 5 años: 14 días corridos
    WHEN antiguedad_anios <= 10 THEN RETURN 21; -- Más de 5 hasta 10 años: 21 días corridos  
    WHEN antiguedad_anios <= 20 THEN RETURN 28; -- Más de 10 hasta 20 años: 28 días corridos
    ELSE RETURN 35; -- Más de 20 años: 35 días corridos
  END CASE;
END;
$function$;
-- Migration: 20250924014712_cc3b3130-dc35-49fc-a4f3-33500948bb56.sql
-- Eliminar función existente y recrear con decimales
DROP FUNCTION IF EXISTS public.calculate_vacation_days(date);

CREATE OR REPLACE FUNCTION public.calculate_vacation_days(fecha_ingreso date)
RETURNS NUMERIC(5,2)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  fecha_corte DATE := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day'; -- 31 de diciembre del año actual
  dias_trabajados INTEGER;
  antiguedad_anios INTEGER;
  meses_trabajados NUMERIC;
BEGIN
  -- Calcular antigüedad en años completos al 31 de diciembre
  antiguedad_anios := EXTRACT(YEAR FROM AGE(fecha_corte, fecha_ingreso));
  
  -- Si ingresó este año, verificar casos especiales
  IF EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE) THEN
    -- Calcular días trabajados desde ingreso hasta 31 de diciembre (días calendario)
    dias_trabajados := fecha_corte - fecha_ingreso + 1;
    
    -- Calcular meses trabajados
    meses_trabajados := EXTRACT(EPOCH FROM AGE(fecha_corte, fecha_ingreso)) / (30.44 * 24 * 60 * 60); -- Promedio días por mes
    
    -- Si trabajó menos de 6 meses: 1 día de vacaciones por cada 20 días de trabajo efectivo
    IF meses_trabajados < 6 THEN
      RETURN ROUND(dias_trabajados / 20.0, 2);
    ELSE
      -- Si trabajó 6 meses o más en el año, le corresponden 14 días
      RETURN 14;
    END IF;
  END IF;
  
  -- Para empleados con antigüedad de años completos (según Ley de Contrato de Trabajo N° 20.744)
  CASE 
    WHEN antiguedad_anios < 0 THEN RETURN 0; -- Fecha futura
    WHEN antiguedad_anios <= 5 THEN RETURN 14;  -- Hasta 5 años: 14 días corridos
    WHEN antiguedad_anios <= 10 THEN RETURN 21; -- Más de 5 hasta 10 años: 21 días corridos  
    WHEN antiguedad_anios <= 20 THEN RETURN 28; -- Más de 10 hasta 20 años: 28 días corridos
    ELSE RETURN 35; -- Más de 20 años: 35 días corridos
  END CASE;
END;
$function$;
-- Migration: 20251001112036_92478ef3-ed15-42c8-8622-45fa2cda5331.sql
-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  document_type VARCHAR NOT NULL,
  generated_date DATE NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'generado',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  document_content TEXT,
  signed_date DATE,
  observations TEXT
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view documents" 
ON public.documents 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update documents" 
ON public.documents 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete documents" 
ON public.documents 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Migration: 20251001113244_c5c387ea-4be7-4fbc-83cd-c8ae32ba2cae.sql
-- Add foreign key constraint to documents table
ALTER TABLE public.documents
ADD CONSTRAINT documents_employee_id_fkey 
FOREIGN KEY (employee_id) 
REFERENCES public.employees(id) 
ON DELETE CASCADE;
-- Migration: 20251002173925_07d794e4-6f95-480d-9f8a-8bac82c6f893.sql
-- Create documents bucket for storing generated PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
);

-- Allow anyone to view documents
CREATE POLICY "Anyone can view documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

-- Allow anyone to upload documents
CREATE POLICY "Anyone can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow anyone to update documents
CREATE POLICY "Anyone can update documents"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'documents');

-- Allow anyone to delete documents
CREATE POLICY "Anyone can delete documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');

-- Add pdf_url column to documents table to store the storage path
ALTER TABLE public.documents
ADD COLUMN pdf_url TEXT;
-- Migration: 20251004123802_e70bc099-1d8e-46ef-88c1-0e8ece527eea.sql
-- Crear tabla de registro de pagos
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('salary', 'advance', 'commission', 'deduction')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  period VARCHAR NOT NULL,
  payment_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acceso completo
CREATE POLICY "Anyone can view payroll"
  ON public.payroll
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert payroll"
  ON public.payroll
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update payroll"
  ON public.payroll
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete payroll"
  ON public.payroll
  FOR DELETE
  USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
-- Migration: 20251004123821_e51c2b2b-bf70-4323-b81b-abf8664a0f2e.sql
-- Arreglar la advertencia de seguridad en la función handle_updated_at
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recrear el trigger para payroll
CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
-- Migration: 20251005145811_cd981c54-fdd1-48bb-a70a-48539e5f2c21.sql
-- Actualizar valores existentes de 'commission' a 'bonus' en la tabla payroll
UPDATE public.payroll 
SET type = 'bonus' 
WHERE type = 'commission';

-- Nota: Como el campo 'type' es de tipo varchar sin restricciones CHECK específicas,
-- no necesitamos modificar restricciones adicionales. 
-- Los nuevos valores 'bonus' se pueden insertar directamente.
-- Migration: 20251011130847_2984a7c5-4742-4070-a1b8-172f6316c0fa.sql
-- Crear tabla para suspensiones y apercibimientos
CREATE TABLE public.sanctions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  tipo VARCHAR NOT NULL CHECK (tipo IN ('apercibimiento', 'sancion')),
  fecha_documento DATE NOT NULL DEFAULT CURRENT_DATE,
  motivo TEXT NOT NULL,
  lugar_hecho TEXT,
  fecha_hecho DATE,
  -- Campos específicos para sanciones
  dias_suspension INTEGER,
  fecha_inicio DATE,
  fecha_reincorporacion DATE,
  -- Metadatos
  pdf_url TEXT,
  estado VARCHAR NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'anulado')),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sanctions ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Anyone can view sanctions"
  ON public.sanctions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert sanctions"
  ON public.sanctions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update sanctions"
  ON public.sanctions
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete sanctions"
  ON public.sanctions
  FOR DELETE
  USING (true);

-- Crear trigger para updated_at
CREATE TRIGGER update_sanctions_updated_at
  BEFORE UPDATE ON public.sanctions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Crear índices
CREATE INDEX idx_sanctions_employee_id ON public.sanctions(employee_id);
CREATE INDEX idx_sanctions_tipo ON public.sanctions(tipo);
CREATE INDEX idx_sanctions_estado ON public.sanctions(estado);
-- Migration: 20251015000000_add_galpon_to_uniforms.sql
-- Add galpon column to uniforms table
-- Galpon is optional (nullable) and represents a numeric value from 1 to 5

ALTER TABLE public.uniforms 
ADD COLUMN galpon INTEGER;

-- Add constraint to ensure galpon is between 1 and 5 when not null
ALTER TABLE public.uniforms 
ADD CONSTRAINT galpon_range_check 
CHECK (galpon IS NULL OR (galpon >= 1 AND galpon <= 5));

-- Add comment to document the column
COMMENT ON COLUMN public.uniforms.galpon IS 'Número de galpón (1-5), opcional';

-- Create index for better performance when filtering by galpon
CREATE INDEX idx_uniforms_galpon ON public.uniforms(galpon) WHERE galpon IS NOT NULL;

-- Migration: 20251015000001_change_license_to_array.sql
-- Cambiar tipo de licencia de VARCHAR(50) a TEXT[] para permitir múltiples licencias
-- Primero crear una columna temporal para almacenar los arrays
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS tipos_licencia TEXT[];

-- Migrar datos existentes: si tiene tipo_licencia, lo agregamos al array
UPDATE public.employees 
SET tipos_licencia = ARRAY[tipo_licencia]
WHERE tipo_licencia IS NOT NULL AND tipo_licencia != '';

-- Eliminar la columna antigua
ALTER TABLE public.employees 
DROP COLUMN IF EXISTS tipo_licencia;

-- Renombrar la nueva columna para mantener consistencia
ALTER TABLE public.employees 
RENAME COLUMN tipos_licencia TO tipo_licencia;

-- Agregar comentario para documentar el cambio
COMMENT ON COLUMN public.employees.tipo_licencia IS 'Array de tipos de licencia de conducir (puede tener múltiples)';

-- Crear índice para mejorar consultas sobre arrays
CREATE INDEX IF NOT EXISTS idx_employees_tipo_licencia 
ON public.employees USING gin(tipo_licencia);

-- Migration: 20251015000002_support_decimal_vacation_days.sql
-- Migración para soportar días decimales en vacaciones (ej: 0.5 para medio día)
-- Cambiar columnas de INTEGER a NUMERIC(5,2) para permitir hasta 999.99 días

-- Actualizar tabla vacation_balances
ALTER TABLE public.vacation_balances 
  ALTER COLUMN dias_totales TYPE NUMERIC(5,2),
  ALTER COLUMN dias_adeudados TYPE NUMERIC(5,2), 
  ALTER COLUMN dias_usados TYPE NUMERIC(5,2);

-- Actualizar tabla vacation_requests
ALTER TABLE public.vacation_requests 
  ALTER COLUMN dias_solicitados TYPE NUMERIC(5,2);

-- Primero eliminar la función existente
DROP FUNCTION IF EXISTS public.get_total_available_days(uuid, integer);

-- Recrear función get_total_available_days para retornar NUMERIC
CREATE OR REPLACE FUNCTION public.get_total_available_days(employee_id UUID, year INTEGER)
RETURNS NUMERIC(5,2) AS $$
DECLARE
  balance_record public.vacation_balances%ROWTYPE;
  total_available NUMERIC(5,2);
BEGIN
  SELECT * INTO balance_record 
  FROM public.vacation_balances 
  WHERE vacation_balances.employee_id = get_total_available_days.employee_id 
    AND vacation_balances.year = get_total_available_days.year;
  
  IF balance_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Solo días totales - días usados (ya no incluimos adeudados)
  total_available := balance_record.dias_totales - balance_record.dias_usados;
  RETURN GREATEST(total_available, 0);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Comentario para referencia
COMMENT ON TABLE public.vacation_balances IS 'Tabla de balances de vacaciones - soporta días decimales (ej: 0.5 para medio día)';
COMMENT ON TABLE public.vacation_requests IS 'Tabla de solicitudes de vacaciones - soporta días decimales (ej: 0.5 para medio día)';

-- Migration: 20251016234909_a897ef38-bf32-4c0d-ba9f-1eb529d42c90.sql
-- Reset dias_usados to 0 for specific employees (Lucas Milton and Laura Roxana)
UPDATE public.vacation_balances vb
SET dias_usados = 0
FROM public.employees e
WHERE vb.employee_id = e.id
  AND e.dni IN ('38020563','25089374');

-- Ensure no leftover vacation requests for these employees (cleanup, harmless if none exist)
DELETE FROM public.vacation_requests vr
USING public.employees e
WHERE vr.employee_id = e.id
  AND e.dni IN ('38020563','25089374');
-- Migration: 20251016235116_889168b9-0902-4575-8239-0b0ebc93dc64.sql
-- Actualizar el check constraint de payroll para permitir 'bonus' en lugar de 'commission'
-- Esto soluciona el error al intentar cargar bonificaciones

ALTER TABLE public.payroll DROP CONSTRAINT IF EXISTS payroll_type_check;

ALTER TABLE public.payroll 
ADD CONSTRAINT payroll_type_check 
CHECK (type::text = ANY (ARRAY['salary'::character varying, 'advance'::character varying, 'bonus'::character varying, 'deduction'::character varying]::text[]));
-- Migration: 20251020181840_5ecfdd96-19f4-49ba-ae28-e459ec27382f.sql
-- Agregar columna id_huella a la tabla employees
ALTER TABLE public.employees 
ADD COLUMN id_huella character varying(50);
-- Migration: 20251021192840_ac479d61-9ba4-4ee5-8eca-e6c82fa67e54.sql
-- Políticas para permitir la descarga de CVs desde el bucket cv-files

-- Permitir que cualquier usuario autenticado o anónimo pueda descargar CVs
CREATE POLICY "Anyone can download CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-files');

-- Permitir que cualquiera pueda subir CVs
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-files');
-- Migration: 20251021192927_cac24302-83d2-4af0-876e-a09c21d90d48.sql
-- Hacer público el bucket cv-files para permitir descargas directas
UPDATE storage.buckets 
SET public = true 
WHERE id = 'cv-files';
COMMIT;

-- Configuración de Storage Buckets
BEGIN;

-- Crear bucket 'documents' para documentos PDF
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760, -- 10MB
  ARRAY['application/pdf']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket 'bd_backup' para backups automáticos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bd_backup',
  'bd_backup',
  false,
  52428800, -- 50MB
  ARRAY['application/json', 'text/plain']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para bucket 'documents'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir lectura pública de documentos'
  ) THEN
    CREATE POLICY "Permitir lectura pública de documentos" ON storage.objects 
    FOR SELECT USING (bucket_id = 'documents');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir subida autenticada de documentos'
  ) THEN
    CREATE POLICY "Permitir subida autenticada de documentos" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'documents');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir actualización autenticada de documentos'
  ) THEN
    CREATE POLICY "Permitir actualización autenticada de documentos" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'documents');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir eliminación autenticada de documentos'
  ) THEN
    CREATE POLICY "Permitir eliminación autenticada de documentos" ON storage.objects 
    FOR DELETE USING (bucket_id = 'documents');
  END IF;
END $$;

-- Políticas de Storage para bucket 'bd_backup'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Solo servicios pueden acceder a backups'
  ) THEN
    CREATE POLICY "Solo servicios pueden acceder a backups" ON storage.objects 
    FOR ALL USING (bucket_id = 'bd_backup' AND auth.role() = 'service_role');
  END IF;
END $$;

COMMIT;

