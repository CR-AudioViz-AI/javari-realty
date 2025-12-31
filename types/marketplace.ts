// 3rd Party Marketplace Types
// CR AudioViz AI - Javari Realtor Platform

export interface ServiceProvider {
  id: string;
  user_id?: string;
  business_name: string;
  category: ProviderCategory;
  subcategories: string[];
  description: string;
  logo_url?: string;
  photos: string[];
  contact_name: string;
  email: string;
  phone: string;
  website?: string;
  service_areas: string[]; // Zip codes or city names
  price_range: '$' | '$$' | '$$$' | '$$$$';
  is_verified: boolean;
  is_licensed: boolean;
  is_insured: boolean;
  license_number?: string;
  years_in_business: number;
  subscription_tier: 'basic' | 'enhanced' | 'premium' | 'website';
  subscription_price: number;
  subscription_status: 'active' | 'trial' | 'expired' | 'cancelled';
  rating: number;
  review_count: number;
  response_time_hours?: number;
  created_at: string;
  updated_at: string;
}

export type ProviderCategory = 
  | 'mortgage_lender'
  | 'title_company'
  | 'insurance'
  | 'home_warranty'
  | 'inspector'
  | 'appraiser'
  | 'contractor'
  | 'landscaper'
  | 'mover'
  | 'pool_service'
  | 'pest_control'
  | 'roofer'
  | 'hvac'
  | 'plumber'
  | 'electrician'
  | 'solar'
  | 'security'
  | 'cleaning'
  | 'handyman'
  | 'photographer'
  | 'stager'
  | 'attorney';

export const PROVIDER_CATEGORIES: Record<ProviderCategory, { label: string; icon: string; phase: string }> = {
  mortgage_lender: { label: 'Mortgage Lender', icon: '🏦', phase: 'pre_purchase' },
  title_company: { label: 'Title Company', icon: '📋', phase: 'closing' },
  insurance: { label: 'Insurance Agent', icon: '🛡️', phase: 'closing' },
  home_warranty: { label: 'Home Warranty', icon: '🏠', phase: 'post_purchase' },
  inspector: { label: 'Home Inspector', icon: '🔍', phase: 'pre_purchase' },
  appraiser: { label: 'Appraiser', icon: '📊', phase: 'pre_purchase' },
  contractor: { label: 'General Contractor', icon: '🔨', phase: 'post_purchase' },
  landscaper: { label: 'Landscaper', icon: '🌳', phase: 'post_purchase' },
  mover: { label: 'Moving Company', icon: '🚚', phase: 'closing' },
  pool_service: { label: 'Pool Service', icon: '🏊', phase: 'post_purchase' },
  pest_control: { label: 'Pest Control', icon: '🐜', phase: 'post_purchase' },
  roofer: { label: 'Roofer', icon: '🏗️', phase: 'post_purchase' },
  hvac: { label: 'HVAC Company', icon: '❄️', phase: 'post_purchase' },
  plumber: { label: 'Plumber', icon: '🚿', phase: 'post_purchase' },
  electrician: { label: 'Electrician', icon: '⚡', phase: 'post_purchase' },
  solar: { label: 'Solar Company', icon: '☀️', phase: 'post_purchase' },
  security: { label: 'Security Systems', icon: '🔐', phase: 'post_purchase' },
  cleaning: { label: 'Cleaning Service', icon: '🧹', phase: 'closing' },
  handyman: { label: 'Handyman', icon: '🔧', phase: 'post_purchase' },
  photographer: { label: 'Photographer', icon: '📷', phase: 'pre_listing' },
  stager: { label: 'Home Stager', icon: '🛋️', phase: 'pre_listing' },
  attorney: { label: 'Real Estate Attorney', icon: '⚖️', phase: 'closing' },
};

export interface ProviderReview {
  id: string;
  provider_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  title?: string;
  review_text: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  response?: string;
  response_date?: string;
  created_at: string;
}

export interface ProviderLead {
  id: string;
  provider_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  message: string;
  service_needed: string;
  property_address?: string;
  preferred_contact: 'email' | 'phone' | 'either';
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  created_at: string;
}

export const SUBSCRIPTION_TIERS = {
  basic: {
    price: 25,
    features: ['Business listing', 'Contact info', 'Service areas', '3 photos'],
  },
  enhanced: {
    price: 100,
    features: ['Everything in Basic', 'Priority placement', 'Unlimited photos', 'Reviews display', 'Response to reviews'],
  },
  premium: {
    price: 300,
    features: ['Everything in Enhanced', 'Analytics dashboard', 'Lead notifications', 'Featured badge', 'Social proof stats'],
  },
  website: {
    price: 500,
    features: ['Everything in Premium', 'Full website', 'Custom domain', 'Referral system', 'CRM integration', 'Lead routing'],
  },
};
