import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Edit, MoreHorizontal, Download } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  avatar?: string;
  startDate: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onViewDetails: (employee: Employee) => void;
  onDownloadPDF: (employee: Employee) => void;
}

const EmployeeCard = ({ employee, onEdit, onViewDetails, onDownloadPDF }: EmployeeCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {employee.name}
              </h3>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
              <p className="text-xs text-muted-foreground">{employee.department}</p>
            </div>
          </div>
          <Badge variant={employee.status === "active" ? "active" : "inactive"}>
            {employee.status === "active" ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Email:</span> {employee.email}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Teléfono:</span> {employee.phone}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Ingreso:</span> {employee.startDate}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(employee)}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Detalle
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDownloadPDF(employee)}
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(employee)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;