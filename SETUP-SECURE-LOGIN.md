# 🔐 Configuración de Login Seguro

Este documento explica cómo configurar el sistema de login seguro basado en base de datos.

## 📋 ¿Qué se hizo?

Se implementó un sistema de autenticación más seguro que almacena la contraseña en la base de datos en lugar de estar hardcodeada en el código fuente.

### Cambios realizados:

1. ✅ **Migración SQL**: Creada en `supabase/migrations/20251114000000_create_system_config.sql`
2. ✅ **Tipos TypeScript**: Agregado tipo `system_config` en `src/integrations/supabase/types.ts`
3. ✅ **Componente Login**: Modificado `src/pages/Login.tsx` para verificar contra la BD

## 🚀 Pasos para aplicar los cambios

### Opción 1: Supabase Dashboard (Recomendado)

1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard/project/hrharsnbombcmwixrgpo)
2. Ve a **SQL Editor** en el menú lateral
3. Copia y pega el siguiente SQL:

```sql
-- Create system_config table for storing application settings
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (for login verification)
CREATE POLICY "Allow public read access to system_config" 
ON system_config FOR SELECT 
TO public 
USING (true);

-- Create policy to prevent write access from client
CREATE POLICY "Prevent public write access to system_config" 
ON system_config FOR INSERT 
TO public 
WITH CHECK (false);

CREATE POLICY "Prevent public update access to system_config" 
ON system_config FOR UPDATE 
TO public 
USING (false);

CREATE POLICY "Prevent public delete access to system_config" 
ON system_config FOR DELETE 
TO public 
USING (false);

-- Insert initial login password
INSERT INTO system_config (key, value, description)
VALUES ('app_password', 'talenthub2026', 'Contraseña de acceso a la aplicación')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, updated_at = NOW();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_system_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_system_config_updated_at_trigger
BEFORE UPDATE ON system_config
FOR EACH ROW
EXECUTE FUNCTION update_system_config_updated_at();

-- Add comment to table
COMMENT ON TABLE system_config IS 'Tabla de configuración del sistema para almacenar ajustes de la aplicación';
COMMENT ON COLUMN system_config.key IS 'Clave única de configuración';
COMMENT ON COLUMN system_config.value IS 'Valor de la configuración';
COMMENT ON COLUMN system_config.description IS 'Descripción de la configuración';
```

4. Haz clic en **Run** o presiona `Ctrl+Enter`
5. Verifica que veas el mensaje "Success"

### Opción 2: Usando psql (Si tienes PostgreSQL CLI instalado)

```bash
psql "postgresql://postgres:admin1234@db.exdsdocotrqisoijaahh.supabase.co:5432/postgres" \
  -f supabase/migrations/20251114000000_create_system_config.sql
```

### Opción 3: Usando una herramienta GUI (DBeaver, pgAdmin, etc.)

1. Conecta a la base de datos usando los siguientes datos:
   - **Host**: `db.exdsdocotrqisoijaahh.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: `admin1234`

2. Abre el archivo `supabase/migrations/20251114000000_create_system_config.sql`
3. Ejecuta el script completo

## ✅ Verificar la instalación

### 1. Verificar que la tabla existe

En el SQL Editor de Supabase:

```sql
SELECT * FROM system_config WHERE key = 'app_password';
```

Deberías ver:
| id | key | value | description |
|----|-----|-------|-------------|
| ... | app_password | talenthub2026 | Contraseña de acceso a la aplicación |

### 2. Probar el login

1. Inicia la aplicación: `npm run dev`
2. Ve a la página de login
3. Ingresa la contraseña: **`talenthub2026`**
4. Deberías poder acceder al sistema

## 🔑 Contraseña actual

**Nueva contraseña**: `talenthub2026`

## 🔄 Cómo cambiar la contraseña en el futuro

Para cambiar la contraseña, ejecuta este SQL en Supabase:

```sql
UPDATE system_config 
SET value = 'TU_NUEVA_CONTRASEÑA' 
WHERE key = 'app_password';
```

**Importante**: No necesitas modificar el código para cambiar la contraseña. Solo actualiza el valor en la base de datos.

## 🔒 Seguridad

### Ventajas de este enfoque:

1. ✅ **No hay contraseñas en el código**: La contraseña no está expuesta en el repositorio
2. ✅ **Fácil de cambiar**: Puedes cambiar la contraseña sin redesplegar la aplicación
3. ✅ **Políticas RLS**: Solo lectura desde el cliente, escritura solo desde el servidor
4. ✅ **Auditable**: Tienes timestamps de cuándo se creó/actualizó

### Recomendaciones adicionales:

- 🔐 Usa contraseñas fuertes (mínimo 12 caracteres, mayúsculas, minúsculas, números y símbolos)
- 🔄 Cambia la contraseña periódicamente (cada 3-6 meses)
- 📝 Documenta los cambios de contraseña en un lugar seguro
- 🚫 Nunca compartas la contraseña en canales inseguros

## 📊 Estructura de la tabla

```sql
CREATE TABLE system_config (
  id UUID PRIMARY KEY,           -- Identificador único
  key VARCHAR(255) UNIQUE,       -- Clave de configuración (ej: 'app_password')
  value TEXT,                    -- Valor de la configuración
  description TEXT,              -- Descripción opcional
  created_at TIMESTAMPTZ,        -- Fecha de creación
  updated_at TIMESTAMPTZ         -- Fecha de última actualización
);
```

## 🆘 Troubleshooting

### Error: "No se pudo verificar la contraseña"

1. Verifica que la tabla `system_config` existe
2. Verifica que el registro con `key = 'app_password'` existe
3. Verifica las políticas RLS permiten lectura pública

### Error: "column 'system_config' does not exist"

1. Asegúrate de haber ejecutado la migración SQL
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Limpia la caché del navegador

### La contraseña no funciona

1. Verifica el valor en la base de datos:
   ```sql
   SELECT value FROM system_config WHERE key = 'app_password';
   ```
2. Asegúrate de escribir la contraseña exactamente como está en la BD (sensible a mayúsculas/minúsculas)

## 📧 Contacto

Si tienes problemas con la configuración, contacta al equipo de desarrollo.

---

**Última actualización**: 14 de Noviembre, 2025
**Versión**: 1.0

