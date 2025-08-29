import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Search, Download, TrendingUp, Award, Users } from "lucide-react";
import PerformanceForm from "./PerformanceForm";
import PerformanceDetail from "./PerformanceDetail";
import { useToast } from "@/hooks/use-toast";

const PerformanceList = () => {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [selectedPerformance, setSelectedPerformance] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");

  // Mock performance evaluations data
  const mockEvaluations = [
    {
      id: 1,
      empleadoId: 1,
      empleadoNombre: "María José González",
      periodo: "2024-Q4",
      fechaEvaluacion: "2024-11-15",
      evaluador: "Gerente de Área",
      puntuacionGeneral: 92,
      competencias: {
        tecnicas: 90,
        liderazgo: 95,
        comunicacion: 88,
        puntualidad: 98,
        trabajoEquipo: 92
      },
      objetivos: {
        cumplimiento: 95,
        calidad: 90,
        eficiencia: 88
      },
      estado: "completado",
      observaciones: "Excelente desempeño, candidata a promoción",
      fortalezas: ["Liderazgo natural", "Excelente comunicación", "Proactiva"],
      areasDesarrollo: ["Gestión del tiempo", "Conocimientos técnicos avanzados"]
    },
    {
      id: 2,
      empleadoId: 4,
      empleadoNombre: "Roberto Fernández",
      periodo: "2024-Q4",
      fechaEvaluacion: "2024-11-10",
      evaluador: "Supervisor Técnico",
      puntuacionGeneral: 85,
      competencias: {
        tecnicas: 95,
        liderazgo: 80,
        comunicacion: 82,
        puntualidad: 92,
        trabajoEquipo: 88
      },
      objetivos: {
        cumplimiento: 90,
        calidad: 95,
        eficiencia: 85
      },
      estado: "completado",
      observaciones: "Sólido desempeño técnico, mejorar habilidades de comunicación",
      fortalezas: ["Experto técnico", "Confiable", "Orientado a resultados"],
      areasDesarrollo: ["Comunicación interpersonal", "Flexibilidad"]
    },
    {
      id: 3,
      empleadoId: 2,
      empleadoNombre: "Juan Carlos Rodríguez",
      periodo: "2024-Q4",
      fechaEvaluacion: "2024-11-20",
      evaluador: "Jefe de Operaciones",
      puntuacionGeneral: 78,
      competencias: {
        tecnicas: 85,
        liderazgo: 70,
        comunicacion: 75,
        puntualidad: 65,
        trabajoEquipo: 80
      },
      objetivos: {
        cumplimiento: 75,
        calidad: 80,
        eficiencia: 78
      },
      estado: "en-progreso",
      observaciones: "Necesita mejorar puntualidad y cumplimiento de objetivos",
      fortalezas: ["Conocimiento del proceso", "Buena actitud"],
      areasDesarrollo: ["Puntualidad", "Organización", "Proactividad"]
    }
  ];

  const filteredEvaluations = mockEvaluations.filter(evaluation => {
    const matchesSearch = evaluation.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = !filterPeriod || evaluation.periodo === filterPeriod;
    return matchesSearch && matchesPeriod;
  });

  const handleNewEvaluation = () => {
    setSelectedPerformance(null);
    setView("form");
  };

  const handleViewEvaluation = (evaluation: any) => {
    setSelectedPerformance(evaluation);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedPerformance(null);
  };

  const generateReport = () => {
    toast({
      title: "Reporte generado",
      description: "El reporte de evaluaciones se ha generado exitosamente",
    });
  };

  if (view === "form") {
    return <PerformanceForm onBack={handleBackToList} evaluation={selectedPerformance} />;
  }

  if (view === "detail" && selectedPerformance) {
    return <PerformanceDetail evaluation={selectedPerformance} onBack={handleBackToList} />;
  }

  // Calculate averages
  const avgScore = Math.round(mockEvaluations.reduce((sum, evaluation) => sum + evaluation.puntuacionGeneral, 0) / mockEvaluations.length);
  const highPerformers = mockEvaluations.filter(evaluation => evaluation.puntuacionGeneral >= 90).length;
  const needsImprovement = mockEvaluations.filter(evaluation => evaluation.puntuacionGeneral < 80).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Star className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Evaluación de Desempeño</h2>
            <p className="text-foreground/70">Gestiona las evaluaciones y seguimiento del rendimiento</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte General
          </Button>
          <Button onClick={handleNewEvaluation}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Evaluación
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Evaluaciones Completadas</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockEvaluations.filter(e => e.estado === "completado").length}
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
                <p className="text-sm font-medium text-foreground/70">Puntuación Promedio</p>
                <p className="text-3xl font-bold text-foreground">{avgScore}</p>
                <p className="text-xs text-foreground/60">sobre 100</p>
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
                <p className="text-sm font-medium text-foreground/70">Alto Rendimiento</p>
                <p className="text-3xl font-bold text-foreground">{highPerformers}</p>
                <p className="text-xs text-foreground/60">empleados ≥90</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Star className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Necesita Mejora</p>
                <p className="text-3xl font-bold text-foreground">{needsImprovement}</p>
                <p className="text-xs text-foreground/60">empleados &lt;80</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Users className="h-6 w-6 text-warning" />
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
            
            <Select onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los períodos</SelectItem>
                <SelectItem value="2024-Q4">Q4 2024</SelectItem>
                <SelectItem value="2024-Q3">Q3 2024</SelectItem>
                <SelectItem value="2024-Q2">Q2 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvaluations.map((evaluation) => (
          <Card key={evaluation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{evaluation.empleadoNombre}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={evaluation.estado === "completado" ? "success" : "warning"}>
                    {evaluation.estado === "completado" ? "Completado" : "En Progreso"}
                  </Badge>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      evaluation.puntuacionGeneral >= 90 ? 'text-success' :
                      evaluation.puntuacionGeneral >= 80 ? 'text-primary' :
                      evaluation.puntuacionGeneral >= 70 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {evaluation.puntuacionGeneral}
                    </div>
                    <div className="text-xs text-foreground/60">puntos</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground/70">Período</p>
                  <p className="text-foreground">{evaluation.periodo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/70">Evaluador</p>
                  <p className="text-foreground text-sm">{evaluation.evaluador}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-2">Competencias Clave</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{evaluation.competencias.tecnicas}</div>
                    <div className="text-xs text-foreground/60">Técnicas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{evaluation.competencias.liderazgo}</div>
                    <div className="text-xs text-foreground/60">Liderazgo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{evaluation.competencias.comunicacion}</div>
                    <div className="text-xs text-foreground/60">Comunicación</div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground/70 mb-2">Cumplimiento de Objetivos</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Cumplimiento</span>
                    <span className="font-medium text-foreground">{evaluation.objetivos.cumplimiento}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${evaluation.objetivos.cumplimiento}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {evaluation.observaciones && (
                <div>
                  <p className="text-sm font-medium text-foreground/70">Observaciones</p>
                  <p className="text-foreground text-sm truncate">{evaluation.observaciones}</p>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleViewEvaluation(evaluation)}>
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

      {filteredEvaluations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No se encontraron evaluaciones
            </h3>
            <p className="text-foreground/70">
              No hay evaluaciones que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceList;