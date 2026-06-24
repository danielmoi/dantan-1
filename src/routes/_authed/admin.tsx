import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/lib/profile';
import { sendInvite, cancelInvite, listInvites } from '@/server/invitation';
import type { Invitation } from '@/types/invitation';

export const Route = createFileRoute('/_authed/admin')({
  beforeLoad: async ({ context }) => {
    if (typeof window === 'undefined') return;
  },
  loader: async () => {
    return listInvites();
  },
  component: AdminPage,
});

function AdminPage() {
  const { profile } = useProfile();
  const invitations = Route.useLoaderData();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!profile?.isSuperAdmin) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendInvite({ data: { email } });
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelInvite({ data: { id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel invitation');
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
            {invitations.map((inv: Invitation) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{inv.email}</span>
                  <span className="text-xs text-muted-foreground">{inv.status}</span>
                </div>
                {(inv.status === 'created' || inv.status === 'resent') && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel(inv.id)}>
                    Cancel
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
