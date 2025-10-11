import { useEffect, useState } from 'react';
import { Sanction } from '@/hooks/useSanctions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SanctionDetailProps {
  sanction: Sanction;
  onClose: () => void;
  onGeneratePDF: (sanction: Sanction) => void;
}

export const SanctionDetail = ({ sanction, onClose, onGeneratePDF }: SanctionDetailProps) => {
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('id', sanction.employee_id)
        .single();

      if (data) setEmployee(data);
    };

    fetchEmployee();
  }, [sanction.employee_id]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detalle de {sanction.tipo === 'sancion' ? 'Suspensión' : 'Apercibimiento'}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tipo</p>
            <Badge variant={sanction.tipo === 'sancion' ? 'destructive' : 'default'}>
              {sanction.tipo === 'sancion' ? 'Suspensión' : 'Apercibimiento'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <Badge variant={sanction.estado === 'activo' ? 'default' : 'secondary'}>
              {sanction.estado}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Empleado</p>
          <p className="font-medium">
            {employee ? `${employee.apellidos}, ${employee.nombres}` : 'Cargando...'}
          </p>
          {employee && <p className="text-sm">DNI: {employee.dni}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Fecha del Documento</p>
            <p>{format(new Date(sanction.fecha_documento), 'dd/MM/yyyy', { locale: es })}</p>
          </div>
          {sanction.fecha_hecho && (
            <div>
              <p className="text-sm text-muted-foreground">Fecha del Hecho</p>
              <p>{format(new Date(sanction.fecha_hecho), 'dd/MM/yyyy', { locale: es })}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Motivo</p>
          <p className="whitespace-pre-wrap">{sanction.motivo}</p>
        </div>

        {sanction.lugar_hecho && (
          <div>
            <p className="text-sm text-muted-foreground">Lugar del Hecho</p>
            <p>{sanction.lugar_hecho}</p>
          </div>
        )}

        {sanction.tipo === 'sancion' && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Días de Suspensión</p>
              <p className="font-medium">{sanction.dias_suspension} días</p>
            </div>
            {sanction.fecha_inicio && (
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                <p>{format(new Date(sanction.fecha_inicio), 'dd/MM/yyyy', { locale: es })}</p>
              </div>
            )}
            {sanction.fecha_reincorporacion && (
              <div>
                <p className="text-sm text-muted-foreground">Reincorporación</p>
                <p>{format(new Date(sanction.fecha_reincorporacion), 'dd/MM/yyyy', { locale: es })}</p>
              </div>
            )}
          </div>
        )}

        {sanction.observaciones && (
          <div>
            <p className="text-sm text-muted-foreground">Observaciones</p>
            <p className="whitespace-pre-wrap">{sanction.observaciones}</p>
          </div>
        )}

        {!sanction.pdf_url && (
          <Button onClick={() => onGeneratePDF(sanction)} className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Generar PDF
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
