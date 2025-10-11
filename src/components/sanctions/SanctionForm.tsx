import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Sanction } from '@/hooks/useSanctions';

interface Employee {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
}

interface SanctionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Sanction;
}

export const SanctionForm = ({ onSubmit, onCancel, initialData }: SanctionFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tipo, setTipo] = useState<'apercibimiento' | 'sancion'>(initialData?.tipo || 'apercibimiento');
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialData || {
      tipo: 'apercibimiento',
      fecha_documento: new Date().toISOString().split('T')[0],
      estado: 'activo',
    },
  });

  const diasSuspension = watch('dias_suspension');
  const fechaInicio = watch('fecha_inicio');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (diasSuspension && fechaInicio) {
      const inicio = new Date(fechaInicio);
      const dias = typeof diasSuspension === 'string' ? parseInt(diasSuspension) : diasSuspension;
      inicio.setDate(inicio.getDate() + dias);
      setValue('fecha_reincorporacion', inicio.toISOString().split('T')[0]);
    }
  }, [diasSuspension, fechaInicio, setValue]);

  const fetchEmployees = async () => {
    const { data } = await supabase
      .from('employees')
      .select('id, nombres, apellidos, dni')
      .eq('estado', 'activo')
      .order('apellidos');
    
    if (data) setEmployees(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Sanción' : 'Nueva Sanción/Apercibimiento'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(value: 'apercibimiento' | 'sancion') => {
                  setTipo(value);
                  setValue('tipo', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apercibimiento">Apercibimiento</SelectItem>
                  <SelectItem value="sancion">Sanción (Suspensión)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Empleado</Label>
              <Select
                defaultValue={initialData?.employee_id}
                onValueChange={(value) => setValue('employee_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.apellidos}, {emp.nombres} - DNI: {emp.dni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha del Documento</Label>
              <Input type="date" {...register('fecha_documento', { required: true })} />
            </div>

            <div className="space-y-2">
              <Label>Fecha del Hecho</Label>
              <Input type="date" {...register('fecha_hecho')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Motivo</Label>
            <Textarea
              {...register('motivo', { required: true })}
              placeholder="Describa el motivo de la sanción o apercibimiento"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Lugar del Hecho</Label>
            <Input {...register('lugar_hecho')} placeholder="Lugar donde ocurrió el hecho" />
          </div>

          {tipo === 'sancion' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Días de Suspensión</Label>
                  <Input
                    type="number"
                    {...register('dias_suspension', { required: tipo === 'sancion' })}
                    placeholder="Cantidad de días"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    {...register('fecha_inicio', { required: tipo === 'sancion' })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Reincorporación</Label>
                  <Input
                    type="date"
                    {...register('fecha_reincorporacion', { required: tipo === 'sancion' })}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              {...register('observaciones')}
              placeholder="Observaciones adicionales (opcional)"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Actualizar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
