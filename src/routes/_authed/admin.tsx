import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { Invitation } from '@/types/invitation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/lib/profile';
import { formatDate } from '@/lib/utils';
import { InvitationRepository } from '@/repositories/invitation';
import { resendInvite, sendInvite } from '@/server/invitation';

export const Route = createFileRoute('/_authed/admin')({
  component: AdminPage,
});

function AdminPage() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Array<Invitation>>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState<Record<string, 'resending' | 'cancelling'>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile && !profile.isSuperAdmin) {
      navigate({ to: '/dashboard' });
    }
  }, [profile, navigate]);

  useEffect(() => {
    if (!profile?.isSuperAdmin) return;
    InvitationRepository.list().then(setInvitations);
  }, [profile]);

  if (!profile?.isSuperAdmin) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const invitation = await sendInvite({ data: { email } });
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      setInvitations((prev) => [invitation, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send invitation'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (id: string) => {
    setRowLoading((prev) => ({ ...prev, [id]: 'resending' }));
    try {
      const updated = await resendInvite({ data: { id } });
        setInvitations((prev) =>
          prev.map((inv) => (inv.id === id ? updated : inv))
        );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to resend invitation'
      );
    } finally {
      setRowLoading((prev) => { const next = { ...prev }; delete next[id]; return next; });
    }
  };

  const handleCancel = async (id: string) => {
    setRowLoading((prev) => ({ ...prev, [id]: 'cancelling' }));
    try {
      const updated = await InvitationRepository.updateStatus(
        id,
        'cancelled',
        profile.id
      );
      if (updated)
        setInvitations((prev) =>
          prev.map((inv) => (inv.id === id ? updated : inv))
        );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to cancel invitation'
      );
    } finally {
      setRowLoading((prev) => { const next = { ...prev }; delete next[id]; return next; });
    }
  };

  return (
    <div className="p-6 max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Admin</h1>
        <p className="text-sm text-muted-foreground">Manage invitations</p>
      </div>

      <form onSubmit={handleSend} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Send invitation</h2>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}
        <div className="flex flex-col gap-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@example.com"
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="self-start">
          {loading ? 'Sending...' : 'Send invite'}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Invitations</h2>
        {invitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invitations yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-lg border p-3 text-sm"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{inv.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {inv.status}
                    {inv.status === 'created' && (
                      <> · {formatDate(inv.createdAt)}</>
                    )}
                    {(inv.status === 'resent' || inv.status === 'cancelled') && (
                      <> · {formatDate(inv.updatedAt)}</>
                    )}
                    {inv.status === 'accepted' && inv.acceptedAt && (
                      <> · {formatDate(inv.acceptedAt)}</>
                    )}
                  </span>
                </div>
                {(inv.status === 'created' || inv.status === 'resent') && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResend(inv.id)}
                      disabled={!!rowLoading[inv.id]}
                    >
                      {rowLoading[inv.id] === 'resending' ? 'Resending...' : 'Resend'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(inv.id)}
                      disabled={!!rowLoading[inv.id]}
                    >
                      {rowLoading[inv.id] === 'cancelling' ? 'Cancelling...' : 'Cancel'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
