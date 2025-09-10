import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/contexts/EmployeeContext";
import { Search, Filter, Download, Eye } from "lucide-react";

// Datos de ejemplo - se reemplazará con datos de Supabase
const mockPayrollData = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Juan Pérez",
    type: "salary",
    amount: 85000,
    period: "2024-01",
    paymentDate: "2024-01-31",
    description: "Sueldo enero 2024",
    status: "paid"
  },
  {
    id: 2,
    employeeId: 1,
    employeeName: "Juan Pérez",
    type: "advance",
    amount: 15000,
    period: "2024-01",
    paymentDate: "2024-01-15",
    description: "Adelanto quincena",
    status: "paid"
  },
  {
    id: 3,
    employeeId: 2,
    employeeName: "María García",
    type: "commission",
    amount: 12000,
    period: "2024-01",
    paymentDate: "2024-01-31",
    description: "Comisión por ventas",
    status: "pending"
  }
];

const PayrollList = () => {
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  const getTypeLabel = (type: string) => {
    const labels = {
      salary: "Sueldo",
      advance: "Adelanto", 
      commission: "Comisión",
      deduction: "Descuento"
    };
    return labels[type as keyof typeof labels];
  };

  const getTypeVariant = (type: string) => {
    const variants = {
      salary: "default",
      advance: "secondary",
      commission: "outline",
      deduction: "destructive"
    };
    return variants[type as keyof typeof variants];
  };

  const getStatusLabel = (status: string) => {
    return status === "paid" ? "Pagado" : "Pendiente";
  };

  const getStatusVariant = (status: string) => {
    return status === "paid" ? "default" : "secondary";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  };

  const filteredData = mockPayrollData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || record.type === filterType;
    const matchesPeriod = filterPeriod === "all" || record.period === filterPeriod;
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  const generatePayslip = (record: any) => {
    console.log("Generando recibo para:", record);
    // Aquí se implementará la generación de PDF
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Consulta todos los registros de pagos, adelantos, comisiones y descuentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="salary">Sueldos</SelectItem>
                <SelectItem value="advance">Adelantos</SelectItem>
                <SelectItem value="commission">Comisiones</SelectItem>
                <SelectItem value="deduction">Descuentos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los períodos</SelectItem>
                <SelectItem value="2024-01">Enero 2024</SelectItem>
                <SelectItem value="2023-12">Diciembre 2023</SelectItem>
                <SelectItem value="2023-11">Noviembre 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Fecha de Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron registros de pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.employeeName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeVariant(record.type) as any}>
                          {getTypeLabel(record.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(record.amount)}
                      </TableCell>
                      <TableCell>
                        {formatPeriod(record.period)}
                      </TableCell>
                      <TableCell>
                        {formatDate(record.paymentDate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(record.status) as any}>
                          {getStatusLabel(record.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generatePayslip(record)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollList;