import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/two')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/two"!</div>;
}
