-- Políticas para permitir la descarga de CVs desde el bucket cv-files

-- Permitir que cualquier usuario autenticado o anónimo pueda descargar CVs
CREATE POLICY "Anyone can download CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-files');

-- Permitir que cualquiera pueda subir CVs
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-files');