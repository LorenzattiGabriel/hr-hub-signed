import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import EmployeeList from "@/components/employees/EmployeeList";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import VacationList from "@/components/vacations/VacationList";
import TrainingList from "@/components/training/TrainingList";
import AttendanceList from "@/components/attendance/AttendanceList";
import PerformanceList from "@/components/performance/PerformanceList";
import CalendarList from "@/components/calendar/CalendarList";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  const renderContent = () => {
    switch (activeModule) {
      case "employees":
        return <EmployeeList />;
      case "vacations":
        return <VacationList />;
      case "training":
        return <TrainingList />;
      case "attendance":
        return <AttendanceList />;
      case "performance":
        return <PerformanceList />;
      case "calendar":
        return <CalendarList />;
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
