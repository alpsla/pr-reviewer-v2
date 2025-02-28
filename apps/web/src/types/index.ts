// Common type definitions for the project
import { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface WithChildren {
  children: ReactNode;
}
