'use client';

import { Header, Footer } from '@/components/layout';

export default function TestLayoutPage() {
  return (
    <div 
      style={{
        margin: 0,
        padding: 0,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'white',
      }}
    >
      <Header />
      
      <div
        style={{
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          flex: 1,
        }}
      >
        <h1 style={{ marginBottom: '2rem', fontSize: '1.875rem', fontWeight: 'bold' }}>
          Test Layout Page
        </h1>
        
        <p>
          This is a minimal test page to identify layout issues.
          If you still see empty containers on this page, the issue is coming from a higher level.
        </p>
      </div>
      
      <Footer />
    </div>
  );
}