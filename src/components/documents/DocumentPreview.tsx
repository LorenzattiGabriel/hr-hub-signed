import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";
import ConsentimientoSimple from "./templates/ConsentimientoSimple";
import ReglamentoInternoSimple from "./templates/ReglamentoInternoSimple";
import { DespidoPeriodoPruebaTemplate } from "./templates/DespidoPeriodoPruebaTemplate";

interface DocumentPreviewProps {
  documentType: string;
  employeeData: {
    nombres: string;
    apellidos: string;
    dni: string;
    direccion: string;
    cuil?: string;
  };
  generatedDate: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DocumentPreview = ({
  documentType,
  employeeData,
  generatedDate,
  onClose,
  onConfirm,
}: DocumentPreviewProps) => {
  const { toast } = useToast();
  const documentRef = useRef<HTMLDivElement>(null);

  const employeeName = `${employeeData.nombres} ${employeeData.apellidos}`;
  // Formatear fecha correctamente evitando problemas de zona horaria
  const dateObj = new Date(generatedDate + 'T12:00:00');
  const formattedDate = dateObj.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleDownloadPDF = async () => {
    try {
      console.log('📥 [PREVIEW] Descargando PDF usando función compartida');
      
      // Usar el generador directo que funciona sin html2pdf
      const { generatePDFDirectly } = await import("@/utils/directPdfGenerator");
      
      const result = await generatePDFDirectly({
        documentType,
        employeeData: {
          nombres: employeeData.nombres,
          apellidos: employeeData.apellidos,
          dni: employeeData.dni,
          direccion: employeeData.direccion
        },
        generatedDate,
        documentId: `preview_${Date.now()}` // ID temporal para preview
      });
      
      if (result.success && result.blob) {
        // Descargar el blob directamente
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `preview_${documentType}_${employeeData.dni}_${generatedDate}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "PDF descargado",
          description: "El documento se ha descargado exitosamente",
        });
      } else {
        throw new Error(result.error || 'Error generando PDF');
      }
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    }
  };

  const renderTemplate = () => {
    if (documentType === "consentimiento_datos_biometricos") {
      return (
        <ConsentimientoSimple
          ref={documentRef}
          employeeName={employeeName}
          employeeDni={employeeData.dni}
          employeeAddress={employeeData.direccion || "Sin dirección registrada"}
          date={formattedDate}
        />
      );
    } else if (documentType === "reglamento_interno") {
      return (
        <ReglamentoInternoSimple
          ref={documentRef}
          employeeName={employeeName}
          date={formattedDate}
        />
      );
    } else if (documentType === "despido_periodo_prueba") {
      return (
        <DespidoPeriodoPruebaTemplate
          ref={documentRef}
          employeeData={{
            nombres: employeeData.nombres,
            apellidos: employeeData.apellidos,
            dni: employeeData.dni,
            cuil: employeeData.cuil
          }}
          fecha={formattedDate}
        />
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Vista Previa del Documento</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={onConfirm}>Confirmar y Guardar</Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          <div className="bg-gray-100 p-8">{renderTemplate()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentPreview;