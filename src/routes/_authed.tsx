import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { getUser } from '@/lib/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/Header';
import { Body } from '@/components/Body';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_authed')({
  beforeLoad: () => {
    if (!getUser()) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Body>
          <Outlet />
        </Body>
      </SidebarInset>
    </SidebarProvider>
  );
}
