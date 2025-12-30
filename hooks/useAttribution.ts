// =============================================================================
// USE ATTRIBUTION HOOK
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 1:03 PM EST
// React hook for tracking attribution events (only with consent)
// =============================================================================

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useConsent } from './useConsent';
import { AttributionSource } from '@/types/attribution';

interface TrackOptions {
  source?: AttributionSource;
  campaignId?: string;
}

interface UseAttributionReturn {
  trackPageView: (options?: TrackOptions) => Promise<void>;
  trackEvent: (eventType: string, metadata?: Record<string, unknown>) => Promise<void>;
  canTrack: boolean;
}

export function useAttribution(userId: string | null, agentId: string): UseAttributionReturn {
  const { hasConsent, hasScope } = useConsent(userId, agentId);
  const lastTrackedUrl = useRef<string>('');

  // Check if we can track (has attribution consent)
  const canTrack = hasConsent && hasScope('attribution');

  // Parse UTM parameters from URL
  const getUtmParams = useCallback(() => {
    if (typeof window === 'undefined') return {};
    
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined,
    };
  }, []);

  // Detect attribution source from referrer and UTM
  const detectSource = useCallback((): AttributionSource => {
    if (typeof window === 'undefined') return 'direct';

    const utmSource = new URLSearchParams(window.location.search).get('utm_source');
    const referrer = document.referrer;

    // Check UTM source first
    if (utmSource) {
      if (['google', 'bing', 'yahoo', 'duckduckgo'].some(s => utmSource.includes(s))) {
        return 'organic';
      }
      if (['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'].some(s => utmSource.includes(s))) {
        return 'social';
      }
      if (utmSource.includes('email') || utmSource.includes('newsletter')) {
        return 'email';
      }
      if (utmSource.includes('ad') || utmSource.includes('cpc') || utmSource.includes('ppc')) {
        return 'advertising';
      }
      return 'partner';
    }

    // Check referrer
    if (!referrer) return 'direct';
    
    const referrerUrl = new URL(referrer);
    const referrerHost = referrerUrl.hostname;

    // Social platforms
    if (['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'tiktok.com'].some(h => referrerHost.includes(h))) {
      return 'social';
    }

    // Search engines
    if (['google.', 'bing.', 'yahoo.', 'duckduckgo.'].some(h => referrerHost.includes(h))) {
      return 'organic';
    }

    // Email platforms
    if (['mail.google.', 'outlook.', 'mail.yahoo.'].some(h => referrerHost.includes(h))) {
      return 'email';
    }

    return 'referral';
  }, []);

  // Track page view
  const trackPageView = useCallback(
    async (options: TrackOptions = {}) => {
      if (!canTrack || !userId) return;

      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      
      // Prevent duplicate tracking of same URL
      if (currentUrl === lastTrackedUrl.current) return;
      lastTrackedUrl.current = currentUrl;

      const source = options.source || detectSource();
      const utmParams = getUtmParams();

      try {
        await fetch('/api/attribution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            agent_id: agentId,
            source,
            landing_page: currentUrl,
            referrer_url: typeof document !== 'undefined' ? document.referrer : null,
            utm_params: utmParams,
          }),
        });
      } catch (error) {
        console.error('Attribution tracking error:', error);
        // Silent fail - don't break user experience
      }
    },
    [canTrack, userId, agentId, detectSource, getUtmParams]
  );

  // Track custom event
  const trackEvent = useCallback(
    async (eventType: string, metadata: Record<string, unknown> = {}) => {
      if (!canTrack || !userId) return;

      try {
        await fetch('/api/attribution/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            agent_id: agentId,
            event_type: eventType,
            metadata,
            page_url: typeof window !== 'undefined' ? window.location.href : null,
          }),
        });
      } catch (error) {
        console.error('Event tracking error:', error);
        // Silent fail
      }
    },
    [canTrack, userId, agentId]
  );

  // Auto-track page views on route changes
  useEffect(() => {
    if (!canTrack) return;

    // Track initial page view
    trackPageView();

    // Listen for route changes (for Next.js)
    const handleRouteChange = () => {
      trackPageView();
    };

    // Use popstate for browser navigation
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [canTrack, trackPageView]);

  return {
    trackPageView,
    trackEvent,
    canTrack,
  };
}

export default useAttribution;
