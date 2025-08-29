import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, User, MapPin, Phone, Mail, GraduationCap, Heart, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LegajoPDFProps {
  employeeData: any;
  trigger?: React.ReactNode;
}

const LegajoPDF = ({ employeeData, trigger }: LegajoPDFProps) => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
const downloadPDF = async () => {
  const element = printRef.current;
  if (!element) return;
  try {
    const module: any = await import('html2pdf.js');
    const html2pdf = module.default || module;
    const filename = `Legajo_${(employeeData.apellidos || 'Empleado')}_${employeeData.nombres || ''}.pdf`.replace(/\s+/g, '_');
    await html2pdf()
      .set({
        margin: 10,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();

    toast({
      title: "PDF descargado",
      description: "El legajo se descargó correctamente.",
    });
  } catch (error) {
    console.error('Error generando PDF', error);
    toast({
      title: "Error al generar PDF",
      description: "Intenta nuevamente.",
      variant: "destructive",
    });
  }
};

  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Ver Legajo PDF
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Legajo Digital - {employeeData.nombres} {employeeData.apellidos}</span>
          </DialogTitle>
        </DialogHeader>

        <div ref={printRef} className="bg-white p-8 space-y-6" style={{ fontFamily: 'serif' }}>
          {/* Header del Legajo */}
          <div className="text-center border-b-2 border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">LEGAJO DIGITAL DE EMPLEADO</h1>
            <h2 className="text-lg font-semibold text-gray-600">AVÍCOLA LA PALOMA</h2>
            <p className="text-sm text-gray-500 mt-2">
              Fecha de Generación: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Datos Personales */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <User className="h-5 w-5 mr-2" />
                DATOS PERSONALES
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Nombre y Apellido:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.nombres} {employeeData.apellidos}
                </p>
              </div>
              <div>
                <strong>DNI:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.dni || "_______________"}
                </p>
              </div>
              <div>
                <strong>CUIL:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.cuil || "_______________"}
                </p>
              </div>
              <div>
                <strong>Fecha de Nacimiento:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {formatDate(employeeData.fechaNacimiento)}
                </p>
              </div>
              <div>
                <strong>Estado Civil:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.estadoCivil || "_______________"}
                </p>
              </div>
              <div className="col-span-2">
                <strong>Domicilio:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.direccion || "_______________"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Datos de Contacto */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <Phone className="h-5 w-5 mr-2" />
                INFORMACIÓN DE CONTACTO
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Teléfono:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.telefono || "_______________"}
                </p>
              </div>
              <div>
                <strong>Email:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.email || "_______________"}
                </p>
              </div>
              <div>
                <strong>Contacto de Emergencia:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.contactoEmergencia || "_______________"}
                </p>
              </div>
              <div>
                <strong>Parentesco:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.parentescoEmergencia || "_______________"}
                </p>
              </div>
              <div className="col-span-2">
                <strong>Teléfono de Emergencia:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.telefonoEmergencia || "_______________"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Datos Laborales */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <Briefcase className="h-5 w-5 mr-2" />
                INFORMACIÓN LABORAL
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Puesto/Cargo:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.cargo || "_______________"}
                </p>
              </div>
              <div>
                <strong>Sector:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.sector || "_______________"}
                </p>
              </div>
              <div>
                <strong>Fecha de Ingreso:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {formatDate(employeeData.fechaIngreso)}
                </p>
              </div>
              <div>
                <strong>Estado:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.estado || "Activo"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Información Académica */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <GraduationCap className="h-5 w-5 mr-2" />
                INFORMACIÓN ACADÉMICA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Nivel Educativo:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.nivelEducativo || "_______________"}
                </p>
              </div>
              <div>
                <strong>Título:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.titulo || "_______________"}
                </p>
              </div>
              <div>
                <strong>Otros Conocimientos:</strong>
                <div className="border border-gray-300 min-h-[60px] p-2 bg-gray-50">
                  {employeeData.otrosConocimientos || ""}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Médica */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg text-gray-800">
                <Heart className="h-5 w-5 mr-2" />
                INFORMACIÓN MÉDICA
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Grupo Sanguíneo:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.grupoSanguineo || "_______________"}
                </p>
              </div>
              <div>
                <strong>Obra Social:</strong>
                <p className="border-b border-dotted border-gray-400 pb-1">
                  {employeeData.obraSocial || "_______________"}
                </p>
              </div>
              <div className="col-span-2">
                <strong>Alergias:</strong>
                <div className="border border-gray-300 min-h-[40px] p-2 bg-gray-50">
                  {employeeData.alergias || ""}
                </div>
              </div>
              <div className="col-span-2">
                <strong>Medicación Habitual:</strong>
                <div className="border border-gray-300 min-h-[40px] p-2 bg-gray-50">
                  {employeeData.medicacionHabitual || ""}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800">OBSERVACIONES ADICIONALES</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-300 min-h-[60px] p-2 bg-gray-50 text-sm">
                {employeeData.observaciones || ""}
              </div>
            </CardContent>
          </Card>

          {/* Firmas */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t-2 border-gray-300">
            <div className="text-center">
              <div className="border-t border-gray-600 mt-16 pt-2">
                <p className="text-sm font-semibold">FIRMA DEL EMPLEADO</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-600 mt-16 pt-2">
                <p className="text-sm font-semibold">ACLARACIÓN</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
            <p>
              Este documento constituye el legajo digital del empleado según normativas laborales vigentes.
            </p>
            <p className="mt-1">
              Generado el {new Date().toLocaleDateString()} - Sistema RRHH Avícola La Paloma
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={downloadPDF} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegajoPDF;