-- Script para configurar correctamente el bucket "avicola" en Supabase

-- 1. Crear el bucket si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avicola',
  'avicola', 
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar RLS en storage.objects si no está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Anyone can view avicola files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to avicola" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update avicola files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from avicola" ON storage.objects;

-- 4. Crear políticas RLS para el bucket "avicola"
CREATE POLICY "Anyone can view avicola files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avicola');

CREATE POLICY "Anyone can upload to avicola"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avicola');

CREATE POLICY "Anyone can update avicola files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'avicola');

CREATE POLICY "Anyone can delete from avicola"
ON storage.objects
FOR DELETE
USING (bucket_id = 'avicola');

-- 5. Verificar que el bucket existe
SELECT * FROM storage.buckets WHERE id = 'avicola';
