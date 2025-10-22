#!/bin/bash

# Script Rápido de Backup - Solo estructura y configuración esencial
# Para replicación rápida en nuevos clientes (sin datos existentes)

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID="hrharsnbombcmwixrgpo"
BACKUP_DIR="./quick-backup/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}⚡ Generando backup rápido para nuevos clientes...${NC}"

mkdir -p "${BACKUP_DIR}"

echo -e "\n${GREEN}1. Exportando solo schema (sin datos)...${NC}"
supabase db dump --project-id="${PROJECT_ID}" --schema public --no-data > "${BACKUP_DIR}/schema_only.sql"

echo -e "\n${GREEN}2. Copiando migraciones...${NC}"
cp -r ./supabase/migrations "${BACKUP_DIR}/"

echo -e "\n${GREEN}3. Configuración de Storage y políticas...${NC}"
cat > "${BACKUP_DIR}/setup_new_client.sql" << 'EOF'
-- Configuración completa para nuevo cliente

-- 1. Crear buckets de Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', true, 10485760, ARRAY['application/pdf']::text[]),
  ('bd_backup', 'bd_backup', false, 52428800, ARRAY['application/json', 'text/plain']::text[])
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas para documents bucket
CREATE POLICY "Permitir lectura pública de documentos" ON storage.objects 
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Permitir subida autenticada de documentos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Permitir actualización autenticada de documentos" ON storage.objects 
FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Permitir eliminación autenticada de documentos" ON storage.objects 
FOR DELETE USING (bucket_id = 'documents');

-- 3. Políticas para bd_backup bucket
CREATE POLICY "Solo servicios pueden acceder a backups" ON storage.objects 
FOR ALL USING (bucket_id = 'bd_backup' AND auth.role() = 'service_role');

-- 4. Habilitar RLS en todas las tablas principales
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- 5. Políticas básicas RLS (permitir todo para usuarios autenticados)
-- Nota: Ajustar según los requisitos específicos de cada cliente

-- Employees
CREATE POLICY "Usuarios pueden gestionar empleados" ON employees
FOR ALL USING (auth.uid() IS NOT NULL);

-- Attendance
CREATE POLICY "Usuarios pueden gestionar asistencia" ON attendance
FOR ALL USING (auth.uid() IS NOT NULL);

-- Vacations
CREATE POLICY "Usuarios pueden gestionar vacaciones" ON vacations
FOR ALL USING (auth.uid() IS NOT NULL);

-- Absences
CREATE POLICY "Usuarios pueden gestionar ausencias" ON absences
FOR ALL USING (auth.uid() IS NOT NULL);

-- Documents
CREATE POLICY "Usuarios pueden gestionar documentos" ON documents
FOR ALL USING (auth.uid() IS NOT NULL);

-- Performance Evaluations
CREATE POLICY "Usuarios pueden gestionar evaluaciones" ON performance_evaluations
FOR ALL USING (auth.uid() IS NOT NULL);

-- Training Programs
CREATE POLICY "Usuarios pueden gestionar programas de capacitación" ON training_programs
FOR ALL USING (auth.uid() IS NOT NULL);

-- Training Completions
CREATE POLICY "Usuarios pueden gestionar completaciones de capacitación" ON training_completions
FOR ALL USING (auth.uid() IS NOT NULL);

-- Uniforms
CREATE POLICY "Usuarios pueden gestionar uniformes" ON uniforms
FOR ALL USING (auth.uid() IS NOT NULL);

-- Payroll
CREATE POLICY "Usuarios pueden gestionar nómina" ON payroll
FOR ALL USING (auth.uid() IS NOT NULL);

EOF

echo -e "\n${GREEN}4. Creando script de instalación para nuevo cliente...${NC}"
cat > "${BACKUP_DIR}/install_for_new_client.sh" << 'INSTALL_EOF'
#!/bin/bash

# Script de Instalación para Nuevo Cliente
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Proporciona el PROJECT_ID del nuevo proyecto${NC}"
    echo -e "${YELLOW}Uso: ./install_for_new_client.sh <PROJECT_ID>${NC}"
    exit 1
fi

NEW_PROJECT_ID="$1"
echo -e "${BLUE}🚀 Configurando HR Hub para nuevo cliente...${NC}"
echo -e "${YELLOW}Proyecto ID: ${NEW_PROJECT_ID}${NC}"

echo -e "\n${GREEN}1. Aplicando estructura de base de datos...${NC}"
supabase db push --project-id="${NEW_PROJECT_ID}" < schema_only.sql

echo -e "\n${GREEN}2. Configurando Storage y políticas RLS...${NC}"
# Nota: Necesitarás la contraseña de la base de datos
echo -e "${YELLOW}⚠️ Ejecuta manualmente en el SQL Editor del Dashboard:${NC}"
echo -e "${BLUE}Copia y pega el contenido de 'setup_new_client.sql'${NC}"

echo -e "\n${GREEN}✅ Estructura base instalada!${NC}"
echo -e "\n${YELLOW}Pasos adicionales:${NC}"
echo -e "1. Ejecutar setup_new_client.sql en el SQL Editor"
echo -e "2. Actualizar variables de entorno en la aplicación React"
echo -e "3. Personalizar branding para el nuevo cliente"
echo -e "4. Configurar usuarios iniciales"

INSTALL_EOF

chmod +x "${BACKUP_DIR}/install_for_new_client.sh"

echo -e "\n${GREEN}5. Creando guía de personalización...${NC}"
cat > "${BACKUP_DIR}/CUSTOMIZATION_GUIDE.md" << 'CUSTOM_EOF'
# Guía de Personalización para Nuevos Clientes

## 1. Variables de Entorno

Actualiza en tu aplicación React:

```env
VITE_SUPABASE_URL=https://[NUEVO_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[NUEVA_ANON_KEY]
```

## 2. Personalización de Branding

### Logo y Nombre de Empresa
- Reemplaza el logo en `/public/`
- Actualiza el nombre de la empresa en:
  - `src/components/layout/Header.tsx`
  - `src/pages/Index.tsx`
  - Templates de documentos PDF

### Colores y Tema
- Modifica `tailwind.config.ts` para los colores corporativos
- Actualiza `src/index.css` para estilos globales

### Templates de Documentos
- `src/utils/directPdfGenerator.ts` - Contiene los templates de PDF
- Personaliza encabezados, contenido y footers según el cliente

## 3. Configuración Específica del Cliente

### Datos Iniciales Recomendados
1. **Crear usuario administrador inicial**
2. **Configurar departamentos básicos**
3. **Definir tipos de documentos necesarios**
4. **Configurar períodos de vacaciones**

### Políticas RLS Personalizadas (Opcional)
Si el cliente requiere permisos específicos, modifica las políticas en `setup_new_client.sql`

## 4. Testing
1. Probar generación de PDFs
2. Verificar subida de archivos
3. Confirmar funcionalidad de cada módulo

## 5. Despliegue
1. Configurar dominio personalizado (opcional)
2. Configurar HTTPS
3. Configurar backups automáticos
4. Documentar credenciales y configuración para el cliente

CUSTOM_EOF

echo -e "\n${GREEN}✅ Backup rápido generado exitosamente!${NC}"
echo -e "${BLUE}📁 Ubicación: ${BACKUP_DIR}${NC}"
echo -e "\n${YELLOW}Para nuevo cliente:${NC}"
echo -e "1. Crea nuevo proyecto en Supabase"
echo -e "2. Ejecuta: ./install_for_new_client.sh <PROJECT_ID>"
echo -e "3. Sigue la guía CUSTOMIZATION_GUIDE.md"

