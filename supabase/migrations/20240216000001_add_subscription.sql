-- Create subscription type enum
CREATE TYPE subscription_tier AS ENUM ('free', 'individual', 'corporate');

-- Add subscription-related fields to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_tier subscription_tier DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_customer_id TEXT,
ADD COLUMN IF NOT EXISTS payment_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS usage_limits JSONB DEFAULT '{
    "monthly_analysis": 10,
    "repository_limit": 3,
    "team_members": 1
}'::jsonb,
ADD COLUMN IF NOT EXISTS usage_current JSONB DEFAULT '{
    "monthly_analysis": 0,
    "repositories": 0,
    "team_members": 1
}'::jsonb;

-- Add indexes for subscription queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);

-- Create billing_history table for tracking payments and plan changes
CREATE TABLE IF NOT EXISTS public.billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    event_type TEXT NOT NULL, -- 'subscription_created', 'subscription_updated', 'payment_succeeded', etc.
    old_tier subscription_tier,
    new_tier subscription_tier,
    amount DECIMAL,
    currency TEXT,
    payment_status TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);