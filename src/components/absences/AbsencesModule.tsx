import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Plus, Search, Clock, User, FileText, AlertCircle } from "lucide-react";
import AbsenceForm from "./AbsenceForm";
import AbsenceDetail from "./AbsenceDetail";
import { useToast } from "@/hooks/use-toast";

// Import employee data
const mockEmployees = [
  {
    id: 1,
    nombres: "Noelia Belén",
    apellidos: "Ludueña",
    dni: "35.832.688",
    estado: "activo"
  },
  {
    id: 2,
    nombres: "Mariela Desiree",
    apellidos: "Díaz",
    dni: "41.279.664",
    estado: "activo"
  },
  {
    id: 5,
    nombres: "Gerardo Damián",
    apellidos: "Mateo",
    dni: "34.671.654",
    estado: "activo"
  },
  {
    id: 8,
    nombres: "Marcelo Edgar",
    apellidos: "Mangold",
    dni: "40.026.130",
    estado: "activo"
  },
  {
    id: 9,
    nombres: "Edgar Alberto",
    apellidos: "Maidana",
    dni: "27.079.378",
    estado: "activo"
  },
  {
    id: 10,
    nombres: "Laura Roxana",
    apellidos: "Criado",
    dni: "25.089.374",
    estado: "activo"
  },
  {
    id: 11,
    nombres: "Lucas Milton",
    apellidos: "Bonetto",
    dni: "38.020.563",
    estado: "activo"
  }
];

const AbsencesModule = () => {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedAbsence, setSelectedAbsence] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mock absence data
  const mockAbsences = [
    {
      id: 1,
      empleadoId: 1,
      empleadoNombre: "Noelia Belén Ludueña",
      fechaInicio: "2024-11-25",
      fechaFin: "2024-11-26",
      tipo: "enfermedad",
      motivo: "Gripe estacional",
      certificadoMedico: true,
      archivo: "certificado_medico_001.pdf",
      estado: "aprobado",
      fechaSolicitud: "2024-11-24",
      observaciones: "Presentó certificado médico válido"
    },
    {
      id: 2,
      empleadoId: 5,
      empleadoNombre: "Gerardo Damián Mateo",
      fechaInicio: "2024-11-20",
      fechaFin: "2024-11-20",
      tipo: "personal",
      motivo: "Trámite bancario urgente",
      certificadoMedico: false,
      archivo: null,
      estado: "pendiente",
      fechaSolicitud: "2024-11-19",
      observaciones: ""
    },
    {
      id: 3,
      empleadoId: 8,
      empleadoNombre: "Marcelo Edgar Mangold",
      fechaInicio: "2024-11-15",
      fechaFin: "2024-11-17",
      tipo: "familiar",
      motivo: "Internación de familiar directo",
      certificadoMedico: false,
      archivo: "constancia_hospital.pdf",
      estado: "aprobado",
      fechaSolicitud: "2024-11-14",
      observaciones: "Situación familiar de emergencia"
    }
  ];

  const filteredAbsences = mockAbsences.filter(absence => {
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

  const generateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte de ausencias se ha generado exitosamente",
    });
  };

  if (view === "form") {
    return <AbsenceForm onBack={handleBackToList} absence={selectedAbsence} employees={mockEmployees} />;
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
                  {mockAbsences.filter(a => a.estado === "pendiente").length}
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
                  {mockAbsences.filter(a => a.tipo === "enfermedad").length}
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
                  {mockAbsences.filter(a => a.tipo === "personal").length}
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
                  {mockAbsences.filter(a => a.certificadoMedico || a.archivo).length}
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