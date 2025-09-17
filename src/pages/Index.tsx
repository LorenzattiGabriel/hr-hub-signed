import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import EmployeeList from "@/components/employees/EmployeeList";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import VacationsModule from "@/components/vacations/VacationsModuleV2";
import AbsencesModule from "@/components/absences/AbsencesModule";
import TrainingList from "@/components/training/TrainingList";
import UniformsModule from "@/components/uniforms/UniformsModule";
import AttendanceList from "@/components/attendance/AttendanceList";
import PerformanceList from "@/components/performance/PerformanceList";
import CalendarList from "@/components/calendar/CalendarList";
import PayrollModule from "@/components/payroll/PayrollModule";


const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderContent = () => {
    switch (activeModule) {
      case "employees":
        return <EmployeeList />;
      case "vacations":
        return <VacationsModule />;
      case "absences":
        return <AbsencesModule />;
      case "training":
        return <TrainingList />;
      case "uniforms":
        return <UniformsModule />;
      case "attendance":
        return <AttendanceList />;
      case "performance":
        return <PerformanceList />;
      case "calendar":
        return <CalendarList />;
      case "payroll":
        return <PayrollModule />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="flex-1 container-padding section-spacing overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default Index;
