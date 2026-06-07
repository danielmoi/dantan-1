import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/')({
  component: HomePage,
});

const stack = [
  'TanStack Start',
  'TanStack Router',
  'shadcn/ui',
  'Tailwind v4',
  'Dark mode',
  'Inter',
];

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 px-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-6xl font-bold tracking-tight">Danstack</h1>
        <p className="text-muted-foreground max-w-sm text-lg">
          A modern starter template for building full-stack React apps.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm"
          >
            {item}
          </span>
        ))}
      </div>
      {user ? (
        <Button asChild size="lg">
          <Link to="/one">Go to app</Link>
        </Button>
      ) : (
        <Button asChild size="lg">
          <Link to="/login">Sign in</Link>
        </Button>
      )}
    </div>
  );
}
