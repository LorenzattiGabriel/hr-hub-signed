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