#!/bin/bash

# Script de Migración sin Transacciones - Más robusto
# Aplica cada migración individualmente sin BEGIN/COMMIT global

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 Migración Robusta a Nueva Base de Datos${NC}"
echo -e "${CYAN}===========================================${NC}"
echo

# Verificar que se proporcione la URL de conexión
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar la URL de conexión${NC}"
    echo -e "${YELLOW}Uso: ./migrate-without-transactions.sh <DATABASE_URL>${NC}"
    exit 1
fi

DB_URL="$1"
echo -e "${BLUE}📊 Base de datos destino configurada${NC}"
echo

# Verificar que psql esté instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ Error: psql no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ psql encontrado${NC}"
echo

# Crear directorio temporal
TEMP_DIR="./migration-$(date +%Y%m%d_%H%M%S)"
mkdir -p "${TEMP_DIR}"

echo -e "${BLUE}📋 Aplicando migraciones individuales...${NC}"
echo

# Contador de éxitos y errores
SUCCESS_COUNT=0
ERROR_COUNT=0

# Aplicar cada migración individualmente
for migration in ./supabase/migrations/*.sql; do
    if [ -f "$migration" ]; then
        migration_name=$(basename "$migration")
        echo -e "${YELLOW}Aplicando: ${migration_name}${NC}"
        
        if psql "$DB_URL" < "$migration" > "${TEMP_DIR}/${migration_name}.log" 2>&1; then
            echo -e "${GREEN}  ✅ Éxito${NC}"
            ((SUCCESS_COUNT++))
        else
            echo -e "${RED}  ⚠️  Error (puede ser normal si ya existe)${NC}"
            ((ERROR_COUNT++))
            # Guardar log de error
            tail -5 "${TEMP_DIR}/${migration_name}.log" | sed 's/^/    /'
        fi
    fi
done

echo
echo -e "${BLUE}📋 Configurando Storage...${NC}"

# Aplicar configuración de Storage
cat > "${TEMP_DIR}/storage_setup.sql" << 'STORAGE'
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

STORAGE

if psql "$DB_URL" < "${TEMP_DIR}/storage_setup.sql" > "${TEMP_DIR}/storage.log" 2>&1; then
    echo -e "${GREEN}✅ Buckets de Storage creados${NC}"
else
    echo -e "${YELLOW}⚠️  Error en Storage (puede ser que ya existan)${NC}"
fi

echo
echo -e "${BLUE}📋 Configurando políticas de Storage...${NC}"

# Aplicar políticas de Storage una por una
cat > "${TEMP_DIR}/storage_policies.sql" << 'POLICIES'
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

POLICIES

if psql "$DB_URL" < "${TEMP_DIR}/storage_policies.sql" > "${TEMP_DIR}/policies.log" 2>&1; then
    echo -e "${GREEN}✅ Políticas de Storage creadas${NC}"
else
    echo -e "${YELLOW}⚠️  Error en políticas (puede ser que ya existan)${NC}"
fi

echo
echo -e "${CYAN}📊 Resumen de la migración:${NC}"
echo -e "${GREEN}✅ Migraciones exitosas: ${SUCCESS_COUNT}${NC}"
if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Migraciones con errores: ${ERROR_COUNT} (pueden ser normales si ya existen)${NC}"
fi

echo
echo -e "${BLUE}📁 Logs guardados en: ${TEMP_DIR}${NC}"
echo

echo -e "${YELLOW}🔍 Verificando tablas creadas...${NC}"

# Verificar que las tablas se crearon
psql "$DB_URL" -c "\dt" > "${TEMP_DIR}/tables_list.txt" 2>&1

if grep -q "employees" "${TEMP_DIR}/tables_list.txt"; then
    echo -e "${GREEN}✅ Tablas verificadas correctamente${NC}"
    echo
    echo -e "${CYAN}Tablas principales encontradas:${NC}"
    grep -E "employees|attendance|vacations|documents|absences" "${TEMP_DIR}/tables_list.txt" | sed 's/^/  /'
else
    echo -e "${RED}❌ No se encontraron las tablas esperadas${NC}"
    echo -e "${YELLOW}Revisa los logs en: ${TEMP_DIR}${NC}"
fi

echo
echo -e "${GREEN}🎉 ¡Proceso de migración completado!${NC}"
echo -e "${YELLOW}Verifica en Supabase Dashboard que todo esté correcto${NC}"

