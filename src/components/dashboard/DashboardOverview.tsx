import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CalendarDays, 
  ClipboardList, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react";
import { useEmployees } from "@/contexts/EmployeeContext";

const DashboardOverview = () => {
  const { employees, getActiveEmployees } = useEmployees();
  const activeEmployees = getActiveEmployees();
  
  const quickStats = [
    {
      title: "Empleados Activos",
      value: activeEmployees.length.toString(),
      change: "+3 este mes",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Ausencias Hoy",
      value: "5",
      change: "2 vacaciones, 3 permisos",
      icon: CalendarDays,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Llegadas Tarde",
      value: "12",
      change: "Esta semana",
      icon: Clock,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Evaluaciones Pendientes",
      value: "8",
      change: "Vencen en 7 días",
      icon: ClipboardList,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "employee",
      message: `Nuevo empleado agregado: ${employees.length > 0 ? `${employees[0].nombres} ${employees[0].apellidos}` : 'Sin empleados'}`,
      time: "Hace 2 horas",
      status: "success"
    },
    {
      id: 2,
      type: "vacation",
      message: "Solicitud de vacaciones aprobada: Carlos Rodríguez",
      time: "Hace 4 horas",
      status: "info"
    },
    {
      id: 3,
      type: "training",
      message: "Capacitación completada: Ana Martínez",
      time: "Hace 6 horas",
      status: "success"
    },
    {
      id: 4,
      type: "alert",
      message: "Recordatorio: Evaluación de desempeño pendiente",
      time: "Hace 1 día",
      status: "warning"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Capacitación en Seguridad",
      date: "15 Nov",
      time: "14:00",
      attendees: 12
    },
    {
      id: 2,
      title: "Reunión de Evaluación",
      date: "18 Nov",
      time: "10:00",
      attendees: 5
    },
    {
      id: 3,
      title: "Entrega de Uniformes",
      date: "20 Nov",
      time: "09:00",
      attendees: 8
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-card-foreground mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver todas las actividades
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <h4 className="font-medium text-card-foreground text-sm">
                    {event.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date} a las {event.time}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {event.attendees} participantes
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver calendario completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="premium" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Nuevo Empleado</span>
            </Button>
            <Button variant="secondary" className="h-20 flex-col space-y-2">
              <CalendarDays className="h-6 w-6" />
              <span>Registrar Ausencia</span>
            </Button>
            <Button variant="success" className="h-20 flex-col space-y-2">
              <ClipboardList className="h-6 w-6" />
              <span>Generar Reporte</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;