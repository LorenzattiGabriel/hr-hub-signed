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