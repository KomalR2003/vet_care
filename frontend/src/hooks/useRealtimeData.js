import { useEffect, useRef } from 'react';

export const useRealtimeData = (
  fetchFunction, 
  dependencies = [], 
  interval = 10000, 
  enabled = true
) => {
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    if (fetchFunction && typeof fetchFunction === 'function') {
      fetchFunction();
    }

    intervalRef.current = setInterval(() => {
      if (isActiveRef.current && fetchFunction) {
        fetchFunction();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [...dependencies, enabled, interval]);

  const pausePolling = () => {
    isActiveRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumePolling = () => {
    isActiveRef.current = true;
    if (fetchFunction) {
      fetchFunction();
    }
  };

  const forceUpdate = () => {
    if (fetchFunction) {
      fetchFunction();
    }
  };

  return { pausePolling, resumePolling, forceUpdate };
};

export const usePageVisibility = (onVisibilityChange) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (onVisibilityChange) {
        onVisibilityChange(!document.hidden);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onVisibilityChange]);
};

export default useRealtimeData;