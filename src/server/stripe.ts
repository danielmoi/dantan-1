import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { env } from '@/lib/env';
import { getPriceIdForTier, stripe } from '@/lib/stripe.server';
import { createSupabaseServerClient } from '@/lib/supabase.server';

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ tier: z.number().int().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const client = createSupabaseServerClient();

    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) throw new Error('Unauthorized');

    const { data: profile } = await client
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await client
        .from('profiles')
        .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: getPriceIdForTier(data.tier), quantity: 1 }],
      success_url: `${env.appUrl}/billing?checkout=success`,
      cancel_url: `${env.appUrl}/billing?checkout=canceled`,
      metadata: { supabase_user_id: user.id, subscription_tier: String(data.tier) },
    });

    if (!session.url) throw new Error('Failed to create checkout session');
    return { url: session.url };
  });

export const createPortalSession = createServerFn({ method: 'POST' }).handler(async () => {
  const client = createSupabaseServerClient();

  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');

  const { data: profile } = await client
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) throw new Error('No Stripe customer for this user');

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${env.appUrl}/billing`,
  });

  return { url: session.url };
});
