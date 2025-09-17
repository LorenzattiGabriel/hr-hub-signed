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
import { useEmployees } from "@/hooks/useEmployees";

const DashboardOverview = () => {
  const { employees, getActiveEmployees } = useEmployees();
  const activeEmployees = getActiveEmployees();
  
  // Calculate average seniority
  const calculateAverageSeniority = () => {
    if (activeEmployees.length === 0) return 0;
    
    const today = new Date();
    const totalYears = activeEmployees.reduce((sum, employee) => {
      const dateField = employee.fechaIngreso;
      if (dateField) {
        const startDate = new Date(dateField);
        const years = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        return sum + years;
      }
      return sum;
    }, 0);
    
    return Math.round((totalYears / activeEmployees.length) * 10) / 10; // Round to 1 decimal
  };
  
  const averageSeniority = calculateAverageSeniority();
  
  const quickStats = [
    {
      title: "Días de vacaciones usados",
      value: "0",
      change: "Sin datos",
      icon: CalendarDays,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Días de vacaciones disponibles",
      value: "0",
      change: "Sin datos",
      icon: CalendarDays,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Llegadas tarde este mes",
      value: "0",
      change: "Sin datos",
      icon: Clock,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Capacitaciones completadas",
      value: "0",
      change: "Sin datos",
      icon: ClipboardList,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  // Recent activities - start empty
  const recentActivities: any[] = [];


  // Helper for status icon
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

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Empleados</p>
                <p className="text-3xl font-bold text-card-foreground">{employees.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Empleados Activos</p>
                <p className="text-3xl font-bold text-card-foreground">{activeEmployees.length}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Promedio Antigüedad</p>
                <p className="text-3xl font-bold text-card-foreground">{averageSeniority}</p>
                <p className="text-xs text-muted-foreground">años</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay actividad reciente</div>
              ) : (
                recentActivities.map((activity) => (
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
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver todas las actividades
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const upcomingEvents: any[] = [];
              if (upcomingEvents.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">No hay eventos próximos</div>
                );
              }
              return (
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
              );
            })()}
            <Button variant="outline" className="w-full mt-4">
              Ver calendario completo
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default DashboardOverview;