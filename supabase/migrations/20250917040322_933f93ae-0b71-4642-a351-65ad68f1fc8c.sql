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