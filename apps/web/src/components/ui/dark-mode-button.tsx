"use client";

import { Button, ButtonProps } from './button';
import React from 'react';

export interface DarkModeButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

export function DarkModeButton({ 
  children, 
  icon,
  className = '',
  variant = 'outline',
  ...props 
}: DarkModeButtonProps) {
  return (
    <Button
      variant={variant}
      className={`border-slate-300 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </Button>
  );
}
