'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Globe, ChevronDown, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CodeQualLogoFinal } from '@/components/ui/codequal-logo-final';
import { BaseProps } from '@/types';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/context/auth-context';
import { ProvidersMenu } from '@/components/auth/providers-menu';

export interface HeaderProps extends BaseProps {
  userType?: 'free' | 'premium';
}