import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Plus, Search, Download, BookOpen, Award, Users } from "lucide-react";
import TrainingForm from "./TrainingForm";
import TrainingDetail from "./TrainingDetail";
import { useToast } from "@/hooks/use-toast";

const TrainingList = () => {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Mock data
  const mockTrainings = [
    {
      id: 1,
      titulo: "Bioseguridad en Granjas Avícolas",
      empleadoId: 1,
      empleadoNombre: "María José González",
      fecha: "2024-11-15",
      duracion: 8,
      tipo: "seguridad",
      instructor: "Dr. Carlos Pérez",
      estado: "completado",
      certificacion: true,
      observaciones: "Excelente participación"
    },
    {
      id: 2,
      titulo: "Manejo de Equipos de Incubación",
      empleadoId: 4,
      empleadoNombre: "Roberto Fernández",
      fecha: "2024-11-20",
      duracion: 6,
      tipo: "tecnico",
      instructor: "Ing. Ana Martínez",
      estado: "en-progreso",
      certificacion: false,
      observaciones: ""
    },
    {
      id: 3,
      titulo: "Primeros Auxilios en el Trabajo",
      empleadoId: 2,
      empleadoNombre: "Juan Carlos Rodríguez",
      fecha: "2024-10-05",
      duracion: 4,
      tipo: "seguridad",
      instructor: "Cruz Roja Argentina",
      estado: "completado",
      certificacion: true,
      observaciones: "Certificación vigente por 2 años"
    }
  ];

  const filteredTrainings = mockTrainings.filter(training => {
    const matchesSearch = (
      training.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesType = !filterType || training.tipo === filterType;
    return matchesSearch && matchesType;
  });

  const handleNewTraining = () => {
    setSelectedTraining(null);
    setView("form");
  };

  const handleViewTraining = (training: any) => {
    setSelectedTraining(training);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedTraining(null);
  };

  const generateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte de capacitaciones se ha generado exitosamente",
    });
  };

  if (view === "form") {
    return <TrainingForm onBack={handleBackToList} training={selectedTraining} />;
  }

  if (view === "detail" && selectedTraining) {
    return <TrainingDetail training={selectedTraining} onBack={handleBackToList} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Formación y Registros</h2>
            <p className="text-foreground/70">Gestiona las capacitaciones y entregas de uniformes</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte General
          </Button>
          <Button onClick={handleNewTraining}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Capacitación
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Total Capacitaciones</p>
                <p className="text-3xl font-bold text-foreground">{mockTrainings.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Completadas</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockTrainings.filter(t => t.estado === "completado").length}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Award className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">En Progreso</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockTrainings.filter(t => t.estado === "en-progreso").length}
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Users className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Horas Totales</p>
                <p className="text-3xl font-bold text-foreground">18</p>
                <p className="text-xs text-foreground/60">este mes</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <GraduationCap className="h-6 w-6 text-secondary" />
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
                placeholder="Buscar por capacitación o empleado..."
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
                <SelectItem value="">Todos los tipos</SelectItem>
                <SelectItem value="seguridad">Seguridad</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="calidad">Calidad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Training List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrainings.map((training) => (
          <Card key={training.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{training.titulo}</CardTitle>
                <Badge variant={training.estado === "completado" ? "success" : "warning"}>
                  {training.estado === "completado" ? "Completado" : "En Progreso"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground/70">Empleado</p>
                <p className="text-foreground">{training.empleadoNombre}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Fecha</p>
                  <p className="text-foreground">{new Date(training.fecha).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">Duración</p>
                  <p className="text-foreground">{training.duracion} horas</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Tipo</p>
                  <Badge variant="outline">
                    {training.tipo === "seguridad" ? "Seguridad" : 
                     training.tipo === "tecnico" ? "Técnico" : "Administrativo"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">Certificación</p>
                  {training.certificacion ? (
                    <Badge variant="success">Sí</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground/70">Instructor</p>
                <p className="text-foreground text-sm">{training.instructor}</p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleViewTraining(training)}>
                  Ver Detalle
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Certificado
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron capacitaciones
            </h3>
            <p className="text-foreground/70">
              No hay capacitaciones que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingList;