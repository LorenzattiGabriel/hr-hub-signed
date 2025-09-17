import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Download, FileText, Users, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetail from "./EmployeeDetail";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/contexts/EmployeeContext";

const EmployeeList = () => {
  const { toast } = useToast();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (
      employee.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.dni.includes(searchTerm) ||
      employee.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesSector = !filterSector || filterSector === "all" || employee.sector === filterSector;
    const matchesStatus = !filterStatus || filterStatus === "all" || employee.estado === filterStatus;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  const handleNewEmployee = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setView("form");
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setView("form");
  };

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const generateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte de empleados se ha generado exitosamente",
    });
  };

  const handleSaveEmployee = (data: any) => {
    if (data.id) {
      updateEmployee(data.id, data);
      toast({
        title: "Empleado actualizado",
        description: "Los datos del empleado se han actualizado exitosamente",
      });
    } else {
      addEmployee(data);
      toast({
        title: "Empleado agregado",
        description: "El nuevo empleado se ha agregado exitosamente",
      });
    }
    setView("list");
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const handleDeleteEmployee = (id: number, name: string) => {
    deleteEmployee(id);
    toast({
      title: "Empleado eliminado",
      description: `${name} ha sido eliminado del sistema`,
    });
  };

  if (view === "form") {
    return (
      <EmployeeForm 
        onBack={handleBackToList}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        isEditing={isEditing}
      />
    );
  }

  if (view === "detail" && selectedEmployee) {
    return (
      <EmployeeDetail 
        employee={selectedEmployee}
        onBack={handleBackToList}
        onEdit={() => handleEditEmployee(selectedEmployee)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestión de Empleados</h2>
            <p className="text-foreground/70">Administra el legajo digital y la información del personal</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
          <Button onClick={handleNewEmployee}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Total Empleados</p>
                <p className="text-3xl font-bold text-foreground">{employees.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Empleados Activos</p>
                <p className="text-3xl font-bold text-foreground">{employees.filter(e => e.estado === "activo").length}</p>
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
                <p className="text-sm font-medium text-foreground/70">Nuevos Este Mes</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Plus className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Promedio Antigüedad</p>
                <p className="text-3xl font-bold text-foreground">3.2</p>
                <p className="text-xs text-foreground/60">años</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Filter className="h-6 w-6 text-warning" />
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
                placeholder="Buscar por nombre, DNI, cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select onValueChange={setFilterSector}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sectores</SelectItem>
                <SelectItem value="administracion">Administración</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="produccion">Producción</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Empleados ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Empleado</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">DNI</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Cargo</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Sector</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Estado</th>
                  <th className="px-6 py-3 text-sm font-medium text-foreground/70">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {employee.nombres} {employee.apellidos}
                        </span>
                        <span className="text-sm text-foreground/60">{employee.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{employee.dni}</td>
                    <td className="px-6 py-4 text-foreground">{employee.cargo}</td>
                    <td className="px-6 py-4 text-foreground">{employee.sector}</td>
                    <td className="px-6 py-4">
                      <Badge variant={employee.estado === "activo" ? "default" : "secondary"}>
                        {employee.estado === "activo" ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          Ver
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el registro de {employee.nombres} {employee.apellidos} del sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteEmployee(employee.id, `${employee.nombres} ${employee.apellidos}`)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron empleados
            </h3>
            <p className="text-foreground/70">
              No hay empleados que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeList;