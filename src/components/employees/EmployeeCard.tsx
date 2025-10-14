import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, Eye, Edit, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDateLocal, calculateYearsOfService } from "@/utils/dateUtils";

interface EmployeeCardProps {
  employee: {
    id: number;
    nombres: string;
    apellidos: string;
    dni: string;
    cargo: string;
    sector: string;
    email: string;
    telefono: string;
    fechaIngreso: string;
    estado: string;
  };
  onView: () => void;
  onEdit: () => void;
}

const EmployeeCard = ({ employee, onView, onEdit }: EmployeeCardProps) => {
  const { toast } = useToast();

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  const generatePDF = () => {
    toast({
      title: "PDF Generado",
      description: `Legajo de ${employee.nombres} ${employee.apellidos} generado exitosamente`,
    });
  };


  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(employee.nombres, employee.apellidos)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {employee.nombres} {employee.apellidos}
              </h3>
              <p className="text-foreground/70 font-medium">{employee.cargo}</p>
              <p className="text-sm text-foreground/60">{employee.sector}</p>
              
              <div className="flex items-center space-x-4 mt-3 text-sm text-foreground/70">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{employee.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{employee.telefono}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mt-2 text-sm text-foreground/70">
                <Calendar className="h-4 w-4" />
                <span>Ingreso: {formatDateLocal(employee.fechaIngreso)}</span>
                <span className="mx-2">•</span>
                <span>{calculateYearsOfService(employee.fechaIngreso)} años de antigüedad</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <Badge variant={employee.estado === "activo" ? "success" : "destructive"}>
              {employee.estado === "activo" ? "Activo" : "Inactivo"}
            </Badge>
            
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={onView}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={generatePDF}>
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;