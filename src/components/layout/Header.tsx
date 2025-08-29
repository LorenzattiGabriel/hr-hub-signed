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
  User
} from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/bc1834d3-5cc1-4aa1-9acd-e40b9c20d1bf.png" alt="Avícola La Paloma" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">RRHH Avícola</h1>
              <p className="text-xs text-foreground/70">Sistema de Gestión de Personal</p>
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