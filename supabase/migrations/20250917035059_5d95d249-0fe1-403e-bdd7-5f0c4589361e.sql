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