-- Hacer público el bucket cv-files para permitir descargas directas
UPDATE storage.buckets 
SET public = true 
WHERE id = 'cv-files';