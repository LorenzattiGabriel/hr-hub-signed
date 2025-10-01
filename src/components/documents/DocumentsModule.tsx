import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import ConsentimientoDatosBiometricos from "./templates/ConsentimientoDatosBiometricos";
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

  const handleDownloadDocument = async (document: any) => {
    try {
      // Buscar el empleado para obtener sus datos completos
      const employee = activeEmployees.find(e => e.id === document.employee_id);
      if (!employee) {
        toast({
          title: "Error",
          description: "No se encontraron los datos del empleado",
          variant: "destructive",
        });
        return;
      }

      // Crear un div temporal para renderizar el documento
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Renderizar el componente según el tipo de documento
      const employeeName = `${employee.nombres} ${employee.apellidos}`;
      const formattedDate = new Date(document.generated_date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      if (document.document_type === 'consentimiento_datos_biometricos') {
        tempDiv.innerHTML = `
          <div style="width: 210mm; min-height: 297mm; margin: 0 auto; font-family: Arial, sans-serif; background: white; color: black; padding: 48px;">
            <h1 style="text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase; margin-bottom: 32px;">
              CONSTANCIA DE CONSENTIMIENTO PARA USO DE CÁMARAS DE VIGILANCIA Y DATOS BIOMÉTRICOS
            </h1>
            <p style="margin-bottom: 16px;"><strong>Fecha:</strong> ${formattedDate}</p>
            <p style="text-align: justify; line-height: 1.6; margin-bottom: 24px;">
              En la ciudad de Córdoba Capital, comparece el/la trabajador/a <strong>${employeeName}</strong>, 
              DNI Nº <strong>${employee.dni}</strong>, con domicilio en <strong>${employee.direccion || 'Sin dirección registrada'}</strong>, 
              quien manifiesta prestar su consentimiento expreso en los términos de la Ley de Protección de Datos Personales N° 25.326 
              y normativa laboral aplicable.
            </p>
            <h2 style="font-size: 18px; font-weight: bold; margin-top: 32px; margin-bottom: 16px;">1. Cámaras de Vigilancia</h2>
            <p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
              El/la trabajador/a declara haber sido informado/a de la existencia de cámaras de seguridad instaladas en las instalaciones 
              de la empresa Avícola La Paloma (en adelante "la Empresa"), cuya finalidad exclusiva es la prevención de riesgos, 
              seguridad de las personas, resguardo de bienes materiales y control del cumplimiento de normas laborales.
            </p>
            <ul style="margin-left: 32px; margin-bottom: 24px;">
              <li style="text-align: justify; line-height: 1.6; margin-bottom: 8px;">
                Las cámaras se encuentran ubicadas en espacios comunes y áreas de trabajo, sin invadir espacios privados.
              </li>
              <li style="text-align: justify; line-height: 1.6;">
                Las imágenes captadas podrán ser utilizadas como medio de prueba en caso de ser necesario y se almacenarán 
                por un período limitado conforme a la política interna de la Empresa.
              </li>
            </ul>
            <h2 style="font-size: 18px; font-weight: bold; margin-top: 32px; margin-bottom: 16px;">2. Datos Biométricos – Registro de Huella Digital</h2>
            <p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
              El/la trabajador/a presta consentimiento para la recolección y tratamiento de su dato biométrico (huella digital) con la finalidad de:
            </p>
            <ul style="margin-left: 32px; margin-bottom: 24px;">
              <li style="text-align: justify; line-height: 1.6; margin-bottom: 8px;">
                Registrar su asistencia y puntualidad mediante el reloj biométrico implementado por la Empresa.
              </li>
              <li style="text-align: justify; line-height: 1.6;">
                Garantizar la correcta administración de la jornada laboral.
              </li>
            </ul>
            <p style="text-align: justify; line-height: 1.6; margin-bottom: 24px;">
              Los datos biométricos serán tratados con carácter estrictamente confidencial, almacenados en soportes digitales seguros 
              y utilizados únicamente para la finalidad descripta. No serán cedidos a terceros, salvo obligación legal.
            </p>
            <h2 style="font-size: 18px; font-weight: bold; margin-top: 32px; margin-bottom: 16px;">3. Derechos del Trabajador/a</h2>
            <p style="text-align: justify; line-height: 1.6; margin-bottom: 8px;">El/la trabajador/a reconoce que:</p>
            <div style="page-break-after: always;"></div>
            <ul style="margin-left: 32px; margin-top: 24px; margin-bottom: 32px;">
              <li style="text-align: justify; line-height: 1.6; margin-bottom: 8px;">
                Puede ejercer en cualquier momento sus derechos de acceso, rectificación, actualización o supresión de los datos 
                conforme lo establece la Ley N° 25.326.
              </li>
              <li style="text-align: justify; line-height: 1.6;">
                Su consentimiento puede ser revocado mediante notificación fehaciente a la Empresa, sin efectos retroactivos 
                sobre el tratamiento ya realizado.
              </li>
            </ul>
            <div style="margin-top: 64px;">
              <div style="margin-bottom: 48px;">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 24px;">Firma del Trabajador/a</h3>
                <p style="margin-bottom: 16px;">Nombre y Apellido: _________________________________</p>
                <p>DNI: _________________________________</p>
              </div>
              <div>
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 24px;">Firma de la Empresa</h3>
                <p style="margin-bottom: 16px;">Representante: _________________________________</p>
                <p>Cargo: _________________________________</p>
              </div>
            </div>
          </div>
        `;
      }

      const options = {
        margin: 0,
        filename: `${document.document_type}_${employee.dni}_${document.generated_date}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      await html2pdf().set(options).from(tempDiv).save();
      
      // Limpiar
      document.body.removeChild(tempDiv);

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

  const handleViewDocument = (document: any) => {
    toast({
      title: "Vista de documento",
      description: "La vista detallada estará disponible cuando se carguen las plantillas",
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Total Generados</p>
                <p className="text-3xl font-bold text-foreground">
                  {documents.length}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Pendientes de Firma</p>
                <p className="text-3xl font-bold text-foreground">
                  {documents.filter(d => d.status === "generado").length}
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Firmados</p>
                <p className="text-3xl font-bold text-foreground">
                  {documents.filter(d => d.status === "firmado").length}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
};

export default DocumentsModule;