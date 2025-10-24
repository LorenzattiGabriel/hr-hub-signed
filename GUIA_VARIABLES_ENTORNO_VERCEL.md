# Guía Completa: Variables de Entorno en Vercel

Esta guía te ayudará a reemplazar las URLs hardcodeadas de la base de datos por variables de entorno en Vercel.

## 🎯 Ventajas de usar Variables de Entorno

- ✅ **Seguridad**: Las credenciales no están en el código
- ✅ **Flexibilidad**: Diferentes valores por branch/entorno
- ✅ **Mantenimiento**: Cambios sin modificar código
- ✅ **Buenas prácticas**: Estándar de la industria

---

## 📋 Paso 1: Modificar el Código

### 1.1 Actualizar `src/integrations/supabase/client.ts`

**Archivo actual (hardcodeado):**
```typescript
const SUPABASE_URL = "https://yclgjkwvbytmkrpdsrqv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGci...";
```

**Cambiar a:**
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación (opcional pero recomendada)
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}
```

### 1.2 Crear archivo `.env.example` (template)

Crea este archivo en la raíz del proyecto:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 1.3 Actualizar `.gitignore`

Asegúrate que `.env` esté en `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production
```

---

## 🚀 Paso 2: Configurar Variables en Vercel

### 2.1 Acceder a tu Proyecto en Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `hr-hub-signed`
3. Haz clic en **Settings** (⚙️)

### 2.2 Agregar Variables de Entorno

1. En el menú lateral, haz clic en **Environment Variables**
2. Verás un formulario con tres campos:
   - **Name**: Nombre de la variable
   - **Value**: Valor de la variable
   - **Environment**: Dónde aplicar (Production, Preview, Development)

### 2.3 Configurar Variables por Branch

#### Para la Branch **Vematel**:

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://yclgjkwvbytmkrpdsrqv.supabase.co
Environment: ☑ Preview (selecciona solo Preview)
Branch: Vematel
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbGdqa3d2Ynl0bWtycGRzcnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzQ2OTQsImV4cCI6MjA3NjY1MDY5NH0.4rTY8MIK3DIDOQPDFanjmycpoH74377bdJd8ATPOMas
Environment: ☑ Preview (selecciona solo Preview)
Branch: Vematel
```

#### Para la Branch **Fabricius**:

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://exdsdocotrqisoijaahh.supabase.co
Environment: ☑ Preview
Branch: Fabricius
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZHNkb2NvdHJxaXNvaWphYWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzI1NTMsImV4cCI6MjA3NjY0ODU1M30.HV2sZ8sIui80V4hns6HeUy0SfDmRzLsdJyjYNnjW8Js
Environment: ☑ Preview
Branch: Fabricius
```

#### Para la Branch **main** (Avícola):

**Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://hrharsnbombcmwixrgpo.supabase.co
Environment: ☑ Production ☑ Preview
Branch: main
```

**Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaGFyc25ib21iY213aXhyZ3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjQwODAsImV4cCI6MjA3MzEwMDA4MH0.YgTdgAjbrd6ZWI26Fw_nXOWxLCj3K6pCMJb1gSysSzI
Environment: ☑ Production ☑ Preview
Branch: main
```

### 2.4 Captura de pantalla de cómo se ve:

```
┌─────────────────────────────────────────────────────────────┐
│ Environment Variables                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Name: VITE_SUPABASE_URL                                     │
│ Value: https://yclgjkwvbytmkrpdsrqv.supabase.co            │
│                                                              │
│ Environment:                                                 │
│ ☐ Production  ☑ Preview  ☐ Development                     │
│                                                              │
│ Branch (optional): Vematel                                   │
│                                                              │
│ [Add]                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Paso 3: Actualizar el Código en Cada Branch

### 3.1 Para Branch Vematel:

```bash
# Asegúrate de estar en la branch correcta
git checkout Vematel

# Edita el archivo src/integrations/supabase/client.ts
# (ver código en Paso 1.1)

# Commit y push
git add src/integrations/supabase/client.ts .env.example
git commit -m "refactor: Usar variables de entorno para credenciales Supabase"
git push origin Vematel
```

### 3.2 Para Branch Fabricius:

```bash
git checkout Fabricius
# Hacer los mismos cambios
git add src/integrations/supabase/client.ts .env.example
git commit -m "refactor: Usar variables de entorno para credenciales Supabase"
git push origin Fabricius
```

### 3.3 Para Branch main (Avícola):

```bash
git checkout main
# Hacer los mismos cambios
git add src/integrations/supabase/client.ts .env.example
git commit -m "refactor: Usar variables de entorno para credenciales Supabase"
git push origin main
```

---

## ✅ Paso 4: Verificar el Deployment

### 4.1 Después de hacer push:

1. Ve a tu proyecto en Vercel
2. Verás un nuevo deployment iniciándose
3. Haz clic en el deployment
4. Verifica que se complete exitosamente

### 4.2 Si hay errores:

1. Ve a **Deployments** > [tu deployment] > **Build Logs**
2. Busca errores relacionados con variables de entorno
3. Verifica que las variables estén correctamente configuradas

### 4.3 Probar la aplicación:

1. Abre la URL del deployment
2. Intenta hacer login
3. Verifica que pueda conectarse a la base de datos

---

## 🔧 Desarrollo Local

### Para trabajar localmente:

1. **Crea archivo `.env` en la raíz del proyecto:**

```env
# Para Vematel (ejemplo)
VITE_SUPABASE_URL=https://yclgjkwvbytmkrpdsrqv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbGdqa3d2Ynl0bWtycGRzcnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzQ2OTQsImV4cCI6MjA3NjY1MDY5NH0.4rTY8MIK3DIDOQPDFanjmycpoH74377bdJd8ATPOMas
```

2. **Reinicia el servidor de desarrollo:**

```bash
npm run dev
```

3. **Vite cargará automáticamente las variables de `.env`**

---

## 📝 Resumen de Variables por Branch

| Branch | VITE_SUPABASE_URL | Entorno Vercel |
|--------|-------------------|----------------|
| **main** (Avícola) | `hrharsnbombcmwixrgpo.supabase.co` | Production + Preview |
| **Fabricius** | `exdsdocotrqisoijaahh.supabase.co` | Preview (Branch: Fabricius) |
| **Vematel** | `yclgjkwvbytmkrpdsrqv.supabase.co` | Preview (Branch: Vematel) |

---

## 🚨 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solución:**
1. Verifica que las variables estén en Vercel
2. Asegúrate que el nombre sea exactamente `VITE_SUPABASE_URL` (con prefijo `VITE_`)
3. Redeploy el proyecto en Vercel

### Error: "Failed to connect to Supabase"

**Solución:**
1. Verifica que la URL sea correcta
2. Verifica que el ANON_KEY sea válido
3. Revisa los logs del deployment en Vercel

### Las variables no se actualizan

**Solución:**
1. Después de cambiar variables en Vercel, debes hacer un **Redeploy**
2. Ve a Deployments > [...] > Redeploy

---

## 🎯 Ventajas de esta Configuración

✅ **Seguridad**: Credenciales no están en el código
✅ **Flexibilidad**: Cada branch usa su propia base de datos
✅ **Mantenimiento**: Cambios sin tocar código
✅ **Escalabilidad**: Fácil agregar más clientes
✅ **Profesional**: Estándar de la industria

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica que las variables estén correctamente escritas
3. Asegúrate que el prefijo `VITE_` esté presente
4. Verifica que `.env` esté en `.gitignore`

---

**¡Listo! Ahora tu aplicación usa variables de entorno de forma profesional y segura.**


