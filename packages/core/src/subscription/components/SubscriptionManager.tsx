import React from 'react';
import type { SubscriptionTier } from '../types';

interface Plan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  description: string;
  features: string[];
  limits: {
    monthly_analysis: number;
    repository_limit: number;
    team_members: number;
  };
}

const plans: Plan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out the service',
    features: [
      'Basic PR analysis',
      'Individual use only',
      'Community support'
    ],
    limits: {
      monthly_analysis: 10,
      repository_limit: 3,
      team_members: 1
    }
  },
  {
    tier: 'individual',
    name: 'Individual',
    price: 10,
    description: 'For professional developers',
    features: [
      'Advanced PR analysis',
      'Priority support',
      'Detailed reports',
      'API access'
    ],
    limits: {
      monthly_analysis: 50,
      repository_limit: 10,
      team_members: 1
    }
  },
  {
    tier: 'corporate',
    name: 'Corporate',
    price: 49,
    description: 'For teams and organizations',
    features: [
      'Team collaboration',
      'Custom rules and policies',
      'Analytics dashboard',
      'Priority support',
      'Training and onboarding'
    ],
    limits: {
      monthly_analysis: 500,
      repository_limit: 100,
      team_members: 10
    }
  }
];

interface SubscriptionManagerProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => Promise<void>;
  usageStats: {
    monthly_analysis: number;
    repositories: number;
    team_members: number;
  };
}

export function SubscriptionManager({ 
  currentTier, 
  onUpgrade,
  usageStats 
}: SubscriptionManagerProps) {
  const [selectedTier, setSelectedTier] = React.useState<SubscriptionTier>(currentTier);
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setLoading(true);
    try {
      await onUpgrade(tier);
      setSelectedTier(tier);
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600">
          Start with our free plan or upgrade for more features
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.tier} 
            className={`
              rounded-lg border p-6 
              ${plan.tier === selectedTier ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}
            `}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="text-2xl font-bold mb-4">
                ${plan.price}<span className="text-sm text-gray-500">/month</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Features:</h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Usage Limits:</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-600">Monthly Analyses:</span>{' '}
                  <span className="font-medium">{plan.limits.monthly_analysis}</span>
                </li>
                <li>
                  <span className="text-gray-600">Repositories:</span>{' '}
                  <span className="font-medium">{plan.limits.repository_limit}</span>
                </li>
                <li>
                  <span className="text-gray-600">Team Members:</span>{' '}
                  <span className="font-medium">{plan.limits.team_members}</span>
                </li>
              </ul>
            </div>

            {currentTier !== plan.tier ? (
              <button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={loading || currentTier === plan.tier}
                className={`
                  w-full py-2 px-4 rounded
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}
                `}
              >
                {loading ? 'Processing...' : 'Upgrade'}
              </button>
            ) : (
              <div className="text-center py-2 px-4 bg-green-100 text-green-800 rounded">
                Current Plan
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Current Usage</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-gray-600 mb-2">Monthly Analyses</h4>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{usageStats.monthly_analysis}</span>
              <span className="text-gray-500">/ {plans.find(p => p.tier === currentTier)?.limits.monthly_analysis}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-gray-600 mb-2">Repositories</h4>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{usageStats.repositories}</span>
              <span className="text-gray-500">/ {plans.find(p => p.tier === currentTier)?.limits.repository_limit}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-gray-600 mb-2">Team Members</h4>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{usageStats.team_members}</span>
              <span className="text-gray-500">/ {plans.find(p => p.tier === currentTier)?.limits.team_members}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}