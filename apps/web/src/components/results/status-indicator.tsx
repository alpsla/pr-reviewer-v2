"use client";

import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUp, Info } from 'lucide-react';

export type StatusType = 'critical' | 'warning' | 'enhancement' | 'info';

export interface StatusIndicatorProps {
  type: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusIndicator({ 
  type, 
  size = 'md',
  className = '' 
}: StatusIndicatorProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
  
  const icons = {
    critical: <AlertCircle className={`${iconSize} text-red-500`} />,
    warning: <AlertTriangle className={`${iconSize} text-amber-500`} />,
    enhancement: <ArrowUp className={`${iconSize} text-blue-500`} />,
    info: <Info className={`${iconSize} text-gray-500`} />
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      {icons[type]}
    </div>
  );
}