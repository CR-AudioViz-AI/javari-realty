// =============================================================================
// AI LISTING LAUNCH WORKFLOW - Type Definitions
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:24 PM EST
// Hero Workflow #1: Complete listing in 30 minutes
// =============================================================================

export type ListingStatus = 'draft' | 'generating' | 'review' | 'approved' | 'published' | 'failed';
export type ContentType = 'description' | 'features' | 'neighborhood' | 'social' | 'email' | 'flyer';

export interface ListingLaunchRequest {
  property_address: string;
  property_type: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size?: number;
  year_built?: number;
  list_price: number;
  
  // Optional details for better AI generation
  special_features?: string[];
  recent_upgrades?: string[];
  hoa_fee?: number;
  parking?: string;
  heating_cooling?: string;
  appliances_included?: string[];
  
  // Agent customization
  agent_id: string;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  brokerage_name?: string;
  
  // Target audience hints
  target_buyers?: ('first_time' | 'family' | 'investor' | 'downsizer' | 'luxury')[];
  neighborhood_highlights?: string[];
  
  // Photo upload info
  photo_urls?: string[];
  virtual_tour_url?: string;
}

export interface GeneratedContent {
  type: ContentType;
  title: string;
  content: string;
  character_count: number;
  word_count: number;
  generated_at: string;
  model_used: string;
  tokens_used: number;
  variations?: string[]; // Alternative versions
}

export interface ListingLaunchResult {
  id: string;
  status: ListingStatus;
  request: ListingLaunchRequest;
  
  // Generated content
  mls_description: GeneratedContent;
  feature_highlights: GeneratedContent;
  neighborhood_brief: GeneratedContent;
  
  // Marketing materials
  social_posts: {
    facebook: GeneratedContent;
    instagram: GeneratedContent;
    linkedin: GeneratedContent;
    twitter: GeneratedContent;
  };
  
  email_templates: {
    announcement: GeneratedContent;
    open_house: GeneratedContent;
    price_reduction?: GeneratedContent;
  };
  
  // Property intelligence (from orchestrator)
  property_intelligence?: {
    flood_zone: string;
    walk_score: number;
    school_rating: number;
    crime_grade?: string;
    commute_times?: Record<string, number>;
  };
  
  // SEO & Keywords
  seo_keywords: string[];
  hashtags: string[];
  
  // Metadata
  created_at: string;
  updated_at: string;
  published_at?: string;
  total_tokens_used: number;
  generation_time_ms: number;
  credits_used: number;
}

export interface ListingLaunchStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  started_at?: string;
  completed_at?: string;
  error?: string;
}

export interface ListingLaunchProgress {
  listing_id: string;
  overall_progress: number;
  current_step: string;
  steps: ListingLaunchStep[];
  estimated_completion: string;
  can_cancel: boolean;
}

// Social media post templates
export interface SocialPostTemplate {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  max_length: number;
  supports_hashtags: boolean;
  supports_emojis: boolean;
  image_required: boolean;
  best_posting_times: string[];
}

export const SOCIAL_TEMPLATES: Record<string, SocialPostTemplate> = {
  facebook: {
    platform: 'facebook',
    max_length: 63206,
    supports_hashtags: true,
    supports_emojis: true,
    image_required: false,
    best_posting_times: ['9:00 AM', '1:00 PM', '4:00 PM'],
  },
  instagram: {
    platform: 'instagram',
    max_length: 2200,
    supports_hashtags: true,
    supports_emojis: true,
    image_required: true,
    best_posting_times: ['11:00 AM', '2:00 PM', '7:00 PM'],
  },
  linkedin: {
    platform: 'linkedin',
    max_length: 3000,
    supports_hashtags: true,
    supports_emojis: false,
    image_required: false,
    best_posting_times: ['7:00 AM', '12:00 PM', '5:00 PM'],
  },
  twitter: {
    platform: 'twitter',
    max_length: 280,
    supports_hashtags: true,
    supports_emojis: true,
    image_required: false,
    best_posting_times: ['8:00 AM', '12:00 PM', '6:00 PM'],
  },
};

// Email template types
export interface EmailTemplate {
  type: 'announcement' | 'open_house' | 'price_reduction' | 'just_sold' | 'follow_up';
  subject: string;
  preview_text: string;
  html_body: string;
  plain_text: string;
  cta_text: string;
  cta_url: string;
}

// Flyer generation
export interface FlyerTemplate {
  type: 'standard' | 'luxury' | 'modern' | 'classic';
  layout: 'portrait' | 'landscape';
  color_scheme: string[];
  font_family: string;
  sections: ('header' | 'photos' | 'features' | 'description' | 'agent' | 'qr_code')[];
}
