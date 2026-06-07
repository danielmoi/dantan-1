import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth, DEMO_USER } from '@/lib/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    signIn(DEMO_USER);
    navigate({ to: '/' });
  };

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign in to Danstack</h1>
          <p className="text-muted-foreground text-sm">
            Replace this with your auth provider
          </p>
        </div>
        <Button onClick={handleSignIn}>Sign in as Demo User</Button>
      </div>
    </div>
  );
}
