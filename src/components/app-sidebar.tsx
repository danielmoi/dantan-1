import * as React from 'react';
import { Link } from '@tanstack/react-router';

import { NavMain } from '@/components/nav-main';
import { NavUpgrade } from '@/components/nav-upgrade';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { data } from '@/lib/sidebar-data';
import { useProfile } from '@/lib/profile';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile();

  const navItems = [
    ...data.navMain,
    ...(profile?.isSuperAdmin ? [{
      title: 'Admin',
      url: '#',
      icon: null,
      items: [{ title: 'Admin', url: '/admin' }],
    }] : []),
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-sm">
                  D
                </div>
                <span className="font-semibold">Danstack</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUpgrade />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
