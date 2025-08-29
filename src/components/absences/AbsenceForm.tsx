import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AbsenceFormProps {
  onBack: () => void;
  absence?: any;
  employees: any[];
}

const AbsenceForm = ({ onBack, absence, employees }: AbsenceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    empleadoId: absence?.empleadoId || "",
    fechaInicio: absence?.fechaInicio || "",
    fechaFin: absence?.fechaFin || "",
    tipo: absence?.tipo || "",
    motivo: absence?.motivo || "",
    certificadoMedico: absence?.certificadoMedico || false,
    archivo: absence?.archivo || null,
    observaciones: absence?.observaciones || ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, archivo: file }));
  };

  const handleSave = () => {
    if (!formData.empleadoId || !formData.fechaInicio || !formData.fechaFin || !formData.tipo || !formData.motivo) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id.toString() === formData.empleadoId);
    const empleadoNombre = selectedEmployee ? `${selectedEmployee.nombres} ${selectedEmployee.apellidos}` : "";

    toast({
      title: "Ausencia registrada",
      description: `La ausencia de ${empleadoNombre} ha sido registrada exitosamente`,
    });

    setTimeout(() => onBack(), 1500);
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
              {absence ? "Editar Ausencia" : "Nueva Ausencia"}
            </h2>
            <p className="text-foreground/70">
              {absence ? "Modifica la información de la ausencia" : "Registra una nueva ausencia o permiso"}
            </p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          {absence ? "Actualizar" : "Guardar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="empleadoId" className="text-foreground">Empleado *</Label>
              <Select onValueChange={(value) => handleInputChange("empleadoId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.nombres} {employee.apellidos} - DNI: {employee.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="tipo" className="text-foreground">Tipo de Ausencia *</Label>
              <Select onValueChange={(value) => handleInputChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de ausencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enfermedad">Enfermedad</SelectItem>
                  <SelectItem value="personal">Motivo Personal</SelectItem>
                  <SelectItem value="familiar">Motivo Familiar</SelectItem>
                  <SelectItem value="accidente">Accidente Laboral</SelectItem>
                  <SelectItem value="maternidad">Licencia por Maternidad</SelectItem>
                  <SelectItem value="paternidad">Licencia por Paternidad</SelectItem>
                  <SelectItem value="estudio">Licencia por Estudio</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="motivo" className="text-foreground">Motivo Detallado *</Label>
              <Textarea
                id="motivo"
                value={formData.motivo}
                onChange={(e) => handleInputChange("motivo", e.target.value)}
                placeholder="Describe el motivo de la ausencia..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documentación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Documentación y Certificados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="certificadoMedico"
                checked={formData.certificadoMedico}
                onCheckedChange={(checked) => handleInputChange("certificadoMedico", checked as boolean)}
              />
              <Label htmlFor="certificadoMedico" className="text-foreground">
                Requiere certificado médico
              </Label>
            </div>

            <div>
              <Label htmlFor="archivo" className="text-foreground">
                Adjuntar Archivo (Certificado, Constancia, etc.)
              </Label>
              <Input
                id="archivo"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="mt-1"
              />
              {formData.archivo && (
                <p className="text-sm text-foreground/60 mt-1 flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Archivo seleccionado: {formData.archivo.name || formData.archivo}
                </p>
              )}
              <p className="text-xs text-foreground/50 mt-1">
                Formatos permitidos: PDF, JPG, PNG, DOC, DOCX (Máx. 10MB)
              </p>
            </div>

            <div>
              <Label htmlFor="observaciones" className="text-foreground">Observaciones Adicionales</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Información adicional relevante..."
                rows={4}
              />
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">Información Importante</h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Las ausencias por enfermedad requieren certificado médico</li>
                <li>• Los permisos personales deben solicitarse con anticipación</li>
                <li>• Se debe adjuntar documentación de respaldo cuando corresponda</li>
                <li>• Las ausencias injustificadas pueden afectar la evaluación</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AbsenceForm;