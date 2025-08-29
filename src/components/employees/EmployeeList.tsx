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

  // Datos reales de empleados
  const [employees, setEmployees] = useState([
    {
      id: 1,
      nombres: "Noelia Belén",
      apellidos: "Ludueña",
      dni: "35.832.688",
      cuil: "27-35832688-4",
      cargo: "operario-produccion",
      sector: "produccion",
      fechaIngreso: "2024-05-25",
      fechaNacimiento: "1993-12-30",
      telefono: "3525-406695",
      email: "belenludueña8@gmail.com",
      direccion: "Zona Rural. El Crispin",
      salario: 450000,
      estadoCivil: "casado",
      contactoEmergencia: "Óscar Sánchez",
      telefonoEmergencia: "3574-638038",
      parentescoEmergencia: "conyuge",
      estado: "activo",
      nivelEducativo: "secundario-completo",
      titulo: "No posee",
      otrosConocimientos: "Peluquería",
      grupoSanguineo: "AB+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "Sí (No especifica cuál)",
      observaciones: "Licencia de conducir tipo B2, vencimiento 30/3/2025. Hijos: Thomas Benjamin Sánchez (8 años), Ian Gael Sánchez (2 años)"
    },
    {
      id: 2,
      nombres: "Mariela Desiree",
      apellidos: "Díaz",
      dni: "41.279.664",
      cuil: "27-41279664-8",
      cargo: "operario-produccion",
      sector: "produccion",
      fechaIngreso: "2020-01-07",
      fechaNacimiento: "1997-09-24",
      telefono: "3574-412746",
      email: "marieladesiree27@gmail.com",
      direccion: "Barrio Delich, Zona Rural. Río Primero",
      salario: 450000,
      estadoCivil: "soltero",
      contactoEmergencia: "Mónica Mariela Vaca",
      telefonoEmergencia: "3516-195254",
      parentescoEmergencia: "madre",
      estado: "activo",
      nivelEducativo: "primario-completo",
      titulo: "No posee",
      otrosConocimientos: "-",
      grupoSanguineo: "O-",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "Sí (Sancor)",
      observaciones: "Licencia de conducir tipo B1, vencimiento 19/1/2029. Hijos: Thiago Quinteros (8 años)"
    },
    {
      id: 3,
      nombres: "Jorge Abel",
      apellidos: "Sandovares",
      dni: "27.921.696",
      cuil: "20-27921696-5",
      cargo: "chofer",
      sector: "administracion",
      fechaIngreso: "2009-06-23",
      fechaNacimiento: "1980-02-08",
      telefono: "3574-418354",
      email: "abelsandovares@gmail.com",
      direccion: "Achaval Rodríguez 263. Río Primero",
      salario: 520000,
      estadoCivil: "casado",
      contactoEmergencia: "Esposa",
      telefonoEmergencia: "3574-405554",
      parentescoEmergencia: "conyuge",
      estado: "inactivo",
      nivelEducativo: "secundario-completo",
      titulo: "No posee",
      otrosConocimientos: "-",
      grupoSanguineo: "A+",
      alergias: "No",
      medicacionHabitual: "Sí (Metformina)",
      obraSocial: "Sí (Sancor)",
      observaciones: "Licencia de conducir tipo E1, vencimiento 18/7/2025. Hijos: Victoria Moscati Mendoza (16 años), Rafael Sandovares (6 años), Bautista Sandovares (5 años)"
    },
    {
      id: 4,
      nombres: "Juan Sebastián",
      apellidos: "Peralta",
      dni: "39.581.105",
      cuil: "20-39581105-8",
      cargo: "operario-produccion",
      sector: "produccion",
      fechaIngreso: "2024-11-04",
      fechaNacimiento: "1996-02-14",
      telefono: "3574-409910",
      email: "jp4739391@gmail.com",
      direccion: "Av. Sarmiento 238",
      salario: 450000,
      estadoCivil: "union-convivencial",
      contactoEmergencia: "Ariane Acosta",
      telefonoEmergencia: "3574-638980",
      parentescoEmergencia: "conyuge",
      estado: "activo",
      nivelEducativo: "secundario-incompleto",
      titulo: "No posee",
      otrosConocimientos: "Panadería",
      grupoSanguineo: "B+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "No",
      observaciones: "Sin licencia de conducir. Hijos: Mohana Simone Peralta (3 años)"
    },
    {
      id: 5,
      nombres: "Gerardo Damián",
      apellidos: "Mateo",
      dni: "34.671.654",
      cuil: "20-34671654-7",
      cargo: "chofer",
      sector: "administracion",
      fechaIngreso: "2023-08-04",
      fechaNacimiento: "1989-10-23",
      telefono: "3574-651097",
      email: "gerardomateoonano@gmail.com",
      direccion: "Pasaje Rodolfo Senn 308. Río Primero",
      salario: 520000,
      estadoCivil: "union-convivencial",
      contactoEmergencia: "Amalia",
      telefonoEmergencia: "3573-467086",
      parentescoEmergencia: "conyuge",
      estado: "activo",
      nivelEducativo: "primario-completo",
      titulo: "No posee",
      otrosConocimientos: "-",
      grupoSanguineo: "O+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "Sí (Oscep)",
      observaciones: "Licencia de conducir, vencimiento 14/1/2025. Hijos: Bruno Mateo (10 años), Carolina Mateo (4 años), Emiliana Mateo (3 años)"
    },
    {
      id: 6,
      nombres: "María Virginia",
      apellidos: "Ludueña Malano",
      dni: "37.874.590",
      cuil: "27-37874590-6",
      cargo: "administracion",
      sector: "administracion",
      fechaIngreso: "2024-12-20",
      fechaNacimiento: "1994-09-13",
      telefono: "3574-414832",
      email: "mvirlm@gmail.com",
      direccion: "Belgrano 81. Río Primero",
      salario: 650000,
      estadoCivil: "soltero",
      contactoEmergencia: "Matías Ribetti",
      telefonoEmergencia: "3516-168269",
      parentescoEmergencia: "otro",
      estado: "inactivo",
      nivelEducativo: "universitario-completo",
      titulo: "Lic. en Administración",
      otrosConocimientos: "-",
      grupoSanguineo: "A+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "Sí (Met)",
      observaciones: "Licencia de conducir tipo B2, vencimiento 11/4/2029. Sin hijos"
    },
    {
      id: 7,
      nombres: "Gabriel Felipe",
      apellidos: "Farías",
      dni: "41.411.770",
      cuil: "20-41411770-9",
      cargo: "chofer",
      sector: "administracion",
      fechaIngreso: "2024-10-01",
      fechaNacimiento: "1999-01-26",
      telefono: "3574-418308",
      email: "gf41411770@gmail.com",
      direccion: "Cipriano Malgarejo 404. Río Primero",
      salario: 520000,
      estadoCivil: "soltero",
      contactoEmergencia: "Luciana",
      telefonoEmergencia: "3512-079199",
      parentescoEmergencia: "otro",
      estado: "inactivo",
      nivelEducativo: "secundario-completo",
      titulo: "No posee",
      otrosConocimientos: "-",
      grupoSanguineo: "A+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "Sí (Nobis)",
      observaciones: "Licencia de conducir tipo E1, vencimiento 25/4/2026. Hijos: Felipe Farías (4 años)"
    },
    {
      id: 8,
      nombres: "Marcelo Edgar",
      apellidos: "Mangold",
      dni: "40.026.130",
      cuil: "20-40026130-1",
      cargo: "operario-produccion",
      sector: "produccion",
      fechaIngreso: "2019-05-02",
      fechaNacimiento: "1997-01-20",
      telefono: "3533-418765",
      email: "mangoldmarceloedgar@gmail.com",
      direccion: "Zona Rural. Los Guindos",
      salario: 450000,
      estadoCivil: "soltero",
      contactoEmergencia: "Rocío Mangold",
      telefonoEmergencia: "3574-455584",
      parentescoEmergencia: "hermano",
      estado: "activo",
      nivelEducativo: "secundario-incompleto",
      titulo: "No posee",
      otrosConocimientos: "Tambo",
      grupoSanguineo: "O-",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "Sí (Osprera)",
      observaciones: "Licencia de conducir tipo B1, vencimiento 22/12/2025. Hijos: Pilar Alfonsina Mangold (2 años), Chloe Olivia Mangold (2 meses)"
    },
    {
      id: 9,
      nombres: "Edgar Alberto",
      apellidos: "Maidana",
      dni: "27.079.378",
      cuil: "20-27079378-2",
      cargo: "operario-mantenimiento",
      sector: "mantenimiento",
      fechaIngreso: "2025-02-08",
      fechaNacimiento: "1979-02-02",
      telefono: "3574-651443",
      email: "edgarmaidana.2279@gmail.com",
      direccion: "Belgrano 247",
      salario: 480000,
      estadoCivil: "soltero",
      contactoEmergencia: "Madre",
      telefonoEmergencia: "3574-652159",
      parentescoEmergencia: "madre",
      estado: "activo",
      nivelEducativo: "secundario-incompleto",
      titulo: "No posee",
      otrosConocimientos: "Soldadura, Construcción",
      grupoSanguineo: "O+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "No",
      observaciones: "Licencia de conducir tipo E1, vencimiento 11/5/2025. Sin hijos"
    },
    {
      id: 10,
      nombres: "Laura Roxana",
      apellidos: "Criado",
      dni: "25.089.374",
      cuil: "27-25089374-3",
      cargo: "operario-administracion",
      sector: "administracion",
      fechaIngreso: "2016-02-02",
      fechaNacimiento: "1976-10-27",
      telefono: "3574-401950",
      email: "laura_roxi33@hotmail.com",
      direccion: "José Tarditi 356",
      salario: 470000,
      estadoCivil: "soltero",
      contactoEmergencia: "Marcos Chialva",
      telefonoEmergencia: "3574-454579",
      parentescoEmergencia: "otro",
      estado: "activo",
      nivelEducativo: "secundario-completo",
      titulo: "No posee",
      otrosConocimientos: "-",
      grupoSanguineo: "A+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "Sí (Osprera)",
      observaciones: "Sin licencia de conducir. Sin hijos"
    },
    {
      id: 11,
      nombres: "Lucas Milton",
      apellidos: "Bonetto",
      dni: "38.020.563",
      cuil: "20-38020563-4",
      cargo: "chofer",
      sector: "administracion",
      fechaIngreso: "2025-07-14",
      fechaNacimiento: "1994-04-17",
      telefono: "3576-514566",
      email: "lucasbonetto1704@gmail.com",
      direccion: "Irigoyen 252",
      salario: 520000,
      estadoCivil: "soltero",
      contactoEmergencia: "María Inés Beltramone",
      telefonoEmergencia: "3576-471275",
      parentescoEmergencia: "madre",
      estado: "activo",
      nivelEducativo: "secundario-completo",
      titulo: "No posee",
      otrosConocimientos: "Inglés básico",
      grupoSanguineo: "AB+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "No",
      observaciones: "Licencia de conducir tipo E1, vencimiento 3/8/2028. Sin hijos"
    },
    {
      id: 12,
      nombres: "Daniel Ángel",
      apellidos: "Zenteno Choque",
      dni: "42.338.815",
      cuil: "20-42338815-6",
      cargo: "operario-produccion",
      sector: "produccion",
      fechaIngreso: "2025-07-23",
      fechaNacimiento: "1999-12-28",
      telefono: "3574-436540",
      email: "danielzentenozenteno4@gmail.com",
      direccion: "Zona Rural (loteo Delich) S/N",
      salario: 450000,
      estadoCivil: "soltero",
      contactoEmergencia: "Sandra",
      telefonoEmergencia: "3574-436650",
      parentescoEmergencia: "hermano",
      estado: "inactivo",
      nivelEducativo: "secundario-incompleto",
      titulo: "No posee",
      otrosConocimientos: "-",
      grupoSanguineo: "O+",
      alergias: "No",
      medicacionHabitual: "No",
      obraSocial: "No",
      observaciones: "Sin licencia de conducir. Sin hijos"
    }
  ]);

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
    setEmployees((prev) => {
      if (data.id) {
        return prev.map((e) => (e.id === data.id ? { ...e, ...data } : e));
      }
      const newId = Math.max(0, ...prev.map((e) => e.id)) + 1;
      return [{ ...data, id: newId }, ...prev];
    });
    setView("list");
    setSelectedEmployee(null);
    setIsEditing(false);
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