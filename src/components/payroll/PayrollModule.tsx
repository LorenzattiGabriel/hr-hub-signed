import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayrollForm from "./PayrollForm";
import PayrollList from "./PayrollList";
import PayrollReports from "./PayrollReports";
import { Calculator, FileText, TrendingUp } from "lucide-react";

const PayrollModule = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Nómina</h1>
        <p className="text-muted-foreground">
          Administra sueldos, adelantos, comisiones y descuentos de tus empleados
        </p>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Registrar Pagos
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Registro de Pago</CardTitle>
              <CardDescription>
                Registra sueldos, adelantos, comisiones o descuentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PayrollForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PayrollList />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <PayrollReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollModule;