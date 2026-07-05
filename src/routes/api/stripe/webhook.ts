import { createServerFileRoute } from '@tanstack/react-start/server';
import type Stripe from 'stripe';
import { getTierForPriceId, stripe } from '@/lib/stripe.server';
import { createSupabaseAdminClient } from '@/lib/supabase.server';

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Re-derive the customer's current subscription from Stripe rather than trusting
  // this event's payload in isolation — a stale/out-of-order event (e.g. an old
  // subscription being canceled after a newer one replaced it) must not clobber
  // a still-active subscription.
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
  const current = subscriptions.data.find((s) => s.status === 'active' || s.status === 'trialing');
  const priceId = current?.items.data[0]?.price.id;
  const tier = current && priceId ? getTierForPriceId(priceId) : 0;

  await createSupabaseAdminClient()
    .from('profiles')
    .update({
      subscription_tier: tier,
      stripe_subscription_id: current?.id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId);
}

export const ServerRoute = createServerFileRoute('/api/stripe/webhook').methods({
  POST: async ({ request }) => {
    const signature = request.headers.get('stripe-signature');
    if (!signature) return new Response('Missing stripe-signature header', { status: 400 });

    const body = await request.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET ?? '');
    } catch (err) {
      console.error('[stripe-webhook] signature verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object);
        break;
    }

    return new Response(null, { status: 200 });
  },
});
