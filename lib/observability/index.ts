// =============================================================================
// OBSERVABILITY MODULE EXPORTS
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:00 PM EST
// Phase 4: PostHog + Sentry Integration
// =============================================================================

// Configuration
export * from './config';

// Analytics (PostHog)
export {
  analytics,
  trackEvent,
  identifyUser,
  trackPageView,
  trackSearchPerformed,
  trackPropertyViewed,
  trackLeadCreated,
  trackAIGeneration,
  trackToolUsed,
} from './analytics';

// Error Tracking (Sentry)
export {
  errorTracking,
  captureException,
  captureMessage,
  setErrorUser,
  withErrorBoundary,
} from './error-tracking';

// Provider
export {
  ObservabilityProvider,
  useObservability,
  withObservability,
} from './provider';
