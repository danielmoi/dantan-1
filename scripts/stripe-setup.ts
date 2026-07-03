import { writeFileSync } from 'node:fs';
import Stripe from 'stripe';
import { TIER_DATA } from '../src/lib/constants';

process.loadEnvFile('.env.local');

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in .env.local');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const OUTPUT_PATH = new URL('../src/lib/stripe-prices.generated.json', import.meta.url);

async function upsertPrice(tier: number, name: string, unitAmount: number, lookupKey: string): Promise<string> {
  const existingPrice = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (existingPrice.data[0]) {
    console.log(`[stripe-setup] ${name}: price already exists (${existingPrice.data[0].id})`);
    return existingPrice.data[0].id;
  }

  const existingProducts = await stripe.products.search({ query: `name:'${name}' AND active:'true'` });
  const product = existingProducts.data[0] ?? await stripe.products.create({
    name,
    metadata: { subscription_tier: String(tier) },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: unitAmount,
    currency: 'aud',
    recurring: { interval: 'year' },
    lookup_key: lookupKey,
  });

  console.log(`[stripe-setup] ${name}: created price ${price.id} (lookup_key=${lookupKey})`);
  return price.id;
}

async function main() {
  const priceIds: Record<string, string> = {};

  for (const [tier, data] of Object.entries(TIER_DATA)) {
    if (!data.stripeLookupKey) continue;
    priceIds[tier] = await upsertPrice(Number(tier), data.name, Math.round(data.price * 100), data.stripeLookupKey);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(priceIds, null, 2) + '\n');
  console.log(`[stripe-setup] wrote ${OUTPUT_PATH.pathname}`);
}

main();
