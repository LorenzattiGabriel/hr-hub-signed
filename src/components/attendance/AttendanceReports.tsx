import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, BarChart3, TrendingUp, Clock, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttendanceReportsProps {
  onBack: () => void;
}

const AttendanceReports = ({ onBack }: AttendanceReportsProps) => {
  const { toast } = useToast();

  const generateDetailedReport = () => {
    toast({
      title: "Reporte detallado generado",
      description: "El reporte completo de KPIs se ha generado exitosamente",
    });
  };

  // Mock KPI data
  const kpiData = {
    totalEmployees: 25,
    avgPunctuality: 89,
    avgAttendance: 94,
    lateArrivals: 15,
    topPerformers: [
      { name: "Ana Sofía Martínez", punctuality: 100, attendance: 100 },
      { name: "María José González", punctuality: 95, attendance: 100 },
      { name: "Roberto Fernández", punctuality: 92, attendance: 95 }
    ],
    alerts: [
      { name: "Juan Carlos Rodríguez", issue: "Múltiples llegadas tarde", severity: "high" },
      { name: "Laura García", issue: "Ausentismo elevado", severity: "medium" },
      { name: "Pedro Martín", issue: "Patrón irregular", severity: "low" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard de KPIs</h2>
            <p className="text-foreground/70">Análisis detallado de indicadores de asistencia y puntualidad</p>
          </div>
        </div>
        <Button onClick={generateDetailedReport}>
          <Download className="h-4 w-4 mr-2" />
          Reporte Completo
        </Button>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Total Empleados</p>
                <p className="text-3xl font-bold text-foreground">{kpiData.totalEmployees}</p>
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
                <p className="text-sm font-medium text-foreground/70">Puntualidad Promedio</p>
                <p className="text-3xl font-bold text-foreground">{kpiData.avgPunctuality}%</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Clock className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Asistencia Promedio</p>
                <p className="text-3xl font-bold text-foreground">{kpiData.avgAttendance}%</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70">Llegadas Tarde</p>
                <p className="text-3xl font-bold text-foreground">{kpiData.lateArrivals}</p>
                <p className="text-xs text-foreground/60">este mes</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Mejores Desempeños
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpiData.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                  <div>
                    <p className="font-semibold text-foreground">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Puntualidad: {performer.punctuality}% | Asistencia: {performer.attendance}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">#{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Reconocimientos Sugeridos</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Empleado del mes: Ana Sofía Martínez</li>
                <li>• Puntualidad perfecta: 3 empleados</li>
                <li>• Asistencia perfecta: 2 empleados</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertas y Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpiData.alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  alert.severity === "high" ? "bg-destructive/5 border-destructive/20" :
                  alert.severity === "medium" ? "bg-warning/5 border-warning/20" :
                  "bg-muted/50 border-muted"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">{alert.issue}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.severity === "high" ? "bg-destructive text-destructive-foreground" :
                      alert.severity === "medium" ? "bg-warning text-warning-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {alert.severity === "high" ? "Alto" : alert.severity === "medium" ? "Medio" : "Bajo"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-warning/10 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Acciones Recomendadas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reunión con empleados con alta tardanza</li>
                <li>• Revisar causas de ausentismo</li>
                <li>• Implementar sistema de incentivos</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Tendencias Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Puntualidad por Mes</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Noviembre</span>
                  <span className="font-medium text-foreground">89%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "89%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Octubre</span>
                  <span className="font-medium text-foreground">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Septiembre</span>
                  <span className="font-medium text-foreground">95%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Asistencia por Mes</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Noviembre</span>
                  <span className="font-medium text-foreground">94%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Octubre</span>
                  <span className="font-medium text-foreground">96%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "96%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Septiembre</span>
                  <span className="font-medium text-foreground">98%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "98%" }}></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Llegadas Tarde</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Noviembre</span>
                  <span className="font-medium text-foreground">15</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Octubre</span>
                  <span className="font-medium text-foreground">8</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Septiembre</span>
                  <span className="font-medium text-foreground">5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Análisis:</strong> Se observa una tendencia decreciente en puntualidad durante noviembre. 
              Se recomienda investigar las causas y implementar medidas correctivas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceReports;