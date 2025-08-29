import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmployeeFormProps {
  onBack: () => void;
  employee?: any;
  isEditing?: boolean;
}

const EmployeeForm = ({ onBack, employee, isEditing = false }: EmployeeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombres: employee?.nombres || "",
    apellidos: employee?.apellidos || "",
    dni: employee?.dni || "",
    cuil: employee?.cuil || "",
    fechaNacimiento: employee?.fechaNacimiento || "",
    telefono: employee?.telefono || "",
    email: employee?.email || "",
    direccion: employee?.direccion || "",
    cargo: employee?.cargo || "",
    sector: employee?.sector || "",
    fechaIngreso: employee?.fechaIngreso || "",
    salario: employee?.salario || "",
    estadoCivil: employee?.estadoCivil || "",
    contactoEmergencia: employee?.contactoEmergencia || "",
    telefonoEmergencia: employee?.telefonoEmergencia || "",
    observaciones: employee?.observaciones || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validaciones básicas
    if (!formData.nombres || !formData.apellidos || !formData.dni) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios (Nombres, Apellidos, DNI)",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: isEditing ? "Empleado actualizado" : "Empleado creado",
      description: `${formData.nombres} ${formData.apellidos} ha sido ${isEditing ? 'actualizado' : 'registrado'} exitosamente`,
    });

    setTimeout(() => onBack(), 1500);
  };

  const generateLegajo = () => {
    if (!formData.nombres || !formData.apellidos) {
      toast({
        title: "Error",
        description: "Complete los datos básicos antes de generar el legajo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Legajo generado",
      description: "El legajo digital se ha generado exitosamente y está listo para descargar",
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
              {isEditing ? "Editar Empleado" : "Nuevo Empleado"}
            </h2>
            <p className="text-foreground/70">
              {isEditing ? "Modifica la información del empleado" : "Completa los datos para crear el legajo digital"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateLegajo}>
            <FileText className="h-4 w-4 mr-2" />
            Generar Legajo PDF
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Datos Personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres" className="text-foreground">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange("nombres", e.target.value)}
                  placeholder="Nombres completos"
                />
              </div>
              <div>
                <Label htmlFor="apellidos" className="text-foreground">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  placeholder="Apellidos completos"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dni" className="text-foreground">DNI *</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => handleInputChange("dni", e.target.value)}
                  placeholder="12345678"
                />
              </div>
              <div>
                <Label htmlFor="cuil" className="text-foreground">CUIL</Label>
                <Input
                  id="cuil"
                  value={formData.cuil}
                  onChange={(e) => handleInputChange("cuil", e.target.value)}
                  placeholder="20-12345678-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaNacimiento" className="text-foreground">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="estadoCivil" className="text-foreground">Estado Civil</Label>
                <Select onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soltero">Soltero/a</SelectItem>
                    <SelectItem value="casado">Casado/a</SelectItem>
                    <SelectItem value="divorciado">Divorciado/a</SelectItem>
                    <SelectItem value="viudo">Viudo/a</SelectItem>
                    <SelectItem value="union-convivencial">Unión Convivencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="direccion" className="text-foreground">Dirección</Label>
              <Textarea
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                placeholder="Dirección completa"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="telefono" className="text-foreground">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="empleado@avicolapaloma.com"
              />
            </div>

            <div>
              <Label htmlFor="contactoEmergencia" className="text-foreground">Contacto de Emergencia</Label>
              <Input
                id="contactoEmergencia"
                value={formData.contactoEmergencia}
                onChange={(e) => handleInputChange("contactoEmergencia", e.target.value)}
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <Label htmlFor="telefonoEmergencia" className="text-foreground">Teléfono de Emergencia</Label>
              <Input
                id="telefonoEmergencia"
                value={formData.telefonoEmergencia}
                onChange={(e) => handleInputChange("telefonoEmergencia", e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            <div>
              <Label htmlFor="observaciones" className="text-foreground">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Notas adicionales..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Datos Laborales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información Laboral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cargo" className="text-foreground">Cargo</Label>
              <Select onValueChange={(value) => handleInputChange("cargo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operario">Operario</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="encargado">Encargado</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="veterinario">Veterinario</SelectItem>
                  <SelectItem value="conductor">Conductor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sector" className="text-foreground">Sector</Label>
              <Select onValueChange={(value) => handleInputChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="granja">Granja</SelectItem>
                  <SelectItem value="incubacion">Incubación</SelectItem>
                  <SelectItem value="procesamiento">Procesamiento</SelectItem>
                  <SelectItem value="administracion">Administración</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="ventas">Ventas</SelectItem>
                  <SelectItem value="calidad">Control de Calidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fechaIngreso" className="text-foreground">Fecha de Ingreso</Label>
              <Input
                id="fechaIngreso"
                type="date"
                value={formData.fechaIngreso}
                onChange={(e) => handleInputChange("fechaIngreso", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="salario" className="text-foreground">Salario Básico</Label>
              <Input
                id="salario"
                type="number"
                value={formData.salario}
                onChange={(e) => handleInputChange("salario", e.target.value)}
                placeholder="450000"
              />
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Estado del Empleado</p>
                  <p className="text-sm text-foreground/70">Empleado activo</p>
                </div>
                <Badge variant="success">Activo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeForm;