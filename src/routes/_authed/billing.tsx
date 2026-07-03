import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TIER_DATA } from '@/lib/constants';
import { useProfile } from '@/lib/profile';
import { createCheckoutSession, createPortalSession } from '@/server/stripe';

export const Route = createFileRoute('/_authed/billing')({
  component: BillingPage,
});

function BillingPage() {
  const { profile } = useProfile();
  const [loadingTier, setLoadingTier] = useState<number | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');

  const currentTier = profile?.subscriptionTier ?? 0;

  const handleChoosePlan = async (tier: number) => {
    setError('');
    setLoadingTier(tier);
    try {
      const { url } = await createCheckoutSession({ data: { tier } });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setLoadingTier(null);
    }
  };

  const handleManageBilling = async () => {
    setError('');
    setPortalLoading(true);
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
      setPortalLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Billing</h1>
          <p className="text-sm text-muted-foreground">Manage your subscription plan</p>
        </div>
        {profile?.stripeCustomerId && (
          <Button variant="outline" onClick={handleManageBilling} disabled={portalLoading}>
            {portalLoading ? 'Opening...' : 'Manage billing'}
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(TIER_DATA).map(([tier, data]) => {
          const tierNum = Number(tier);
          const isCurrent = tierNum === currentTier;
          return (
            <div key={tier} className="flex flex-col gap-3 rounded-lg border p-4">
              <div>
                <h2 className="font-semibold">{data.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {data.price === 0 ? 'Free' : `$${data.price.toFixed(2)} AUD/yr`}
                </p>
              </div>
              <Button
                variant={isCurrent ? 'secondary' : 'default'}
                disabled={isCurrent || loadingTier !== null || tierNum === 0}
                onClick={() => handleChoosePlan(tierNum)}
                className="mt-auto"
              >
                {isCurrent ? 'Current plan' : loadingTier === tierNum ? 'Redirecting...' : 'Choose plan'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
