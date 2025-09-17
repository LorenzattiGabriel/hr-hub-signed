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