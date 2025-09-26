"use client";

import {
  IconCalendar,
  IconCalendarStats,
  IconChartLine,
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
  };
};

const navData = {
  navMain: [
    {
      title: "Dashboard",
      description:
        "Visão geral com lucro/prejuízo acumulado, últimos dias e gráficos.",
      url: "/dashboard",
      icon: IconChartLine,
    },
    {
      title: "Minhas Apostas",
      description:
        "Listagem completa com filtros por status, data, casa e mercado.",
      url: "/bets",
      icon: IconListDetails,
    },
  ],
  navReports: [
    {
      name: "Resumo Diário",
      url: "/reports/daily",
      icon: IconCalendarStats,
      disabled: true,
    },
    {
      name: "Resumo Mensal",
      url: "/reports/monthly",
      icon: IconCalendar,
      disabled: true,
    },
  ],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Tabet.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavDocuments
          title="Relatórios"
          items={navData.navReports}
          className="mt-4"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
