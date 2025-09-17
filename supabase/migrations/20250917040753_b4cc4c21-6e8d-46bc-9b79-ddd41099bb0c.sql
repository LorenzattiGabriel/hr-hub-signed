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