import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmployeeCard from "./EmployeeCard";
import { Search, Plus, Filter, Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockEmployees = [
  {
    id: "1",
    name: "María González",
    position: "Gerente de Ventas",
    department: "Ventas",
    email: "maria.gonzalez@empresa.com",
    phone: "+54 11 1234-5678",
    status: "active" as const,
    startDate: "15/03/2022"
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    position: "Desarrollador Senior",
    department: "Tecnología",
    email: "carlos.rodriguez@empresa.com",
    phone: "+54 11 2345-6789",
    status: "active" as const,
    startDate: "08/07/2021"
  },
  {
    id: "3",
    name: "Ana Martínez",
    position: "Coordinadora de RRHH",
    department: "Recursos Humanos",
    email: "ana.martinez@empresa.com",
    phone: "+54 11 3456-7890",
    status: "active" as const,
    startDate: "22/11/2023"
  },
  {
    id: "4",
    name: "Roberto Silva",
    position: "Analista Contable",
    department: "Administración",
    email: "roberto.silva@empresa.com",
    phone: "+54 11 4567-8901",
    status: "inactive" as const,
    startDate: "10/01/2020"
  }
];

const EmployeeList = () => {
  const [employees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeEmployees = employees.filter(emp => emp.status === "active").length;
  const inactiveEmployees = employees.filter(emp => emp.status === "inactive").length;

  const handleEdit = (employee: any) => {
    toast({
      title: "Editar Empleado",
      description: `Editando información de ${employee.name}`,
    });
  };

  const handleViewDetails = (employee: any) => {
    toast({
      title: "Detalle del Empleado",
      description: `Visualizando información completa de ${employee.name}`,
    });
  };

  const handleDownloadPDF = (employee: any) => {
    toast({
      title: "Generando PDF",
      description: `Descargando legajo digital de ${employee.name}`,
    });
  };

  const handleNewEmployee = () => {
    toast({
      title: "Nuevo Empleado",
      description: "Formulario para crear un nuevo empleado",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{employees.length}</p>
                <p className="text-xs text-muted-foreground">Total Empleados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{activeEmployees}</p>
                <p className="text-xs text-muted-foreground">Empleados Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserX className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">{inactiveEmployees}</p>
                <p className="text-xs text-muted-foreground">Empleados Inactivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-card-foreground">+12%</p>
                <p className="text-xs text-muted-foreground">Crecimiento Mensual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Gestión de Empleados</CardTitle>
            <Button onClick={handleNewEmployee} variant="premium">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleados por nombre, cargo o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
                onDownloadPDF={handleDownloadPDF}
              />
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                No se encontraron empleados
              </h3>
              <p className="text-muted-foreground">
                No hay empleados que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeList;