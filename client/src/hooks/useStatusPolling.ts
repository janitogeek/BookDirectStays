import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface StatusMonitorResponse {
  success: boolean;
  statusChanges: number;
  newlyApproved: number;
  message: string;
  timestamp: string;
  totalSubmissions: number;
}

export const useStatusPolling = (pollingInterval: number = 2 * 60 * 1000) => { // Changed from 5 to 2 minutes
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  const checkStatus = useCallback(async () => {
    if (isPollingRef.current) {
      console.log('⏳ Status check already in progress, skipping...');
      return;
    }

    try {
      isPollingRef.current = true;
      console.log('🔍 Checking for status changes...');

      const response = await fetch('/api/status-monitor', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_STATUS_MONITOR_SECRET}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Status monitor failed: ${response.statusText}`);
      }

      const data: StatusMonitorResponse = await response.json();
      
      if (data.success && data.statusChanges > 0) {
        console.log(`🔄 Status changes detected: ${data.message}`);
        
        if (data.newlyApproved > 0) {
          console.log(`✅ ${data.newlyApproved} newly approved submissions - refreshing data...`);
          
          // Invalidate and refetch all relevant queries
          await queryClient.invalidateQueries({ queryKey: ['/api/preloaded-submissions'] });
          await queryClient.invalidateQueries({ queryKey: ['/api/preloaded-countries'] });
          await queryClient.invalidateQueries({ queryKey: ['/api/preloaded-cities'] });
          
          // Force a background refresh
          queryClient.refetchQueries({ 
            queryKey: ['/api/preloaded-submissions'],
            type: 'active'
          });
          
          console.log('✅ Data refreshed successfully');
        }
      } else {
        console.log('✅ No status changes detected');
      }
      
    } catch (error) {
      console.error('❌ Status check failed:', error);
    } finally {
      isPollingRef.current = false;
    }
  }, [queryClient]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      console.log('🔄 Polling already active');
      return;
    }

    console.log(`🚀 Starting status polling every ${pollingInterval / 1000 / 60} minutes`);
    
    // Initial check
    checkStatus();
    
    // Set up interval
    intervalRef.current = setInterval(checkStatus, pollingInterval);
  }, [checkStatus, pollingInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      console.log('⏹️ Stopping status polling');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const forceCheck = useCallback(() => {
    console.log('🔍 Force checking status...');
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    // Start polling when component mounts
    startPolling();

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return {
    startPolling,
    stopPolling,
    forceCheck,
    isPolling: !!intervalRef.current
  };
};
