import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSanctions, Sanction } from '@/hooks/useSanctions';
import { SanctionForm } from './SanctionForm';
import { SanctionsList } from './SanctionsList';
import { SanctionDetail } from './SanctionDetail';
import { generateAndUploadPDF } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SanctionsModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSanction, setSelectedSanction] = useState<Sanction | null>(null);
  const { sanctions, loading, addSanction, updateSanction, deleteSanction, refetch } = useSanctions();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    const result = await addSanction(data);
    if (result.error === null) {
      setShowForm(false);
    }
  };

  const handleGeneratePDF = async (sanction: Sanction) => {
    try {
      // Obtener datos del empleado
      const { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('id', sanction.employee_id)
        .single();

      if (!employee) {
        throw new Error('No se encontró el empleado');
      }

      const documentType = sanction.tipo === 'apercibimiento' 
        ? 'apercibimiento' 
        : 'sancion';

      const result = await generateAndUploadPDF({
        documentType,
        employeeData: {
          nombres: employee.nombres,
          apellidos: employee.apellidos,
          dni: employee.dni,
          cuil: employee.cuil,
          employee,
          sanction,
        },
        generatedDate: sanction.fecha_documento,
        documentId: sanction.id,
      });

      if (result.success && result.url) {
        await updateSanction(sanction.id, {
          pdf_url: result.url,
        });

        toast({
          title: 'PDF generado',
          description: 'El documento se generó correctamente.',
        });

        refetch();
      } else {
        throw new Error(result.error || 'Error al generar PDF');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al generar PDF',
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando sanciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suspensiones y Apercibimientos</h1>
          <p className="text-muted-foreground">
            Gestión de sanciones disciplinarias y apercibimientos
          </p>
        </div>
        {!showForm && !selectedSanction && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Sanción
          </Button>
        )}
      </div>

      {showForm ? (
        <SanctionForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : selectedSanction ? (
        <SanctionDetail
          sanction={selectedSanction}
          onClose={() => setSelectedSanction(null)}
          onGeneratePDF={handleGeneratePDF}
        />
      ) : (
        <SanctionsList
          sanctions={sanctions}
          onDelete={deleteSanction}
          onViewDetail={setSelectedSanction}
          onGeneratePDF={handleGeneratePDF}
        />
      )}
    </div>
  );
};
