import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Download, Users, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CalendarList = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock calendar events
  const mockEvents = [
    {
      id: 1,
      title: "Vacaciones - María González",
      date: "2024-12-15",
      type: "vacation",
      empleado: "María José González"
    },
    {
      id: 2,
      title: "Capacitación Bioseguridad",
      date: "2024-12-10",
      type: "training",
      empleado: "Todos los empleados"
    },
    {
      id: 3,
      title: "Evaluación de Desempeño",
      date: "2024-12-20",
      type: "evaluation",
      empleado: "Juan Carlos Rodríguez"
    }
  ];

  const addEvent = () => {
    toast({
      title: "Nuevo evento",
      description: "Funcionalidad de calendario en desarrollo",
    });
  };

  const exportCalendar = () => {
    toast({
      title: "Calendario exportado",
      description: "El calendario se ha exportado exitosamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Calendario y Eventos</h2>
            <p className="text-foreground/70">Visualiza y planifica eventos, vacaciones y capacitaciones</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportCalendar}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={addEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Eventos Este Mes</p>
                <p className="text-3xl font-bold text-foreground">{mockEvents.length}</p>
              </div>
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Vacaciones Programadas</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockEvents.filter(e => e.type === "vacation").length}
                </p>
              </div>
              <Users className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Capacitaciones</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockEvents.filter(e => e.type === "training").length}
                </p>
              </div>
              <Clock className="h-6 w-6 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Evaluaciones</p>
                <p className="text-3xl font-bold text-foreground">
                  {mockEvents.filter(e => e.type === "evaluation").length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    event.type === "vacation" ? "bg-success/10" :
                    event.type === "training" ? "bg-warning/10" : "bg-primary/10"
                  }`}>
                    {event.type === "vacation" ? <Users className="h-4 w-4" /> :
                     event.type === "training" ? <Clock className="h-4 w-4" /> :
                     <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-foreground/70">{event.empleado}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{new Date(event.date).toLocaleDateString()}</p>
                  <Badge variant={
                    event.type === "vacation" ? "success" :
                    event.type === "training" ? "warning" : "default"
                  }>
                    {event.type === "vacation" ? "Vacaciones" :
                     event.type === "training" ? "Capacitación" : "Evaluación"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarList;