import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CalendarDays, 
  GraduationCap, 
  ClipboardList, 
  BarChart3, 
  Calendar,
  Building2,
  Bell,
  Settings,
  User
} from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">RRHH Manager</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión de Personal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;