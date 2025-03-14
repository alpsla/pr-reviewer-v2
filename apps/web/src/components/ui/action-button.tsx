"use client";

import { Button, ButtonProps } from './button';
import React from 'react';

export interface ActionButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

export function ActionButton({ 
  children, 
  icon,
  className = '',
  variant = 'default',
  ...props 
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      className={`bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm hover:shadow-md transition-colors ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
}