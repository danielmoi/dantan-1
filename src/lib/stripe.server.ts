import Stripe from 'stripe';
import stripePrices from '@/lib/stripe-prices.generated.json';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

const tierToPriceId = stripePrices as Record<string, string>;
const priceIdToTier = Object.fromEntries(
  Object.entries(tierToPriceId).map(([tier, priceId]) => [priceId, Number(tier)]),
);

export function getPriceIdForTier(tier: number): string {
  const priceId = tierToPriceId[String(tier)];
  if (!priceId) {
    throw new Error(`No Stripe price for tier ${tier}. Run "npm run stripe:setup" first.`);
  }
  return priceId;
}

export function getTierForPriceId(priceId: string): number {
  return priceIdToTier[priceId] ?? 0;
}
