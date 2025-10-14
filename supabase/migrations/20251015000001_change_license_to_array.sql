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
