'use client';

import { SupabaseProvider } from "@/lib/providers/supabase-provider";
import ClientOnly from "./client-only";

export default function ClientSupabaseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientOnly>
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </ClientOnly>
  );
}
