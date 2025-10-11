import { useState } from 'react';
import { Sanction } from '@/hooks/useSanctions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SanctionsListProps {
  sanctions: Sanction[];
  onDelete: (id: string) => void;
  onViewDetail: (sanction: Sanction) => void;
  onGeneratePDF: (sanction: Sanction) => void;
}

export const SanctionsList = ({
  sanctions,
  onDelete,
  onViewDetail,
  onGeneratePDF,
}: SanctionsListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});

  useState(() => {
    const fetchEmployeeNames = async () => {
      const employeeIds = [...new Set(sanctions.map((s) => s.employee_id))];
      const { data } = await supabase
        .from('employees')
        .select('id, nombres, apellidos')
        .in('id', employeeIds);

      if (data) {
        const names = data.reduce((acc, emp) => {
          acc[emp.id] = `${emp.apellidos}, ${emp.nombres}`;
          return acc;
        }, {} as Record<string, string>);
        setEmployeeNames(names);
      }
    };

    if (sanctions.length > 0) {
      fetchEmployeeNames();
    }
  });

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const downloadPDF = async (pdfUrl: string, tipo: string, employeeId: string) => {
    try {
      const fileName = pdfUrl.split('/').pop() || `${tipo}.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .download(fileName);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sanctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No hay sanciones registradas
                </TableCell>
              </TableRow>
            ) : (
              sanctions.map((sanction) => (
                <TableRow key={sanction.id}>
                  <TableCell>
                    {format(new Date(sanction.fecha_documento), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>{employeeNames[sanction.employee_id] || 'Cargando...'}</TableCell>
                  <TableCell>
                    <Badge variant={sanction.tipo === 'sancion' ? 'destructive' : 'default'}>
                      {sanction.tipo === 'sancion' ? 'Suspensión' : 'Apercibimiento'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{sanction.motivo}</TableCell>
                  <TableCell>
                    <Badge variant={sanction.estado === 'activo' ? 'default' : 'secondary'}>
                      {sanction.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetail(sanction)}
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {sanction.pdf_url ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadPDF(sanction.pdf_url!, sanction.tipo, sanction.employee_id)}
                          title="Descargar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onGeneratePDF(sanction)}
                          title="Generar PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(sanction.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el registro permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
