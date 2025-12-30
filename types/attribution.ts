// =============================================================================
// CONSENT-BASED ATTRIBUTION SYSTEM - Type Definitions
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 12:56 PM EST
// =============================================================================

export type ConsentStatus = 'pending' | 'granted' | 'denied' | 'withdrawn';
export type ConsentScope = 'attribution' | 'marketing' | 'analytics' | 'all';
export type AttributionSource = 'direct' | 'referral' | 'advertising' | 'organic' | 'social' | 'email' | 'partner';

export interface ConsentRecord {
  id: string;
  user_id: string;
  agent_id: string;
  scope: ConsentScope[];
  status: ConsentStatus;
  ip_address: string;
  user_agent: string;
  consent_text: string;
  consent_version: string;
  granted_at: string | null;
  withdrawn_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttributionEvent {
  id: string;
  user_id: string;
  agent_id: string;
  source: AttributionSource;
  campaign_id: string | null;
  referrer_url: string | null;
  landing_page: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  consent_id: string;
  trust_score: number; // 0-100
  created_at: string;
}

export interface AttributionChain {
  id: string;
  lead_id: string;
  touchpoints: AttributionTouchpoint[];
  first_touch_agent_id: string;
  last_touch_agent_id: string;
  converting_agent_id: string | null;
  total_touchpoints: number;
  attribution_model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  created_at: string;
  updated_at: string;
}

export interface AttributionTouchpoint {
  id: string;
  chain_id: string;
  agent_id: string;
  source: AttributionSource;
  channel: string;
  interaction_type: 'view' | 'click' | 'inquiry' | 'showing' | 'offer' | 'close';
  weight: number; // 0-1 based on attribution model
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface ConsentBannerConfig {
  title: string;
  description: string;
  privacy_policy_url: string;
  terms_url: string;
  scopes: {
    scope: ConsentScope;
    label: string;
    description: string;
    required: boolean;
    default_checked: boolean;
  }[];
  buttons: {
    accept_all: string;
    accept_selected: string;
    decline_all: string;
    manage_preferences: string;
  };
}

export interface AgentAttributionStats {
  agent_id: string;
  total_attributions: number;
  consented_attributions: number;
  conversion_rate: number;
  average_trust_score: number;
  sources: {
    source: AttributionSource;
    count: number;
    percentage: number;
  }[];
  monthly_trend: {
    month: string;
    attributions: number;
    conversions: number;
  }[];
}

export interface PrivacyDisclosure {
  version: string;
  effective_date: string;
  content: {
    what_we_collect: string[];
    how_we_use: string[];
    who_we_share_with: string[];
    your_rights: string[];
    how_to_opt_out: string;
    contact_info: string;
  };
}

// API Request/Response Types
export interface ConsentRequest {
  user_id: string;
  agent_id: string;
  scopes: ConsentScope[];
  ip_address: string;
  user_agent: string;
}

export interface ConsentResponse {
  success: boolean;
  consent_id: string;
  status: ConsentStatus;
  expires_at: string | null;
  message: string;
}

export interface AttributionRequest {
  user_id: string;
  agent_id: string;
  source: AttributionSource;
  landing_page: string;
  referrer_url?: string;
  utm_params?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export interface WithdrawConsentRequest {
  consent_id: string;
  user_id: string;
  reason?: string;
}
