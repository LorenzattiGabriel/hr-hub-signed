import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Save, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrainingFormProps {
  onBack: () => void;
  training?: any;
}

const TrainingForm = ({ onBack, training }: TrainingFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titulo: training?.titulo || "",
    empleadoId: training?.empleadoId || "",
    fecha: training?.fecha || "",
    duracion: training?.duracion || "",
    tipo: training?.tipo || "",
    instructor: training?.instructor || "",
    certificacion: training?.certificacion || false,
    observaciones: training?.observaciones || ""
  });

  // Mock employees data
  const employees = [
    { id: 1, nombre: "María José González Pérez" },
    { id: 2, nombre: "Juan Carlos Rodríguez Silva" },
    { id: 3, nombre: "Ana Sofía Martínez López" },
    { id: 4, nombre: "Roberto Fernández Castro" },
    { id: 5, nombre: "Laura García Moreno" }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.titulo || !formData.empleadoId || !formData.fecha) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Capacitación guardada",
      description: "La capacitación ha sido registrada exitosamente",
    });

    setTimeout(() => onBack(), 1500);
  };

  const generateCertificate = () => {
    if (!formData.titulo || !formData.empleadoId) {
      toast({
        title: "Error",
        description: "Complete los datos básicos antes de generar el certificado",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Certificado generado",
      description: "El certificado de capacitación se ha generado exitosamente",
    });
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
              {training ? "Editar Capacitación" : "Nueva Capacitación"}
            </h2>
            <p className="text-foreground/70">
              Registra los datos de la capacitación o entrenamiento
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateCertificate}>
            <Download className="h-4 w-4 mr-2" />
            Generar Certificado
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Datos de la Capacitación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Datos de la Capacitación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="titulo" className="text-foreground">Título de la Capacitación *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                placeholder="Ej: Bioseguridad en Granjas Avícolas"
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha" className="text-foreground">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="duracion" className="text-foreground">Duración (horas)</Label>
                <Input
                  id="duracion"
                  type="number"
                  value={formData.duracion}
                  onChange={(e) => handleInputChange("duracion", e.target.value)}
                  placeholder="8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tipo" className="text-foreground">Tipo de Capacitación</Label>
              <Select onValueChange={(value) => handleInputChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seguridad">Seguridad e Higiene</SelectItem>
                  <SelectItem value="tecnico">Técnico - Operativo</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="calidad">Control de Calidad</SelectItem>
                  <SelectItem value="liderazgo">Liderazgo</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="instructor" className="text-foreground">Instructor/Entidad</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleInputChange("instructor", e.target.value)}
                placeholder="Ej: Dr. Carlos Pérez - Instituto Avícola"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="certificacion"
                checked={formData.certificacion}
                onCheckedChange={(checked) => handleInputChange("certificacion", !!checked)}
              />
              <Label htmlFor="certificacion" className="text-foreground">
                Otorga certificación oficial
              </Label>
            </div>

            <div>
              <Label htmlFor="observaciones" className="text-foreground">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Notas adicionales sobre la capacitación..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información del Empleado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información del Empleado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.empleadoId ? (
              <>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    {employees.find(e => e.id.toString() === formData.empleadoId)?.nombre}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-foreground/70">Cargo</p>
                      <p className="text-foreground">Supervisora</p>
                    </div>
                    <div>
                      <p className="text-foreground/70">Sector</p>
                      <p className="text-foreground">Granja</p>
                    </div>
                    <div>
                      <p className="text-foreground/70">Antigüedad</p>
                      <p className="text-foreground">4 años</p>
                    </div>
                    <div>
                      <p className="text-foreground/70">Estado</p>
                      <p className="text-foreground">Activo</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Historial de Capacitaciones</h4>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-success/10 rounded-lg border-l-4 border-success">
                      <p className="font-medium text-foreground">Primeros Auxilios</p>
                      <p className="text-sm text-foreground/70">Completado - 15/09/2024</p>
                    </div>
                    
                    <div className="p-3 bg-success/10 rounded-lg border-l-4 border-success">
                      <p className="font-medium text-foreground">Manejo de Aves</p>
                      <p className="text-sm text-foreground/70">Completado - 20/08/2024</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Próximas Capacitaciones Requeridas</h4>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Actualización en Bioseguridad (Vence: Dic 2024)</li>
                    <li>• Capacitación en Equipos Nuevos</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <GraduationCap className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
                <p className="text-foreground/70">
                  Selecciona un empleado para ver su información
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingForm;