'use client';

import { useSupabase } from "@/lib/providers/supabase-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, signOut } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
      <p className="text-muted-foreground">
        Welcome back, {user.email}!
      </p>
    </div>
  );
}