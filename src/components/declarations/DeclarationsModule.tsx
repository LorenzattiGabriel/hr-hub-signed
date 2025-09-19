import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEmployees } from "@/hooks/useEmployees";
import html2pdf from "html2pdf.js";

interface Declaration {
  id: string;
  employee_id: string;
  nombres: string;
  apellidos: string;
  domicilio: string;
  calle_paralela_1?: string;
  calle_paralela_2?: string;
  fecha_declaracion: string;
}

const DeclarationsModule = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    nombres: "",
    apellidos: "",
    domicilio: "",
    calle_paralela_1: "",
    calle_paralela_2: "",
  });

  const { employees } = useEmployees();
  const { toast } = useToast();

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const fetchDeclarations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('declaraciones_domicilio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeclarations(data || []);
    } catch (error) {
      console.error('Error fetching declarations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las declaraciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.nombres || !formData.apellidos || !formData.domicilio) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('declaraciones_domicilio')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Declaración jurada creada correctamente",
      });

      setFormData({
        employee_id: "",
        nombres: "",
        apellidos: "",
        domicilio: "",
        calle_paralela_1: "",
        calle_paralela_2: "",
      });
      setShowForm(false);
      fetchDeclarations();
    } catch (error) {
      console.error('Error creating declaration:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la declaración",
        variant: "destructive",
      });
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employee_id: employeeId,
        nombres: employee.nombres,
        apellidos: employee.apellidos,
        domicilio: employee.direccion || "",
      }));
    }
  };

  const generatePDF = (declaration: Declaration) => {
    const employee = employees.find(emp => emp.id === declaration.employee_id);
    
    const htmlContent = `
      <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="text-align: center; margin-bottom: 40px; color: #333;">
          DECLARACIÓN JURADA DE DOMICILIO
        </h1>
        
        <div style="margin-bottom: 30px;">
          <p><strong>Fecha:</strong> ${new Date(declaration.fecha_declaracion).toLocaleDateString('es-AR')}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <p>Yo, <strong>${declaration.nombres} ${declaration.apellidos}</strong>, DNI N° <strong>${employee?.dni || 'N/A'}</strong>, declaro bajo juramento que mi domicilio real es:</p>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
          <p><strong>Dirección:</strong> ${declaration.domicilio}</p>
          ${declaration.calle_paralela_1 ? `<p><strong>Entre calles:</strong> ${declaration.calle_paralela_1}${declaration.calle_paralela_2 ? ` y ${declaration.calle_paralela_2}` : ''}</p>` : ''}
        </div>

        <div style="margin-bottom: 40px;">
          <p>Declaro que la información brindada es verídica y me comprometo a comunicar cualquier cambio de domicilio dentro de los 30 días de producido.</p>
          
          <p>Esta declaración jurada es realizada bajo las responsabilidades y penalidades establecidas por la ley.</p>
        </div>

        <div style="margin-top: 80px; text-align: center;">
          <div style="display: inline-block; border-top: 1px solid #333; padding-top: 10px; width: 300px;">
            <p><strong>Firma del Declarante</strong></p>
            <p>${declaration.nombres} ${declaration.apellidos}</p>
            <p>DNI: ${employee?.dni || 'N/A'}</p>
          </div>
        </div>

        <div style="margin-top: 60px; font-size: 12px; color: #666; text-align: center;">
          <p>Documento generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: `declaracion_jurada_${declaration.nombres}_${declaration.apellidos}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(htmlContent).save();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando declaraciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Declaraciones Juradas de Domicilio</h1>
          <p className="text-muted-foreground">Gestiona las declaraciones de domicilio de los empleados</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Declaración
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Declaración Jurada</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employee">Empleado *</Label>
                  <Select value={formData.employee_id} onValueChange={handleEmployeeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.apellidos}, {employee.nombres} - DNI: {employee.dni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    value={formData.nombres}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombres: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => setFormData(prev => ({ ...prev, apellidos: e.target.value }))}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="domicilio">Domicilio *</Label>
                  <Input
                    id="domicilio"
                    value={formData.domicilio}
                    onChange={(e) => setFormData(prev => ({ ...prev, domicilio: e.target.value }))}
                    placeholder="Dirección completa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="calle_paralela_1">Calle Paralela 1</Label>
                  <Input
                    id="calle_paralela_1"
                    value={formData.calle_paralela_1}
                    onChange={(e) => setFormData(prev => ({ ...prev, calle_paralela_1: e.target.value }))}
                    placeholder="Entre calle..."
                  />
                </div>

                <div>
                  <Label htmlFor="calle_paralela_2">Calle Paralela 2</Label>
                  <Input
                    id="calle_paralela_2"
                    value={formData.calle_paralela_2}
                    onChange={(e) => setFormData(prev => ({ ...prev, calle_paralela_2: e.target.value }))}
                    placeholder="Y calle..."
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">Crear Declaración</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {declarations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay declaraciones registradas</p>
            </CardContent>
          </Card>
        ) : (
          declarations.map((declaration) => {
            const employee = employees.find(emp => emp.id === declaration.employee_id);
            return (
              <Card key={declaration.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        {declaration.nombres} {declaration.apellidos}
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>DNI:</strong> {employee?.dni || 'N/A'}</p>
                        <p><strong>Domicilio:</strong> {declaration.domicilio}</p>
                        {(declaration.calle_paralela_1 || declaration.calle_paralela_2) && (
                          <p><strong>Entre calles:</strong> {declaration.calle_paralela_1}{declaration.calle_paralela_2 ? ` y ${declaration.calle_paralela_2}` : ''}</p>
                        )}
                        <p><strong>Fecha:</strong> {new Date(declaration.fecha_declaracion).toLocaleDateString('es-AR')}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => generatePDF(declaration)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Descargar PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DeclarationsModule;