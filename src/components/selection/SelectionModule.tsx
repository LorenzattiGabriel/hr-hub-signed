import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Upload, Eye, Download, Edit, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface Candidate {
  id: string;
  nombre_apellido?: string;
  fecha_nacimiento?: string;
  edad?: number;
  sexo?: string;
  localidad?: string;
  vacante_postulada?: string;
  mail?: string;
  numero_contacto?: string;
  experiencia_laboral?: string;
  conocimientos_habilidades?: string;
  observaciones_reclutador?: string;
  tipo_jornada_buscada?: string;
  disponibilidad?: string;
  referencias_laborales?: string;
  estado: string;
  created_at: string;
  updated_at: string;
}

interface CandidateHistory {
  id: string;
  candidate_id: string;
  estado_anterior?: string;
  estado_nuevo: string;
  notas?: string;
  created_at: string;
}

const ESTADOS_CANDIDATO = [
  'no_entrevistado',
  'entrevistado',
  'preseleccionado',
  'fuera_de_proceso',
  'seleccionado'
];

export const SelectionModule = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateHistory, setCandidateHistory] = useState<CandidateHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddCandidateDialog, setShowAddCandidateDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({});
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [cvText, setCvText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, ageFilter, locationFilter, genderFilter, statusFilter]);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los candidatos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandidateHistory = async (candidateId: string) => {
    try {
      const { data, error } = await supabase
        .from('candidate_history')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidateHistory(data || []);
    } catch (error) {
      console.error('Error fetching candidate history:', error);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate => 
        candidate.nombre_apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.vacante_postulada?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.conocimientos_habilidades?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.localidad?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ageFilter) {
      const age = parseInt(ageFilter);
      filtered = filtered.filter(candidate => candidate.edad === age);
    }

    if (locationFilter) {
      filtered = filtered.filter(candidate => 
        candidate.localidad?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (genderFilter && genderFilter !== 'todos') {
      filtered = filtered.filter(candidate => candidate.sexo === genderFilter);
    }

    if (statusFilter && statusFilter !== 'todos') {
      filtered = filtered.filter(candidate => candidate.estado === statusFilter);
    }

    setFilteredCandidates(filtered);
  };

  const processCVWithAI = (cvText: string): Partial<Candidate> => {
    // Simulamos el procesamiento con IA por ahora
    const lines = cvText.split('\n').filter(line => line.trim());
    const candidate: Partial<Candidate> = {};

    // Extraer información básica (esto sería reemplazado por IA real)
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('nombre') || lowerLine.includes('name')) {
        candidate.nombre_apellido = line.split(':')[1]?.trim();
      }
      if (lowerLine.includes('edad') || lowerLine.includes('age')) {
        const ageMatch = line.match(/\d+/);
        if (ageMatch) candidate.edad = parseInt(ageMatch[0]);
      }
      if (lowerLine.includes('email') || lowerLine.includes('@')) {
        const emailMatch = line.match(/\S+@\S+\.\S+/);
        if (emailMatch) candidate.mail = emailMatch[0];
      }
      if (lowerLine.includes('teléfono') || lowerLine.includes('telefono') || lowerLine.includes('phone')) {
        const phoneMatch = line.match(/[\d\s\-\+\(\)]+/);
        if (phoneMatch) candidate.numero_contacto = phoneMatch[0].trim();
      }
      if (lowerLine.includes('localidad') || lowerLine.includes('ciudad') || lowerLine.includes('city')) {
        candidate.localidad = line.split(':')[1]?.trim();
      }
    });

    candidate.experiencia_laboral = cvText.length > 500 ? cvText.substring(0, 500) + '...' : cvText;
    candidate.estado = 'no_entrevistado';

    return candidate;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Procesar datos de Excel
        console.log('Excel data:', jsonData);
        toast({
          title: "Archivo procesado",
          description: `Se procesaron ${jsonData.length} registros del Excel`,
        });
      } else {
        // Procesar como texto de CV
        const text = await file.text();
        const processedCandidate = processCVWithAI(text);
        setNewCandidate(processedCandidate);
        setShowAddCandidateDialog(true);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar el archivo",
        variant: "destructive",
      });
    }
  };

  const addCandidate = async () => {
    try {
      const candidateData = { ...newCandidate };
      
      // Calcular edad si hay fecha de nacimiento
      if (candidateData.fecha_nacimiento) {
        const birthDate = new Date(candidateData.fecha_nacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        candidateData.edad = age;
      }

      const { error } = await supabase
        .from('candidates')
        .insert([candidateData]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Candidato agregado correctamente",
      });

      setShowAddCandidateDialog(false);
      setNewCandidate({});
      setCvText('');
      fetchCandidates();
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el candidato",
        variant: "destructive",
      });
    }
  };

  const updateCandidateStatus = async () => {
    if (!selectedCandidate || !newStatus) return;

    try {
      // Actualizar estado del candidato
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ estado: newStatus })
        .eq('id', selectedCandidate.id);

      if (updateError) throw updateError;

      // Agregar al historial
      const { error: historyError } = await supabase
        .from('candidate_history')
        .insert([{
          candidate_id: selectedCandidate.id,
          estado_anterior: selectedCandidate.estado,
          estado_nuevo: newStatus,
          notas: statusNotes
        }]);

      if (historyError) throw historyError;

      toast({
        title: "Éxito",
        description: "Estado actualizado correctamente",
      });

      setShowStatusDialog(false);
      setNewStatus('');
      setStatusNotes('');
      fetchCandidates();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const downloadSelectedProfiles = () => {
    const csvContent = [
      ['Nombre', 'Edad', 'Sexo', 'Localidad', 'Vacante', 'Email', 'Estado'].join(','),
      ...filteredCandidates.map(candidate => [
        candidate.nombre_apellido || '',
        candidate.edad || '',
        candidate.sexo || '',
        candidate.localidad || '',
        candidate.vacante_postulada || '',
        candidate.mail || '',
        candidate.estado
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidatos_seleccionados.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'seleccionado': return 'default';
      case 'preseleccionado': return 'secondary';
      case 'entrevistado': return 'outline';
      case 'fuera_de_proceso': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'no_entrevistado': 'No Entrevistado',
      'entrevistado': 'Entrevistado',
      'preseleccionado': 'Preseleccionado',
      'fuera_de_proceso': 'Fuera de Proceso',
      'seleccionado': 'Seleccionado'
    };
    return labels[status] || status;
  };

  const openDetailDialog = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    await fetchCandidateHistory(candidate.id);
    setShowDetailDialog(true);
  };

  const openStatusDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.estado);
    setShowStatusDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Selección de Personal</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddCandidateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Candidato
          </Button>
          <label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Cargar CV/Excel
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.pdf,.doc,.docx,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" onClick={downloadSelectedProfiles}>
            <Download className="h-4 w-4 mr-2" />
            Descargar Selección
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Búsqueda General</Label>
              <Input
                id="search"
                placeholder="Nombre, vacante, habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                placeholder="Edad"
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Localidad</Label>
              <Input
                id="location"
                placeholder="Localidad"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Sexo</Label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {ESTADOS_CANDIDATO.map(estado => (
                    <SelectItem key={estado} value={estado}>
                      {getStatusLabel(estado)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Candidatos */}
      <Card>
        <CardHeader>
          <CardTitle>Candidatos ({filteredCandidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>Vacante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.nombre_apellido || 'N/A'}</TableCell>
                  <TableCell>{candidate.edad || 'N/A'}</TableCell>
                  <TableCell>{candidate.sexo || 'N/A'}</TableCell>
                  <TableCell>{candidate.localidad || 'N/A'}</TableCell>
                  <TableCell>{candidate.vacante_postulada || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(candidate.estado)}>
                      {getStatusLabel(candidate.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(candidate)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusDialog(candidate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para agregar candidato */}
      <Dialog open={showAddCandidateDialog} onOpenChange={setShowAddCandidateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Candidato</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cv-text">Texto del CV (Procesamiento con IA)</Label>
              <Textarea
                id="cv-text"
                placeholder="Pega aquí el texto del CV para procesamiento automático..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="h-32"
              />
              <Button
                onClick={() => {
                  const processed = processCVWithAI(cvText);
                  setNewCandidate(processed);
                }}
                className="mt-2 w-full"
                variant="outline"
              >
                <FileText className="h-4 w-4 mr-2" />
                Procesar CV con IA
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre y Apellido</Label>
                <Input
                  id="nombre"
                  value={newCandidate.nombre_apellido || ''}
                  onChange={(e) => setNewCandidate({...newCandidate, nombre_apellido: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="fecha-nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha-nacimiento"
                  type="date"
                  value={newCandidate.fecha_nacimiento || ''}
                  onChange={(e) => setNewCandidate({...newCandidate, fecha_nacimiento: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select 
                  value={newCandidate.sexo || ''} 
                  onValueChange={(value) => setNewCandidate({...newCandidate, sexo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="localidad">Localidad</Label>
                <Input
                  id="localidad"
                  value={newCandidate.localidad || ''}
                  onChange={(e) => setNewCandidate({...newCandidate, localidad: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="vacante">Vacante Postulada</Label>
                <Input
                  id="vacante"
                  value={newCandidate.vacante_postulada || ''}
                  onChange={(e) => setNewCandidate({...newCandidate, vacante_postulada: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCandidate.mail || ''}
                  onChange={(e) => setNewCandidate({...newCandidate, mail: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddCandidateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={addCandidate}>
              Guardar Candidato
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalle */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Perfil Completo - {selectedCandidate?.nombre_apellido}</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Información Personal</Label>
                  <div className="space-y-2 mt-2">
                    <p><strong>Edad:</strong> {selectedCandidate.edad || 'N/A'}</p>
                    <p><strong>Sexo:</strong> {selectedCandidate.sexo || 'N/A'}</p>
                    <p><strong>Localidad:</strong> {selectedCandidate.localidad || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedCandidate.mail || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> {selectedCandidate.numero_contacto || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <Label>Información Laboral</Label>
                  <div className="space-y-2 mt-2">
                    <p><strong>Vacante:</strong> {selectedCandidate.vacante_postulada || 'N/A'}</p>
                    <p><strong>Tipo de Jornada:</strong> {selectedCandidate.tipo_jornada_buscada || 'N/A'}</p>
                    <p><strong>Disponibilidad:</strong> {selectedCandidate.disponibilidad || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <Label>Estado Actual</Label>
                  <div className="space-y-2 mt-2">
                    <Badge variant={getStatusBadgeVariant(selectedCandidate.estado)}>
                      {getStatusLabel(selectedCandidate.estado)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {selectedCandidate.experiencia_laboral && (
                <div>
                  <Label>Experiencia Laboral</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <p className="whitespace-pre-wrap">{selectedCandidate.experiencia_laboral}</p>
                  </div>
                </div>
              )}

              {selectedCandidate.conocimientos_habilidades && (
                <div>
                  <Label>Conocimientos y Habilidades</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <p className="whitespace-pre-wrap">{selectedCandidate.conocimientos_habilidades}</p>
                  </div>
                </div>
              )}

              {selectedCandidate.observaciones_reclutador && (
                <div>
                  <Label>Observaciones del Reclutador</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <p className="whitespace-pre-wrap">{selectedCandidate.observaciones_reclutador}</p>
                  </div>
                </div>
              )}

              <div>
                <Label>Historial de Estados</Label>
                <div className="mt-2">
                  {candidateHistory.length > 0 ? (
                    <div className="space-y-2">
                      {candidateHistory.map((history) => (
                        <div key={history.id} className="p-3 border rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p><strong>Estado:</strong> {getStatusLabel(history.estado_nuevo)}</p>
                              {history.estado_anterior && (
                                <p><strong>Estado anterior:</strong> {getStatusLabel(history.estado_anterior)}</p>
                              )}
                              {history.notas && (
                                <p><strong>Notas:</strong> {history.notas}</p>
                              )}
                            </div>
                            <small className="text-gray-500">
                              {new Date(history.created_at).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No hay historial disponible</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para cambiar estado */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado - {selectedCandidate?.nombre_apellido}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-status">Nuevo Estado</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_CANDIDATO.map(estado => (
                    <SelectItem key={estado} value={estado}>
                      {getStatusLabel(estado)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-notes">Notas (opcional)</Label>
              <Textarea
                id="status-notes"
                placeholder="Agregar notas sobre el cambio de estado..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={updateCandidateStatus}>
                Actualizar Estado
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};