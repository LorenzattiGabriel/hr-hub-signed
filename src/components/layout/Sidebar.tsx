import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Users, 
  CalendarDays, 
  GraduationCap, 
  ClipboardList, 
  BarChart3, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shirt,
  DollarSign
} from "lucide-react";

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  {
    id: "dashboard",
    name: "Panel General",
    icon: BarChart3,
    description: "Resumen y estadísticas",
    badge: ""
  },
  {
    id: "employees",
    name: "Gestión de Empleados",
    icon: Users,
    description: "Legajo Digital",
    badge: "12"
  },
  {
    id: "vacations",
    name: "Vacaciones",
    icon: CalendarDays,
    description: "Gestión de vacaciones",
    badge: "3"
  },
  {
    id: "absences",
    name: "Ausencias y Permisos",
    icon: ClipboardList,
    description: "Permisos y Certificados",
    badge: "2"
  },
  {
    id: "training",
    name: "Capacitaciones",
    icon: GraduationCap,
    description: "Formación y Desarrollo",
    badge: "3"
  },
  {
    id: "uniforms",
    name: "Entrega de Uniformes",
    icon: Shirt,
    description: "Control de Uniformes",
    badge: "2"
  },
  {
    id: "attendance",
    name: "Control de Asistencia",
    icon: ClipboardList,
    description: "KPIs y Reportes",
    badge: "New"
  },
  {
    id: "performance",
    name: "Evaluación de Desempeño",
    icon: BarChart3,
    description: "Seguimiento de Rendimiento"
  },
  {
    id: "payroll",
    name: "Nómina de Sueldos",
    icon: DollarSign,
    description: "Sueldos y Pagos",
    badge: "New"
  },
];

const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative border-r border-border bg-card transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-card-foreground">Módulos</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <Button
                key={module.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-3 h-auto py-3",
                  isCollapsed && "px-2 justify-center"
                )}
                onClick={() => onModuleChange(module.id)}
              >
                <Icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "")} />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{module.name}</span>
                      {module.badge && (
                        <Badge 
                          variant={module.badge === "New" ? "success" : "secondary"}
                          className="ml-2"
                        >
                          {module.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-foreground/60 mt-1">
                      {module.description}
                    </p>
                  </div>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;