import { createFileRoute, redirect } from '@tanstack/react-router';
import { exchangeCode } from '@/server/auth';

export const Route = createFileRoute('/auth/callback')({
  beforeLoad: async ({ location }) => {
    const params = new URLSearchParams(location.searchStr);
    const code = params.get('code');
    const next = params.get('next') ?? '/dashboard';

    if (!code) {
      console.error('[auth/callback] missing code param');
      throw redirect({ to: '/login', search: { error: 'auth_failed' } });
    }

    try {
      await exchangeCode({ data: { code } });
    } catch (e) {
      console.error('[auth/callback] code exchange failed:', e);
      throw redirect({ to: '/login', search: { error: 'auth_failed' } });
    }

    throw redirect({ to: next });
  },
  component: AuthCallback,
});

function AuthCallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
