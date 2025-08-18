import { useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: string;
  userId?: string;
  sessionId?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  context?: Record<string, any>;
}

interface ErrorEvent {
  error: Error;
  context?: Record<string, any>;
  userId?: string;
  timestamp: string;
}

class MonitoringService {
  private sessionId: string;
  private userId?: string;
  private apiEndpoint: string;
  private isProduction: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.apiEndpoint = process.env.VITE_MONITORING_ENDPOINT || '/api/monitoring';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  // Analytics tracking
  trackEvent(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      userId: event.userId || this.userId,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    if (this.isProduction) {
      this.sendToMonitoringService('events', enrichedEvent);
    } else {
      logger.info('Analytics Event:', enrichedEvent);
    }
  }

  // Performance monitoring
  trackPerformance(metric: PerformanceMetric) {
    const enrichedMetric = {
      ...metric,
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href
    };

    if (this.isProduction) {
      this.sendToMonitoringService('performance', enrichedMetric);
    } else {
      logger.info('Performance Metric:', enrichedMetric);
    }
  }

  // Error tracking
  trackError(errorEvent: ErrorEvent) {
    const enrichedError = {
      ...errorEvent,
      sessionId: this.sessionId,
      userId: errorEvent.userId || this.userId,
      stack: errorEvent.error.stack,
      message: errorEvent.error.message,
      name: errorEvent.error.name,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    if (this.isProduction) {
      this.sendToMonitoringService('errors', enrichedError);
    } else {
      logger.error('Error Event:', enrichedError);
    }
  }

  // User interaction tracking
  trackUserInteraction(action: string, component: string, context?: Record<string, any>) {
    this.trackEvent({
      name: 'user_interaction',
      properties: {
        action,
        component,
        ...context
      }
    });
  }

  // Page view tracking
  trackPageView(path: string, title?: string) {
    this.trackEvent({
      name: 'page_view',
      properties: {
        path,
        title: title || document.title,
        referrer: document.referrer
      }
    });
  }

  // Feature usage tracking
  trackFeatureUsage(feature: string, properties?: Record<string, any>) {
    this.trackEvent({
      name: 'feature_usage',
      properties: {
        feature,
        ...properties
      }
    });
  }

  // Clinical workflow tracking
  trackClinicalAction(action: string, context: Record<string, any>) {
    this.trackEvent({
      name: 'clinical_action',
      properties: {
        action,
        ...context
      }
    });
  }

  private async sendToMonitoringService(endpoint: string, data: any) {
    try {
      await fetch(`${this.apiEndpoint}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      logger.error('Failed to send monitoring data:', error);
    }
  }
}

// Singleton instance
const monitoringService = new MonitoringService();

// React hook for monitoring
export const useMonitoring = () => {
  // Track component mount/unmount
  useEffect(() => {
    const componentName = 'unknown'; // This would ideally be passed as parameter
    
    monitoringService.trackEvent({
      name: 'component_mount',
      properties: { component: componentName }
    });

    return () => {
      monitoringService.trackEvent({
        name: 'component_unmount',
        properties: { component: componentName }
      });
    };
  }, []);

  // Performance monitoring utilities
  const measurePerformance = useCallback((name: string, fn: () => void | Promise<void>) => {
    const startTime = performance.now();
    
    const finish = () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      monitoringService.trackPerformance({
        name,
        value: duration,
        timestamp: new Date().toISOString(),
        context: { type: 'execution_time' }
      });
    };

    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.finally(finish);
      } else {
        finish();
        return result;
      }
    } catch (error) {
      finish();
      throw error;
    }
  }, []);

  // Error boundary integration
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    monitoringService.trackError({
      error,
      context,
      timestamp: new Date().toISOString()
    });
  }, []);

  // User interaction tracking
  const trackInteraction = useCallback((action: string, component: string, context?: Record<string, any>) => {
    monitoringService.trackUserInteraction(action, component, context);
  }, []);

  // Clinical workflow tracking
  const trackClinicalAction = useCallback((action: string, context: Record<string, any>) => {
    monitoringService.trackClinicalAction(action, context);
  }, []);

  // Feature usage tracking
  const trackFeatureUsage = useCallback((feature: string, properties?: Record<string, any>) => {
    monitoringService.trackFeatureUsage(feature, properties);
  }, []);

  return {
    measurePerformance,
    trackError,
    trackInteraction,
    trackClinicalAction,
    trackFeatureUsage,
    setUserId: monitoringService.setUserId.bind(monitoringService)
  };
};

// Web Vitals monitoring
export const useWebVitals = () => {
  useEffect(() => {
    // Track basic performance metrics without web-vitals dependency for now
    const trackNavigationTiming = () => {
      if (performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          monitoringService.trackPerformance({
            name: 'DOM_CONTENT_LOADED',
            value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            timestamp: new Date().toISOString(),
            context: { type: 'navigation_timing' }
          });

          monitoringService.trackPerformance({
            name: 'LOAD_COMPLETE',
            value: navigation.loadEventEnd - navigation.loadEventStart,
            timestamp: new Date().toISOString(),
            context: { type: 'navigation_timing' }
          });
        }
      }
    };

    // Track after page load
    if (document.readyState === 'complete') {
      trackNavigationTiming();
    } else {
      window.addEventListener('load', trackNavigationTiming);
      return () => window.removeEventListener('load', trackNavigationTiming);
    }
  }, []);
};

// Usage examples:
/*
// In a component:
const DoseCalculator = () => {
  const { measurePerformance, trackInteraction, trackClinicalAction } = useMonitoring();
  
  const handleDoseCalculation = useCallback(() => {
    measurePerformance('dose_calculation', () => {
      // Perform dose calculation
      const result = calculateDose(params);
      
      trackClinicalAction('dose_calculated', {
        drugName: params.drug.name,
        patientAge: params.age,
        calculatedDose: result.dose
      });
      
      return result;
    });
  }, [measurePerformance, trackClinicalAction]);
  
  const handleButtonClick = () => {
    trackInteraction('click', 'DoseCalculator', { button: 'calculate' });
    handleDoseCalculation();
  };
  
  // ... rest of component
};
*/

export default monitoringService;