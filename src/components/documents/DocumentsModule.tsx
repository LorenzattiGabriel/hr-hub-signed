import { useState } from "react";
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
    { value: "consentimiento_datos_biometricos", label: "Consentimiento de Datos Biométricos" },
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

  const handleDownloadDocument = (document: any) => {
    toast({
      title: "Descarga de documento",
      description: "La funcionalidad de descarga estará disponible cuando se carguen las plantillas",
    });
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