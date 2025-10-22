#!/bin/bash

# Script de Backup Completo para Supabase
# Genera backup del schema, datos, configuraciones de Storage, políticas RLS y Edge Functions

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
PROJECT_ID="hrharsnbombcmwixrgpo"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
BACKUP_NAME="avicola_backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}🔄 Iniciando backup completo del proyecto Supabase...${NC}"
echo -e "${YELLOW}Proyecto ID: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Directorio de backup: ${BACKUP_DIR}${NC}"

# Crear directorio de backup
mkdir -p "${BACKUP_DIR}"

echo -e "\n${GREEN}📋 1. Generando backup del schema (estructura de tablas)...${NC}"
supabase db dump --project-id="${PROJECT_ID}" --schema public > "${BACKUP_DIR}/schema.sql"

echo -e "\n${GREEN}📊 2. Generando backup de datos...${NC}"
supabase db dump --project-id="${PROJECT_ID}" --data-only > "${BACKUP_DIR}/data.sql"

echo -e "\n${GREEN}🔐 3. Generando backup de políticas RLS y funciones...${NC}"
supabase db dump --project-id="${PROJECT_ID}" --schema auth,storage > "${BACKUP_DIR}/auth_storage.sql"

echo -e "\n${GREEN}⚙️ 4. Exportando configuraciones de Storage...${NC}"
# Crear archivo de configuración de buckets
cat > "${BACKUP_DIR}/storage_config.sql" << 'EOF'
-- Storage Buckets Configuration
-- Ejecutar después de crear el proyecto

-- Crear bucket 'documents' para documentos PDF
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760, -- 10MB
  ARRAY['application/pdf']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Crear bucket 'avicola' (si se usa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avicola',
  'avicola',
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
CREATE POLICY "Permitir lectura pública de documentos" ON storage.objects 
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Permitir subida autenticada de documentos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Permitir actualización autenticada de documentos" ON storage.objects 
FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Permitir eliminación autenticada de documentos" ON storage.objects 
FOR DELETE USING (bucket_id = 'documents');

-- Políticas de Storage para bucket 'avicola' (si se usa)
CREATE POLICY "Permitir lectura pública de avicola" ON storage.objects 
FOR SELECT USING (bucket_id = 'avicola');

CREATE POLICY "Permitir subida autenticada de avicola" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'avicola');

CREATE POLICY "Permitir actualización autenticada de avicola" ON storage.objects 
FOR UPDATE USING (bucket_id = 'avicola');

CREATE POLICY "Permitir eliminación autenticada de avicola" ON storage.objects 
FOR DELETE USING (bucket_id = 'avicola');

-- Políticas de Storage para bucket 'bd_backup'
CREATE POLICY "Solo servicios pueden acceder a backups" ON storage.objects 
FOR ALL USING (bucket_id = 'bd_backup' AND auth.role() = 'service_role');

EOF

echo -e "\n${GREEN}📦 5. Copiando migraciones existentes...${NC}"
cp -r ./supabase/migrations "${BACKUP_DIR}/"

echo -e "\n${GREEN}🔧 6. Exportando configuración del proyecto...${NC}"
cp ./supabase/config.toml "${BACKUP_DIR}/"

# Crear archivo de configuración adicional
cat > "${BACKUP_DIR}/project_config.json" << EOF
{
  "project_id": "${PROJECT_ID}",
  "backup_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "1.0",
  "description": "Backup completo del proyecto HR Hub - Avícola",
  "tables": [
    "employees",
    "attendance",
    "vacations",
    "absences",
    "documents",
    "performance_evaluations",
    "training_programs",
    "training_completions",
    "uniforms",
    "payroll"
  ],
  "storage_buckets": [
    "documents",
    "avicola",
    "bd_backup"
  ],
  "features": [
    "RLS enabled",
    "Storage policies",
    "Authentication",
    "Real-time subscriptions"
  ]
}
EOF

echo -e "\n${GREEN}🎯 7. Generando Edge Functions (si existen)...${NC}"
if [ -d "./supabase/functions" ]; then
  cp -r ./supabase/functions "${BACKUP_DIR}/"
  echo -e "${GREEN}✅ Edge Functions copiadas${NC}"
else
  echo -e "${YELLOW}⚠️ No se encontraron Edge Functions${NC}"
fi

echo -e "\n${GREEN}📝 8. Generando scripts de restauración...${NC}"

# Script de restauración
cat > "${BACKUP_DIR}/restore.sh" << 'RESTORE_EOF'
#!/bin/bash

# Script de Restauración para nuevo proyecto Supabase
set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 Iniciando restauración en nuevo proyecto Supabase...${NC}"

# Verificar que se proporcione el PROJECT_ID
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar el PROJECT_ID del nuevo proyecto${NC}"
    echo -e "${YELLOW}Uso: ./restore.sh <PROJECT_ID>${NC}"
    exit 1
fi

NEW_PROJECT_ID="$1"
echo -e "${YELLOW}Restaurando en proyecto: ${NEW_PROJECT_ID}${NC}"

echo -e "\n${GREEN}1. Aplicando schema (estructura de tablas)...${NC}"
supabase db push --project-id="${NEW_PROJECT_ID}" --include-all < schema.sql

echo -e "\n${GREEN}2. Configurando Storage buckets...${NC}"
psql "postgresql://postgres:[PASSWORD]@db.${NEW_PROJECT_ID}.supabase.co:5432/postgres" < storage_config.sql

echo -e "\n${GREEN}3. Importando datos...${NC}"
psql "postgresql://postgres:[PASSWORD]@db.${NEW_PROJECT_ID}.supabase.co:5432/postgres" < data.sql

echo -e "\n${GREEN}4. Aplicando configuraciones de auth y storage...${NC}"
psql "postgresql://postgres:[PASSWORD]@db.${NEW_PROJECT_ID}.supabase.co:5432/postgres" < auth_storage.sql

if [ -d "./functions" ]; then
    echo -e "\n${GREEN}5. Desplegando Edge Functions...${NC}"
    for func_dir in ./functions/*/; do
        func_name=$(basename "$func_dir")
        echo -e "${BLUE}Desplegando función: ${func_name}${NC}"
        supabase functions deploy "${func_name}" --project-id="${NEW_PROJECT_ID}"
    done
fi

echo -e "\n${GREEN}✅ Restauración completada exitosamente!${NC}"
echo -e "${YELLOW}Recuerda:${NC}"
echo -e "1. Actualizar las variables de entorno en tu aplicación"
echo -e "2. Verificar las políticas RLS"
echo -e "3. Configurar la autenticación si es necesario"
echo -e "4. Reemplazar [PASSWORD] con la contraseña real de la base de datos"

RESTORE_EOF

chmod +x "${BACKUP_DIR}/restore.sh"

# Crear README con instrucciones
cat > "${BACKUP_DIR}/README.md" << 'README_EOF'
# Backup Completo HR Hub - Avícola

Este backup contiene toda la estructura y configuración necesaria para replicar el proyecto HR Hub en nuevos clientes.

## Contenido del Backup

- `schema.sql` - Estructura completa de la base de datos
- `data.sql` - Todos los datos existentes (opcional para nuevos clientes)
- `storage_config.sql` - Configuración de buckets de Storage
- `auth_storage.sql` - Configuraciones de autenticación y storage
- `migrations/` - Todas las migraciones de la base de datos
- `functions/` - Edge Functions (si existen)
- `config.toml` - Configuración del proyecto Supabase
- `project_config.json` - Metadatos del backup
- `restore.sh` - Script automatizado de restauración

## Cómo Restaurar en un Nuevo Proyecto

### Paso 1: Crear nuevo proyecto en Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto
3. Anota el PROJECT_ID del nuevo proyecto

### Paso 2: Configurar Supabase CLI
```bash
# Instalar Supabase CLI si no lo tienes
npm install -g supabase

# Login en Supabase
supabase login
```

### Paso 3: Restaurar automáticamente
```bash
# Ejecutar script de restauración
./restore.sh <NUEVO_PROJECT_ID>
```

### Paso 4: Restauración manual (alternativa)

Si prefieres hacerlo paso a paso:

```bash
# 1. Aplicar schema
supabase db push --project-id="NUEVO_PROJECT_ID" --include-all < schema.sql

# 2. Configurar Storage
psql "postgresql://postgres:[PASSWORD]@db.NUEVO_PROJECT_ID.supabase.co:5432/postgres" < storage_config.sql

# 3. Importar datos (opcional para nuevos clientes)
psql "postgresql://postgres:[PASSWORD]@db.NUEVO_PROJECT_ID.supabase.co:5432/postgres" < data.sql

# 4. Aplicar configuraciones adicionales
psql "postgresql://postgres:[PASSWORD]@db.NUEVO_PROJECT_ID.supabase.co:5432/postgres" < auth_storage.sql
```

### Paso 5: Configurar aplicación
1. Actualiza las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Despliega la aplicación React
3. Verifica que todo funcione correctamente

## Personalización para Nuevos Clientes

### Para personalizar para un nuevo cliente:
1. **NO importes `data.sql`** (para empezar con base limpia)
2. Actualiza logos y branding en la aplicación React
3. Configura dominios personalizados si es necesario
4. Ajusta las políticas RLS según los requisitos del cliente

## Estructura de Tablas Incluidas
- `employees` - Empleados
- `attendance` - Asistencia
- `vacations` - Vacaciones
- `absences` - Ausencias
- `documents` - Documentos
- `performance_evaluations` - Evaluaciones de desempeño
- `training_programs` - Programas de capacitación
- `training_completions` - Capacitaciones completadas
- `uniforms` - Uniformes
- `payroll` - Nómina

## Buckets de Storage
- `documents` - Documentos PDF generados
- `avicola` - Archivos específicos (si se usa)
- `bd_backup` - Backups automáticos

## Soporte
Si necesitas ayuda con la restauración, contacta al equipo de desarrollo.

README_EOF

echo -e "\n${GREEN}🗜️ 9. Comprimiendo backup...${NC}"
cd ./backups
tar -czf "${BACKUP_NAME}.tar.gz" "$(basename "${BACKUP_DIR}")"
cd ..

echo -e "\n${GREEN}✅ Backup completo generado exitosamente!${NC}"
echo -e "${BLUE}📁 Ubicación: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}📦 Archivo comprimido: ./backups/${BACKUP_NAME}.tar.gz${NC}"
echo -e "\n${YELLOW}Para restaurar en un nuevo proyecto:${NC}"
echo -e "1. Extrae el archivo: tar -xzf ${BACKUP_NAME}.tar.gz"
echo -e "2. Ve al directorio extraído"
echo -e "3. Ejecuta: ./restore.sh <NUEVO_PROJECT_ID>"
echo -e "\n${GREEN}🎉 Listo para replicar en otros clientes!${NC}"

