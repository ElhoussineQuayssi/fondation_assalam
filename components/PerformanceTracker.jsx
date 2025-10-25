"use client";

import { useEffect } from 'react';
import { trackPerformance } from '@/lib/performance';

export default function PerformanceTracker() {
  useEffect(() => {
    // Track performance metrics
    trackPerformance();

    // Track additional metrics
    if (typeof window !== 'undefined') {
      // Track memory usage if available
      if (performance.memory) {
        const memoryInfo = performance.memory;
        console.log('[Performance] Memory Usage:', {
          used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024),
        });
      }

      // Track connection information
      if ('connection' in navigator) {
        const connection = navigator.connection;
        console.log('[Performance] Connection:', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
