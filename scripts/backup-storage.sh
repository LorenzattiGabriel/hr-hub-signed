#!/bin/bash

# Script para Backup de Archivos de Storage
# Descarga todos los archivos de los buckets de Supabase

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ID="hrharsnbombcmwixrgpo"
STORAGE_BACKUP_DIR="./storage-backup/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}📁 Iniciando backup de archivos de Storage...${NC}"

# Crear directorio
mkdir -p "${STORAGE_BACKUP_DIR}"

# Lista de buckets a respaldar
BUCKETS=("documents" "avicola" "bd_backup")

for bucket in "${BUCKETS[@]}"; do
    echo -e "\n${GREEN}📦 Respaldando bucket: ${bucket}${NC}"
    
    # Crear directorio para el bucket
    mkdir -p "${STORAGE_BACKUP_DIR}/${bucket}"
    
    # Intentar listar archivos en el bucket
    echo "Listando archivos en bucket ${bucket}..."
    
    # Nota: Este comando requiere que tengas configurado supabase CLI con las credenciales correctas
    # Como alternativa, puedes usar la API REST de Supabase
    
    # Crear script Python para descargar archivos usando la API
    cat > "${STORAGE_BACKUP_DIR}/download_${bucket}.py" << EOF
import requests
import os
import json
from urllib.parse import urljoin

# Configuración
SUPABASE_URL = "https://${PROJECT_ID}.supabase.co"
# Necesitarás configurar tu SERVICE_ROLE_KEY
SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY_HERE"

bucket_name = "${bucket}"
download_dir = "./${bucket}/"

headers = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

# Listar archivos en el bucket
list_url = f"{SUPABASE_URL}/storage/v1/object/list/{bucket_name}"
response = requests.post(list_url, headers=headers, json={})

if response.status_code == 200:
    files = response.json()
    print(f"Encontrados {len(files)} archivos en bucket {bucket_name}")
    
    for file_info in files:
        if file_info.get('name'):
            file_name = file_info['name']
            print(f"Descargando: {file_name}")
            
            # Descargar archivo
            download_url = f"{SUPABASE_URL}/storage/v1/object/{bucket_name}/{file_name}"
            file_response = requests.get(download_url, headers=headers)
            
            if file_response.status_code == 200:
                # Crear directorio si no existe
                os.makedirs(os.path.dirname(f"{download_dir}/{file_name}"), exist_ok=True)
                
                # Guardar archivo
                with open(f"{download_dir}/{file_name}", 'wb') as f:
                    f.write(file_response.content)
                print(f"✅ Descargado: {file_name}")
            else:
                print(f"❌ Error descargando {file_name}: {file_response.status_code}")
else:
    print(f"❌ Error listando archivos del bucket {bucket_name}: {response.status_code}")
    print(response.text)
EOF

    echo -e "${YELLOW}📝 Script de descarga creado: download_${bucket}.py${NC}"
    echo -e "${YELLOW}⚠️ Necesitas configurar SERVICE_ROLE_KEY en el script${NC}"
done

# Crear script de configuración
cat > "${STORAGE_BACKUP_DIR}/configure_and_run.sh" << 'CONFIG_EOF'
#!/bin/bash

echo "🔧 Configuración de Backup de Storage"
echo
echo "Pasos para completar el backup:"
echo
echo "1. Ve a tu proyecto Supabase > Settings > API"
echo "2. Copia tu 'service_role' key (¡MANTÉN SECRETA!)"
echo "3. Instala requests de Python:"
echo "   pip install requests"
echo
echo "4. Para cada bucket, edita el archivo download_[BUCKET].py:"
echo "   - Reemplaza 'YOUR_SERVICE_ROLE_KEY_HERE' con tu service_role key"
echo
echo "5. Ejecuta cada script:"
echo "   python download_documents.py"
echo "   python download_avicola.py"
echo "   python download_bd_backup.py"
echo
echo "⚠️ IMPORTANTE: Nunca subas la service_role key a Git!"

# Hacer ejecutables todos los scripts Python
find . -name "download_*.py" -exec chmod +x {} \;

CONFIG_EOF

chmod +x "${STORAGE_BACKUP_DIR}/configure_and_run.sh"

# Crear archivo de inventario
cat > "${STORAGE_BACKUP_DIR}/STORAGE_INVENTORY.md" << 'INVENTORY_EOF'
# Inventario de Storage Backup

## Buckets Respaldados

### 1. documents
- **Propósito**: Documentos PDF generados por la aplicación
- **Público**: Sí
- **Tipos permitidos**: PDF
- **Tamaño máximo**: 10MB por archivo

### 2. avicola  
- **Propósito**: Archivos específicos del cliente avícola
- **Público**: Sí
- **Tipos permitidos**: PDF
- **Tamaño máximo**: 10MB por archivo

### 3. bd_backup
- **Propósito**: Backups automáticos de base de datos
- **Público**: No
- **Tipos permitidos**: JSON, texto plano
- **Tamaño máximo**: 50MB por archivo

## Instrucciones de Restauración

### Para restaurar archivos en nuevo proyecto:

1. **Crear buckets** (ya incluido en scripts principales)
2. **Subir archivos manualmente** a través del Dashboard de Supabase
3. **O usar script de subida automática** (crear según necesidad)

### Script de subida automática:
```python
import requests
import os

# Configurar con nuevo proyecto
SUPABASE_URL = "https://NUEVO_PROJECT_ID.supabase.co"
SERVICE_ROLE_KEY = "NUEVA_SERVICE_ROLE_KEY"

# Subir archivos...
```

## Notas Importantes

- Los archivos de storage NO se incluyen en los dumps SQL normales
- Es importante respaldar storage por separado
- Para nuevos clientes, usualmente NO necesitas copiar archivos existentes
- Solo copia archivos si migras un cliente existente

INVENTORY_EOF

echo -e "\n${GREEN}✅ Backup de Storage configurado!${NC}"
echo -e "${BLUE}📁 Ubicación: ${STORAGE_BACKUP_DIR}${NC}"
echo -e "\n${YELLOW}Para completar el backup:${NC}"
echo -e "1. cd ${STORAGE_BACKUP_DIR}"
echo -e "2. ./configure_and_run.sh"
echo -e "3. Sigue las instrucciones mostradas"
echo -e "\n${YELLOW}💡 Nota: Para nuevos clientes generalmente NO necesitas copiar archivos existentes${NC}"

