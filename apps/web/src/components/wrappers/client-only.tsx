'use client';

import { useEffect, useState } from 'react';

export default function ClientOnly({
  children,
  fallback = <div className="p-4 text-center">Loading...</div>
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
