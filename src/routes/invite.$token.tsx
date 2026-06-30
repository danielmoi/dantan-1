import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { Invitation } from '@/types/invitation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/icons';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';
import { useAuth } from '@/lib/auth';
import { InvitationRepository } from '@/repositories/invitation';

export const Route = createFileRoute('/invite/$token')({
  component: InvitePage,
});

function InvitePage() {
  const { token } = Route.useParams();
  const { user } = useAuth();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  useEffect(() => {
    InvitationRepository.getByToken(token).then((inv) => {
      if (!inv) {
        setError('Invalid invitation link.');
      } else if (inv.status === 'accepted') {
        setError('This invitation has already been accepted.');
      } else if (inv.status === 'cancelled') {
        setError('This invitation has been cancelled.');
      } else if (new Date(inv.expiresAt) < new Date()) {
        setError('This invitation has expired.');
      } else {
        setInvitation(inv);
      }
      setLoadingInvite(false);
    });
  }, [token]);

  // Auto-accept once user is authenticated and invitation is loaded
  useEffect(() => {
    if (!user || !invitation || accepting) return;
    setAccepting(true);
    InvitationRepository.updateStatus(invitation.id, 'accepted', user.id)
      .then(() => window.location.replace('/dashboard'))
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : 'Failed to accept invitation'
        );
        setAccepting(false);
      });
  }, [user, invitation, token, accepting]);

  const handleGoogle = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${env.appUrl}/auth/callback?next=/invite/${token}`,
      },
    });
    if (error) {
      setError(error.message);
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;
    setAuthLoading(true);
    setError('');

    const fn =
      authMode === 'signup'
        ? supabase.auth.signUp({
            email: invitation.email,
            password,
            options: {
              emailRedirectTo: `${env.appUrl}/auth/callback?next=/invite/${token}`,
            },
          })
        : supabase.auth.signInWithPassword({
            email: invitation.email,
            password,
          });

    const { error } = await fn;
    if (error) {
      setError(error.message);
      setAuthLoading(false);
    }
    // On success, onAuthStateChange fires → user state updates → auto-accept effect runs
  };

  if (loadingInvite) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (accepting) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Accepting invitation...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">You've been invited</h1>
          <p className="text-sm text-muted-foreground">{invitation?.email}</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          variant="outline"
          onClick={handleGoogle}
          disabled={authLoading}
          className="gap-2"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${authMode === 'signup' ? 'border-foreground bg-foreground text-background' : 'border-border bg-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Sign up
          </button>
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${authMode === 'signin' ? 'border-foreground bg-foreground text-background' : 'border-border bg-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Sign in
          </button>
        </div>

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={invitation?.email ?? ''}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={authLoading}>
            {authLoading
              ? 'Please wait...'
              : authMode === 'signup'
                ? 'Create account & accept'
                : 'Sign in & accept'}
          </Button>
        </form>
      </div>
    </div>
  );
}
