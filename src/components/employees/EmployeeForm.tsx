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
import LegajoPDF from "./LegajoPDF";

interface EmployeeFormProps {
  onBack: () => void;
  onSave?: (employee: any) => void;
  employee?: any;
  isEditing?: boolean;
}

const EmployeeForm = ({ onBack, onSave, employee, isEditing = false }: EmployeeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Datos Personales
    nombres: employee?.nombres || "",
    apellidos: employee?.apellidos || "",
    dni: employee?.dni || "",
    cuil: employee?.cuil || "",
    fechaNacimiento: employee?.fechaNacimiento || "",
    direccion: employee?.direccion || "",
    
    // Documentos
    fotoDni: employee?.fotoDni || null,
    fotoCarnet: employee?.fotoCarnet || null,
    
    // Datos de Contacto
    telefono: employee?.telefono || "",
    email: employee?.email || "",
    contactoEmergencia: employee?.contactoEmergencia || "",
    telefonoEmergencia: employee?.telefonoEmergencia || "",
    parentescoEmergencia: employee?.parentescoEmergencia || "",
    
    // Datos Laborales
    cargo: employee?.cargo || "",
    sector: employee?.sector || "",
    tipoContrato: employee?.tipoContrato || "",
    fechaIngreso: employee?.fechaIngreso || "",
    salario: employee?.salario || "",
    estadoCivil: employee?.estadoCivil || "",
    estado: employee?.estado || "activo",
    
    // Información Académica
    nivelEducativo: employee?.nivelEducativo || "",
    titulo: employee?.titulo || "",
    otrosConocimientos: employee?.otrosConocimientos || "",
    
    // Información Médica
    grupoSanguineo: employee?.grupoSanguineo || "",
    alergias: employee?.alergias || "",
    obraSocial: employee?.obraSocial || "",
    medicacionHabitual: employee?.medicacionHabitual || "",
    
    // Información Familiar y Licencias
    tieneHijos: employee?.tieneHijos || "",
    nombresHijos: employee?.nombresHijos || "",
    tieneLicencia: employee?.tieneLicencia || "",
    tipoLicencia: employee?.tipoLicencia || "",
    
    // Observaciones
    observaciones: employee?.observaciones || ""
  });

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const calculateAntiquity = (fechaIngreso: string) => {
    if (!fechaIngreso) return { years: 0, months: 0, days: 0 };
    
    const ingresoDate = new Date(fechaIngreso);
    const today = new Date();
    
    let years = today.getFullYear() - ingresoDate.getFullYear();
    let months = today.getMonth() - ingresoDate.getMonth();
    let days = today.getDate() - ingresoDate.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  };

  const calculateVacationDays = (fechaIngreso: string) => {
    if (!fechaIngreso) return 0;
    
    const antiquity = calculateAntiquity(fechaIngreso);
    const totalYears = antiquity.years;
    
    // Según la ley laboral argentina
    if (totalYears < 1) return 0;
    if (totalYears >= 1 && totalYears < 5) return 14;
    if (totalYears >= 5 && totalYears < 10) return 21;
    if (totalYears >= 10 && totalYears < 20) return 28;
    if (totalYears >= 20) return 35;
    
    return 14; // Por defecto
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

    // Guardar en lista (padre)
    const payload = { ...formData, id: employee?.id };
    onSave?.(payload);

    toast({
      title: isEditing ? "Empleado actualizado" : "Empleado creado",
      description: `${formData.nombres} ${formData.apellidos} ha sido ${isEditing ? 'actualizado' : 'registrado'} exitosamente`,
    });

    setTimeout(() => onBack(), 800);
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
      title: "Legajo digital generado",
      description: "El legajo completo con todos los datos se ha generado exitosamente y está listo para descarga y firma",
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
          <LegajoPDF 
            employeeData={formData}
            trigger={
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Previsualizar Legajo
              </Button>
            }
          />
          <Button variant="outline" onClick={generateLegajo}>
            <Download className="h-4 w-4 mr-2" />
            Generar PDF
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
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
              <Label htmlFor="direccion" className="text-foreground">Domicilio Completo</Label>
              <Textarea
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                placeholder="Dirección completa con ciudad y código postal"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fotoDni" className="text-foreground">Foto del DNI (Opcional)</Label>
              <Input
                id="fotoDni"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("fotoDni", e.target.files?.[0] || null)}
                className="mt-1"
              />
              {formData.fotoDni && (
                <p className="text-sm text-foreground/60 mt-1">
                  Archivo seleccionado: {formData.fotoDni.name}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="fotoCarnet" className="text-foreground">Foto Carnet (Opcional)</Label>
              <Input
                id="fotoCarnet"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange("fotoCarnet", e.target.files?.[0] || null)}
                className="mt-1"
              />
              {formData.fotoCarnet && (
                <p className="text-sm text-foreground/60 mt-1">
                  Archivo seleccionado: {formData.fotoCarnet.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Datos de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="telefono" className="text-foreground">Teléfono del Empleado</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-foreground">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="empleado@avicolapaloma.com"
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Contacto de Emergencia</h4>
              
              <div>
                <Label htmlFor="contactoEmergencia" className="text-foreground">Nombre Completo</Label>
                <Input
                  id="contactoEmergencia"
                  value={formData.contactoEmergencia}
                  onChange={(e) => handleInputChange("contactoEmergencia", e.target.value)}
                  placeholder="Nombre y apellido del contacto"
                />
              </div>

              <div>
                <Label htmlFor="parentescoEmergencia" className="text-foreground">Parentesco</Label>
                <Select value={formData.parentescoEmergencia} onValueChange={(value) => handleInputChange("parentescoEmergencia", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padre">Padre</SelectItem>
                    <SelectItem value="madre">Madre</SelectItem>
                    <SelectItem value="conyuge">Cónyuge</SelectItem>
                    <SelectItem value="hijo">Hijo/a</SelectItem>
                    <SelectItem value="hermano">Hermano/a</SelectItem>
                    <SelectItem value="abuelo">Abuelo/a</SelectItem>
                    <SelectItem value="tio">Tío/a</SelectItem>
                    <SelectItem value="amigo">Amigo/a</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
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
              <Label htmlFor="cargo" className="text-foreground">Puesto/Cargo</Label>
              <Select value={formData.cargo} onValueChange={(value) => handleInputChange("cargo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar puesto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operario-mantenimiento">Operario Mantenimiento</SelectItem>
                  <SelectItem value="operario-produccion">Operario Producción</SelectItem>
                  <SelectItem value="recursos-humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="administracion">Administración</SelectItem>
                  <SelectItem value="chofer">Chofer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sector" className="text-foreground">Sector</Label>
              <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administracion">Administración</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="produccion">Producción</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipoContrato" className="text-foreground">Tipo de Contrato</Label>
              <Select value={formData.tipoContrato} onValueChange={(value) => handleInputChange("tipoContrato", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indefinido">Contrato por tiempo indeterminado</SelectItem>
                  <SelectItem value="temporal">Contrato temporal</SelectItem>
                  <SelectItem value="obra">Contrato por obra o servicio</SelectItem>
                  <SelectItem value="pasantia">Pasantía</SelectItem>
                  <SelectItem value="eventual">Trabajo eventual</SelectItem>
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

            <div>
              <Label htmlFor="estado" className="text-foreground">Estado del Empleado</Label>
              <Select onValueChange={(value) => handleInputChange("estado", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="licencia">En Licencia</SelectItem>
                  <SelectItem value="suspension">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Información calculada automáticamente */}
            {formData.fechaIngreso && (
              <div className="space-y-2 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <h4 className="font-semibold text-foreground">Información Calculada</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-foreground">Antigüedad:</Label>
                    <p className="text-foreground/80">
                      {(() => {
                        const antiquity = calculateAntiquity(formData.fechaIngreso);
                        return `${antiquity.years} años, ${antiquity.months} meses, ${antiquity.days} días`;
                      })()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-foreground">Días de Vacaciones Anuales:</Label>
                    <p className="text-foreground/80">
                      {calculateVacationDays(formData.fechaIngreso)} días
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información Académica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información Académica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nivelEducativo" className="text-foreground">Nivel Educativo Alcanzado</Label>
              <Select onValueChange={(value) => handleInputChange("nivelEducativo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel educativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primario-incompleto">Primario Incompleto</SelectItem>
                  <SelectItem value="primario-completo">Primario Completo</SelectItem>
                  <SelectItem value="secundario-incompleto">Secundario Incompleto</SelectItem>
                  <SelectItem value="secundario-completo">Secundario Completo</SelectItem>
                  <SelectItem value="terciario-incompleto">Terciario Incompleto</SelectItem>
                  <SelectItem value="terciario-completo">Terciario Completo</SelectItem>
                  <SelectItem value="universitario-incompleto">Universitario Incompleto</SelectItem>
                  <SelectItem value="universitario-completo">Universitario Completo</SelectItem>
                  <SelectItem value="posgrado">Posgrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="titulo" className="text-foreground">Título Obtenido</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                placeholder="Ej: Bachiller en Ciencias Naturales, Técnico en..."
              />
            </div>

            <div>
              <Label htmlFor="otrosConocimientos" className="text-foreground">Otros Conocimientos</Label>
              <Textarea
                id="otrosConocimientos"
                value={formData.otrosConocimientos}
                onChange={(e) => handleInputChange("otrosConocimientos", e.target.value)}
                placeholder="Cursos, capacitaciones, idiomas, habilidades técnicas, etc."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información Médica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información Médica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="grupoSanguineo" className="text-foreground">Grupo Sanguíneo</Label>
              <Select onValueChange={(value) => handleInputChange("grupoSanguineo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar grupo sanguíneo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="obraSocial" className="text-foreground">Obra Social</Label>
              <Input
                id="obraSocial"
                value={formData.obraSocial}
                onChange={(e) => handleInputChange("obraSocial", e.target.value)}
                placeholder="Nombre de la obra social y número de afiliado"
              />
            </div>

            <div>
              <Label htmlFor="alergias" className="text-foreground">Alergias</Label>
              <Textarea
                id="alergias"
                value={formData.alergias}
                onChange={(e) => handleInputChange("alergias", e.target.value)}
                placeholder="Detallar alergias conocidas (medicamentos, alimentos, sustancias, etc.)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="medicacionHabitual" className="text-foreground">Medicación Habitual</Label>
              <Textarea
                id="medicacionHabitual"
                value={formData.medicacionHabitual}
                onChange={(e) => handleInputChange("medicacionHabitual", e.target.value)}
                placeholder="Medicamentos que toma regularmente, dosis y frecuencia"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información Familiar y Licencias */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Información Familiar y Licencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tieneHijos" className="text-foreground">¿Tiene Hijos?</Label>
              <Select onValueChange={(value) => handleInputChange("tieneHijos", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tieneHijos === "si" && (
              <div>
                <Label htmlFor="nombresHijos" className="text-foreground">Nombres de los Hijos</Label>
                <Textarea
                  id="nombresHijos"
                  value={formData.nombresHijos}
                  onChange={(e) => handleInputChange("nombresHijos", e.target.value)}
                  placeholder="Ingrese los nombres de los hijos"
                  rows={2}
                />
              </div>
            )}

            <div>
              <Label htmlFor="tieneLicencia" className="text-foreground">¿Posee Licencia de Conducir?</Label>
              <Select onValueChange={(value) => handleInputChange("tieneLicencia", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tieneLicencia === "si" && (
              <div>
                <Label htmlFor="tipoLicencia" className="text-foreground">Tipo de Licencia</Label>
                <Select onValueChange={(value) => handleInputChange("tipoLicencia", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de licencia" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border max-h-[200px] overflow-y-auto z-50">
                    {/* Clase A (Motos y Ciclomotores) */}
                    <SelectItem value="A.1.1">A.1.1: Ciclomotores</SelectItem>
                    <SelectItem value="A.1.2">A.1.2: Motocicletas de hasta 150 cc</SelectItem>
                    <SelectItem value="A.1.3">A.1.3: Motocicletas de más de 150 cc hasta 300 cc</SelectItem>
                    <SelectItem value="A.1.4">A.1.4: Motocicletas de más de 300 cc</SelectItem>
                    <SelectItem value="A.2.1">A.2.1: Motocicletas, triciclos y cuatriciclos</SelectItem>
                    <SelectItem value="A.2.2">A.2.2: Triciclos y cuatriciclos de más de 300 kg</SelectItem>
                    
                    {/* Clase B (Automóviles y Camionetas) */}
                    <SelectItem value="B.1">B.1: Automóviles, utilitarios, camionetas y casas rodantes hasta 3.500 kg</SelectItem>
                    <SelectItem value="B.2">B.2: Automóviles, utilitarios, camionetas y casas rodantes de más de 3.500 kg</SelectItem>
                    
                    {/* Clase C (Vehículos de Carga) */}
                    <SelectItem value="C.1">C.1: Camiones hasta 12.000 kg</SelectItem>
                    <SelectItem value="C.2">C.2: Camiones de más de 12.000 kg</SelectItem>
                    <SelectItem value="C.3">C.3: Vehículos de carga pesada</SelectItem>
                    
                    {/* Clase D (Transporte de Pasajeros) */}
                    <SelectItem value="D.1">D.1: Transporte de hasta 8 pasajeros</SelectItem>
                    <SelectItem value="D.2">D.2: Transporte de más de 8 pasajeros</SelectItem>
                    <SelectItem value="D.3">D.3: Vehículos de emergencia y seguridad</SelectItem>
                    
                    {/* Clase E (Vehículos Articulados) */}
                    <SelectItem value="E.1">E.1: Vehículos de carga con remolque o semirremolque</SelectItem>
                    <SelectItem value="E.2">E.2: Vehículos de pasajeros con remolque o articulados</SelectItem>
                    
                    {/* Clase G (Maquinaria Especial) */}
                    <SelectItem value="G.1">G.1: Tractores</SelectItem>
                    <SelectItem value="G.2">G.2: Maquinaria agrícola, de construcción y vial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Observaciones Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="observaciones" className="text-foreground">Otras Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Cualquier información adicional relevante sobre el empleado..."
                rows={4}
              />
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">Información sobre el Legajo Digital</h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• El legajo PDF incluirá todos los datos ingresados</li>
                <li>• Se generará con espacios para firma y aclaración</li>
                <li>• Documento listo para imprimir y firmar</li>
                <li>• Cumple con requisitos legales de documentación laboral</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeForm;