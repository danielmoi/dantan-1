import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/icons';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

type AuthMode = 'signin' | 'signup';

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(() =>
    new URLSearchParams(window.location.search).get('error')
      ? 'Sign in failed. Please try again.'
      : ''
  );

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError('');
    setMessage('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${env.appUrl}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage(`We sent a confirmation link to ${email}. Click it to activate your account.`);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${env.appUrl}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {mode === 'signin' ? 'Sign in to Danstack' : 'Create an account'}
          </h1>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {message ? (
          <p className="text-sm text-green-600 dark:text-green-400 text-center">
            {message}
          </p>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleGoogle}
              disabled={loading}
              className="gap-2"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase text-muted-foreground">
                or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => switchMode('signin')}
                className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${mode === 'signin' ? 'border-foreground bg-foreground text-background' : 'border-border bg-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Sign in
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${mode === 'signup' ? 'border-foreground bg-foreground text-background' : 'border-border bg-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Sign up
              </button>
            </div>
          </>
        )}

        {!message && (
          <form
            onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}
            className="flex flex-col gap-4"
          >
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
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
            <Button type="submit" disabled={loading}>
              {loading
                ? mode === 'signin'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
