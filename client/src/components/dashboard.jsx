import { useState } from "react";
import AppSidebar from "./app-sidebar";
import SoilCharts from "./soil-charts";
import WeatherContent from "./weather-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const Dashboard = () => {
  const [activeRoute, setActiveRoute] = useState("soil");

  const renderContent = () => {
    switch (activeRoute) {
      case "soil":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Soil Monitoring
              </h2>
              <p className="text-muted-foreground">
                Real-time soil conditions and analytics for optimal crop growth.
              </p>
            </div>
            <SoilCharts />
          </div>
        );
      case "weather":
        return <WeatherContent />;
      default:
        return <div>Select a route from the sidebar</div>;
    }
  };

  const getPageTitle = () => {
    switch (activeRoute) {
      case "soil":
        return "Soil Monitoring";
      case "weather":
        return "Weather Monitoring";
      default:
        return "Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar activeRoute={activeRoute} onRouteChange={setActiveRoute} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
