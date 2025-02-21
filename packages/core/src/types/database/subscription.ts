/**
 * Subscription-related type definitions
 */

export type SubscriptionTier = 'free' | 'basic' | 'team' | 'enterprise' | 'individual' | 'corporate';

export type UsageLimits = {
  monthly_analysis: number;
  repository_limit: number;
  team_members: number;
  file_size_limit_mb: number;
  priority_support: boolean;
  custom_prompts: boolean;
};

export type CurrentUsage = {
  monthly_analysis: number;
  repositories: number;
  team_members: number;
  repository_limit?: number; // Added for index compatibility
};

export type SubscriptionPlan = {
  tier: SubscriptionTier;
  name: string;
  description: string;
  price: number;
  features: string[];
  limits: UsageLimits;
};

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive';

export type SubscriptionData = {
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billing_period_start: Date;
  billing_period_end: Date;
  cancel_at_period_end: boolean;
  payment_method?: {
    type: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  };
  usage: CurrentUsage;
};

export type BillingEventType = 'subscription_created' | 'subscription_updated' | 'subscription_canceled' | 'payment_succeeded' | 'payment_failed';

export type BillingEventMetadata = {
  invoice_id?: string;
  amount?: number;
  currency?: string;
  status?: string;
  description?: string;
};

export type BillingHistoryEvent = {
  id: string;
  user_id: string;
  event_type: BillingEventType;
  created_at: Date;
  metadata: BillingEventMetadata;
};
