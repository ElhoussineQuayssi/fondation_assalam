/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals and other performance metrics
 */
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const trackPerformance = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  if ('web-vitals' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => sendMetric('CLS', metric));
      getFID((metric) => sendMetric('FID', metric));
      getFCP((metric) => sendMetric('FCP', metric));
      getLCP((metric) => sendMetric('LCP', metric));
      getTTFB((metric) => sendMetric('TTFB', metric));
    });
  }

  // Track Navigation Timing
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const nav = navigationEntries[0];
      const timings = {};

      // Only calculate if timestamps are available (not 0 or undefined)
      if (nav.domContentLoadedEventEnd && nav.domContentLoadedEventStart) {
        timings.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
      } else {
        timings.domContentLoaded = 0;
      }

      if (nav.loadEventEnd && nav.loadEventStart) {
        timings.loadComplete = nav.loadEventEnd - nav.loadEventStart;
      } else {
        timings.loadComplete = 0;
      }

      if (nav.domInteractive && nav.navigationStart) {
        timings.domInteractive = nav.domInteractive - nav.navigationStart;
      } else {
        timings.domInteractive = 0;
      }

      if (nav.responseStart && nav.navigationStart) {
        timings.responseStart = nav.responseStart - nav.navigationStart;
      } else {
        timings.responseStart = 0;
      }

      sendMetric('Navigation Timing', timings);
    }
  }

  // Track Resource Timing
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resourceEntries = performance.getEntriesByType('resource');
    const slowResources = resourceEntries.filter(entry => entry.duration > 1000);

    if (slowResources.length > 0) {
      sendMetric('Slow Resources', slowResources.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
      })));
    }
  }
};

const sendMetric = (name, metric) => {
  // In a real application, you would send this to your analytics service
  console.log(`[Performance] ${name}:`, metric);

  // Example: Send to Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'web_vitals', {
      event_category: 'Performance',
      event_label: name,
      value: Math.round(metric.value || metric),
      non_interaction: true,
    });
  }

  // Example: Send to custom analytics endpoint
  // fetch('/api/analytics/performance', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, metric, timestamp: Date.now() }),
  // });
};

// Track performance on page load and after load event
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPerformance);
    // Also track after load event to ensure all timing data is available
    window.addEventListener('load', () => {
      setTimeout(trackPerformance, 0); // Small delay to ensure all events are processed
    });
  } else {
    trackPerformance();
  }
}

export default trackPerformance;
