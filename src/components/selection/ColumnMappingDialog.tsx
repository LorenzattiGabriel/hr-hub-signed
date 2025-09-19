import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ColumnMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excelHeaders: string[];
  excelData: any[][];
  onConfirmMapping: (mapping: Record<string, string>) => void;
}

interface FieldDefinition {
  key: string;
  label: string;
  required: boolean;
  description: string;
}

const CANDIDATE_FIELDS: FieldDefinition[] = [
  { key: 'nombre_apellido', label: 'Nombre y Apellido', required: true, description: 'Nombre completo del candidato' },
  { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento', required: false, description: 'Formato: DD/MM/YYYY o YYYY-MM-DD' },
  { key: 'edad', label: 'Edad', required: false, description: 'Edad en años (número)' },
  { key: 'sexo', label: 'Sexo', required: false, description: 'Masculino, Femenino, Otro' },
  { key: 'localidad', label: 'Localidad', required: false, description: 'Ciudad o localidad de residencia' },
  { key: 'vacante_postulada', label: 'Vacante Postulada', required: false, description: 'Puesto al que se postula' },
  { key: 'mail', label: 'Email', required: false, description: 'Correo electrónico' },
  { key: 'numero_contacto', label: 'Número de Contacto', required: false, description: 'Teléfono o celular' },
  { key: 'experiencia_laboral', label: 'Experiencia Laboral', required: false, description: 'Historial laboral del candidato' },
  { key: 'conocimientos_habilidades', label: 'Conocimientos y Habilidades', required: false, description: 'Skills técnicos y competencias' },
  { key: 'observaciones_reclutador', label: 'Observaciones del Reclutador', required: false, description: 'Notas del proceso de selección' },
  { key: 'tipo_jornada_buscada', label: 'Tipo de Jornada Buscada', required: false, description: 'Full-time, Part-time, etc.' },
  { key: 'disponibilidad', label: 'Disponibilidad', required: false, description: 'Cuándo puede comenzar' },
  { key: 'referencias_laborales', label: 'Referencias Laborales', required: false, description: 'Contactos de empleos anteriores' }
];

export const ColumnMappingDialog: React.FC<ColumnMappingDialogProps> = ({
  open,
  onOpenChange,
  excelHeaders,
  excelData,
  onConfirmMapping
}) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleMappingChange = (fieldKey: string, excelColumn: string) => {
    setMapping(prev => ({
      ...prev,
      [fieldKey]: excelColumn === 'none' ? '' : excelColumn
    }));
  };

  const getMappedFieldsCount = () => {
    return Object.values(mapping).filter(value => value !== '').length;
  };

  const getRequiredFieldsMapped = () => {
    const requiredFields = CANDIDATE_FIELDS.filter(field => field.required);
    return requiredFields.filter(field => mapping[field.key] && mapping[field.key] !== '').length;
  };

  const getTotalRequiredFields = () => {
    return CANDIDATE_FIELDS.filter(field => field.required).length;
  };

  const isColumnUsed = (columnIndex: string) => {
    return Object.values(mapping).includes(columnIndex);
  };

  const canConfirm = () => {
    const requiredMapped = getRequiredFieldsMapped();
    const totalRequired = getTotalRequiredFields();
    return requiredMapped === totalRequired;
  };

  const handleConfirm = () => {
    // Crear el mapeo inverso: índice de columna -> campo del sistema
    const inverseMapping: Record<string, string> = {};
    Object.entries(mapping).forEach(([fieldKey, columnIndex]) => {
      if (columnIndex !== '') {
        inverseMapping[columnIndex] = fieldKey;
      }
    });
    onConfirmMapping(inverseMapping);
  };

  const getPreviewValue = (columnIndex: string) => {
    if (!columnIndex || columnIndex === '') return 'N/A';
    const idx = parseInt(columnIndex);
    if (excelData.length > 1 && excelData[1][idx] !== undefined) {
      const value = excelData[1][idx];
      return value ? value.toString().substring(0, 30) + (value.toString().length > 30 ? '...' : '') : 'Vacío';
    }
    return 'N/A';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mapear Columnas del Excel</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Estado del mapeo */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {canConfirm() ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
              <span className="font-medium">
                Estado: {getMappedFieldsCount()} campos mapeados
              </span>
            </div>
            <Badge variant={canConfirm() ? "default" : "secondary"}>
              Campos requeridos: {getRequiredFieldsMapped()}/{getTotalRequiredFields()}
            </Badge>
          </div>

          {/* Vista previa de las columnas del Excel */}
          <div>
            <Label className="text-lg font-semibold">Columnas detectadas en el Excel:</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {excelHeaders.map((header, index) => (
                <div
                  key={index}
                  className={`p-2 border rounded text-sm ${
                    isColumnUsed(index.toString()) 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="font-medium">{header || `Columna ${index + 1}`}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Ejemplo: {getPreviewValue(index.toString())}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapeo de campos */}
          <div>
            <Label className="text-lg font-semibold">Mapear a campos del sistema:</Label>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Campo del Sistema</TableHead>
                    <TableHead className="w-[200px]">Columna del Excel</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-[200px]">Vista Previa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CANDIDATE_FIELDS.map((field) => (
                    <TableRow key={field.key}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{field.label}</span>
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">
                              Requerido
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={mapping[field.key] || ''}
                          onValueChange={(value) => handleMappingChange(field.key, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar columna" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No mapear</SelectItem>
                            {excelHeaders.map((header, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {header || `Columna ${index + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {field.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        {mapping[field.key] ? (
                          <div className="p-2 bg-gray-50 rounded text-xs">
                            {getPreviewValue(mapping[field.key])}
                          </div>
                        ) : (
                          <span className="text-gray-400">No mapeado</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!canConfirm()}
              className="min-w-[120px]"
            >
              {canConfirm() ? 'Importar Datos' : 'Mapear campos requeridos'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};