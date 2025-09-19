import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Consultation {
  id: string;
  fecha_consulta: string;
  detalle: string;
  consultor?: string;
  observaciones?: string;
  created_at: string;
}

const ConsultationsModule = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fecha_consulta: "",
    detalle: "",
    consultor: "",
    observaciones: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitas_consultores')
        .select('*')
        .order('fecha_consulta', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las consultas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fecha_consulta: "",
      detalle: "",
      consultor: "",
      observaciones: "",
    });
    setEditingConsultation(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fecha_consulta || !formData.detalle) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingConsultation) {
        const { error } = await supabase
          .from('visitas_consultores')
          .update(formData)
          .eq('id', editingConsultation.id);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Consulta actualizada correctamente",
        });
      } else {
        const { error } = await supabase
          .from('visitas_consultores')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Consulta registrada correctamente",
        });
      }

      resetForm();
      fetchConsultations();
    } catch (error) {
      console.error('Error saving consultation:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la consulta",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (consultation: Consultation) => {
    setFormData({
      fecha_consulta: consultation.fecha_consulta,
      detalle: consultation.detalle,
      consultor: consultation.consultor || "",
      observaciones: consultation.observaciones || "",
    });
    setEditingConsultation(consultation);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta consulta?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('visitas_consultores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Consulta eliminada correctamente",
      });

      fetchConsultations();
    } catch (error) {
      console.error('Error deleting consultation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la consulta",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando consultas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Visitas de Consultores</h1>
          <p className="text-muted-foreground">Registra y gestiona las visitas de consultores</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Consulta
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingConsultation ? "Editar Consulta" : "Nueva Consulta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_consulta">Fecha de Consulta *</Label>
                  <Input
                    id="fecha_consulta"
                    type="date"
                    value={formData.fecha_consulta}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha_consulta: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="consultor">Consultor</Label>
                  <Input
                    id="consultor"
                    value={formData.consultor}
                    onChange={(e) => setFormData(prev => ({ ...prev, consultor: e.target.value }))}
                    placeholder="Nombre del consultor"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="detalle">Detalle de la Consulta *</Label>
                  <Textarea
                    id="detalle"
                    value={formData.detalle}
                    onChange={(e) => setFormData(prev => ({ ...prev, detalle: e.target.value }))}
                    placeholder="Describe el motivo y contenido de la consulta..."
                    rows={4}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                    placeholder="Observaciones adicionales..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingConsultation ? "Actualizar" : "Registrar"} Consulta
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {consultations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay consultas registradas</p>
            </CardContent>
          </Card>
        ) : (
          consultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(consultation.fecha_consulta).toLocaleDateString('es-AR')}
                      </div>
                      {consultation.consultor && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {consultation.consultor}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Detalle de la Consulta</h3>
                      <p className="text-foreground whitespace-pre-wrap">{consultation.detalle}</p>
                    </div>

                    {consultation.observaciones && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Observaciones</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{consultation.observaciones}</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Registrado el {new Date(consultation.created_at).toLocaleDateString('es-AR')} a las {new Date(consultation.created_at).toLocaleTimeString('es-AR')}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEdit(consultation)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(consultation.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsultationsModule;