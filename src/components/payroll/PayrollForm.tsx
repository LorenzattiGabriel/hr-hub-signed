import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "@/hooks/useEmployees";
import { usePayroll } from "@/hooks/usePayroll";
import { CalendarIcon, DollarSign } from "lucide-react";

const payrollSchema = z.object({
  employeeId: z.string().min(1, "Selecciona un empleado"),
  type: z.enum(["salary", "advance", "bonus", "deduction"], {
    required_error: "Selecciona el tipo de pago",
  }),
  amount: z.string().min(1, "El monto es requerido"),
  period: z.string().min(1, "El período es requerido"),
  description: z.string().optional(),
  paymentDate: z.string().min(1, "La fecha de pago es requerida"),
});

type PayrollFormValues = z.infer<typeof payrollSchema>;

const PayrollForm = () => {
  const { employees } = useEmployees();
  const { createPayroll } = usePayroll();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PayrollFormValues>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employeeId: "",
      type: "salary",
      amount: "",
      period: new Date().toISOString().slice(0, 7), // YYYY-MM format
      description: "",
      paymentDate: new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
    },
  });

  const onSubmit = async (data: PayrollFormValues) => {
    setIsSubmitting(true);
    try {
      await createPayroll.mutateAsync({
        employee_id: data.employeeId,
        type: data.type,
        amount: parseFloat(data.amount),
        period: data.period,
        payment_date: data.paymentDate,
        description: data.description || undefined,
      });
      form.reset();
    } catch (error) {
      // Error already handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      salary: "Sueldo",
      advance: "Adelanto",
      bonus: "Bonificación",
      deduction: "Descuento"
    };
    return labels[type as keyof typeof labels];
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Período: {getCurrentMonth()}
          </CardTitle>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empleado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un empleado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.nombres} {employee.apellidos} - {employee.sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pago</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="salary">Sueldo</SelectItem>
                      <SelectItem value="advance">Adelanto</SelectItem>
                      <SelectItem value="bonus">Bonificación</SelectItem>
                      <SelectItem value="deduction">Descuento</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período (Mes/Año)</FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Pago</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción (Opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detalles adicionales sobre el pago..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Registrar Pago"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PayrollForm;