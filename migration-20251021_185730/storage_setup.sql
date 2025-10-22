-- Configuración de Storage Buckets (sin transacción global)

-- Crear bucket 'documents'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760,
  ARRAY['application/pdf']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket 'bd_backup'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bd_backup',
  'bd_backup',
  false,
  52428800,
  ARRAY['application/json', 'text/plain']::text[]
) ON CONFLICT (id) DO NOTHING;

