import { useCallback, useMemo, useRef, useEffect } from 'react';
import { debounce } from 'lodash-es';

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  slowRenders: number;
}

// Custom hook for debounced calculations
export const useDebouncedCalculation = <T extends any[], R>(
  calculation: (...args: T) => R,
  delay: number = 300,
  dependencies: any[] = []
) => {
  const debouncedCalc = useMemo(
    () => debounce(calculation, delay),
    [delay, ...dependencies]
  );

  useEffect(() => {
    return () => {
      debouncedCalc.cancel();
    };
  }, [debouncedCalc]);

  return debouncedCalc;
};

// Hook for memoizing expensive calculations
export const useMemoizedCalculation = <T>(
  calculation: () => T,
  dependencies: any[]
) => {
  return useMemo(calculation, dependencies);
};

// Hook for performance monitoring
export const usePerformanceMonitoring = (componentName: string) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    slowRenders: 0
  });

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    
    const metrics = metricsRef.current;
    metrics.renderCount++;
    metrics.lastRenderTime = renderTime;
    metrics.averageRenderTime = (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;
    
    if (renderTime > 100) { // Consider >100ms as slow
      metrics.slowRenders++;
      console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    if (process.env.NODE_ENV === 'development' && metrics.renderCount % 10 === 0) {
      console.log(`📊 Performance metrics for ${componentName}:`, {
        renders: metrics.renderCount,
        avgTime: metrics.averageRenderTime.toFixed(2) + 'ms',
        slowRenders: metrics.slowRenders,
        lastRender: metrics.lastRenderTime.toFixed(2) + 'ms'
      });
    }
  });

  return metricsRef.current;
};

// Hook for optimized event handlers
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T => {
  return useCallback(callback, dependencies);
};

// Hook for managing heavy computations
export const useHeavyComputation = <T>(
  computation: () => T,
  dependencies: any[],
  options: {
    enableProfiling?: boolean;
    warningThreshold?: number;
  } = {}
) => {
  const { enableProfiling = true, warningThreshold = 50 } = options;

  return useMemo(() => {
    const startTime = enableProfiling ? performance.now() : 0;
    
    const result = computation();
    
    if (enableProfiling) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > warningThreshold) {
        console.warn(`⚠️ Heavy computation detected: ${duration.toFixed(2)}ms`, {
          computation: computation.name || 'anonymous',
          duration: duration.toFixed(2) + 'ms',
          dependencies
        });
      }
    }
    
    return result;
  }, dependencies);
};

// Hook for cleanup management
export const useCleanup = (cleanupFn: () => void, dependencies: any[] = []) => {
  useEffect(() => {
    return cleanupFn;
  }, dependencies);
};

// Hook for memory leak detection
export const useMemoryLeakDetection = (componentName: string) => {
  const mountTimeRef = useRef<number>(Date.now());
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const listenersRef = useRef<Set<() => void>>(new Set());

  const addTimer = useCallback((timer: NodeJS.Timeout) => {
    timersRef.current.add(timer);
    return timer;
  }, []);

  const removeTimer = useCallback((timer: NodeJS.Timeout) => {
    clearTimeout(timer);
    timersRef.current.delete(timer);
  }, []);

  const addListener = useCallback((cleanup: () => void) => {
    listenersRef.current.add(cleanup);
    return cleanup;
  }, []);

  const removeListener = useCallback((cleanup: () => void) => {
    cleanup();
    listenersRef.current.delete(cleanup);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup all timers
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();

      // Cleanup all listeners
      listenersRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn(`Failed to cleanup listener in ${componentName}:`, error);
        }
      });
      listenersRef.current.clear();

      const lifespan = Date.now() - mountTimeRef.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`🧹 Cleaned up ${componentName} after ${lifespan}ms`);
      }
    };
  }, [componentName]);

  return {
    addTimer,
    removeTimer,
    addListener,
    removeListener
  };
};