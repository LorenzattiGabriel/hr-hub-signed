import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";
import ConsentimientoDatosBiometricos from "./templates/ConsentimientoDatosBiometricos";
import ReglamentoInterno from "./templates/ReglamentoInterno";

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
    try {
      // Crear div temporal con el documento
      const tempDiv = window.document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      window.document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);

      // Renderizar el template correspondiente
      if (documentType === 'consentimiento_datos_biometricos') {
        root.render(
          <ConsentimientoDatosBiometricos
            employeeName={employeeName}
            employeeDni={employeeData.dni}
            employeeAddress={employeeData.direccion || 'Sin dirección registrada'}
            date={formattedDate}
          />
        );
      } else if (documentType === 'reglamento_interno') {
        root.render(
          <ReglamentoInterno
            employeeName={employeeName}
            date={formattedDate}
          />
        );
      }

      // Esperar renderizado completo
      await new Promise(res => requestAnimationFrame(() => setTimeout(res, 100)));

      const options = {
        margin: [10, 10, 10, 10],
        filename: `${documentType}_${employeeData.dni}_${generatedDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          width: 794,
          windowWidth: 794,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true,
        },
        pagebreak: { mode: ['css', 'legacy'] },
      };

      // Generar PDF y forzar descarga
      const worker = (html2pdf as any)().from(tempDiv).set(options).toPdf();
      const pdf = await worker.get('pdf');
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename;
      a.click();
      URL.revokeObjectURL(url);

      // Limpiar
      root.unmount();
      if (window.document.body.contains(tempDiv)) {
        window.document.body.removeChild(tempDiv);
      }

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
    } else if (documentType === "reglamento_interno") {
      return (
        <ReglamentoInterno
          ref={documentRef}
          employeeName={employeeName}
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