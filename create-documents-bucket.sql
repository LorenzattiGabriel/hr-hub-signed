-- 1. Crear el bucket "documents"
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Crear políticas RLS para el bucket "documents"
CREATE POLICY "Anyone can view documents files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Anyone can upload to documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Anyone can update documents files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'documents');

CREATE POLICY "Anyone can delete from documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');

-- 3. Verificar que el bucket se creó
SELECT * FROM storage.buckets WHERE id = 'documents';
