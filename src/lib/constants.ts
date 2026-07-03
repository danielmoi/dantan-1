export const TIER_DATA = {
  0: {
    name: 'Basic',
    price: 0,
    stripeLookupKey: null,
  },
  1: {
    name: 'Premium',
    price: 9.90,
    stripeLookupKey: 'tier_1_yearly',
  },
  2: {
    name: 'VIP Supporter',
    price: 19.90,
    stripeLookupKey: 'tier_2_yearly',
  },
} satisfies Record<number, { name: string; price: number; stripeLookupKey: string | null }>;

export type SubscriptionTier = keyof typeof TIER_DATA;

export function getTierData(tier: number) {
  return TIER_DATA[tier as SubscriptionTier] ?? TIER_DATA[0];
}
