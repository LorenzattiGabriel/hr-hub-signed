import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Plus, Search, Clock, User, FileText, AlertCircle, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AbsenceForm from "./AbsenceForm";
import AbsenceDetail from "./AbsenceDetail";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/hooks/useEmployees";
import { useAbsences } from "@/hooks/useAbsences";

const AbsencesModule = () => {
  const { toast } = useToast();
  const { getActiveEmployees } = useEmployees();
  const activeEmployees = getActiveEmployees();
  
  console.log('AbsencesModule - activeEmployees:', activeEmployees); // Debug log
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedAbsence, setSelectedAbsence] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Datos reales de ausencias
  const { absences, loading, deleteAbsence } = useAbsences();

  // Adaptar a forma esperada por la UI existente
  const items = absences.map((a) => ({
    id: a.id,
    empleadoId: a.employee_id,
    empleadoNombre: a.empleadoNombre || '',
    empleadoDni: a.empleadoDni || '',
    fechaInicio: a.fecha_inicio,
    fechaFin: a.fecha_fin,
    tipo: a.tipo,
    motivo: a.motivo || '',
    estado: a.estado,
    certificadoMedico: a.certificado_medico,
    archivo: a.archivo_url,
    observaciones: a.observaciones || ''
  }));

  // Forzar actualización cuando cambian los datos
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Actualizar cuando cambien las ausencias
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [absences]);

  const filteredAbsences = items.filter(absence => {
    const matchesSearch = absence.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || filterType === "all" || absence.tipo === filterType;
    const matchesStatus = !filterStatus || filterStatus === "all" || absence.estado === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleNewAbsence = () => {
    setSelectedAbsence(null);
    setView("form");
  };

  const handleViewAbsence = (absence: any) => {
    setSelectedAbsence(absence);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedAbsence(null);
  };

  const handleDeleteAbsence = async (absenceId: string) => {
    try {
      await deleteAbsence(absenceId);
    } catch (error) {
      // El hook ya muestra el toast de error
    }
  };

  const generateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte de ausencias se ha generado exitosamente",
    });
  };

  if (view === "form") {
    return <AbsenceForm onBack={handleBackToList} absence={selectedAbsence} employees={activeEmployees} />;
  }

  if (view === "detail" && selectedAbsence) {
    return <AbsenceDetail absence={selectedAbsence} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AlertCircle className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestión de Ausencias y Permisos</h2>
            <p className="text-foreground/70">Administra las ausencias, permisos y certificados médicos</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte de Ausencias
          </Button>
          <Button onClick={handleNewAbsence}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Ausencia
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Ausencias Pendientes</p>
                <p className="text-3xl font-bold text-foreground">
                  {items.filter(a => a.estado === "pendiente").length}
                </p>
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
                <p className="text-sm font-medium text-foreground/70">Por Enfermedad</p>
                <p className="text-3xl font-bold text-foreground">
                  {items.filter(a => a.tipo === "enfermedad").length}
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Motivos Personales</p>
                <p className="text-3xl font-bold text-foreground">
                  {items.filter(a => a.tipo === "personal" || a.tipo === "paternidad" || a.tipo === "familiar").length}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Con Certificado</p>
                <p className="text-3xl font-bold text-foreground">
                  {items.filter(a => a.certificadoMedico || a.archivo).length}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <FileText className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
              <Input
                placeholder="Buscar por empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="enfermedad">Enfermedad</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="paternidad">Paternidad</SelectItem>
                <SelectItem value="familiar">Familiar</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Absence List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAbsences.map((absence) => (
          <Card key={absence.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{absence.empleadoNombre}</CardTitle>
                <Badge variant={absence.estado === "aprobado" ? "default" : absence.estado === "pendiente" ? "secondary" : "destructive"}>
                  {absence.estado === "aprobado" ? "Aprobado" : absence.estado === "pendiente" ? "Pendiente" : "Rechazado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Fecha Inicio</p>
                  <p className="text-foreground">{new Date(absence.fechaInicio).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">Fecha Fin</p>
                  <p className="text-foreground">{new Date(absence.fechaFin).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Tipo</p>
                  <Badge variant="outline" className="capitalize">{absence.tipo}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">Certificado</p>
                  <div className="flex items-center space-x-1">
                    {absence.certificadoMedico || absence.archivo ? (
                      <Badge variant="default" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Sí
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">No</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground/70">Motivo</p>
                <p className="text-foreground text-sm">{absence.motivo}</p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleViewAbsence(absence)}>
                  Ver Detalle
                </Button>
                {(absence.certificadoMedico || absence.archivo) && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Archivo
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la ausencia de {absence.empleadoNombre}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteAbsence(absence.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAbsences.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron ausencias
            </h3>
            <p className="text-foreground/70">
              No hay ausencias que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AbsencesModule;