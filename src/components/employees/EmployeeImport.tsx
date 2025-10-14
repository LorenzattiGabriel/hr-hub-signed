import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useEmployees, type Employee } from '@/hooks/useEmployees';
import * as XLSX from 'xlsx';
interface EmployeeImportProps {
  onComplete: () => void;
  refetch?: () => Promise<void>;
}

export const EmployeeImport = ({ onComplete, refetch }: EmployeeImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { importEmployees, employees } = useEmployees();

  const parseExcelData = (data: string): Omit<Employee, 'id'>[] => {
    const lines = data.split('\n').filter(line => line.trim());
    const employees: Omit<Employee, 'id'>[] = [];

    // Buscar líneas que contengan datos de empleados (que empiecen con ACTIVO)
    for (const line of lines) {
      if (line.includes('ACTIVO')) {
        const parts = line.split('\t');
        if (parts.length >= 10) {
          // Extraer datos basados en la estructura del Excel
          const fechaIngreso = parts[1]?.trim() || '';
          const nombreCompleto = parts[2]?.trim() || '';
          const fechaNacimiento = parts[3]?.trim() || '';
          const dni = parts[4]?.trim() || '';
          const cargo = parts[5]?.trim() || '';
          const tipoContrato = parts[6]?.trim() || '';
          const telefono = parts[7]?.trim() || '';
          const email = parts[8]?.trim() || '';
          const telefonoEmergencia = parts[9]?.trim() || '';
          const contactoEmergencia = parts[10]?.trim() || '';
          const parentescoEmergencia = parts[11]?.trim() || '';
          const nivelEducativo = parts[12]?.trim() || '';
          const titulo = parts[13]?.trim() || '';
          const otrosConocimientos = parts[14]?.trim() || '';
          const grupoSanguineo = parts[15]?.trim() || '';
          const alergias = parts[16]?.trim() === 'Sí' ? 'Sí' : 'No';
          const medicacionHabitual = parts[17]?.trim() || '';
          const tieneLicencia = parts[18]?.trim() === 'Sí' ? 'si' : 'no';
          const tipoLicencia = parts[19]?.trim() || '';
          const obraSocial = parts[20]?.trim() === 'Sí' ? parts[21]?.trim() || '' : '';
          const tieneHijos = parts[23]?.trim() === 'Sí' ? 'si' : 'no';
          const nombresHijos = parts[24]?.trim() || '';

          // Separar apellidos y nombres
          const [apellidos, nombres] = nombreCompleto.includes(',') 
            ? nombreCompleto.split(',').map(s => s.trim())
            : [nombreCompleto, ''];

          const employee: Omit<Employee, 'id'> = {
            nombres: nombres || nombreCompleto,
            apellidos: apellidos || '',
            dni,
            fecha_ingreso: convertDate(fechaIngreso),
            cargo,
            sector: 'Producción', // Default
            tipoContrato,
            fechaIngreso: convertDate(fechaIngreso), // Legacy field
            fechaNacimiento: convertDate(fechaNacimiento),
            telefono,
            email,
            direccion: '', // No disponible en el Excel
            salario: 0, // No disponible en el Excel
            estadoCivil: '', // No disponible en el Excel
            contactoEmergencia,
            telefonoEmergencia,
            parentescoEmergencia,
            estado: 'activo',
            nivelEducativo,
            titulo: titulo === 'NO POSEE' ? '' : titulo,
            otrosConocimientos: otrosConocimientos === '-' ? '' : otrosConocimientos,
            grupoSanguineo,
            alergias: alergias === 'Sí' ? 'Sí' : '',
            medicacionHabitual: medicacionHabitual === 'No' ? '' : medicacionHabitual,
            obraSocial: obraSocial === '-' ? '' : obraSocial,
            observaciones: '',
            tieneHijos,
            nombresHijos: nombresHijos || '',
            tieneLicencia,
            tipoLicencia: tipoLicencia === '-' ? [] : [mapLicenseType(tipoLicencia)],
            fotoDni: null,
            fotoCarnet: null
          };

          employees.push(employee);
        }
      }
    }

    return employees;
  };

  const convertDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // Handle Excel serial date numbers
    const dateValue = parseFloat(dateStr);
    if (!isNaN(dateValue) && dateValue > 1000) {
      // Excel serial date (days since 1900-01-01, accounting for Excel's leap year bug)
      const excelEpoch = new Date(1900, 0, 1);
      const jsDate = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
      return jsDate.toISOString().split('T')[0];
    }
    
    // Handle DD/MM/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Try direct conversion for ISO format
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) {
      return isoDate.toISOString().split('T')[0];
    }
    
    return dateStr;
  };

  const mapLicenseType = (license: string): string => {
    const licenseMap: { [key: string]: string } = {
      'B1': 'clase-b',
      'B2': 'clase-b',
      'A': 'clase-a',
      'C': 'clase-c',
      'D': 'clase-d',
      'E': 'clase-e'
    };
    return licenseMap[license] || license;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processFile = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    setIsProcessing(true);

    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '' });

      const norm = (v: any) => String(v ?? '').trim();
      const toBoolText = (v: any) => norm(v).toLowerCase().startsWith('s') ? 'si' : 'no';

      const parsed: Omit<Employee, 'id'>[] = rows
        .filter(r => norm(r['ESTADO']).length === 0 || norm(r['ESTADO']).toUpperCase() === 'ACTIVO')
        .map((r) => {
          const nombreCompleto = norm(r['Apellido y Nombre:']);
          const hasComma = nombreCompleto.includes(',');
          const [apellidos, nombres] = hasComma
            ? nombreCompleto.split(',').map((s: string) => s.trim())
            : ['', nombreCompleto];

          const poseeObraSocial = toBoolText(r['Posee Obra Social']) === 'si';
          const obraSocialDetalle = norm(r['En caso de ser afirmativo detallar cual:']);

          const tipoLic = norm(r['Detallar el tipo de Licencia:']);

          return {
            nombres,
            apellidos,
            dni: norm(r['Seleccione DNI:']),
            cuil: '',
            cargo: norm(r['Puesto:']),
            sector: 'Producción',
            tipoContrato: norm(r['Tipo de Contrato:']),
            fechaIngreso: convertDate(norm(r['Fecha de ingreso:'])),
            fechaNacimiento: convertDate(norm(r['Fecha de Nacimiento:'])),
            telefono: norm(r['Número de contacto:']),
            email: norm(r['Correo Electrónico:']),
            direccion: '',
            salario: 0,
            estadoCivil: '',
            contactoEmergencia: norm(r['Nombre']),
            telefonoEmergencia: norm(r['Número de contacto de emergencia:']),
            parentescoEmergencia: norm(r['parentesco:']),
            estado: norm(r['ESTADO']).toUpperCase() === 'ACTIVO' ? 'activo' : 'inactivo',
            nivelEducativo: norm(r['Nivel educativo alcanzado:']),
            titulo: norm(r['Título: (en caso de no tener colocar *No posee)']).toUpperCase() === 'NO POSEE' ? '' : norm(r['Título: (en caso de no tener colocar *No posee)']),
            otrosConocimientos: norm(r['Otros conocimientos:']) === '-' ? '' : norm(r['Otros conocimientos:']),
            grupoSanguineo: norm(r['Grupo y Factor Sanguíneo:']),
            alergias: toBoolText(r['¿Tiene alergias?']) === 'si' ? 'Sí' : '',
            medicacionHabitual: norm(r['¿Toma alguna medicación habitual?:']).toLowerCase() === 'no' ? '' : norm(r['¿Toma alguna medicación habitual?:']),
            obraSocial: poseeObraSocial ? obraSocialDetalle : '',
            observaciones: '',
            tieneHijos: toBoolText(r['¿Tiene Hijos?']),
            nombresHijos: norm(r['En caso afirmativo detallar sus nombres completos y edades']),
            tieneLicencia: toBoolText(r['Posee licencia de conducir:']),
            tipoLicencia: tipoLic ? [mapLicenseType(tipoLic)] : [],
            fotoDni: null,
            fotoCarnet: null,
          } as Omit<Employee, 'id'>;
        })
        // Filtrar filas sin DNI
        .filter(emp => emp.dni.length > 0);

      // Deduplicar por DNI dentro del archivo
      const seen = new Set<string>();
      const uniqueParsed = parsed.filter(emp => {
        const k = emp.dni;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

      // Evitar duplicados con los ya existentes en contexto
      const existing = new Set((employees ?? []).map(e => String(e.dni).trim()));
      const toInsert = uniqueParsed.filter(emp => !existing.has(emp.dni));

      if (toInsert.length === 0) {
        toast.info('No hay empleados nuevos para importar (todos ya existen por DNI)');
        onComplete();
        return;
      }

      await importEmployees(toInsert);
      const skipped = uniqueParsed.length - toInsert.length;
      toast.success(`${toInsert.length} empleados importados correctamente${skipped > 0 ? `, ${skipped} omitidos por duplicados` : ''}`);
      
      // Actualizar la lista después de la importación
      if (refetch) {
        await refetch();
      }
      
      onComplete();

    } catch (error) {
      toast.error('Error al procesar el archivo');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Importar Empleados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file" className="text-foreground">Archivo Excel</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={processFile} 
              disabled={!file || isProcessing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isProcessing ? 'Procesando...' : 'Importar Empleados'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onComplete}
              className="border-border text-foreground hover:bg-accent"
            >
              Cancelar
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>El archivo debe tener el formato del Excel proporcionado con las siguientes columnas:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Estado, Fecha de ingreso, Apellido y Nombre</li>
              <li>Fecha de Nacimiento, DNI, Puesto</li>
              <li>Tipo de Contrato, Contacto, Email</li>
              <li>Y demás campos según la plantilla</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};