import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CalendarDays, 
  GraduationCap, 
  ClipboardList, 
  BarChart3, 
  Calendar,
  Bell,
  Settings,
  User,
  LogOut
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    toast({
      title: "Sesión cerrada",
      description: "Has salido del sistema exitosamente",
    });
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/bc1834d3-5cc1-4aa1-9acd-e40b9c20d1bf.png" 
              alt="Avícola La Paloma" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">RRHH Avícola La Paloma & TalentHub</h1>
              <p className="text-sm text-muted-foreground">Sistema de gestión de personal • Desarrollo propio Talenthub</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">Usuario Admin</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">UA</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;