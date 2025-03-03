"use client";

import React from 'react';

export interface CircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  color: string;
  label?: string;
  className?: string;
}

export function CircularProgress({ 
  value, 
  size = 'md', 
  color, 
  label,
  className = ''
}: CircularProgressProps) {
  // Adjust sizes based on the screenshot
  const radius = size === 'sm' ? 18 : size === 'md' ? 30 : 38;
  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  const width = (radius * 2) + (strokeWidth * 2);
  const height = (radius * 2) + (strokeWidth * 2);
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <circle
          className="text-slate-700"
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}