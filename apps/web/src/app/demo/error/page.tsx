"use client";

import React, { useEffect } from 'react';

// This component will trigger the app-level error boundary
export default function ErrorDemo() {
  useEffect(() => {
    // Throw an error to trigger the error boundary
    throw new Error("This is a demonstration of the global error page");
  }, []);
  
  // This will never be rendered because the error is thrown in useEffect
  return (
    <div>Loading error demonstration...</div>
  );
}