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