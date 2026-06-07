import { createFileRoute } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_authed/')({
  component: RouteComponent,
});

const panel = cn('bg-muted/50 rounded-xl p-5');

function RouteComponent() {
  return (
    <div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 mb-5">
        <div className={cn(panel, 'aspect-video')}>Panel 1</div>
        <div className={cn(panel, 'aspect-video')}>Panel 2</div>
        <div className={cn(panel, 'aspect-video')}>Panel 3</div>
      </div>
      <div className={cn(panel, 'min-h-[100vh] flex-1 md:min-h-100')}>
        Main Panel
      </div>
    </div>
  );
}
