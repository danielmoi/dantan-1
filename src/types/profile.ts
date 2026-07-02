export type ProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  is_super_admin: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_tier: number;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  isSuperAdmin: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionTier: number;
  createdAt: string;
  updatedAt: string;
};
