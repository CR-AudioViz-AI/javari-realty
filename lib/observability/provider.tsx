// =============================================================================
// OBSERVABILITY PROVIDER
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:58 PM EST
// Phase 4: Unified Analytics + Error Tracking Provider
// =============================================================================

'use client';

import { useEffect, createContext, useContext, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, identifyUser } from './analytics';
import { errorTracking, setErrorUser } from './error-tracking';
import { UserProperties } from './config';

interface ObservabilityContextType {
  trackEvent: typeof analytics.track;
  trackPageView: typeof analytics.pageView;
  setUser: (user: UserProperties) => void;
  clearUser: () => void;
  captureError: typeof errorTracking.captureException;
  isFeatureEnabled: typeof analytics.isFeatureEnabled;
}

const ObservabilityContext = createContext<ObservabilityContextType | null>(null);

interface ObservabilityProviderProps {
  children: ReactNode;
}

export function ObservabilityProvider({ children }: ObservabilityProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize on mount
  useEffect(() => {
    analytics.init();
    errorTracking.init();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      analytics.pageView(pathname, {
        url: typeof window !== 'undefined' ? window.location.href : pathname,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      });
    }
  }, [pathname, searchParams]);

  const setUser = (user: UserProperties) => {
    identifyUser(user);
    setErrorUser({ id: user.id, email: user.email, name: user.name });
  };

  const clearUser = () => {
    analytics.reset();
    errorTracking.clearUser();
  };

  const value: ObservabilityContextType = {
    trackEvent: analytics.track.bind(analytics),
    trackPageView: analytics.pageView.bind(analytics),
    setUser,
    clearUser,
    captureError: errorTracking.captureException.bind(errorTracking),
    isFeatureEnabled: analytics.isFeatureEnabled.bind(analytics),
  };

  return (
    <ObservabilityContext.Provider value={value}>
      {children}
    </ObservabilityContext.Provider>
  );
}

// Hook for using observability
export function useObservability() {
  const context = useContext(ObservabilityContext);
  
  if (!context) {
    // Return no-op functions if outside provider
    return {
      trackEvent: () => {},
      trackPageView: () => {},
      setUser: () => {},
      clearUser: () => {},
      captureError: () => {},
      isFeatureEnabled: () => false,
    } as ObservabilityContextType;
  }
  
  return context;
}

// HOC for adding observability to components
export function withObservability<P extends object>(
  Component: React.ComponentType<P & { observability: ObservabilityContextType }>
) {
  return function WrappedComponent(props: P) {
    const observability = useObservability();
    return <Component {...props} observability={observability} />;
  };
}

export default ObservabilityProvider;
