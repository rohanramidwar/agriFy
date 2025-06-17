import { Leaf, Cloud } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";

const navigationItems = [
  {
    title: "Soil",
    icon: Leaf,
    id: "soil",
  },
  {
    title: "Weather",
    icon: Cloud,
    id: "weather",
  },
];

const AppSidebar = ({ activeRoute, onRouteChange, ...props }) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Leaf className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">AgriMonitor</span>
            <span className="text-xs text-sidebar-foreground/70">
              Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeRoute === item.id}
                    onClick={() => onRouteChange(item.id)}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
