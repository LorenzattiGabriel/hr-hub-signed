import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { createRoot } from "react-dom/client";
import ConsentimientoDatosBiometricos from "./templates/ConsentimientoDatosBiometricos";
import ReglamentoInterno from "./templates/ReglamentoInterno";
import DocumentPreview from "./DocumentPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search, Download, Eye, Trash2, CheckCircle, Clock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DocumentForm from "./DocumentForm";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/hooks/useEmployees";
import { useDocuments } from "@/hooks/useDocuments";

const DocumentsModule = () => {
  const { toast } = useToast();
  const { getActiveEmployees } = useEmployees();
  const activeEmployees = getActiveEmployees();
  const { documents, loading, addDocument, deleteDocument } = useDocuments();
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const [view, setView] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const documentTypes = [
    { value: "reglamento_interno", label: "Reglamento Interno" },
    { value: "consentimiento_datos_biometricos", label: "Constancia de Consentimiento para Uso de Cámaras de Vigilancia y Datos Biométricos" },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.empleadoNombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || filterType === "all" || doc.document_type === filterType;
    const matchesStatus = !filterStatus || filterStatus === "all" || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleNewDocument = () => {
    setView("form");
  };

  const handleBackToList = () => {
    setView("list");
  };

  const handleSaveDocument = async (documentData: any) => {
    await addDocument(documentData);
  };

  const handleDeleteDocument = async (documentId: string) => {
    await deleteDocument(documentId);
  };

  const handleDownloadDocument = async (docRecord: any) => {
    try {
      // Buscar el empleado para obtener sus datos completos
      const employee = activeEmployees.find(e => e.id === docRecord.employee_id);
      if (!employee) {
        toast({
          title: "Error",
          description: "No se encontraron los datos del empleado",
          variant: "destructive",
        });
        return;
      }

      // Crear un div temporal para renderizar el documento
      const tempDiv = window.document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm';
      window.document.body.appendChild(tempDiv);

      // Renderizar el componente según el tipo de documento
      const employeeName = `${employee.nombres} ${employee.apellidos}`;
      const formattedDate = new Date(docRecord.generated_date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      // Renderizar con componentes React y descargar como PDF (fiable en iframes)
      const root = createRoot(tempDiv);

      if (docRecord.document_type === 'consentimiento_datos_biometricos') {
        root.render(
          <ConsentimientoDatosBiometricos
            employeeName={employeeName}
            employeeDni={employee.dni}
            employeeAddress={employee.direccion || 'Sin dirección registrada'}
            date={formattedDate}
          />
        );
      } else if (docRecord.document_type === 'reglamento_interno') {
        root.render(
          <ReglamentoInterno
            employeeName={employeeName}
            date={formattedDate}
          />
        );
      } else {
        root.unmount();
        window.document.body.removeChild(tempDiv);
        toast({
          title: "Tipo no soportado",
          description: "No se pudo renderizar este documento",
          variant: "destructive",
        });
        return;
      }

      // Esperar al siguiente frame para asegurar renderizado completo
      await new Promise(res => requestAnimationFrame(() => setTimeout(res, 100)));

      const options = {
        margin: [10, 10, 10, 10],
        filename: `${docRecord.document_type}_${employee.dni}_${docRecord.generated_date}.pdf`,
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

      const worker = (html2pdf as any)().from(tempDiv).set(options).toPdf();
      const pdf = await worker.get('pdf');
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename;
      a.click();
      URL.revokeObjectURL(url);

      // Limpieza
      root.unmount();
      if (window.document.body.contains(tempDiv)) {
        window.document.body.removeChild(tempDiv);
      }

      toast({
        title: "PDF descargado",
        description: "El documento se ha descargado exitosamente",
      });

      return;
      
      // Limpiar
      window.document.body.removeChild(tempDiv);

      toast({
        title: "PDF descargado",
        description: "El documento se ha descargado exitosamente",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = (docRecord: any) => {
    // Encontrar los datos completos del empleado para la vista previa
    const employee = activeEmployees.find(e => e.id === docRecord.employee_id);
    if (!employee) {
      toast({
        title: "Error",
        description: "No se encontraron los datos del empleado",
        variant: "destructive",
      });
      return;
    }

    setPreviewDoc({
      documentType: docRecord.document_type,
      employeeData: {
        nombres: employee.nombres,
        apellidos: employee.apellidos,
        dni: employee.dni,
        direccion: employee.direccion || "",
      },
      generatedDate: docRecord.generated_date,
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(t => t.value === type);
    return docType ? docType.label : type;
  };

  if (view === "form") {
    return (
      <DocumentForm
        onBack={handleBackToList}
        onSave={handleSaveDocument}
        employees={activeEmployees}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestión de Documentos</h2>
            <p className="text-foreground/70">Generar y administrar documentos para firma de empleados</p>
          </div>
        </div>
        <Button onClick={handleNewDocument}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
              <Input
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="generado">Generado</SelectItem>
                <SelectItem value="firmado">Firmado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-foreground/70">
              Mostrando {filteredDocuments.length} de {documents.length} documentos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-foreground/70 mb-4">
                Comienza generando un nuevo documento para tus empleados.
              </p>
              <Button onClick={handleNewDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Generar Primer Documento
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Empleado</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Tipo de Documento</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Fecha Generación</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Fecha Firma</th>
                    <th className="text-center py-3 px-4 font-medium text-foreground/70">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-foreground">{document.empleadoNombre}</div>
                          <div className="text-sm text-foreground/70">DNI: {document.empleadoDni}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-foreground">
                          {getDocumentTypeLabel(document.document_type)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-foreground">
                          {new Date(document.generated_date).toLocaleDateString('es-AR')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={document.status === "firmado" ? "default" : "secondary"}
                        >
                          {document.status === "firmado" ? "Firmado" : "Generado"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-foreground">
                          {document.signed_date 
                            ? new Date(document.signed_date).toLocaleDateString('es-AR')
                            : '-'
                          }
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-1 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDocument(document)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadDocument(document)}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El documento será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDocument(document.id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {previewDoc && (
        <DocumentPreview
          documentType={previewDoc.documentType}
          employeeData={previewDoc.employeeData}
          generatedDate={previewDoc.generatedDate}
          onClose={() => setPreviewDoc(null)}
          onConfirm={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
};

export default DocumentsModule;