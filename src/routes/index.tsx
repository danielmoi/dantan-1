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
    <div
      className="relative flex min-h-svh flex-col items-center justify-center gap-10 px-4 text-center"
      style={{ backgroundImage: 'url(/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex flex-col items-center gap-3">
        <h1 className="text-6xl font-bold tracking-tight text-white">Danstack</h1>
        <p className="max-w-sm text-lg text-white/80">
          A modern starter template for building full-stack React apps.
        </p>
      </div>
      <div className="relative flex flex-wrap justify-center gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm"
          >
            {item}
          </span>
        ))}
      </div>
      <div className="relative">
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
    </div>
  );
}
