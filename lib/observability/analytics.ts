// =============================================================================
// POSTHOG ANALYTICS SERVICE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:54 PM EST
// Phase 4: PostHog Analytics Integration
// Free tier: 1M events/month
// =============================================================================

'use client';

import posthog from 'posthog-js';
import {
  AnalyticsEvent,
  AnalyticsProperties,
  UserProperties,
  FeatureFlags,
  OBSERVABILITY_CONFIG,
} from './config';

class AnalyticsService {
  private initialized = false;

  /**
   * Initialize PostHog
   * Call this once in your app's root layout
   */
  init() {
    if (this.initialized || typeof window === 'undefined') return;
    
    const { posthog: config } = OBSERVABILITY_CONFIG;
    
    if (!config.enabled || !config.apiKey) {
      console.log('[Analytics] PostHog disabled or missing API key');
      return;
    }

    posthog.init(config.apiKey, {
      api_host: config.apiHost,
      autocapture: config.autocapture,
      capture_pageview: config.capturePageview,
      capture_pageleave: config.capturePageleave,
      loaded: (ph) => {
        if (config.debug) {
          console.log('[Analytics] PostHog loaded');
        }
      },
    });

    this.initialized = true;
  }

  /**
   * Identify a user
   * Call after login/signup
   */
  identify(user: UserProperties) {
    if (!this.isEnabled()) return;

    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      company: user.company,
      created_at: user.created_at,
      total_listings: user.total_listings,
      total_leads: user.total_leads,
      ai_credits_remaining: user.ai_credits_remaining,
    });
  }

  /**
   * Reset user identity (call on logout)
   */
  reset() {
    if (!this.isEnabled()) return;
    posthog.reset();
  }

  /**
   * Track a custom event
   */
  track(event: AnalyticsEvent, properties?: AnalyticsProperties) {
    if (!this.isEnabled()) {
      if (OBSERVABILITY_CONFIG.posthog.debug) {
        console.log('[Analytics] Track:', event, properties);
      }
      return;
    }

    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track page view (if not using autocapture)
   */
  pageView(pageName: string, properties?: AnalyticsProperties) {
    this.track('page_viewed', {
      ...properties,
      page_name: pageName,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }

  /**
   * Get feature flags
   */
  getFeatureFlags(): Partial<FeatureFlags> {
    if (!this.isEnabled()) return {};
    
    return {
      new_search_ui: posthog.isFeatureEnabled('new_search_ui'),
      ai_chat_enabled: posthog.isFeatureEnabled('ai_chat_enabled'),
      dark_mode: posthog.isFeatureEnabled('dark_mode'),
      beta_features: posthog.isFeatureEnabled('beta_features'),
      new_pricing: posthog.isFeatureEnabled('new_pricing'),
      referral_program: posthog.isFeatureEnabled('referral_program'),
    };
  }

  /**
   * Check if a specific feature is enabled
   */
  isFeatureEnabled(flag: keyof FeatureFlags): boolean {
    if (!this.isEnabled()) return false;
    return posthog.isFeatureEnabled(flag) || false;
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Partial<UserProperties>) {
    if (!this.isEnabled()) return;
    posthog.people.set(properties);
  }

  /**
   * Increment a user property
   */
  incrementUserProperty(property: string, value: number = 1) {
    if (!this.isEnabled()) return;
    posthog.people.set_once({ [property]: 0 });
    // PostHog doesn't have native increment, use set with computed value
    // This would need backend support for true increments
  }

  /**
   * Start a session recording
   */
  startSessionRecording() {
    if (!this.isEnabled()) return;
    posthog.startSessionRecording();
  }

  /**
   * Stop session recording
   */
  stopSessionRecording() {
    if (!this.isEnabled()) return;
    posthog.stopSessionRecording();
  }

  /**
   * Check if PostHog is enabled and initialized
   */
  private isEnabled(): boolean {
    return this.initialized && OBSERVABILITY_CONFIG.posthog.enabled;
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export convenience functions
export const trackEvent = (event: AnalyticsEvent, properties?: AnalyticsProperties) => 
  analytics.track(event, properties);

export const identifyUser = (user: UserProperties) => 
  analytics.identify(user);

export const trackPageView = (pageName: string, properties?: AnalyticsProperties) => 
  analytics.pageView(pageName, properties);

// Pre-built tracking helpers
export const trackSearchPerformed = (query: string, persona?: string, resultsCount?: number) =>
  analytics.track('search_performed', { search_query: query, search_persona: persona, results_count: resultsCount });

export const trackPropertyViewed = (propertyId: string, price?: number, type?: string) =>
  analytics.track('property_viewed', { property_id: propertyId, property_price: price, property_type: type });

export const trackLeadCreated = (leadId: string, source: string, score?: number) =>
  analytics.track('lead_created', { lead_id: leadId, lead_source: source, lead_score: score });

export const trackAIGeneration = (model: string, tokensUsed: number, timeMs: number, success: boolean) =>
  analytics.track(success ? 'ai_generation_completed' : 'ai_generation_failed', {
    ai_model: model,
    ai_tokens_used: tokensUsed,
    ai_generation_time_ms: timeMs,
  });

export const trackToolUsed = (toolName: string, action: string, result?: string) =>
  analytics.track('feature_used', { tool_name: toolName, tool_action: action, tool_result: result });

export default analytics;
