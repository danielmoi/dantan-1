import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
});

function AuthCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        window.location.replace(error ? '/login?error=auth_failed' : '/dashboard');
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        window.location.replace(session ? '/dashboard' : '/login?error=auth_failed');
      });
    }
  }, []);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
