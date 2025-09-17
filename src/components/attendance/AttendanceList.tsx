import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Upload, Download, Clock, TrendingUp, AlertTriangle, Users } from "lucide-react";
import AttendanceUpload from "./AttendanceUpload";
import AttendanceReports from "./AttendanceReports";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/hooks/useEmployees";

const AttendanceList = () => {
  const { toast } = useToast();
  const { getActiveEmployees } = useEmployees();
  const activeEmployees = getActiveEmployees();
  const [view, setView] = useState<"list" | "upload" | "reports">("list");
  const [filterMonth, setFilterMonth] = useState("");

  console.log('AttendanceList - activeEmployees:', activeEmployees); // Debug log

  // Generate attendance data based on real employees
  const getAttendanceForEmployees = () => {
    const today = new Date();
    const attendanceData: any[] = [];
    
    activeEmployees.slice(0, 5).forEach((emp, empIndex) => {
      // Generate attendance for last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const attendance = {
          id: `${emp.id}-${date.getTime()}`,
          empleadoId: emp.id,
          empleadoNombre: `${emp.nombres} ${emp.apellidos}`,
          empleadoDni: emp.dni,
          fecha: date.toISOString().split('T')[0],
          horaEntrada: `0${7 + (empIndex % 2)}:${30 + (i * 5)}:00`,
          horaSalida: `1${6 + (empIndex % 2)}:${15 + (i * 3)}:00`,
          estado: i === 0 && empIndex === 0 ? "ausente" : "presente",
          observaciones: i === 0 && empIndex === 0 ? "Ausencia justificada" : ""
        };
        attendanceData.push(attendance);
      }
    });
    
    return attendanceData;
  };

  const attendanceData = getAttendanceForEmployees();

  const handleUploadExcel = () => {
    setView("upload");
  };

  const handleViewReports = () => {
    setView("reports");
  };

  const handleBackToList = () => {
    setView("list");
  };

  const generateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte de asistencia se ha generado exitosamente",
    });
  };

  if (view === "upload") {
    return <AttendanceUpload onBack={handleBackToList} />;
  }

  if (view === "reports") {
    return <AttendanceReports onBack={handleBackToList} />;
  }

  // Calculate totals (all zero until data is uploaded)
  const totalLateArrivals = 0;
  const avgPunctuality = 0;
  const avgAttendance = 0;
  const activeAlerts = attendanceData.filter(emp => emp.puntualidad < 85 || emp.asistencia < 90).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Control de Asistencia y KPIs</h2>
            <p className="text-foreground/70">Gestiona la asistencia y analiza indicadores de rendimiento</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleUploadExcel}>
            <Upload className="h-4 w-4 mr-2" />
            Cargar Excel
          </Button>
          <Button variant="outline" onClick={handleViewReports}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver KPIs
          </Button>
          <Button onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte Mensual
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Llegadas Tarde</p>
                <p className="text-3xl font-bold text-foreground">{totalLateArrivals}</p>
                <p className="text-xs text-foreground/60">este mes</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Puntualidad Promedio</p>
                <p className="text-3xl font-bold text-foreground">{avgPunctuality}%</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Asistencia Promedio</p>
                <p className="text-3xl font-bold text-foreground">{avgAttendance}%</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Alertas Activas</p>
                <p className="text-3xl font-bold text-foreground">{activeAlerts}</p>
                <p className="text-xs text-foreground/60">empleados</p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select onValueChange={setFilterMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los meses</SelectItem>
                <SelectItem value="2024-11">Noviembre 2024</SelectItem>
                <SelectItem value="2024-10">Octubre 2024</SelectItem>
                <SelectItem value="2024-09">Septiembre 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <div className="space-y-6">
        {attendanceData.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No hay datos de asistencia</h3>
              <p className="text-muted-foreground mb-6">
                Carga un archivo Excel con los datos de asistencia para comenzar a visualizar los reportes y KPIs.
              </p>
              <Button onClick={handleUploadExcel}>
                <Upload className="h-4 w-4 mr-2" />
                Cargar Archivo Excel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {attendanceData.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{record.empleadoNombre}</CardTitle>
                    <Badge variant={record.puntualidad >= 95 ? "success" : record.puntualidad >= 85 ? "warning" : "destructive"}>
                      {record.puntualidad >= 95 ? "Excelente" : record.puntualidad >= 85 ? "Bueno" : "Necesita Mejora"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground/70">Días Trabajados</p>
                      <p className="text-2xl font-bold text-success">{record.diasTrabajados}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/70">Días Falta</p>
                      <p className="text-2xl font-bold text-destructive">{record.diasFalta}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground/70">Llegadas Tarde</p>
                      <p className="text-xl font-bold text-warning">{record.llegadasTarde}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/70">Horas Extras</p>
                      <p className="text-xl font-bold text-primary">{record.horasExtras}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/70">Puntualidad</span>
                      <span className="font-semibold text-foreground">{record.puntualidad}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${record.puntualidad >= 95 ? 'bg-success' : record.puntualidad >= 85 ? 'bg-warning' : 'bg-destructive'}`}
                        style={{ width: `${record.puntualidad}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/70">Asistencia</span>
                      <span className="font-semibold text-foreground">{record.asistencia}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${record.asistencia >= 95 ? 'bg-success' : record.asistencia >= 85 ? 'bg-warning' : 'bg-destructive'}`}
                        style={{ width: `${record.asistencia}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      Ver Detalle
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Reporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;