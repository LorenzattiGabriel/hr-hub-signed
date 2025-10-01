import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";
import ConsentimientoDatosBiometricos from "./templates/ConsentimientoDatosBiometricos";

interface DocumentPreviewProps {
  documentType: string;
  employeeData: {
    nombres: string;
    apellidos: string;
    dni: string;
    direccion: string;
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
  const formattedDate = new Date(generatedDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleDownloadPDF = async () => {
    if (!documentRef.current) return;

    try {
      const options = {
        margin: 0,
        filename: `${documentType}_${employeeData.dni}_${generatedDate}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      await html2pdf().set(options).from(documentRef.current).save();

      toast({
        title: "PDF descargado",
        description: "El documento se ha descargado exitosamente",
      });
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
        <ConsentimientoDatosBiometricos
          ref={documentRef}
          employeeName={employeeName}
          employeeDni={employeeData.dni}
          employeeAddress={employeeData.direccion || "Sin dirección registrada"}
          date={formattedDate}
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