import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database/types";
import type { 
  SubscriptionTier, 
  UsageLimits, 
  CurrentUsage, 
  BillingEventMetadata 
} from "../types/database/subscription";

export class SubscriptionError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'SubscriptionError';
  }
}

export class SubscriptionService {
  constructor(
    private supabase: SupabaseClient<Database>,
  ) {}

  async getUserSubscription(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select(`
          subscription_tier,
          subscription_status,
          subscription_start_date,
          subscription_end_date,
          usage_limits,
          usage_current
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new SubscriptionError('Failed to get user subscription', error);
    }
  }

  async updateSubscription(
    userId: string,
    tier: SubscriptionTier,
    paymentCustomerId?: string,
    paymentSubscriptionId?: string,
  ) {
    const limits = this.getTierLimits(tier);
    
    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          subscription_tier: tier,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          payment_customer_id: paymentCustomerId,
          payment_subscription_id: paymentSubscriptionId,
          usage_limits: limits,
        })
        .eq('id', userId);

      if (error) throw error;

      await this.recordBillingEvent(userId, {
        event_type: 'subscription_updated',
        new_tier: tier,
      });
    } catch (error) {
      throw new SubscriptionError('Failed to update subscription', error);
    }
  }

  async checkUsageLimit(userId: string, type: keyof CurrentUsage & keyof UsageLimits): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription || !subscription.usage_current || !subscription.usage_limits) {
        throw new Error('Subscription, usage limits, or current usage not found');
      }

      const currentUsage = subscription.usage_current as CurrentUsage;
      const limits = subscription.usage_limits as UsageLimits;

      // Add null/undefined check
      const currentValue = currentUsage[type] || 0;
      const limitValue = limits[type] || Infinity;

      return currentValue < limitValue;
    } catch (error) {
      throw new SubscriptionError('Failed to check usage limit', error);
    }
  }

  async incrementUsage(userId: string, type: keyof CurrentUsage) {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) throw new Error('Subscription not found');

      const currentUsage = subscription.usage_current as CurrentUsage;
      currentUsage[type] += 1;

      const { error } = await this.supabase
        .from('users')
        .update({
          usage_current: currentUsage,
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      throw new SubscriptionError('Failed to increment usage', error);
    }
  }

  async resetMonthlyUsage(userId: string) {
    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          'usage_current': {
            monthly_analysis: 0,
            repositories: 0,
            team_members: 1,
          },
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      throw new SubscriptionError('Failed to reset monthly usage', error);
    }
  }

  private async recordBillingEvent(userId: string, event: {
    event_type: string;
    old_tier?: SubscriptionTier;
    new_tier?: SubscriptionTier;
    amount?: number;
    currency?: string;
    payment_status?: string;
    metadata?: BillingEventMetadata;
  }) {
    try {
      const { error } = await this.supabase
        .from('billing_history')
        .insert({
          user_id: userId,
          ...event,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to record billing event:', error);
    }
  }

  private getTierLimits(tier: SubscriptionTier): UsageLimits {
    switch (tier) {
      case 'free':
        return {
          monthly_analysis: 10,
          repository_limit: 3,
          team_members: 1,
          file_size_limit_mb: 5,
          priority_support: false,
          custom_prompts: false
        };
      case 'basic':
      case 'individual':
        return {
          monthly_analysis: 50,
          repository_limit: 10,
          team_members: 1,
          file_size_limit_mb: 10,
          priority_support: false,
          custom_prompts: true
        };
      case 'team':
      case 'corporate':
        return {
          monthly_analysis: 500,
          repository_limit: 100,
          team_members: 10,
          file_size_limit_mb: 50,
          priority_support: true,
          custom_prompts: true
        };
      case 'enterprise':
      default:
        return {
          monthly_analysis: 5000,
          repository_limit: 1000,
          team_members: 100,
          file_size_limit_mb: 100,
          priority_support: true,
          custom_prompts: true
        };
    }
  }
}