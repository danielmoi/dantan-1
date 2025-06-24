import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 mb-5">
        <div className="bg-muted/50 aspect-video rounded-xl p-5">Panel 1</div>
        <div className="bg-muted/50 aspect-video rounded-xl p-5">Panel 2</div>
        <div className="bg-muted/50 aspect-video rounded-xl p-5">Panel 3</div>
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-100 p-5">
        Main Panel
      </div>
    </div>
  );
}
