import React from 'react';
import type { UsageLimits, CurrentUsage } from '../types';

interface UsageStatsProps {
  limits: UsageLimits;
  usage: CurrentUsage;
}

export function UsageStats({ limits, usage }: UsageStatsProps) {
  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Monthly Analyses</span>
          <span className="text-sm text-gray-500">
            {usage.monthly_analysis} / {limits.monthly_analysis}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getUsageColor(
              getUsagePercentage(usage.monthly_analysis, limits.monthly_analysis)
            )}`}
            style={{
              width: `${getUsagePercentage(
                usage.monthly_analysis,
                limits.monthly_analysis
              )}%`,
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Repositories</span>
          <span className="text-sm text-gray-500">
            {usage.repositories} / {limits.repository_limit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getUsageColor(
              getUsagePercentage(usage.repositories, limits.repository_limit)
            )}`}
            style={{
              width: `${getUsagePercentage(
                usage.repositories,
                limits.repository_limit
              )}%`,
            }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Team Members</span>
          <span className="text-sm text-gray-500">
            {usage.team_members} / {limits.team_members}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getUsageColor(
              getUsagePercentage(usage.team_members, limits.team_members)
            )}`}
            style={{
              width: `${getUsagePercentage(
                usage.team_members,
                limits.team_members
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}