import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addNoeliaBelen } from '@/utils/addNewEmployee';
import { UserPlus } from 'lucide-react';

export const AddEmployeeButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddEmployee = async () => {
    setLoading(true);
    try {
      const result = await addNoeliaBelen();
      
      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al agregar el empleado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAddEmployee} 
      disabled={loading}
      className="fixed bottom-4 right-4 z-50"
    >
      <UserPlus className="h-4 w-4 mr-2" />
      {loading ? 'Agregando...' : 'Agregar Noelia Belén'}
    </Button>
  );
};