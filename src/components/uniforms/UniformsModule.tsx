import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEmployees } from "@/hooks/useEmployees";
import { useUniforms } from "@/hooks/useUniforms";
import { Shirt, Plus, Download, Calendar, User, Package, Trash2, Search, Filter } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

const UniformsModule = () => {
  const { getActiveEmployees } = useEmployees();
  const { uniforms, addUniform, deleteUniform, loading } = useUniforms();
  const { toast } = useToast();
  const activeEmployees = getActiveEmployees();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [uniformType, setUniformType] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [season, setSeason] = useState("");
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const uniformTypes = [
    "Barbijo",
    "Guantes",
    "Mameluco",
    "Sordina",
    "Gafas de seguridad",
    "Remera",
    "Pantalón cargo",
    "Zapatos punta de acero",
    "Campera",
    "Buzo"
  ];

  const sizes = ["Sin talle", "XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

  const seasons = ["Verano", "Invierno", "Todo el año"];

  const conditions = ["Nuevo", "Usado - Buen estado", "Usado - Estado regular"];

  // Elementos de protección se entregan a demanda
  const protectionElements = ["Barbijo", "Guantes", "Mameluco", "Sordina", "Gafas de seguridad"];
  
  // Uniformes tienen fechas programadas de entrega
  const uniformTypes6Months = ["Remera", "Pantalón cargo", "Campera", "Buzo"];
  const uniformTypes1Year = ["Zapatos punta de acero"];

  const getItemCategory = (uniformType: string) => {
    if (protectionElements.includes(uniformType)) {
      return "Elemento de protección";
    }
    return "Uniforme";
  };

  const calculateNextDeliveryDate = (uniformType: string, deliveryDate: string) => {
    if (protectionElements.includes(uniformType)) {
      return null; // A demanda
    }
    
    const delivery = new Date(deliveryDate);
    if (uniformTypes1Year.includes(uniformType)) {
      const nextDate = new Date(delivery);
      nextDate.setFullYear(delivery.getFullYear() + 1);
      return nextDate;
    } else if (uniformTypes6Months.includes(uniformType)) {
      const nextDate = new Date(delivery);
      nextDate.setMonth(delivery.getMonth() + 6);
      return nextDate;
    }
    
    return null;
  };

  const getNextDeliveryStatus = (uniformType: string, deliveryDate: string) => {
    const nextDate = calculateNextDeliveryDate(uniformType, deliveryDate);
    
    if (!nextDate) {
      return { text: "A demanda", color: "text-foreground/70", bgColor: "bg-muted" };
    }
    
    const today = new Date();
    const isOverdue = nextDate < today;
    
    return {
      text: nextDate.toLocaleDateString('es-AR'),
      color: isOverdue ? "text-red-600" : "text-green-600",
      bgColor: isOverdue ? "bg-red-50" : "bg-green-50"
    };
  };

  // Función de filtrado
  const filteredUniforms = uniforms.filter(uniform => {
    const matchesSearch = (
      uniform.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uniform.employeeDni?.includes(searchTerm) ||
      uniform.uniform_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesType = !filterType || filterType === "all" || uniform.uniform_type === filterType;
    const matchesStatus = !filterStatus || filterStatus === "all" || uniform.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSubmit = async () => {
    if (!selectedEmployee || !uniformType || !size || !season || !condition || !deliveryDate) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const employee = activeEmployees.find(emp => emp.id.toString() === selectedEmployee);
    if (!employee) return;

    try {
      await addUniform({
        employee_id: employee.id,
        uniform_type: uniformType,
        size,
        quantity: parseInt(quantity),
        delivery_date: deliveryDate,
        season,
        condition,
        notes: notes || null,
        status: "entregado"
      });

      // Reset form
      setSelectedEmployee("");
      setUniformType("");
      setSize("");
      setQuantity("1");
      setDeliveryDate(new Date().toISOString().split('T')[0]);
      setSeason("");
      setCondition("");
      setNotes("");
      setIsDialogOpen(false);
    } catch (error) {
      // Error already handled by hook
    }
  };

  const handleDeleteUniform = async (uniformId: string, employeeName: string) => {
    try {
      await deleteUniform(uniformId);
      toast({
        title: "Uniforme eliminado",
        description: `El registro de uniforme de ${employeeName} ha sido eliminado`,
      });
    } catch (error) {
      // El hook ya muestra el toast de error
    }
  };

  const generateDeliveryReceipt = (delivery: any) => {
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin-bottom: 10px;">CONSTANCIA DE ENTREGA DE UNIFORME</h1>
          <p style="color: #6b7280;">Registro N° ${delivery.id}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Datos del Empleado</h3>
          <p><strong>Nombre:</strong> ${delivery.employeeName}</p>
          <p><strong>DNI:</strong> ${delivery.employeeDni}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Detalle del Uniforme</h3>
          <p><strong>Tipo:</strong> ${delivery.uniform_type}</p>
          <p><strong>Talle:</strong> ${delivery.size}</p>
          <p><strong>Cantidad:</strong> ${delivery.quantity}</p>
          <p><strong>Temporada:</strong> ${delivery.season}</p>
          <p><strong>Estado:</strong> ${delivery.condition}</p>
          <p><strong>Fecha de entrega:</strong> ${new Date(delivery.delivery_date).toLocaleDateString('es-AR')}</p>
          ${delivery.notes ? `<p><strong>Observaciones:</strong> ${delivery.notes}</p>` : ''}
        </div>
        
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; width: 200px;">
            <p>Firma del Empleado</p>
          </div>
          <div style="text-align: center; border-top: 1px solid #000; padding-top: 5px; width: 200px;">
            <p>Firma RRHH</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>Documento generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: `constancia-uniforme-${delivery.employeeName?.replace(/\s+/g, '-')}-${delivery.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  const generateGeneralReport = () => {
    const content = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937;">REPORTE GENERAL DE UNIFORMES</h1>
          <p style="color: #6b7280;">Generado el ${new Date().toLocaleDateString('es-AR')}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1f2937;">Resumen</h3>
          <p><strong>Total de entregas:</strong> ${uniforms.length}</p>
          <p><strong>Empleados con uniformes:</strong> ${new Set(uniforms.map(d => d.employee_id)).size}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Empleado</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Tipo</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Talle</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Fecha</th>
              <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${uniforms.map(delivery => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${delivery.employeeName}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${delivery.uniform_type}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${delivery.size}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${new Date(delivery.delivery_date).toLocaleDateString('es-AR')}</td>
                <td style="border: 1px solid #d1d5db; padding: 8px;">${delivery.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: `reporte-uniformes-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Shirt className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Entrega de Uniformes</h2>
            <p className="text-foreground/70">Gestiona la entrega y control de uniformes de trabajo</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateGeneralReport}>
            <Download className="h-4 w-4 mr-2" />
            Reporte General
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Entrega
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Entrega de Uniforme</DialogTitle>
                <DialogDescription>
                  Completa la información de la entrega de uniforme
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="employee">Empleado *</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.nombres} {employee.apellidos} - {employee.dni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="uniformType">Tipo de Uniforme *</Label>
                  <Select value={uniformType} onValueChange={(value) => {
                    setUniformType(value);
                    // Auto-asignar temporada para elementos de protección
                    if (protectionElements.includes(value)) {
                      setSeason("Todo el año");
                      setSize("Sin talle");
                    } else {
                      setSeason("");
                      setSize("");
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <optgroup label="Elementos de Protección">
                        {protectionElements.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </optgroup>
                      <optgroup label="Uniformes">
                        {["Remera", "Pantalón cargo", "Zapatos punta de acero", "Campera", "Buzo"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </optgroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="size">Talle *</Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Talle" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deliveryDate">Fecha de Entrega *</Label>
                  <Input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="season">
                    Temporada * 
                    {protectionElements.includes(uniformType) && (
                      <span className="text-xs text-muted-foreground ml-1">(Auto-asignado)</span>
                    )}
                  </Label>
                  <Select 
                    value={season} 
                    onValueChange={setSeason}
                    disabled={protectionElements.includes(uniformType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar temporada" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Estado *</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Observaciones</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas adicionales (opcional)"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>Registrar Entrega</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
              <Input
                placeholder="Buscar por empleado, DNI, tipo de uniforme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {uniformTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Uniformes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Entregas ({filteredUniforms.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-medium text-foreground">Cargando entregas...</p>
              </div>
            </div>
          ) : filteredUniforms.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">
                  {uniforms.length === 0 ? "No hay entregas registradas" : "No se encontraron entregas"}
                </p>
                <p className="text-foreground/70">
                  {uniforms.length === 0 
                    ? "Comienza registrando la primera entrega de uniforme"
                    : "No hay entregas que coincidan con los filtros seleccionados"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Empleado</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Tipo</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Categoría</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Talle</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Cantidad</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Fecha Entrega</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Próxima Entrega</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Estado</th>
                    <th className="px-6 py-3 text-sm font-medium text-foreground/70">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUniforms.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {delivery.employeeName}
                          </span>
                          <span className="text-sm text-foreground/60">DNI: {delivery.employeeDni}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">{delivery.uniform_type}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {getItemCategory(delivery.uniform_type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-foreground">{delivery.size}</td>
                      <td className="px-6 py-4 text-foreground">{delivery.quantity}</td>
                      <td className="px-6 py-4 text-foreground">
                        {new Date(delivery.delivery_date).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const status = getNextDeliveryStatus(delivery.uniform_type, delivery.delivery_date);
                          return (
                            <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${status.bgColor} ${status.color}`}>
                              {status.text}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={delivery.status === "entregado" ? "default" : "secondary"}>
                          {delivery.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => generateDeliveryReceipt(delivery)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar entrega?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el registro de entrega de {delivery.uniform_type} de {delivery.employeeName}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteUniform(delivery.id, delivery.employeeName)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
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

export default UniformsModule;