import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Plus, Search, Clock, User } from "lucide-react";
import VacationForm from "./VacationForm";
import VacationDetail from "./VacationDetail";
import { useToast } from "@/hooks/use-toast";

const VacationList = () => {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedVacation, setSelectedVacation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mock data - in real app this would come from localStorage
  const mockVacations = [
    {
      id: 1,
      empleadoId: 1,
      empleadoNombre: "María José González",
      fechaInicio: "2024-12-15",
      fechaFin: "2024-12-29",
      diasSolicitados: 10,
      diasDisponibles: 21,
      estado: "aprobado",
      motivo: "Vacaciones familiares",
      fechaSolicitud: "2024-11-15",
      observaciones: ""
    },
    {
      id: 2,
      empleadoId: 2,
      empleadoNombre: "Juan Carlos Rodríguez",
      fechaInicio: "2024-11-20",
      fechaFin: "2024-11-22",
      diasSolicitados: 3,
      diasDisponibles: 18,
      estado: "pendiente",
      motivo: "Asuntos personales",
      fechaSolicitud: "2024-11-10",
      observaciones: "Solicitud urgente"
    }
  ];

  const filteredVacations = mockVacations.filter(vacation => {
    const matchesSearch = vacation.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || vacation.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleNewVacation = () => {
    setSelectedVacation(null);
    setView("form");
  };

  const handleViewVacation = (vacation: any) => {
    setSelectedVacation(vacation);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedVacation(null);
  };

  const generateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte de vacaciones se ha generado exitosamente",
    });
  };

  if (view === "form") {
    return <VacationForm onBack={handleBackToList} vacation={selectedVacation} />;
  }

  if (view === "detail" && selectedVacation) {
    return <VacationDetail vacation={selectedVacation} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Vacaciones y Ausencias</h2>
            <p className="text-foreground/70">Gestiona las vacaciones y permisos del personal</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte General
          </Button>
          <Button onClick={handleNewVacation}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Solicitud
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Solicitudes Pendientes</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockVacations.filter(v => v.estado === "pendiente").length}
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
                <p className="text-sm font-medium text-foreground/70">Aprobadas Este Mes</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockVacations.filter(v => v.estado === "aprobado").length}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Calendar className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Días Promedio</p>
                <p className="text-3xl font-bold text-foreground">6.5</p>
                <p className="text-xs text-foreground/60">días por solicitud</p>
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
                <p className="text-sm font-medium text-foreground/70">Días Totales</p>
                <p className="text-3xl font-bold text-foreground">13</p>
                <p className="text-xs text-foreground/60">este mes</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-secondary" />
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
            
            <Select onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vacation List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVacations.map((vacation) => (
          <Card key={vacation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{vacation.empleadoNombre}</CardTitle>
                <Badge variant={vacation.estado === "aprobado" ? "success" : vacation.estado === "pendiente" ? "warning" : "destructive"}>
                  {vacation.estado === "aprobado" ? "Aprobado" : vacation.estado === "pendiente" ? "Pendiente" : "Rechazado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Fecha Inicio</p>
                  <p className="text-foreground">{new Date(vacation.fechaInicio).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">Fecha Fin</p>
                  <p className="text-foreground">{new Date(vacation.fechaFin).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Días Solicitados</p>
                  <p className="text-foreground font-semibold">{vacation.diasSolicitados}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">Días Disponibles</p>
                  <p className="text-foreground">{vacation.diasDisponibles}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground/70">Motivo</p>
                <p className="text-foreground text-sm">{vacation.motivo}</p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleViewVacation(vacation)}>
                  Ver Detalle
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVacations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron solicitudes
            </h3>
            <p className="text-foreground/70">
              No hay solicitudes que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VacationList;