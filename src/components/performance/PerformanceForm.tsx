import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Star, Save, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/contexts/EmployeeContext";

interface PerformanceFormProps {
  onBack: () => void;
  evaluation?: any;
}

const PerformanceForm = ({ onBack, evaluation }: PerformanceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    empleadoId: evaluation?.empleadoId || "",
    periodo: evaluation?.periodo || "",
    evaluador: evaluation?.evaluador || "",
    competencias: {
      tecnicas: evaluation?.competencias?.tecnicas || [75],
      liderazgo: evaluation?.competencias?.liderazgo || [75],
      comunicacion: evaluation?.competencias?.comunicacion || [75],
      puntualidad: evaluation?.competencias?.puntualidad || [75],
      trabajoEquipo: evaluation?.competencias?.trabajoEquipo || [75]
    },
    objetivos: {
      cumplimiento: evaluation?.objetivos?.cumplimiento || [75],
      calidad: evaluation?.objetivos?.calidad || [75],
      eficiencia: evaluation?.objetivos?.eficiencia || [75]
    },
    observaciones: evaluation?.observaciones || "",
    fortalezas: evaluation?.fortalezas?.join(", ") || "",
    areasDesarrollo: evaluation?.areasDesarrollo?.join(", ") || ""
  });

  // Employees from context
  const { employees: employeesCtx } = useEmployees();
  const employees = employeesCtx.map(emp => ({ id: emp.id, nombre: `${emp.nombres} ${emp.apellidos}` }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompetenciaChange = (competencia: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      competencias: {
        ...prev.competencias,
        [competencia]: value
      }
    }));
  };

  const handleObjetivoChange = (objetivo: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      objetivos: {
        ...prev.objetivos,
        [objetivo]: value
      }
    }));
  };

  const calculateOverallScore = () => {
    const competenciasAvg = Object.values(formData.competencias).reduce((sum, val) => sum + val[0], 0) / 5;
    const objetivosAvg = Object.values(formData.objetivos).reduce((sum, val) => sum + val[0], 0) / 3;
    return Math.round((competenciasAvg + objetivosAvg) / 2);
  };

  const handleSave = () => {
    if (!formData.empleadoId || !formData.periodo || !formData.evaluador) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Evaluación guardada",
      description: "La evaluación de desempeño ha sido registrada exitosamente",
    });

    setTimeout(() => onBack(), 1500);
  };

  const generateReport = () => {
    if (!formData.empleadoId) {
      toast({
        title: "Error",
        description: "Seleccione un empleado antes de generar el reporte",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reporte generado",
      description: "El reporte de evaluación se ha generado exitosamente",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {evaluation ? "Editar Evaluación" : "Nueva Evaluación de Desempeño"}
            </h2>
            <p className="text-foreground/70">
              Completa la evaluación de rendimiento del empleado
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(calculateOverallScore())}`}>
              {calculateOverallScore()}
            </div>
            <div className="text-sm text-foreground/70">Puntuación General</div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={generateReport}>
              <Download className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="empleado" className="text-foreground">Empleado *</Label>
              <Select onValueChange={(value) => handleInputChange("empleadoId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="periodo" className="text-foreground">Período de Evaluación *</Label>
              <Select onValueChange={(value) => handleInputChange("periodo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-Q4">Q4 2024</SelectItem>
                  <SelectItem value="2024-Q3">Q3 2024</SelectItem>
                  <SelectItem value="2024-Q2">Q2 2024</SelectItem>
                  <SelectItem value="2024-Q1">Q1 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="evaluador" className="text-foreground">Evaluador *</Label>
              <Select onValueChange={(value) => handleInputChange("evaluador", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar evaluador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gerente de Área">Gerente de Área</SelectItem>
                  <SelectItem value="Supervisor Técnico">Supervisor Técnico</SelectItem>
                  <SelectItem value="Jefe de Operaciones">Jefe de Operaciones</SelectItem>
                  <SelectItem value="Director de RRHH">Director de RRHH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.empleadoId && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Información del Empleado</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Cargo:</span>
                    <span className="text-foreground">Supervisora</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Sector:</span>
                    <span className="text-foreground">Granja</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Antigüedad:</span>
                    <span className="text-foreground">4 años</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Competencias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Evaluación de Competencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-foreground">Habilidades Técnicas</Label>
                <span className="font-semibold text-foreground">{formData.competencias.tecnicas[0]}</span>
              </div>
              <Slider
                value={formData.competencias.tecnicas}
                onValueChange={(value) => handleCompetenciaChange("tecnicas", value)}
                max={100}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-foreground/60">
                <span>Necesita Mejora</span>
                <span>Excelente</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-foreground">Liderazgo</Label>
                <span className="font-semibold text-foreground">{formData.competencias.liderazgo[0]}</span>
              </div>
              <Slider
                value={formData.competencias.liderazgo}
                onValueChange={(value) => handleCompetenciaChange("liderazgo", value)}
                max={100}
                step={5}
                className="mb-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-foreground">Comunicación</Label>
                <span className="font-semibold text-foreground">{formData.competencias.comunicacion[0]}</span>
              </div>
              <Slider
                value={formData.competencias.comunicacion}
                onValueChange={(value) => handleCompetenciaChange("comunicacion", value)}
                max={100}
                step={5}
                className="mb-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-foreground">Puntualidad</Label>
                <span className="font-semibold text-foreground">{formData.competencias.puntualidad[0]}</span>
              </div>
              <Slider
                value={formData.competencias.puntualidad}
                onValueChange={(value) => handleCompetenciaChange("puntualidad", value)}
                max={100}
                step={5}
                className="mb-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-foreground">Trabajo en Equipo</Label>
                <span className="font-semibold text-foreground">{formData.competencias.trabajoEquipo[0]}</span>
              </div>
              <Slider
                value={formData.competencias.trabajoEquipo}
                onValueChange={(value) => handleCompetenciaChange("trabajoEquipo", value)}
                max={100}
                step={5}
                className="mb-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Objetivos y Comentarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Objetivos y Comentarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Cumplimiento de Objetivos</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-foreground">Cumplimiento</Label>
                    <span className="font-semibold text-foreground">{formData.objetivos.cumplimiento[0]}%</span>
                  </div>
                  <Slider
                    value={formData.objetivos.cumplimiento}
                    onValueChange={(value) => handleObjetivoChange("cumplimiento", value)}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-foreground">Calidad</Label>
                    <span className="font-semibold text-foreground">{formData.objetivos.calidad[0]}%</span>
                  </div>
                  <Slider
                    value={formData.objetivos.calidad}
                    onValueChange={(value) => handleObjetivoChange("calidad", value)}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-foreground">Eficiencia</Label>
                    <span className="font-semibold text-foreground">{formData.objetivos.eficiencia[0]}%</span>
                  </div>
                  <Slider
                    value={formData.objetivos.eficiencia}
                    onValueChange={(value) => handleObjetivoChange("eficiencia", value)}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="fortalezas" className="text-foreground">Fortalezas Principales</Label>
              <Textarea
                id="fortalezas"
                value={formData.fortalezas}
                onChange={(e) => handleInputChange("fortalezas", e.target.value)}
                placeholder="Ej: Liderazgo natural, Excelente comunicación..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="areasDesarrollo" className="text-foreground">Áreas de Desarrollo</Label>
              <Textarea
                id="areasDesarrollo"
                value={formData.areasDesarrollo}
                onChange={(e) => handleInputChange("areasDesarrollo", e.target.value)}
                placeholder="Ej: Gestión del tiempo, Conocimientos técnicos..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="observaciones" className="text-foreground">Observaciones Generales</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Comentarios adicionales sobre el desempeño..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceForm;