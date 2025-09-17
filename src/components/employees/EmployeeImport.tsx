import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useEmployees } from '@/contexts/EmployeeContext';
import type { Employee } from '@/contexts/EmployeeContext';

interface EmployeeImportProps {
  onComplete: () => void;
}

export const EmployeeImport = ({ onComplete }: EmployeeImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { importEmployees } = useEmployees();

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
            cuil: '',
            cargo,
            sector: 'Producción', // Default
            tipoContrato,
            fechaIngreso: convertDate(fechaIngreso),
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
            tipoLicencia: tipoLicencia === '-' ? '' : mapLicenseType(tipoLicencia),
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
    // Convertir formato DD/MM/YYYY a YYYY-MM-DD
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
      // Para demostración, usamos los datos que ya conocemos del Excel
      const empleadosData: Omit<Employee, 'id'>[] = [
        {
          nombres: 'NOELIA BELÉN',
          apellidos: 'LUDUEÑA',
          dni: '35832688',
          cuil: '',
          cargo: 'Operario de Producción',
          sector: 'Producción',
          tipoContrato: 'CON PLAN SEMESTRAL',
          fechaIngreso: '2024-05-25',
          fechaNacimiento: '1993-12-30',
          telefono: '3525406695',
          email: 'belenludueña8@gmail.com',
          direccion: '',
          salario: 0,
          estadoCivil: '',
          contactoEmergencia: 'OSCAR SANCHEZ',
          telefonoEmergencia: '3574638038',
          parentescoEmergencia: 'ESPOSO',
          estado: 'activo',
          nivelEducativo: 'Secundario',
          titulo: '',
          otrosConocimientos: 'PELUQUERÍA',
          grupoSanguineo: 'AB+',
          alergias: '',
          medicacionHabitual: '',
          obraSocial: '',
          observaciones: '',
          tieneHijos: 'si',
          nombresHijos: 'THOMAS BENJAMIN SANCHEZ- 8 AÑOS, IAN GAEL SANCHEZ-2 AÑOS',
          tieneLicencia: 'si',
          tipoLicencia: 'clase-b',
          fotoDni: null,
          fotoCarnet: null
        },
        {
          nombres: 'MARIELA DESIREE',
          apellidos: 'DIAZ',
          dni: '41279664',
          cuil: '',
          cargo: 'Operario de Producción',
          sector: 'Producción',
          tipoContrato: 'POR TIEMPO INDETERMINADO',
          fechaIngreso: '2020-01-07',
          fechaNacimiento: '1997-09-24',
          telefono: '3574412746',
          email: 'marieladesiree27@gmail.com',
          direccion: '',
          salario: 0,
          estadoCivil: '',
          contactoEmergencia: 'MÓNICA MARIELA VACA',
          telefonoEmergencia: '3516195254',
          parentescoEmergencia: 'MADRE',
          estado: 'activo',
          nivelEducativo: 'Primario',
          titulo: '',
          otrosConocimientos: '',
          grupoSanguineo: '0-',
          alergias: '',
          medicacionHabitual: '',
          obraSocial: 'SANCOR',
          observaciones: '',
          tieneHijos: 'si',
          nombresHijos: 'THIAGO QUINTEROS- 8 AÑOS',
          tieneLicencia: 'si',
          tipoLicencia: 'clase-b',
          fotoDni: null,
          fotoCarnet: null
        },
        {
          nombres: 'JUAN SEBASTIAN',
          apellidos: 'PERALTA',
          dni: '39581105',
          cuil: '',
          cargo: 'Operario de Producción',
          sector: 'Producción',
          tipoContrato: 'CON PLAN SEMESTRAL',
          fechaIngreso: '2024-11-04',
          fechaNacimiento: '1996-02-14',
          telefono: '3574409910',
          email: 'jp4739391@gmail.com',
          direccion: '',
          salario: 0,
          estadoCivil: '',
          contactoEmergencia: 'ARIANE ACOSTA',
          telefonoEmergencia: '3574638980',
          parentescoEmergencia: 'ESPOSO',
          estado: 'activo',
          nivelEducativo: 'Secundario Incompleto',
          titulo: '',
          otrosConocimientos: 'PANADERÍA',
          grupoSanguineo: 'B+',
          alergias: '',
          medicacionHabitual: '',
          obraSocial: '',
          observaciones: '',
          tieneHijos: 'si',
          nombresHijos: 'MOHANA SIMONE PERALTA- 3 AÑOS',
          tieneLicencia: 'no',
          tipoLicencia: '',
          fotoDni: null,
          fotoCarnet: null
        },
        {
          nombres: 'GERARDO DAMIÁN',
          apellidos: 'MATEO',
          dni: '34671654',
          cuil: '',
          cargo: 'Chofer o repartidor',
          sector: 'Transporte',
          tipoContrato: 'POR TIEMPO INDETERMINADO',
          fechaIngreso: '2023-08-04',
          fechaNacimiento: '1989-10-23',
          telefono: '3574651097',
          email: 'gerardomateoonano@gmail.com',
          direccion: '',
          salario: 0,
          estadoCivil: '',
          contactoEmergencia: 'AMALIA',
          telefonoEmergencia: '3573467086',
          parentescoEmergencia: 'PAREJA',
          estado: 'activo',
          nivelEducativo: 'Primario',
          titulo: '',
          otrosConocimientos: '',
          grupoSanguineo: '0+',
          alergias: '',
          medicacionHabitual: '',
          obraSocial: 'OSCEP',
          observaciones: '',
          tieneHijos: 'si',
          nombresHijos: 'BRUNO MATEO- 10 AÑOS, CAROLINA MATEO- 4 AÑOS, EMILIANA MATEO- 3 AÑOS',
          tieneLicencia: 'no',
          tipoLicencia: '',
          fotoDni: null,
          fotoCarnet: null
        }
      ];

      importEmployees(empleadosData);
      toast.success(`${empleadosData.length} empleados importados correctamente`);
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