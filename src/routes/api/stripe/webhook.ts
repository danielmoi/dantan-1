import { createServerFileRoute } from '@tanstack/react-start/server';
import type Stripe from 'stripe';
import { getTierForPriceId, stripe } from '@/lib/stripe.server';
import { createSupabaseAdminClient } from '@/lib/supabase.server';

async function syncSubscription(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id;
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';
  const tier = isActive && priceId ? getTierForPriceId(priceId) : 0;

  await createSupabaseAdminClient()
    .from('profiles')
    .update({
      subscription_tier: tier,
      stripe_subscription_id: isActive ? subscription.id : null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', subscription.customer as string);
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
