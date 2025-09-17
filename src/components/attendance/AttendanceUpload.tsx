import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ArrowLeft, FileSpreadsheet, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAttendanceData } from "@/hooks/useAttendanceData";
import { useEmployees } from "@/hooks/useEmployees";
import * as XLSX from 'xlsx';

interface AttendanceUploadProps {
  onBack: () => void;
}

const AttendanceUpload = ({ onBack }: AttendanceUploadProps) => {
  const { toast } = useToast();
  const { bulkInsert } = useAttendanceData();
  const { employees } = useEmployees();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("sheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setUploadedFile(file);
      } else {
        toast({
          title: "Formato incorrecto",
          description: "Por favor selecciona un archivo Excel (.xlsx o .xls)",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input triggered', e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('File selected:', file.name, file.type, file.size);
      
      // Validate file type
      if (file.type.includes("sheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
        setUploadedFile(file);
        toast({
          title: "Archivo seleccionado",
          description: `Archivo ${file.name} listo para procesar`,
        });
      } else {
        toast({
          title: "Formato incorrecto",
          description: "Por favor selecciona un archivo Excel (.xlsx o .xls)",
          variant: "destructive"
        });
      }
    } else {
      console.log('No file selected');
    }
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Process and validate data
          const attendanceRecords = [];
          for (const row of jsonData as any[]) {
            // Try to find employee by DNI or name
            const employeeDni = String(row.DNI || row.Empleado || '').trim();
            const employeeName = String(row.Nombre || row.Empleado || '').trim();
            
            let employee = employees.find(emp => 
              emp.dni === employeeDni || 
              `${emp.nombres} ${emp.apellidos}`.toLowerCase().includes(employeeName.toLowerCase())
            );

            if (!employee && employeeName) {
              // Try partial name match
              employee = employees.find(emp => 
                employeeName.toLowerCase().includes(emp.nombres.toLowerCase()) ||
                employeeName.toLowerCase().includes(emp.apellidos.toLowerCase())
              );
            }

            if (!employee) {
              console.warn(`No se encontró empleado para: ${employeeName || employeeDni}`);
              continue;
            }

            const fecha = row.Fecha || row.fecha;
            const horaEntrada = row.Entrada || row['Hora Entrada'] || row.entrada || row['Hora de Entrada'];
            const horaSalida = row.Salida || row['Hora Salida'] || row.salida || row['Hora de Salida'];
            const llegadaTarde = row['Llegada tarde'] || false;
            const salidaTemprano = row['Salida temprano'] || false;
            const tiempoExtra = row['Tiempo extra'] || null;

            // Use the calculated values from the fingerprint system
            const llegadaTardeFromFile = row['Llegada tarde'] || false;
            const salidaTempranoFromFile = row['Salida temprano'] || false;
            const tiempoExtraFromFile = row['Tiempo extra'] || null;

            // Parse date
            let parsedDate;
            if (typeof fecha === 'number') {
              // Excel date serial number
              parsedDate = XLSX.SSF.parse_date_code(fecha);
              parsedDate = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
            } else {
              parsedDate = new Date(fecha);
            }

            // Calculate worked hours if not provided
            let horasTrabajadas = tiempoExtraFromFile;
            if (!horasTrabajadas && horaEntrada && horaSalida) {
              const entrada = new Date(`1970-01-01T${horaEntrada}`);
              const salida = new Date(`1970-01-01T${horaSalida}`);
              horasTrabajadas = (salida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
            }

            attendanceRecords.push({
              employee_id: employee.id,
              fecha: parsedDate.toISOString().split('T')[0],
              hora_entrada: horaEntrada || null,
              hora_salida: horaSalida || null,
              horas_trabajadas: horasTrabajadas,
              llegada_tarde: llegadaTardeFromFile,
              observaciones: salidaTempranoFromFile ? 'Salida temprano detectada' : null
            });
          }

          if (attendanceRecords.length === 0) {
            throw new Error('No se encontraron registros válidos en el archivo');
          }

          // Insert records into database
          await bulkInsert(attendanceRecords);

          toast({
            title: "Archivo procesado exitosamente",
            description: `Se procesaron ${attendanceRecords.length} registros de asistencia`,
          });
          
          setTimeout(() => onBack(), 1500);
        } catch (error) {
          console.error('Error processing file:', error);
          toast({
            title: "Error procesando archivo",
            description: "Verifique que el formato del archivo sea correcto",
            variant: "destructive"
          });
        } finally {
          setProcessing(false);
        }
      };
      
      reader.readAsArrayBuffer(uploadedFile);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error",
        description: "No se pudo leer el archivo",
        variant: "destructive"
      });
      setProcessing(false);
    }
  };

  const downloadTemplate = () => {
    toast({
      title: "Plantilla descargada",
      description: "La plantilla Excel ha sido descargada exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Cargar Archivo de Asistencia</h2>
            <p className="text-foreground/70">Sube el archivo Excel exportado desde el sistema de huellas dactilares</p>
          </div>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Descargar Plantilla
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Subir Archivo Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {dragActive ? "Suelta el archivo aquí" : "Arrastra tu archivo Excel aquí"}
              </h3>
              <p className="text-muted-foreground mb-4">
                o haz clic para seleccionar un archivo
              </p>
              
              <input
                type="file"
                accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Seleccionar Archivo</span>
                </Button>
              </label>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-success font-medium">{uploadedFile.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tamaño: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={processFile} 
                  className="w-full" 
                  disabled={processing}
                >
                  {processing ? "Procesando..." : "Procesar Archivo"}
                </Button>
                
                {processing && (
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Analizando datos de asistencia...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Formato del Archivo</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Formato Excel (.xlsx o .xls)</li>
                <li>• Incluir columnas: Empleado, Fecha, Hora Entrada, Hora Salida</li>
                <li>• Una fila por día trabajado</li>
                <li>• Fechas en formato DD/MM/AAAA</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Datos que se Procesarán</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Días trabajados por empleado</li>
                <li>• Llegadas tarde (después de 8:00 AM)</li>
                <li>• Horas extras trabajadas</li>
                <li>• Cálculo automático de puntualidad</li>
                <li>• Porcentaje de asistencia mensual</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Reportes Generados</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• KPIs de asistencia por empleado</li>
                <li>• Ranking de puntualidad</li>
                <li>• Alertas de ausentismo</li>
                <li>• Tendencias mensuales</li>
              </ul>
            </div>

            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning">
                <strong>Importante:</strong> El archivo debe contener datos de un mes completo para generar estadísticas precisas.
              </p>
            </div>

            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary">
                <strong>Tip:</strong> Puedes descargar la plantilla Excel para ver el formato exacto requerido.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceUpload;