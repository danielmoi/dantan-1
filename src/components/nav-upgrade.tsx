import { Link } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { getTierData } from '@/lib/constants';
import { useProfile } from '@/lib/profile';

export function NavUpgrade() {
  const { profile } = useProfile();
  const { state } = useSidebar();

  const tier = profile?.subscriptionTier ?? 0;
  const tierData = getTierData(tier);

  if (tier === 0 && state === 'expanded') {
    return (
      <div className="mx-2 mb-1 flex flex-col gap-2 rounded-lg border bg-sidebar-accent/50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="size-4" />
          Upgrade your plan
        </div>
        <p className="text-xs text-muted-foreground">
          Unlock Premium and VIP Supporter features.
        </p>
        <Button asChild size="sm">
          <Link to="/billing">Find out more</Link>
        </Button>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={tier === 0 ? 'Upgrade plan' : `${tierData.name} plan`}>
          <Link to="/billing">
            <Sparkles />
            <span>{tier === 0 ? 'Find out more' : `${tierData.name} plan`}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
