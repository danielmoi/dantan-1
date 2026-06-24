import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { InvitationRepository } from '@/repositories/invitation';
import { InvitationService } from '@/services/invitation';
import type { Invitation } from '@/types/invitation';

export const Route = createFileRoute('/invite/$token')({
  component: InvitePage,
});

function InvitePage() {
  const { token } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setLoading(false);
    });
  }, [token]);

  const handleAccept = async () => {
    if (!invitation || !user) return;
    setLoading(true);
    try {
      await InvitationService.accept(invitation.token, user.id);
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-4 text-center">
        <h1 className="text-2xl font-bold">You've been invited</h1>

        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {invitation && !error && (
          <>
            {user ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Accept the invitation to continue as <strong>{user.email}</strong>.
                </p>
                <Button onClick={handleAccept} disabled={loading}>
                  {loading ? 'Accepting...' : 'Accept invitation'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Sign up or sign in to accept your invitation.
                </p>
                <Button onClick={() => navigate({ to: '/login' })}>
                  Sign up / Sign in
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
