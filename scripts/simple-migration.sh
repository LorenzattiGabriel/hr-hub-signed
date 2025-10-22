#!/bin/bash

# Script Simple de Migración - Usa las migraciones existentes directamente
# No requiere Supabase CLI, solo psql

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 Migración Simple a Nueva Base de Datos${NC}"
echo -e "${CYAN}=========================================${NC}"
echo

# Verificar que se proporcione la URL de conexión
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar la URL de conexión${NC}"
    echo -e "${YELLOW}Uso: ./simple-migration.sh <DATABASE_URL>${NC}"
    echo -e "${YELLOW}Ejemplo: ./simple-migration.sh 'postgresql://postgres:password@db.xxx.supabase.co:5432/postgres'${NC}"
    exit 1
fi

DB_URL="$1"
echo -e "${BLUE}📊 Base de datos destino configurada${NC}"
echo

# Verificar que psql esté instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ Error: psql no está instalado${NC}"
    echo -e "${YELLOW}Instala PostgreSQL client:${NC}"
    echo -e "${YELLOW}  brew install postgresql${NC}"
    exit 1
fi

echo -e "${GREEN}✅ psql encontrado${NC}"
echo

# Crear directorio temporal para el schema combinado
TEMP_DIR="./temp-migration-$(date +%Y%m%d_%H%M%S)"
mkdir -p "${TEMP_DIR}"

echo -e "${BLUE}📋 Paso 1: Combinando todas las migraciones...${NC}"

# Combinar todas las migraciones en orden
cat > "${TEMP_DIR}/full_schema.sql" << 'HEADER'
-- Migración Completa HR Hub
-- Generado automáticamente
-- Este script aplica todas las migraciones en orden

BEGIN;

HEADER

# Agregar todas las migraciones en orden
for migration in ./supabase/migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo -e "${YELLOW}  Agregando: $(basename $migration)${NC}"
        echo "-- Migration: $(basename $migration)" >> "${TEMP_DIR}/full_schema.sql"
        cat "$migration" >> "${TEMP_DIR}/full_schema.sql"
        echo "" >> "${TEMP_DIR}/full_schema.sql"
    fi
done

echo "COMMIT;" >> "${TEMP_DIR}/full_schema.sql"

echo -e "${GREEN}✅ Schema combinado creado${NC}"
echo

echo -e "${BLUE}📋 Paso 2: Agregando configuración de Storage...${NC}"

# Agregar configuración de Storage
cat >> "${TEMP_DIR}/full_schema.sql" << 'STORAGE'

-- Configuración de Storage Buckets
BEGIN;

-- Crear bucket 'documents' para documentos PDF
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760, -- 10MB
  ARRAY['application/pdf']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket 'bd_backup' para backups automáticos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bd_backup',
  'bd_backup',
  false,
  52428800, -- 50MB
  ARRAY['application/json', 'text/plain']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para bucket 'documents'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir lectura pública de documentos'
  ) THEN
    CREATE POLICY "Permitir lectura pública de documentos" ON storage.objects 
    FOR SELECT USING (bucket_id = 'documents');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir subida autenticada de documentos'
  ) THEN
    CREATE POLICY "Permitir subida autenticada de documentos" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'documents');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir actualización autenticada de documentos'
  ) THEN
    CREATE POLICY "Permitir actualización autenticada de documentos" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'documents');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Permitir eliminación autenticada de documentos'
  ) THEN
    CREATE POLICY "Permitir eliminación autenticada de documentos" ON storage.objects 
    FOR DELETE USING (bucket_id = 'documents');
  END IF;
END $$;

-- Políticas de Storage para bucket 'bd_backup'
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Solo servicios pueden acceder a backups'
  ) THEN
    CREATE POLICY "Solo servicios pueden acceder a backups" ON storage.objects 
    FOR ALL USING (bucket_id = 'bd_backup' AND auth.role() = 'service_role');
  END IF;
END $$;

COMMIT;

STORAGE

echo -e "${GREEN}✅ Configuración de Storage agregada${NC}"
echo

echo -e "${BLUE}📋 Paso 3: Aplicando schema a la nueva base de datos...${NC}"
echo -e "${YELLOW}Esto puede tomar unos minutos...${NC}"
echo

# Aplicar el schema
if psql "$DB_URL" < "${TEMP_DIR}/full_schema.sql" > "${TEMP_DIR}/migration.log" 2>&1; then
    echo -e "${GREEN}✅ Migración completada exitosamente!${NC}"
else
    echo -e "${RED}❌ Error durante la migración${NC}"
    echo -e "${YELLOW}Revisa el log: ${TEMP_DIR}/migration.log${NC}"
    tail -20 "${TEMP_DIR}/migration.log"
    exit 1
fi

echo
echo -e "${CYAN}📊 Resumen de la migración:${NC}"
echo -e "${GREEN}✅ Todas las tablas creadas${NC}"
echo -e "${GREEN}✅ Políticas RLS configuradas${NC}"
echo -e "${GREEN}✅ Buckets de Storage creados${NC}"
echo -e "${GREEN}✅ Políticas de Storage aplicadas${NC}"
echo

echo -e "${BLUE}📁 Archivos generados:${NC}"
echo -e "  - Schema completo: ${TEMP_DIR}/full_schema.sql"
echo -e "  - Log de migración: ${TEMP_DIR}/migration.log"
echo

echo -e "${YELLOW}🎯 Próximos pasos:${NC}"
echo -e "1. Verifica la migración en Supabase Dashboard"
echo -e "2. Crea un nuevo proyecto React para este cliente"
echo -e "3. Actualiza las variables de entorno:"
echo -e "   VITE_SUPABASE_URL=https://exdsdocotrqisoijaahh.supabase.co"
echo -e "   VITE_SUPABASE_ANON_KEY=[tu_anon_key]"
echo -e "4. Personaliza branding y contenido para el cliente"
echo

echo -e "${GREEN}🎉 ¡Base de datos lista para el nuevo cliente!${NC}"

# Preguntar si quiere limpiar archivos temporales
read -p "¿Deseas eliminar los archivos temporales? (y/n): " cleanup
if [ "$cleanup" = "y" ] || [ "$cleanup" = "Y" ]; then
    rm -rf "${TEMP_DIR}"
    echo -e "${GREEN}✅ Archivos temporales eliminados${NC}"
else
    echo -e "${BLUE}📁 Archivos temporales guardados en: ${TEMP_DIR}${NC}"
fi

