import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import EmployeeList from "@/components/employees/EmployeeList";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderContent = () => {
    switch (activeModule) {
      case "employees":
        return <EmployeeList />;
      case "vacations":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Módulo de Vacaciones y Ausencias</h2>
            <p className="text-muted-foreground">Próximamente disponible</p>
          </div>
        );
      case "training":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Módulo de Formación y Registros</h2>
            <p className="text-muted-foreground">Próximamente disponible</p>
          </div>
        );
      case "attendance":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Módulo de Control de Asistencia</h2>
            <p className="text-muted-foreground">Próximamente disponible</p>
          </div>
        );
      case "performance":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Módulo de Evaluación de Desempeño</h2>
            <p className="text-muted-foreground">Próximamente disponible</p>
          </div>
        );
      case "calendar":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Módulo de Calendario y Eventos</h2>
            <p className="text-muted-foreground">Próximamente disponible</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
