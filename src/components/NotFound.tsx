import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <img
        src="/404-ghost.jpg"
        alt="404 ghost"
        className="w-full max-w-xl rounded-2xl"
      />
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-zinc-400 text-lg">
          Looks like this page vanished into thin air.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go back
          </Button>
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
