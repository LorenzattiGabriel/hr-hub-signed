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