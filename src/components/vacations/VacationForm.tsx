import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Save, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VacationFormProps {
  onBack: () => void;
  vacation?: any;
}

const VacationForm = ({ onBack, vacation }: VacationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    empleadoId: vacation?.empleadoId || "",
    fechaInicio: vacation?.fechaInicio || "",
    fechaFin: vacation?.fechaFin || "",
    motivo: vacation?.motivo || "",
    observaciones: vacation?.observaciones || ""
  });

  // Mock employees data
  const employees = [
    { id: 1, nombre: "María José González Pérez" },
    { id: 2, nombre: "Juan Carlos Rodríguez Silva" },
    { id: 3, nombre: "Ana Sofía Martínez López" },
    { id: 4, nombre: "Roberto Fernández Castro" },
    { id: 5, nombre: "Laura García Moreno" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateDays = () => {
    if (formData.fechaInicio && formData.fechaFin) {
      const start = new Date(formData.fechaInicio);
      const end = new Date(formData.fechaFin);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSave = () => {
    if (!formData.empleadoId || !formData.fechaInicio || !formData.fechaFin) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Solicitud guardada",
      description: "La solicitud de vacaciones ha sido registrada exitosamente",
    });

    setTimeout(() => onBack(), 1500);
  };

  const generateConstancia = () => {
    if (!formData.empleadoId) {
      toast({
        title: "Error",
        description: "Seleccione un empleado antes de generar la constancia",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Constancia generada",
      description: "La constancia de vacaciones se ha generado exitosamente",
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
              {vacation ? "Editar Solicitud" : "Nueva Solicitud de Vacaciones"}
            </h2>
            <p className="text-foreground/70">
              Completa los datos para la solicitud de vacaciones
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateConstancia}>
            <Download className="h-4 w-4 mr-2" />
            Generar Constancia
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Solicitud
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Datos de la Solicitud */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Datos de la Solicitud</CardTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaInicio" className="text-foreground">Fecha de Inicio *</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fechaFin" className="text-foreground">Fecha de Fin *</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => handleInputChange("fechaFin", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-foreground">Días Solicitados</Label>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{calculateDays()}</p>
                <p className="text-sm text-foreground/70">días laborables</p>
              </div>
            </div>

            <div>
              <Label htmlFor="motivo" className="text-foreground">Motivo</Label>
              <Select onValueChange={(value) => handleInputChange("motivo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacaciones-anuales">Vacaciones Anuales</SelectItem>
                  <SelectItem value="asuntos-personales">Asuntos Personales</SelectItem>
                  <SelectItem value="motivos-familiares">Motivos Familiares</SelectItem>
                  <SelectItem value="licencia-medica">Licencia Médica</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observaciones" className="text-foreground">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Observaciones adicionales..."
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
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Balance de Vacaciones</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <p className="text-sm text-foreground/70">Días Correspondientes</p>
                      <p className="text-2xl font-bold text-success">21</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <p className="text-sm text-foreground/70">Días Utilizados</p>
                      <p className="text-2xl font-bold text-warning">8</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-foreground/70">Días Disponibles</p>
                    <p className="text-2xl font-bold text-primary">13</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-foreground/70 mb-1">Cálculo según legislación argentina</p>
                  <p className="text-xs text-foreground/60">
                    Corresponden 21 días por año trabajado según antigüedad
                  </p>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
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

export default VacationForm;