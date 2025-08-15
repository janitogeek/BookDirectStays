import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV === 'development') return;

    const measurePerformance = () => {
      const newMetrics: Partial<PerformanceMetrics> = {};

      // Time to First Byte
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          newMetrics.ttfb = navigation.responseStart - navigation.requestStart;
        }
      }

      // First Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries[entries.length - 1];
            if (fcpEntry) {
              newMetrics.fcp = fcpEntry.startTime;
              setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime } as PerformanceMetrics));
            }
          });
          fcpObserver.observe({ entryTypes: ['paint'] });
        } catch (e) {
          console.warn('FCP measurement failed:', e);
        }
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcpEntry = entries[entries.length - 1];
            if (lcpEntry) {
              newMetrics.lcp = lcpEntry.startTime;
              setMetrics(prev => ({ ...prev, lcp: lcpEntry.startTime } as PerformanceMetrics));
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP measurement failed:', e);
        }
      }

      // First Input Delay
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fidEntry = entries[entries.length - 1];
            if (fidEntry) {
              newMetrics.fid = fidEntry.processingStart - fidEntry.startTime;
              setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime } as PerformanceMetrics));
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID measurement failed:', e);
        }
      }

      // Cumulative Layout Shift
      if ('PerformanceObserver' in window) {
        try {
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0;
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            newMetrics.cls = clsValue;
            setMetrics(prev => ({ ...prev, cls: clsValue } as PerformanceMetrics));
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS measurement failed:', e);
        }
      }

      // Set initial metrics
      if (Object.keys(newMetrics).length > 0) {
        setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // Send metrics to analytics (example)
  useEffect(() => {
    if (metrics && process.env.NODE_ENV === 'production') {
      // Send to Google Analytics, custom analytics, etc.
      console.log('Performance Metrics:', metrics);
      
      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'performance_metrics', {
          event_category: 'performance',
          event_label: 'core_web_vitals',
          value: Math.round(metrics.lcp || 0),
          custom_map: {
            ttfb: metrics.ttfb,
            fcp: metrics.fcp,
            lcp: metrics.lcp,
            fid: metrics.fid,
            cls: metrics.cls,
          }
        });
      }
    }
  }, [metrics]);

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Development mode - show metrics
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">Performance Metrics</div>
      {metrics ? (
        <div className="space-y-1">
          <div>TTFB: {metrics.ttfb?.toFixed(0)}ms</div>
          <div>FCP: {metrics.fcp?.toFixed(0)}ms</div>
          <div>LCP: {metrics.lcp?.toFixed(0)}ms</div>
          <div>FID: {metrics.fid?.toFixed(0)}ms</div>
          <div>CLS: {metrics.cls?.toFixed(3)}</div>
        </div>
      ) : (
        <div>Measuring...</div>
      )}
    </div>
  );
}



