// =============================================================================
// NURTURE SEQUENCE GENERATOR - Type Definitions
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:40 PM EST
// Hero Workflow #3: AI-powered email nurture campaigns
// =============================================================================

export type SequenceType = 'buyer' | 'seller' | 'investor' | 'past_client' | 'sphere' | 'expired' | 'fsbo' | 'custom';
export type EmailTone = 'professional' | 'friendly' | 'casual' | 'luxury' | 'educational';
export type SequenceStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type EmailStatus = 'scheduled' | 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'unsubscribed';

export interface NurtureSequence {
  id: string;
  agent_id: string;
  name: string;
  description: string;
  type: SequenceType;
  status: SequenceStatus;
  
  // Configuration
  tone: EmailTone;
  personalization_level: 'high' | 'medium' | 'low';
  include_market_updates: boolean;
  include_listings: boolean;
  include_educational_content: boolean;
  
  // Emails in sequence
  emails: SequenceEmail[];
  
  // Timing
  start_delay_days: number;
  total_duration_days: number;
  
  // Audience
  enrolled_leads: string[];
  completed_leads: string[];
  
  // Performance
  stats: SequenceStats;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface SequenceEmail {
  id: string;
  sequence_id: string;
  position: number; // Order in sequence (1, 2, 3...)
  
  // Content
  subject: string;
  preview_text: string;
  body_html: string;
  body_text: string;
  
  // Timing
  delay_days: number; // Days after previous email
  send_time: string; // Preferred time "09:00"
  send_days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  
  // Personalization
  merge_fields: MergeField[];
  conditional_blocks: ConditionalBlock[];
  
  // Status
  status: 'draft' | 'approved' | 'active';
  
  // A/B Testing
  variants?: EmailVariant[];
  winning_variant?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface MergeField {
  tag: string; // {{first_name}}
  field: string; // lead.first_name
  fallback: string; // "there"
}

export interface ConditionalBlock {
  id: string;
  condition: string; // "lead.intent === 'buying'"
  content_if_true: string;
  content_if_false: string;
}

export interface EmailVariant {
  id: string;
  name: string; // "Variant A", "Variant B"
  subject: string;
  body_html: string;
  percentage: number; // Traffic split
  stats: {
    sent: number;
    opens: number;
    clicks: number;
    replies: number;
  };
}

export interface SequenceStats {
  total_enrolled: number;
  currently_active: number;
  completed: number;
  unsubscribed: number;
  
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  emails_replied: number;
  
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  unsubscribe_rate: number;
  
  conversions: number;
  conversion_rate: number;
  
  best_performing_email: string;
  worst_performing_email: string;
}

export interface SequenceTemplate {
  id: string;
  name: string;
  description: string;
  type: SequenceType;
  tone: EmailTone;
  email_count: number;
  duration_days: number;
  preview_image?: string;
  popularity: number;
  success_rate: number;
}

// Pre-built templates
export const SEQUENCE_TEMPLATES: SequenceTemplate[] = [
  {
    id: 'buyer_nurture_7',
    name: 'Buyer Nurture - 7 Touch',
    description: 'Perfect for new buyer leads. Educates and builds trust over 30 days.',
    type: 'buyer',
    tone: 'friendly',
    email_count: 7,
    duration_days: 30,
    popularity: 95,
    success_rate: 24,
  },
  {
    id: 'seller_cma_follow',
    name: 'Post-CMA Seller Follow-up',
    description: 'Follow up after a CMA presentation to stay top of mind.',
    type: 'seller',
    tone: 'professional',
    email_count: 5,
    duration_days: 21,
    popularity: 88,
    success_rate: 31,
  },
  {
    id: 'sphere_quarterly',
    name: 'Sphere of Influence - Quarterly',
    description: 'Stay connected with past clients and contacts.',
    type: 'sphere',
    tone: 'friendly',
    email_count: 4,
    duration_days: 90,
    popularity: 72,
    success_rate: 12,
  },
  {
    id: 'expired_reactivation',
    name: 'Expired Listing Reactivation',
    description: 'Re-engage homeowners with expired listings.',
    type: 'expired',
    tone: 'professional',
    email_count: 6,
    duration_days: 14,
    popularity: 65,
    success_rate: 18,
  },
  {
    id: 'investor_deals',
    name: 'Investor Deal Flow',
    description: 'Keep investors engaged with market opportunities.',
    type: 'investor',
    tone: 'professional',
    email_count: 8,
    duration_days: 45,
    popularity: 58,
    success_rate: 22,
  },
];

export interface GenerateSequenceRequest {
  type: SequenceType;
  tone: EmailTone;
  email_count: number;
  duration_days: number;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  brokerage_name?: string;
  target_audience_description?: string;
  key_differentiators?: string[];
  local_market?: string;
  include_market_updates: boolean;
  include_listings: boolean;
}

export interface GenerateSequenceResponse {
  success: boolean;
  sequence?: NurtureSequence;
  error?: string;
  tokens_used: number;
  generation_time_ms: number;
}
