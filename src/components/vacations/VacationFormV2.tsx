import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Save, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVacations } from "@/hooks/useVacations";
import html2pdf from "html2pdf.js";
import { formatDateLocal } from "@/utils/dateUtils";

interface VacationFormProps {
  onBack: () => void;
  vacation?: any;
  employees: any[];
  onSave?: (requestData: any) => void;
}

const VacationForm = ({ onBack, vacation, employees, onSave }: VacationFormProps) => {
  const { toast } = useToast();
  const { getEmployeeVacationBalance } = useVacations();
  
  const [formData, setFormData] = useState({
    employee_id: vacation?.employee_id || "",
    fecha_inicio: vacation?.fecha_inicio || "",
    fecha_fin: vacation?.fecha_fin || "",
    motivo: vacation?.motivo || "",
    periodo: vacation?.periodo || "",
    observaciones: vacation?.observaciones || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateDays = () => {
    if (formData.fecha_inicio && formData.fecha_fin) {
      const start = new Date(formData.fecha_inicio);
      const end = new Date(formData.fecha_fin);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSave = () => {
    if (!formData.employee_id || !formData.fecha_inicio || !formData.fecha_fin || !formData.periodo) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios (empleado, fechas y período)",
        variant: "destructive"
      });
      return;
    }

    const diasSolicitados = calculateDays();
    const diasDisponibles = vacationDaysInfo?.availableDays || 0;

    // Validar que los días solicitados no excedan los disponibles
    if (diasSolicitados > diasDisponibles) {
      toast({
        title: "Error - Días insuficientes",
        description: `No puedes solicitar ${diasSolicitados} días. Solo tienes ${diasDisponibles} días disponibles.`,
        variant: "destructive"
      });
      return;
    }

    // Validar que no se soliciten días negativos o cero
    if (diasSolicitados <= 0) {
      toast({
        title: "Error - Fechas inválidas",
        description: "La fecha de fin debe ser posterior a la fecha de inicio.",
        variant: "destructive"
      });
      return;
    }

    const requestData = {
      ...formData,
      dias_solicitados: diasSolicitados,
      estado: "pendiente"
    };

    if (onSave) {
      onSave(requestData);
    }

    setTimeout(() => onBack(), 1500);
  };

  const generateConstancia = async () => {
    if (!formData.employee_id) {
      toast({
        title: "Error",
        description: "Seleccione un empleado antes de generar la constancia",
        variant: "destructive",
      });
      return;
    }

    // Solo permitir descarga si la solicitud está aprobada (cuando aplica)
    if (vacation && vacation.estado && vacation.estado.toLowerCase() !== "aprobado") {
      toast({
        title: "No disponible",
        description: "Solo puedes descargar la constancia de solicitudes aprobadas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const emp = employees.find(
        (e) => e.id === formData.employee_id
      );
      const employeeName = emp ? `${emp.nombres} ${emp.apellidos}` : "Empleado";
      const dni = emp?.dni ?? "";
      const days = calculateDays();
      const inicio = formatDateLocal(formData.fecha_inicio);
      const fin = formatDateLocal(formData.fecha_fin);
      const emitido = formatDateLocal(new Date().toISOString());
      
      // Calcular día posterior a la fecha de fin
      const fechaFinDate = new Date(formData.fecha_fin);
      fechaFinDate.setDate(fechaFinDate.getDate() + 1);
      const diaPosterior = formatDateLocal(fechaFinDate.toISOString().split('T')[0]);

      // Obtener la empresa del empleado
      const empresa = emp?.empresa || "";
      let empresaNombre = "SIN ASIGNAR";
      let empresaCuitFormateado = "XX-XXXXXXXX-X";
      
      if (empresa.toLowerCase() === "vematel") {
        empresaNombre = "Vematel";
        empresaCuitFormateado = "30-71638948-7";
      } else if (empresa.toLowerCase() === "servicap") {
        empresaNombre = "Servicap";
        empresaCuitFormateado = "30-71854237-1";
      }

      // Calcular antigüedad
      const fechaIngreso = emp?.fecha_ingreso || emp?.fechaIngreso;
      let antiguedadTexto = "X años";
      if (fechaIngreso) {
        const ingreso = new Date(fechaIngreso);
        const ahora = new Date();
        const antiguedadAnios = Math.floor((ahora.getTime() - ingreso.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        antiguedadTexto = `${antiguedadAnios} año${antiguedadAnios !== 1 ? 's' : ''}`;
      }

      const safeName = employeeName.replace(/\s+/g, "_");
      const fileName = `Notificacion_Vacaciones_${safeName}_${formData.periodo}.pdf`;

      const container = document.createElement("div");
      container.style.fontFamily = "Arial, sans-serif";
      container.style.color = "#000";
      container.style.backgroundColor = "#fff";
      
      container.innerHTML = `
        <!-- PÁGINA 1: Original para el empleado -->
        <div style="width:210mm; min-height:297mm; padding:20mm 25mm; box-sizing:border-box;">
          <h1 style="text-align:center; font-size:18px; font-weight:bold; margin:0 0 10px 0; letter-spacing:1px;">
            NOTIFICACIÓN DE VACACIONES
          </h1>
          
          <hr style="border:none; border-top:2px solid #000; margin:0 0 30px 0;">
          
          <p style="margin:0 0 30px 0; text-align:right; font-size:12px;">
            Córdoba, ${emitido}
          </p>
          
          <div style="margin:0 0 30px 0;">
            <p style="margin:4px 0; font-size:12px;"><strong>Razón Social:</strong> ${empresaNombre}</p>
            <p style="margin:4px 0; font-size:12px;"><strong>CUIT de la Empresa:</strong> ${empresaCuitFormateado}</p>
          </div>
          
          <div style="margin:30px 0;">
            <p style="margin:4px 0; font-size:12px;"><strong>Al Sr./Sra.</strong> ${employeeName}</p>
            <p style="margin:4px 0; font-size:12px;"><strong>Número de DNI:</strong> ${dni}</p>
          </div>
          
          <p style="margin:20px 0 10px 0; font-size:12px;">
            De nuestra mayor consideración:
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0; font-size:12px;">
            Por medio de la presente, y en cumplimiento de lo dispuesto por el Artículo 154 de la Ley de Contrato de Trabajo (LCT N° 20.744), le notificamos fehacientemente que se le otorga el goce de su licencia anual ordinaria (vacaciones) correspondiente al período ${formData.periodo}.
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0; font-size:12px;">
            Dicha licencia constará de <strong>${days}</strong> días, calculados en base a su antigüedad.
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0; font-size:12px;">
            Las vacaciones se extenderán desde el día <strong>${inicio}</strong> hasta <strong>${fin}</strong> inclusive.
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0 30px 0; font-size:12px;">
            Por lo tanto, deberá reintegrarse a sus tareas habituales el día <strong>${diaPosterior}</strong>, en su horario habitual.
          </p>
          
          <p style="margin:30px 0; font-size:12px;">
            Sin otro particular, saludamos a Ud. atentamente.
          </p>
          
          <div style="margin:80px 0 30px 0;">
            <p style="margin:0 0 4px 0;">___________________________________</p>
            <p style="margin:4px 0; font-size:12px;">Firma del Empleador o Representante de RRHH</p>
            <p style="margin:4px 0; font-size:12px;"><strong>Aclaración de Firma:</strong></p>
          </div>
        </div>
        
        <!-- PÁGINA 2: Duplicado con constancia para el empleador -->
        <div style="width:210mm; min-height:297mm; padding:20mm 25mm; box-sizing:border-box; page-break-before:always;">
          <h1 style="text-align:center; font-size:18px; font-weight:bold; margin:0 0 10px 0; letter-spacing:1px;">
            NOTIFICACIÓN DE VACACIONES
          </h1>
          
          <hr style="border:none; border-top:2px solid #000; margin:0 0 30px 0;">
          
          <p style="margin:0 0 30px 0; text-align:right; font-size:12px;">
            Córdoba, ${emitido}
          </p>
          
          <div style="margin:0 0 30px 0;">
            <p style="margin:4px 0; font-size:12px;"><strong>Razón Social:</strong> ${empresaNombre}</p>
            <p style="margin:4px 0; font-size:12px;"><strong>CUIT de la Empresa:</strong> ${empresaCuitFormateado}</p>
          </div>
          
          <div style="margin:30px 0;">
            <p style="margin:4px 0; font-size:12px;"><strong>Al Sr./Sra.</strong> ${employeeName}</p>
            <p style="margin:4px 0; font-size:12px;"><strong>Número de DNI:</strong> ${dni}</p>
          </div>
          
          <p style="margin:20px 0 10px 0; font-size:12px;">
            De nuestra mayor consideración:
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0; font-size:12px;">
            Por medio de la presente, y en cumplimiento de lo dispuesto por el Artículo 154 de la Ley de Contrato de Trabajo (LCT N° 20.744), le notificamos fehacientemente que se le otorga el goce de su licencia anual ordinaria (vacaciones) correspondiente al período ${formData.periodo}.
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0; font-size:12px;">
            Dicha licencia constará de <strong>${days}</strong> días, calculados en base a su antigüedad.
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0; font-size:12px;">
            Las vacaciones se extenderán desde el día <strong>${inicio}</strong> hasta <strong>${fin}</strong> inclusive.
          </p>
          
          <p style="line-height:1.6; text-align:justify; margin:10px 0 30px 0; font-size:12px;">
            Por lo tanto, deberá reintegrarse a sus tareas habituales el día <strong>${diaPosterior}</strong>, en su horario habitual.
          </p>
          
          <p style="margin:30px 0; font-size:12px;">
            Sin otro particular, saludamos a Ud. atentamente.
          </p>
          
          <div style="margin:50px 0 30px 0;">
            <p style="margin:0 0 4px 0;">___________________________________</p>
            <p style="margin:4px 0; font-size:12px;">Firma del Empleador o Representante de RRHH</p>
            <p style="margin:4px 0; font-size:12px;"><strong>Aclaración de Firma:</strong></p>
          </div>
          
          <div style="margin:50px 0 0 0;">
            <p style="margin:10px 0; font-size:12px; font-weight:bold;">Constancia de Notificación (Duplicado para el empleador)</p>
            
            <p style="line-height:1.6; text-align:justify; margin:20px 0; font-size:12px;">
              <strong>Recibí en Córdoba, el día ${emitido}, copia fiel de la presente notificación, quedando debidamente notificado/a de mi período vacacional.</strong>
            </p>
            
            <div style="margin:30px 0 10px 0;">
              <p style="margin:10px 0; font-size:12px;"><strong>Firma del Empleado:</strong> _______________________________</p>
              <p style="margin:10px 0; font-size:12px;"><strong>Aclaración:</strong> _______________________________</p>
              <p style="margin:10px 0; font-size:12px;"><strong>DNI:</strong> _______________________________</p>
            </div>
          </div>
        </div>
      `;

      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['css', 'legacy'], before: '.page-break-before', avoid: '.no-break' }
      } as const;

      // Generate PDF and force download via anchor (works better inside iframes)
      const worker = html2pdf().from(container).set(opt).toPdf();
      const pdf = await worker.get('pdf');
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      toast({
        title: "Descarga iniciada",
        description: "La notificación de vacaciones se está descargando.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al generar PDF",
        description: "Intente nuevamente o contacte al soporte.",
        variant: "destructive",
      });
    }
  };

  // Information for selected employee with vacation days - calculate if no balance exists
  const selectedEmployeeInfo = employees.find(emp => emp.id === formData.employee_id);
  const currentYear = new Date().getFullYear();
  const vacationBalance = selectedEmployeeInfo ? getEmployeeVacationBalance(selectedEmployeeInfo.id, currentYear) : null;
  
  // Helper: calculate vacation days for current year using calendar days and decimals
  const calcVacationDaysCurrentYear = (fechaIngreso?: string) => {
    if (!fechaIngreso) return 0;
    const ingreso = new Date(fechaIngreso);
    const now = new Date();
    const fechaCorte = new Date(now.getFullYear(), 11, 31);

    // If joined this year, use proportional rule
    if (ingreso.getFullYear() === now.getFullYear()) {
      const diasTrabajados = Math.floor((fechaCorte.getTime() - ingreso.getTime()) / (24 * 60 * 60 * 1000)) + 1;
      const mesesTrabajados = (fechaCorte.getTime() - ingreso.getTime()) / (30.44 * 24 * 60 * 60 * 1000);
      if (mesesTrabajados < 6) {
        return Math.round((diasTrabajados / 20) * 100) / 100; // 2 decimales
      }
      return 14;
    }

    // Full years per law - Antigüedad calculada al 31/12 del año actual
    const antiguedadAnios = Math.floor((fechaCorte.getTime() - ingreso.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (antiguedadAnios < 5) return 14;     // Más de 6 meses y hasta 5 años: 14 días
    if (antiguedadAnios < 10) return 21;    // Más de 5 años y hasta 10 años: 21 días
    if (antiguedadAnios < 20) return 28;    // Más de 10 años y hasta 20 años: 28 días
    return 35;                              // Más de 20 años: 35 días
  };
  
  const vacationDaysInfo = selectedEmployeeInfo ? {
    totalDays: vacationBalance && vacationBalance.dias_totales > 0 
      ? vacationBalance.dias_totales 
      : calcVacationDaysCurrentYear(selectedEmployeeInfo.fecha_ingreso || selectedEmployeeInfo.fechaIngreso),
    usedDays: vacationBalance?.dias_usados || 0,
    availableDays: 0 // Will be calculated below
  } : null;
  
  if (vacationDaysInfo) {
    vacationDaysInfo.availableDays = Math.round(((vacationDaysInfo.totalDays - vacationDaysInfo.usedDays) + Number.EPSILON) * 100) / 100;
  }

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
            Generar Notificación
          </Button>
          <Button 
            onClick={handleSave}
            disabled={
              vacationDaysInfo && calculateDays() > vacationDaysInfo.availableDays
            }
          >
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
              <Select onValueChange={(value) => handleInputChange("employee_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.nombres} {employee.apellidos} - DNI: {employee.dni}
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
                  value={formData.fecha_inicio}
                  onChange={(e) => handleInputChange("fecha_inicio", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fechaFin" className="text-foreground">Fecha de Fin *</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => handleInputChange("fecha_fin", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-foreground">Días Solicitados</Label>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{calculateDays()}</p>
                <p className="text-sm text-foreground/70">días laborables</p>
                {vacationDaysInfo && calculateDays() > 0 && (
                  <div className="mt-2">
                    {calculateDays() > vacationDaysInfo.availableDays ? (
                      <div className="flex items-center text-red-600 text-xs">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                        Excede días disponibles ({vacationDaysInfo.availableDays})
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600 text-xs">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                        Dentro del límite disponible
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="periodo" className="text-foreground">Período de Vacaciones *</Label>
              <Select onValueChange={(value) => handleInputChange("periodo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>
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
            {formData.employee_id && selectedEmployeeInfo ? (
              <>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    {selectedEmployeeInfo.nombres} {selectedEmployeeInfo.apellidos}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Cargo</p>
                      <p className="text-foreground font-medium">{selectedEmployeeInfo.puesto || selectedEmployeeInfo.cargo || 'No especificado'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Sector</p>
                      <p className="text-foreground font-medium">{selectedEmployeeInfo.departamento || selectedEmployeeInfo.sector || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                {vacationDaysInfo && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Balance de Vacaciones</h4>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block">Días correspondientes:</span>
                        <p className="font-medium text-foreground">{vacationDaysInfo.totalDays}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block">Días usados:</span>
                        <p className="font-medium text-foreground">{vacationDaysInfo.usedDays}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block">Días disponibles:</span>
                        <p className="font-medium text-green-600">{vacationDaysInfo.availableDays}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-foreground/70 mb-1">Cálculo según legislación argentina</p>
                  <p className="text-xs text-foreground/60">
                    Los días disponibles se calculan como: días correspondientes - días usados.
                    Al aprobar una solicitud, los días se descuentan automáticamente del saldo.
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