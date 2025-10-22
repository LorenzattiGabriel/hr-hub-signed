# Guía Completa de Backup y Replicación - HR Hub

Esta guía te ayudará a generar backups completos de tu proyecto HR Hub y replicarlo para nuevos clientes.

## 🎯 Opciones Disponibles

### 1. Backup Completo (`backup-complete.sh`)
- **Uso**: Para migración completa o backup de seguridad
- **Incluye**: Schema + Datos existentes + Configuraciones + Storage
- **Tiempo**: ~5-10 minutos
- **Tamaño**: Más grande (incluye todos los datos)

### 2. Backup Rápido (`quick-backup.sh`)
- **Uso**: Para nuevos clientes (estructura limpia)
- **Incluye**: Solo schema + Configuraciones (sin datos existentes)
- **Tiempo**: ~2-3 minutos
- **Tamaño**: Más pequeño (ideal para nuevos proyectos)

## 🚀 Proceso de Backup

### Preparación
```bash
# 1. Asegúrate de estar logueado en Supabase
supabase login

# 2. Verifica tu proyecto actual
supabase status

# 3. Ve al directorio del proyecto
cd /Users/gabriellorenzatti/Documents/GitHub_Gabi/hr-hub-signed
```

### Ejecutar Backup

#### Para Backup Completo:
```bash
./scripts/backup-complete.sh
```

#### Para Backup Rápido (recomendado para nuevos clientes):
```bash
./scripts/quick-backup.sh
```

## 📦 Contenido del Backup

### Backup Completo incluye:
- ✅ **Schema completo** (estructura de todas las tablas)
- ✅ **Datos existentes** (todos los empleados, documentos, etc.)
- ✅ **Migraciones** (historial completo de cambios)
- ✅ **Configuración de Storage** (buckets y políticas)
- ✅ **Políticas RLS** (seguridad a nivel de fila)
- ✅ **Edge Functions** (si existen)
- ✅ **Scripts de restauración automatizados**
- ✅ **Documentación completa**

### Backup Rápido incluye:
- ✅ **Schema limpio** (estructura sin datos)
- ✅ **Migraciones esenciales**
- ✅ **Configuración básica de Storage**
- ✅ **Políticas RLS estándar**
- ✅ **Script de instalación rápida**
- ✅ **Guía de personalización**

## 🔄 Proceso de Replicación para Nuevos Clientes

### Paso 1: Crear Nuevo Proyecto Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Clic en "New Project"
3. Completa:
   - **Name**: HR Hub - [Nombre del Cliente]
   - **Database Password**: (anota esta contraseña)
   - **Region**: Selecciona la más cercana al cliente
   - **Plan**: Free o Pro según necesidades
4. Espera a que se cree el proyecto (2-3 minutos)
5. **Anota el PROJECT_ID** (aparece en la URL)

### Paso 2: Restaurar usando Backup Rápido (Recomendado)
```bash
# 1. Extrae el backup
cd quick-backup/[FECHA_BACKUP]

# 2. Ejecuta la instalación
./install_for_new_client.sh <NUEVO_PROJECT_ID>

# 3. Ejecuta configuración manual en Supabase Dashboard
# - Ve a SQL Editor
# - Copia y pega el contenido de setup_new_client.sql
# - Ejecuta
```

### Paso 3: Configurar Aplicación React
```bash
# 1. Copia el proyecto React para el nuevo cliente
cp -r hr-hub-signed hr-hub-[CLIENTE]

# 2. Actualiza variables de entorno
# Edita .env (o las variables de tu hosting)
VITE_SUPABASE_URL=https://[NUEVO_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[NUEVA_ANON_KEY]
```

### Paso 4: Personalización para el Cliente
Sigue la guía `CUSTOMIZATION_GUIDE.md` incluida en el backup para:
- Cambiar branding y logos
- Personalizar colores corporativos
- Adaptar templates de documentos
- Configurar datos iniciales

## 🔧 Restauración Manual (Alternativa)

Si prefieres control total sobre el proceso:

### 1. Schema y Estructura
```bash
# Aplicar schema
supabase db push --project-id="NUEVO_PROJECT_ID" < schema.sql
```

### 2. Configurar Storage
```sql
-- En el SQL Editor de Supabase Dashboard:

-- Crear buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', true, 10485760, ARRAY['application/pdf']::text[]),
  ('bd_backup', 'bd_backup', false, 52428800, ARRAY['application/json', 'text/plain']::text[]);

-- Políticas básicas
CREATE POLICY "Permitir lectura pública de documentos" ON storage.objects 
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Permitir subida autenticada de documentos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'documents');
```

### 3. Importar Datos (Solo si usas backup completo)
```bash
# Solo si quieres copiar datos existentes
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres" < data.sql
```

## 📋 Checklist Post-Instalación

Para cada nuevo cliente, verifica:

- [ ] Proyecto Supabase creado y configurado
- [ ] Schema aplicado correctamente
- [ ] Buckets de Storage creados
- [ ] Políticas RLS funcionando
- [ ] Aplicación React desplegada
- [ ] Variables de entorno actualizadas
- [ ] Branding personalizado
- [ ] Templates de documentos adaptados
- [ ] Usuario administrador inicial creado
- [ ] Pruebas básicas realizadas:
  - [ ] Crear empleado
  - [ ] Generar documento PDF
  - [ ] Subir/descargar archivo
  - [ ] Registrar asistencia

## 🛠️ Solución de Problemas

### Error: "Project not found"
- Verifica que el PROJECT_ID sea correcto
- Asegúrate de estar logueado: `supabase login`

### Error: "Permission denied"
- Verifica que tengas permisos de admin en el proyecto
- Revisa que las API keys sean correctas

### PDFs en blanco
- Verifica que los buckets de Storage estén creados
- Confirma que las políticas de Storage permitan subida/descarga

### Error de conexión a base de datos
- Verifica la contraseña de la base de datos
- Confirma que la URL de conexión sea correcta

## 📊 Tablas y Estructura

### Tablas Principales:
- `employees` - Información de empleados
- `attendance` - Registros de asistencia
- `vacations` - Solicitudes de vacaciones
- `absences` - Registros de ausencias
- `documents` - Documentos generados
- `performance_evaluations` - Evaluaciones de desempeño
- `training_programs` - Programas de capacitación
- `training_completions` - Capacitaciones completadas
- `uniforms` - Control de uniformes
- `payroll` - Información de nómina

### Buckets de Storage:
- `documents` - PDFs generados (público)
- `bd_backup` - Backups automáticos (privado)

## 🔄 Mantenimiento

### Backups Regulares
Ejecuta backups periódicamente:
```bash
# Backup mensual completo
./scripts/backup-complete.sh

# Backup semanal de estructura (para actualizaciones)
./scripts/quick-backup.sh
```

### Actualizaciones
Para aplicar actualizaciones a clientes existentes:
1. Genera nuevo backup rápido
2. Aplica solo las nuevas migraciones
3. Actualiza la aplicación React

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs de error en Supabase Dashboard
2. Verifica la configuración paso a paso
3. Consulta la documentación de Supabase
4. Contacta al equipo de desarrollo

---

**✨ ¡Listo para escalar HR Hub a múltiples clientes!**
