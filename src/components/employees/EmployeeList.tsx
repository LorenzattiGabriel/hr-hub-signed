import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Download, FileText, Users } from "lucide-react";
import EmployeeCard from "./EmployeeCard";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetail from "./EmployeeDetail";
import { useToast } from "@/hooks/use-toast";

const EmployeeList = () => {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mock data for demonstration
  const mockEmployees = [
    {
      id: 1,
      nombres: "María José",
      apellidos: "González Pérez",
      dni: "35,234,567",
      cuil: "27-35234567-8",
      cargo: "Supervisora",
      sector: "Granja",
      fechaIngreso: "2020-03-15",
      fechaNacimiento: "1988-07-22",
      telefono: "+54 9 11 2345-6789",
      email: "maria.gonzalez@avicolapaloma.com",
      direccion: "Av. San Martín 1245, Buenos Aires",
      salario: 580000,
      estadoCivil: "Casada",
      contactoEmergencia: "Carlos González",
      telefonoEmergencia: "+54 9 11 9876-5432",
      estado: "activo",
      observaciones: "Excelente desempeño en el área de supervisión"
    },
    {
      id: 2,
      nombres: "Juan Carlos",
      apellidos: "Rodríguez Silva",
      dni: "28,456,789",
      cuil: "20-28456789-3",
      cargo: "Operario",
      sector: "Procesamiento",
      fechaIngreso: "2019-08-10",
      fechaNacimiento: "1985-12-03",
      telefono: "+54 9 11 3456-7890",
      email: "juan.rodriguez@avicolapaloma.com",
      direccion: "Calle Belgrano 856, La Plata",
      salario: 450000,
      estadoCivil: "Soltero",
      contactoEmergencia: "Ana Rodríguez",
      telefonoEmergencia: "+54 9 11 8765-4321",
      estado: "activo",
      observaciones: ""
    },
    {
      id: 3,
      nombres: "Ana Sofía",
      apellidos: "Martínez López",
      dni: "32,678,901",
      cuil: "27-32678901-5",
      cargo: "Veterinaria",
      sector: "Control de Calidad",
      fechaIngreso: "2021-01-20",
      fechaNacimiento: "1990-04-18",
      telefono: "+54 9 11 4567-8901",
      email: "ana.martinez@avicolapaloma.com",
      direccion: "Av. Rivadavia 2134, CABA",
      salario: 750000,
      estadoCivil: "Soltera",
      contactoEmergencia: "Roberto Martínez",
      telefonoEmergencia: "+54 9 11 7654-3210",
      estado: "activo",
      observaciones: "Especialista en sanidad aviar"
    },
    {
      id: 4,
      nombres: "Roberto",
      apellidos: "Fernández Castro",
      dni: "25,789,012",
      cuil: "20-25789012-7",
      cargo: "Encargado",
      sector: "Incubación",
      fechaIngreso: "2018-05-12",
      fechaNacimiento: "1982-09-15",
      telefono: "+54 9 11 5678-9012",
      email: "roberto.fernandez@avicolapaloma.com",
      direccion: "Pje. Las Flores 567, Quilmes",
      salario: 650000,
      estadoCivil: "Casado",
      contactoEmergencia: "Laura Fernández",
      telefonoEmergencia: "+54 9 11 6543-2109",
      estado: "activo",
      observaciones: "15 años de experiencia en incubación"
    },
    {
      id: 5,
      nombres: "Laura",
      apellidos: "García Moreno",
      dni: "30,123,456",
      cuil: "27-30123456-9",
      cargo: "Administrativa",
      sector: "Administración",
      fechaIngreso: "2022-02-01",
      fechaNacimiento: "1987-11-30",
      telefono: "+54 9 11 6789-0123",
      email: "laura.garcia@avicolapaloma.com",
      direccion: "Calle 9 de Julio 789, San Isidro",
      salario: 520000,
      estadoCivil: "Divorciada",
      contactoEmergencia: "Patricia García",
      telefonoEmergencia: "+54 9 11 5432-1098",
      estado: "activo",
      observaciones: ""
    }
  ];

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = (
      employee.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.dni.includes(searchTerm) ||
      employee.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesSector = !filterSector || employee.sector === filterSector;
    const matchesStatus = !filterStatus || employee.estado === filterStatus;
    
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

  if (view === "form") {
    return (
      <EmployeeForm 
        onBack={handleBackToList}
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
                <p className="text-3xl font-bold text-foreground">{mockEmployees.length}</p>
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
                <p className="text-3xl font-bold text-foreground">{mockEmployees.filter(e => e.estado === "activo").length}</p>
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
                <p className="text-3xl font-bold text-foreground">2</p>
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
                <SelectItem value="">Todos los sectores</SelectItem>
                <SelectItem value="Granja">Granja</SelectItem>
                <SelectItem value="Incubación">Incubación</SelectItem>
                <SelectItem value="Procesamiento">Procesamiento</SelectItem>
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Control de Calidad">Control de Calidad</SelectItem>
                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="Transporte">Transporte</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard 
            key={employee.id} 
            employee={employee}
            onView={() => handleViewEmployee(employee)}
            onEdit={() => handleEditEmployee(employee)}
          />
        ))}
      </div>

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