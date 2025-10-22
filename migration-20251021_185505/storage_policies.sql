-- Políticas de Storage

-- Política 1: Lectura pública de documentos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir lectura pública de documentos'
  ) THEN
    EXECUTE 'CREATE POLICY "Permitir lectura pública de documentos" ON storage.objects FOR SELECT USING (bucket_id = ''documents'')';
  END IF;
END $$;

-- Política 2: Subida autenticada de documentos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir subida autenticada de documentos'
  ) THEN
    EXECUTE 'CREATE POLICY "Permitir subida autenticada de documentos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''documents'')';
  END IF;
END $$;

-- Política 3: Actualización autenticada de documentos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir actualización autenticada de documentos'
  ) THEN
    EXECUTE 'CREATE POLICY "Permitir actualización autenticada de documentos" ON storage.objects FOR UPDATE USING (bucket_id = ''documents'')';
  END IF;
END $$;

-- Política 4: Eliminación autenticada de documentos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir eliminación autenticada de documentos'
  ) THEN
    EXECUTE 'CREATE POLICY "Permitir eliminación autenticada de documentos" ON storage.objects FOR DELETE USING (bucket_id = ''documents'')';
  END IF;
END $$;

-- Política 5: Solo servicios pueden acceder a backups
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Solo servicios pueden acceder a backups'
  ) THEN
    EXECUTE 'CREATE POLICY "Solo servicios pueden acceder a backups" ON storage.objects FOR ALL USING (bucket_id = ''bd_backup'' AND auth.role() = ''service_role'')';
  END IF;
END $$;

