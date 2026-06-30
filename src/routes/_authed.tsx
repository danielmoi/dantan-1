import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { getAuthUser } from '@/server/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/Header';
import { Body } from '@/components/Body';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const user = await getAuthUser();
    if (!user) throw redirect({ to: '/login' });
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
