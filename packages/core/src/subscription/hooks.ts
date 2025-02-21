import { useState, useEffect } from 'react';
import { SubscriptionService } from './subscription-service';
import type { SubscriptionTier, UsageLimits, CurrentUsage } from '../types/database/subscription';

export interface SubscriptionData {
  tier: SubscriptionTier;
  status: string;
  startDate: string | null;
  endDate: string | null;
  limits: UsageLimits;
  usage: CurrentUsage;
}

export function useSubscription(userId: string, subscriptionService: SubscriptionService) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSubscription() {
      try {
        setLoading(true);
        const data = await subscriptionService.getUserSubscription(userId);
        if (data) {
          setSubscription({
            tier: data.subscription_tier as SubscriptionTier,
            status: data.subscription_status,
            startDate: data.subscription_start_date,
            endDate: data.subscription_end_date,
            limits: data.usage_limits as UsageLimits,
            usage: data.usage_current as CurrentUsage,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load subscription'));
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadSubscription();
    }
  }, [userId, subscriptionService]);

  const checkLimit = async (type: ("monthly_analysis" | "team_members" | "repository_limit") & keyof UsageLimits) => {
    try {
      return await subscriptionService.checkUsageLimit(userId, type);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to check limit'));
      return false;
    }
  };

  const incrementUsage = async (type: keyof CurrentUsage) => {
    try {
      await subscriptionService.incrementUsage(userId, type);
      // Refresh subscription data
      const data = await subscriptionService.getUserSubscription(userId);
      if (data) {
        setSubscription(prev => ({
          ...prev!,
          usage: data.usage_current as CurrentUsage,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to increment usage'));
    }
  };

  return {
    subscription,
    loading,
    error,
    checkLimit,
    incrementUsage,
  };
}