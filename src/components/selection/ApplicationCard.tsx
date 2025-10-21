import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Briefcase, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  birth_date: string;
  phone: string;
  position: string;
  education: string;
  experience: string;
  reference_name: string;
  reference_position: string;
  reference_company: string;
  reference_phone: string;
  has_transport: string;
  work_schedule: string;
  willing_to_work_onsite: string;
  why_work_here: string;
  cv_file_path?: string;
  cv_file_name?: string;
  cv_file_size?: number;
  accept_terms: boolean;
  created_at: string;
  updated_at: string;
}

interface ApplicationCardProps {
  application: Application;
  onView: () => void;
  onDelete: () => void;
}

export const ApplicationCard = ({ application, onView, onDelete }: ApplicationCardProps) => {
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getPositionIcon = () => {
    const position = application.position?.toLowerCase() || '';
    if (position.includes('operario') || position.includes('producción') || position.includes('mantenimiento')) {
      return '🔧';
    }
    if (position.includes('admin') || position.includes('ventas')) {
      return '📊';
    }
    return '💼';
  };

  const age = application.birth_date ? getAge(application.birth_date) : null;

  return (
    <Card 
      className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 cursor-pointer hover:scale-[1.02]"
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12 bg-primary/10">
            <AvatarFallback className="text-primary font-semibold">
              {getInitials(application.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {application.full_name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span className="mr-2">{getPositionIcon()}</span>
                  <span className="truncate">{application.position}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="outline" className="text-xs shrink-0">
                  {application.education}
                </Badge>
                {application.cv_file_name && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1 shrink-0">
                    <FileText className="h-3 w-3" />
                    CV
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span className="truncate">{application.phone}</span>
              </div>
              {age && (
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-3 w-3" />
                  <span>{age} años</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(application.created_at).toLocaleDateString()}</span>
              </div>
              {application.has_transport && (
                <div className="flex items-center space-x-1">
                  <span>🚗 {application.has_transport}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver más
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
