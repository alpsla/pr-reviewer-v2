'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/context/auth-context';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '9999px', borderTop: '2px solid #3b82f6', borderBottom: '2px solid #3b82f6', animation: 'spin 1s linear infinite' }}></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
      <Header userType="free" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', width: '100%' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1e293b' }}>Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }}>
          {/* User info card */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>User Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ color: '#334155' }}>
                <span style={{ fontWeight: 500 }}>Email:</span> {user?.email}
              </p>
              <p style={{ color: '#334155' }}>
                <span style={{ fontWeight: 500 }}>ID:</span> {user?.id?.substring(0, 8)}...
              </p>
              <p style={{ color: '#334155' }}>
                <span style={{ fontWeight: 500 }}>Provider:</span> {user?.app_metadata?.provider || 'Email'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}