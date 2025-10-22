#!/bin/bash

# Script Maestro de Backup - Ejecuta todo el proceso de backup
# Genera backup completo listo para replicar en nuevos clientes

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}🚀 HR Hub - Sistema Maestro de Backup y Replicación${NC}"
echo -e "${CYAN}=================================================${NC}"
echo

# Verificar que Supabase CLI esté instalado y configurado
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Error: Supabase CLI no está instalado${NC}"
    echo -e "${YELLOW}Instala con: npm install -g supabase${NC}"
    exit 1
fi

# Verificar login
if ! supabase status &> /dev/null; then
    echo -e "${YELLOW}⚠️ No estás logueado en Supabase CLI${NC}"
    echo -e "${BLUE}Ejecutando supabase login...${NC}"
    supabase login
fi

echo -e "${GREEN}✅ Supabase CLI configurado correctamente${NC}"
echo

# Menú de opciones
echo -e "${BLUE}Selecciona el tipo de backup:${NC}"
echo -e "${YELLOW}1)${NC} Backup Completo (migración/seguridad completa)"
echo -e "${YELLOW}2)${NC} Backup Rápido (para nuevos clientes - RECOMENDADO)"
echo -e "${YELLOW}3)${NC} Backup de Storage (archivos)"
echo -e "${YELLOW}4)${NC} Backup TODO (completo + storage)"
echo -e "${YELLOW}5)${NC} Solo mostrar guía de uso"
echo

read -p "Opción (1-5): " option

case $option in
    1)
        echo -e "\n${BLUE}🔄 Ejecutando Backup Completo...${NC}"
        ./scripts/backup-complete.sh
        ;;
    2)
        echo -e "\n${BLUE}⚡ Ejecutando Backup Rápido...${NC}"
        ./scripts/quick-backup.sh
        ;;
    3)
        echo -e "\n${BLUE}📁 Ejecutando Backup de Storage...${NC}"
        ./scripts/backup-storage.sh
        ;;
    4)
        echo -e "\n${BLUE}🌟 Ejecutando Backup Completo + Storage...${NC}"
        echo -e "${YELLOW}Paso 1/2: Backup de base de datos y configuración...${NC}"
        ./scripts/backup-complete.sh
        echo -e "\n${YELLOW}Paso 2/2: Backup de archivos de storage...${NC}"
        ./scripts/backup-storage.sh
        ;;
    5)
        echo -e "\n${CYAN}📖 Mostrando guía de uso...${NC}"
        cat BACKUP_REPLICATION_GUIDE.md
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

echo
echo -e "${GREEN}🎉 Proceso de backup completado!${NC}"
echo
echo -e "${CYAN}📋 Próximos pasos para replicar en nuevos clientes:${NC}"
echo -e "${YELLOW}1.${NC} Crea nuevo proyecto en Supabase Dashboard"
echo -e "${YELLOW}2.${NC} Para backup rápido: usa ./install_for_new_client.sh <PROJECT_ID>"
echo -e "${YELLOW}3.${NC} Para backup completo: usa ./restore.sh <PROJECT_ID>"
echo -e "${YELLOW}4.${NC} Personaliza branding según CUSTOMIZATION_GUIDE.md"
echo -e "${YELLOW}5.${NC} Actualiza variables de entorno en la app React"
echo -e "${YELLOW}6.${NC} Despliega la aplicación para el nuevo cliente"
echo
echo -e "${BLUE}📚 Consulta BACKUP_REPLICATION_GUIDE.md para instrucciones detalladas${NC}"
echo -e "${GREEN}✨ ¡Listo para escalar HR Hub!${NC}"

