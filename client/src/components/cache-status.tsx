/**
 * Cache Status Component
 * 
 * Shows the current cache status for debugging performance
 * Only visible in development or when debugging is enabled
 */

import { useState, useEffect } from 'react';
import { dataPreloader } from '@/lib/data-preloader';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface CacheStatusProps {
  showInProduction?: boolean;
}

export default function CacheStatus({ showInProduction = false }: CacheStatusProps) {
  const [cacheStatus, setCacheStatus] = useState({ cached: false, loading: false, age: undefined });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const isDev = import.meta.env.DEV;
    const showDebug = localStorage.getItem('bds_show_cache_debug') === 'true';
    
    if (isDev || showInProduction || showDebug) {
      setIsVisible(true);
    }

    // Update cache status
    const updateStatus = () => {
      setCacheStatus(dataPreloader.getCacheStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000); // Update every second

    return () => clearInterval(interval);
  }, [showInProduction]);

  if (!isVisible) return null;

  const getStatusColor = () => {
    if (cacheStatus.loading) return 'bg-yellow-500';
    if (cacheStatus.cached) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (cacheStatus.loading) return 'Loading...';
    if (cacheStatus.cached) {
      const ageMinutes = cacheStatus.age ? Math.round(cacheStatus.age / 1000 / 60) : 0;
      return `Cached (${ageMinutes}m old)`;
    }
    return 'No Cache';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="font-medium">Data Cache:</span>
            <Badge variant="outline" className="text-xs">
              {getStatusText()}
            </Badge>
          </div>
          {cacheStatus.cached && (
            <div className="text-xs text-gray-500 mt-1">
              ⚡ Instant page loads enabled
            </div>
          )}
          {cacheStatus.loading && (
            <div className="text-xs text-gray-500 mt-1">
              🔄 Background processing...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Debug helper - users can enable cache status display
// Run in console: localStorage.setItem('bds_show_cache_debug', 'true')
// To disable: localStorage.removeItem('bds_show_cache_debug')




