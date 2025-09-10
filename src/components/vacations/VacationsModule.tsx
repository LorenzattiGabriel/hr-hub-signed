import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Plus, Search, Clock, User, FileText } from "lucide-react";
import VacationForm from "./VacationForm";
import VacationDetail from "./VacationDetail";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/contexts/EmployeeContext";

const VacationsModule = () => {
  const { toast } = useToast();
  const { getActiveEmployees } = useEmployees();
  const activeEmployees = getActiveEmployees();
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedVacation, setSelectedVacation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Calculate vacation days based on seniority
  const calculateVacationDays = (fechaIngreso: string) => {
    if (!fechaIngreso) return 0;
    
    const ingresoDate = new Date(fechaIngreso);
    const today = new Date();
    let years = today.getFullYear() - ingresoDate.getFullYear();
    
    const monthDiff = today.getMonth() - ingresoDate.getMonth();
    const dayDiff = today.getDate() - ingresoDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }
    
    // Según la ley laboral argentina
    if (years < 1) return 0;
    if (years >= 1 && years < 5) return 14;
    if (years >= 5 && years < 10) return 21;
    if (years >= 10 && years < 20) return 28;
    if (years >= 20) return 35;
    
    return 14;
  };

  // Calculate used vacation days (reset to 0)
  const getUsedVacationDays = (employeeId: number) => {
    // Reset all used vacation days to 0
    return 0;
  };

  // Create employee vacation status
  const employeesWithVacations = activeEmployees.map(emp => {
    const totalDays = calculateVacationDays(emp.fechaIngreso);
    const usedDays = getUsedVacationDays(emp.id);
    const remainingDays = totalDays - usedDays;
    
    return {
      ...emp,
      totalVacationDays: totalDays,
      usedVacationDays: usedDays,
      remainingVacationDays: remainingDays
    };
  });

  // No vacation requests yet
  const mockVacations: any[] = [];

  const filteredVacations = mockVacations.filter(vacation => {
    const matchesSearch = vacation.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || filterStatus === "all" || vacation.estado === filterStatus;
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
    return <VacationForm onBack={handleBackToList} vacation={selectedVacation} employees={activeEmployees} />;
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
            <h2 className="text-2xl font-bold text-foreground">Gestión de Vacaciones</h2>
            <p className="text-foreground/70">Administra las vacaciones del personal y días disponibles</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte de Vacaciones
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
                <p className="text-3xl font-bold text-foreground">0</p>
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
                <p className="text-sm font-medium text-foreground/70">Empleados Activos</p>
                <p className="text-3xl font-bold text-foreground">{employeesWithVacations.length}</p>
                <p className="text-xs text-foreground/60">con derecho a vacaciones</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <User className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Vacation Days Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Días de Vacaciones por Empleado</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Empleado</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">DNI</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Días Totales</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Días Usados</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Días Disponibles</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employeesWithVacations.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {employee.nombres} {employee.apellidos}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{employee.dni}</td>
                    <td className="px-6 py-4 text-foreground font-semibold">{employee.totalVacationDays}</td>
                    <td className="px-6 py-4 text-foreground">{employee.usedVacationDays}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${employee.remainingVacationDays <= 5 ? 'text-warning' : 'text-foreground'}`}>
                        {employee.remainingVacationDays}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={employee.remainingVacationDays > 0 ? "default" : "secondary"}>
                        {employee.remainingVacationDays > 0 ? "Disponible" : "Agotado"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Solicitudes de Vacaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vacation Requests List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVacations.map((vacation) => (
              <Card key={vacation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{vacation.empleadoNombre}</CardTitle>
                    <Badge variant={vacation.estado === "aprobado" ? "default" : vacation.estado === "pendiente" ? "secondary" : "destructive"}>
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
                      <p className="text-sm font-medium text-foreground/70">Estado</p>
                      <p className="text-foreground">{vacation.estado}</p>
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
                      <FileText className="h-4 w-4 mr-1" />
                      Constancia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVacations.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No se encontraron solicitudes
              </h3>
              <p className="text-foreground/70">
                No hay solicitudes que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VacationsModule;