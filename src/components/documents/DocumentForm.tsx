import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DocumentPreview from "./DocumentPreview";

interface DocumentFormProps {
  onBack: () => void;
  onSave: (documentData: any) => Promise<any>;
  employees: any[];
}

const DocumentForm = ({ onBack, onSave, employees }: DocumentFormProps) => {
  const { toast } = useToast();
  // Obtener fecha actual en zona horaria de Argentina (UTC-3)
  const getCurrentDateInArgentina = () => {
    const now = new Date();
    // Ajustar a zona horaria de Argentina (UTC-3)
    const argentinaTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000) + (-3 * 60 * 60 * 1000));
    return argentinaTime.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    employee_id: "",
    generated_date: getCurrentDateInArgentina(), // Fecha actual en Argentina
    document_type: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const documentTypes = [
    { value: "reglamento_interno", label: "Reglamento Interno" },
    { value: "consentimiento_datos_biometricos", label: "Constancia de Consentimiento para Uso de Cámaras de Vigilancia y Datos Biométricos" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "employee_id") {
      const employee = employees.find(e => e.id === value);
      setSelectedEmployee(employee);
    }
  };

  const handleSubmit = async () => {
    if (!formData.employee_id || !formData.document_type || !formData.generated_date) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🚀 INICIANDO: Creación de documento...');
      console.log('📋 Datos del formulario:', formData);
      console.log('👤 Empleado seleccionado:', selectedEmployee);
      
      // Primero crear el documento en la base de datos
      const documentData = {
        ...formData,
        status: "generado",
        document_content: generateDocumentContent(),
      };

      console.log('💾 GUARDANDO: Documento en base de datos...');
      const savedDocument = await onSave(documentData);
      console.log('✅ GUARDADO: Documento en BD:', savedDocument);
      console.log('🔍 DEBUG: savedDocument?.id =', savedDocument?.id);
      console.log('🔍 DEBUG: selectedEmployee =', selectedEmployee);

      // El PDF se genera automáticamente en DocumentsModule.handleSaveDocument
      // Ya no necesitamos duplicar la lógica aquí
      
      if (savedDocument?.id) {
        console.log('✅ DOCUMENTO CREADO EXITOSAMENTE con ID:', savedDocument.id);
        toast({
          title: "Documento creado",
          description: "El documento se ha creado exitosamente. El PDF se está generando...",
        });
      } else {
        console.error('❌ PROBLEMA: No se pudo obtener ID del documento guardado');
        console.log('   savedDocument:', savedDocument);
        toast({
          title: "Advertencia",
          description: "El documento se creó pero puede haber problemas. Verifica la lista de documentos.",
          variant: "destructive",
        });
      }

      onBack();
    } catch (error) {
      console.error('❌ ERROR GENERAL:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el documento: " + (error instanceof Error ? error.message : 'Error desconocido'),
        variant: "destructive",
      });
    }
  };

  const generateDocumentContent = () => {
    if (!selectedEmployee) return "";

    const employeeName = `${selectedEmployee.nombres} ${selectedEmployee.apellidos}`;
    const employeeDni = selectedEmployee.dni;
    
    // Formatear fecha correctamente para Argentina
    const dateObj = new Date(formData.generated_date + 'T12:00:00'); // Agregar hora para evitar problemas de zona horaria
    const date = dateObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });

    // Esta es una plantilla básica, se reemplazará con las plantillas reales
    return `Documento generado para: ${employeeName}\nDNI: ${employeeDni}\nFecha: ${date}\nTipo: ${formData.document_type}`;
  };

  const generatePreview = () => {
    if (!selectedEmployee || !formData.document_type) {
      toast({
        title: "Información incompleta",
        description: "Seleccione un empleado y tipo de documento para ver la vista previa",
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
  };

  const handleConfirmDocument = async () => {
    await handleSubmit();
    setShowPreview(false);
  };

  return (
    <>
      {showPreview && selectedEmployee && (
        <DocumentPreview
          documentType={formData.document_type}
          employeeData={selectedEmployee}
          generatedDate={formData.generated_date}
          onClose={() => setShowPreview(false)}
          onConfirm={handleConfirmDocument}
        />
      )}
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Nuevo Documento</h2>
            <p className="text-foreground/70">Generar documento para firma de empleado</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={generatePreview}
            disabled={!selectedEmployee || !formData.document_type}
          >
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa y Generar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Documento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Empleado *</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => handleInputChange("employee_id", value)}
              >
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

            <div className="space-y-2">
              <Label htmlFor="generated_date">Fecha de Generación *</Label>
              <Input
                id="generated_date"
                type="date"
                value={formData.generated_date}
                onChange={(e) => handleInputChange("generated_date", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="document_type">Tipo de Documento *</Label>
              <Select
                value={formData.document_type}
                onValueChange={(value) => handleInputChange("document_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedEmployee && formData.document_type && (
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-2 text-foreground">Datos del Empleado</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-foreground/70">Nombre:</span>
                    <p className="font-medium text-foreground">{selectedEmployee.nombres} {selectedEmployee.apellidos}</p>
                  </div>
                  <div>
                    <span className="text-foreground/70">DNI:</span>
                    <p className="font-medium text-foreground">{selectedEmployee.dni}</p>
                  </div>
                  <div>
                    <span className="text-foreground/70">CUIL:</span>
                    <p className="font-medium text-foreground">{selectedEmployee.cuil || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-foreground/70">Puesto:</span>
                    <p className="font-medium text-foreground">{selectedEmployee.puesto || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default DocumentForm;