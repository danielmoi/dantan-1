import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/one')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/one"!</div>;
}
