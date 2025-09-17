import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/hooks/useEmployees";
import { Download, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

// Datos de ejemplo para reportes - se reemplazará con datos de Supabase
const mockMonthlyReport = {
  period: "2024-01",
  summary: {
    totalSalaries: 320000,
    totalAdvances: 45000,
    totalCommissions: 28000,
    totalDeductions: 12000,
    netTotal: 381000
  },
  employeeDetails: [
    {
      employeeId: 1,
      employeeName: "Juan Pérez",
      baseSalary: 85000,
      advances: 15000,
      commissions: 8000,
      deductions: 3000,
      netPay: 105000
    },
    {
      employeeId: 2,
      employeeName: "María García",
      baseSalary: 75000,
      advances: 10000,
      commissions: 12000,
      deductions: 2000,
      netPay: 95000
    },
    {
      employeeId: 3,
      employeeName: "Carlos López",
      baseSalary: 90000,
      advances: 20000,
      commissions: 5000,
      deductions: 4000,
      netPay: 111000
    }
  ]
};

const PayrollReports = () => {
  const { employees } = useEmployees();
  const [selectedPeriod, setSelectedPeriod] = useState("2024-01");
  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  };

  const exportReport = () => {
    console.log("Exportando reporte del período:", selectedPeriod);
    // Aquí se implementará la exportación a PDF/Excel
  };

  const exportPayslips = () => {
    console.log("Exportando recibos de sueldo del período:", selectedPeriod);
    // Aquí se implementará la exportación masiva de recibos
  };

  const filteredEmployees = selectedEmployee === "all" 
    ? mockMonthlyReport.employeeDetails
    : mockMonthlyReport.employeeDetails.filter(emp => emp.employeeId.toString() === selectedEmployee);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes de Nómina</CardTitle>
          <CardDescription>
            Genera reportes mensuales detallados de pagos por empleado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">Enero 2024</SelectItem>
                  <SelectItem value="2023-12">Diciembre 2023</SelectItem>
                  <SelectItem value="2023-11">Noviembre 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Empleado</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los empleados</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.nombres} {employee.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 sm:pt-6">
              <Button onClick={exportReport} variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Exportar Reporte
              </Button>
              <Button onClick={exportPayslips} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Generar Recibos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sueldos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockMonthlyReport.summary.totalSalaries)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(mockMonthlyReport.summary.totalCommissions)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adelantos</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(mockMonthlyReport.summary.totalAdvances)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descuentos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(mockMonthlyReport.summary.totalDeductions)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalle por Empleado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalle de Nómina - {formatPeriod(selectedPeriod)}
          </CardTitle>
          <CardDescription>
            Desglose detallado de pagos por empleado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Sueldo Base</TableHead>
                  <TableHead>Comisiones</TableHead>
                  <TableHead>Adelantos</TableHead>
                  <TableHead>Descuentos</TableHead>
                  <TableHead className="font-bold">Neto a Pagar</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay datos para el período seleccionado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell className="font-medium">
                        {employee.employeeName}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(employee.baseSalary)}
                      </TableCell>
                      <TableCell className="font-mono text-green-600">
                        +{formatCurrency(employee.commissions)}
                      </TableCell>
                      <TableCell className="font-mono text-orange-600">
                        -{formatCurrency(employee.advances)}
                      </TableCell>
                      <TableCell className="font-mono text-red-600">
                        -{formatCurrency(employee.deductions)}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-lg">
                        {formatCurrency(employee.netPay)}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Recibo
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredEmployees.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Período:</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(
                    filteredEmployees.reduce((sum, emp) => sum + emp.netPay, 0)
                  )}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollReports;