// =============================================================================
// OBSERVABILITY CONFIGURATION
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:52 PM EST
// Phase 4: PostHog Analytics + Sentry Error Tracking
// =============================================================================

// PostHog event types for analytics
export type AnalyticsEvent =
  // User Events
  | 'user_signed_up'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'user_profile_updated'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'subscription_upgraded'
  
  // Search Events
  | 'search_performed'
  | 'search_results_viewed'
  | 'property_viewed'
  | 'property_saved'
  | 'property_shared'
  | 'property_compared'
  
  // Lead Events
  | 'lead_created'
  | 'lead_contacted'
  | 'lead_qualified'
  | 'lead_converted'
  | 'lead_lost'
  
  // Tool Events
  | 'listing_launch_started'
  | 'listing_launch_completed'
  | 'nurture_sequence_created'
  | 'nurture_sequence_activated'
  | 'lead_triage_action'
  | 'mortgage_calculated'
  
  // AI Events
  | 'ai_generation_started'
  | 'ai_generation_completed'
  | 'ai_generation_failed'
  | 'ai_credits_used'
  
  // Engagement Events
  | 'page_viewed'
  | 'feature_used'
  | 'cta_clicked'
  | 'form_submitted'
  | 'error_encountered';

export interface AnalyticsProperties {
  // Common
  user_id?: string;
  agent_id?: string;
  session_id?: string;
  
  // Search
  search_query?: string;
  search_persona?: string;
  results_count?: number;
  
  // Property
  property_id?: string;
  property_type?: string;
  property_price?: number;
  property_location?: string;
  
  // Lead
  lead_id?: string;
  lead_source?: string;
  lead_priority?: string;
  lead_score?: number;
  
  // AI
  ai_model?: string;
  ai_tokens_used?: number;
  ai_generation_time_ms?: number;
  ai_credits_used?: number;
  
  // Tool
  tool_name?: string;
  tool_action?: string;
  tool_result?: string;
  
  // Error
  error_type?: string;
  error_message?: string;
  error_stack?: string;
  
  // Custom
  [key: string]: unknown;
}

export interface UserProperties {
  id: string;
  email: string;
  name?: string;
  role?: 'agent' | 'broker' | 'admin' | 'user';
  plan?: 'free' | 'starter' | 'pro' | 'enterprise';
  company?: string;
  created_at?: string;
  total_listings?: number;
  total_leads?: number;
  ai_credits_remaining?: number;
}

// Sentry error levels
export type ErrorLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

export interface ErrorContext {
  user_id?: string;
  agent_id?: string;
  page?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

// Feature flags for A/B testing
export interface FeatureFlags {
  new_search_ui: boolean;
  ai_chat_enabled: boolean;
  dark_mode: boolean;
  beta_features: boolean;
  new_pricing: boolean;
  referral_program: boolean;
}

// Default configuration
export const OBSERVABILITY_CONFIG = {
  posthog: {
    enabled: process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true',
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    autocapture: true,
    capturePageview: true,
    capturePageleave: true,
    debug: process.env.NODE_ENV === 'development',
  },
  sentry: {
    enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    sampleRate: 1.0,
    tracesSampleRate: 0.1,
  },
};
