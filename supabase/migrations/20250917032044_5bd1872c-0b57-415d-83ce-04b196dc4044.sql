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