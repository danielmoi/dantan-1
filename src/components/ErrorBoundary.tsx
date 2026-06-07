import type { ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function ErrorBoundary({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-sm text-sm">{message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
