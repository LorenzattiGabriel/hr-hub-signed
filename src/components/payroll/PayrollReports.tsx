import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@/hooks/useEmployees";
import { usePayroll } from "@/hooks/usePayroll";
import { Download, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

// Utilidad para exportar a Excel
const exportToExcel = async (data: any[], filename: string) => {
  try {
    // Crear workbook y worksheet
    const ws_data = [
      ['Empleado', 'Sueldo Base', 'Bonificaciones', 'Adelantos', 'Descuentos', 'Neto a Pagar'], // Headers
      ...data.map(emp => [
        emp.employeeName,
        emp.baseSalary,
        emp.bonifications,
        emp.advances,
        emp.deductions,
        emp.netPay
      ])
    ];
    
    // Crear CSV content
    const csvContent = ws_data.map(row => row.join(',')).join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exportando a Excel:', error);
  }
};

const PayrollReports = () => {
  const { employees } = useEmployees();
  const { payrollRecords, isLoading } = usePayroll();
  const [selectedPeriod, setSelectedPeriod] = useState("all");
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

  // Obtener períodos únicos de los datos reales
  const getAvailablePeriods = () => {
    const periods = [...new Set(payrollRecords.map(record => record.period))];
    return periods.sort().reverse(); // Más recientes primero
  };

  // Procesar datos reales para crear el reporte
  const processPayrollData = () => {
    let filteredRecords = payrollRecords;

    // Filtrar por período si se selecciona uno específico
    if (selectedPeriod !== "all") {
      filteredRecords = filteredRecords.filter(record => record.period === selectedPeriod);
    } else {
      // Si no hay filtro, usar el mes actual
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      filteredRecords = filteredRecords.filter(record => record.period === currentMonth);
    }

    // Filtrar por empleado si se selecciona uno específico
    if (selectedEmployee !== "all") {
      filteredRecords = filteredRecords.filter(record => record.employee_id === selectedEmployee);
    }

    // Agrupar por empleado y calcular totales
    const employeeData = new Map();
    
    filteredRecords.forEach(record => {
      const employee = employees.find(emp => emp.id === record.employee_id);
      if (!employee) return;

      const employeeName = `${employee.nombres} ${employee.apellidos}`;
      
      if (!employeeData.has(record.employee_id)) {
        employeeData.set(record.employee_id, {
          employeeId: record.employee_id,
          employeeName,
          baseSalary: 0,
          bonifications: 0,
          advances: 0,
          deductions: 0,
          netPay: 0
        });
      }

      const empData = employeeData.get(record.employee_id);
      
      switch (record.type) {
        case 'salary':
          empData.baseSalary += record.amount;
          break;
        case 'bonus':
          empData.bonifications += record.amount;
          break;
        case 'advance':
          empData.advances += record.amount;
          break;
        case 'deduction':
          empData.deductions += record.amount;
          break;
      }
    });

    // Calcular neto a pagar para cada empleado
    const employeeDetails = Array.from(employeeData.values()).map(emp => ({
      ...emp,
      netPay: emp.baseSalary + emp.bonifications - emp.advances - emp.deductions
    }));

    // Calcular totales generales
    const summary = {
      totalSalaries: employeeDetails.reduce((sum, emp) => sum + emp.baseSalary, 0),
      totalBonifications: employeeDetails.reduce((sum, emp) => sum + emp.bonifications, 0),
      totalAdvances: employeeDetails.reduce((sum, emp) => sum + emp.advances, 0),
      totalDeductions: employeeDetails.reduce((sum, emp) => sum + emp.deductions, 0),
      netTotal: employeeDetails.reduce((sum, emp) => sum + emp.netPay, 0)
    };

    return { employeeDetails, summary };
  };

  const { employeeDetails: filteredEmployees, summary } = processPayrollData();

  const exportReport = () => {
    const filename = `reporte-nomina-${selectedPeriod === "all" ? "actual" : selectedPeriod}`;
    exportToExcel(filteredEmployees, filename);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando datos de nómina...</p>
      </div>
    );
  }

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
                  <SelectItem value="all">
                    {(() => {
                      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
                      return formatPeriod(currentMonth);
                    })()}
                  </SelectItem>
                  {getAvailablePeriods().map((period) => (
                    <SelectItem key={period} value={period}>
                      {formatPeriod(period)}
                    </SelectItem>
                  ))}
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
            <div className="text-2xl font-bold">{formatCurrency(summary.totalSalaries)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonificaciones</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalBonifications)}
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
              {formatCurrency(summary.totalAdvances)}
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
              {formatCurrency(summary.totalDeductions)}
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
                  <TableHead>Bonificaciones</TableHead>
                  <TableHead>Adelantos</TableHead>
                  <TableHead>Descuentos</TableHead>
                  <TableHead className="font-bold">Neto a Pagar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                        +{formatCurrency(employee.bonifications)}
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