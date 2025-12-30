// =============================================================================
// PROPERTY DATA ORCHESTRATOR - Type Definitions
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:12 PM EST
// Implements: Trust Layers (source, date, confidence) on every data point
// =============================================================================

export type DataSource = 
  | 'mls'
  | 'public_records'
  | 'fema'
  | 'epa'
  | 'census'
  | 'fcc'
  | 'hud'
  | 'nces'
  | 'nws'
  | 'usgs'
  | 'walk_score'
  | 'google_places'
  | 'user_input'
  | 'agent_verified'
  | 'ai_estimated'
  | 'third_party';

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unverified';

export type DataFreshness = 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'unknown';

/**
 * Trust metadata attached to every data point
 */
export interface TrustLayer {
  source: DataSource;
  source_name: string;
  source_url?: string;
  retrieved_at: string;
  data_date?: string;
  freshness: DataFreshness;
  confidence: ConfidenceLevel;
  confidence_score: number; // 0-100
  verification_status: 'verified' | 'unverified' | 'disputed' | 'outdated';
  last_verified_at?: string;
  verified_by?: string;
  notes?: string;
}

/**
 * A data point wrapped with trust metadata
 */
export interface TrustedData<T> {
  value: T;
  trust: TrustLayer;
  fallback_value?: T;
  fallback_trust?: TrustLayer;
}

/**
 * Property intelligence data structure with trust layers
 */
export interface PropertyIntelligence {
  property_id: string;
  address: TrustedData<string>;
  coordinates: TrustedData<{ lat: number; lng: number }>;
  
  // Listing Data
  listing?: {
    price: TrustedData<number>;
    status: TrustedData<string>;
    days_on_market: TrustedData<number>;
    list_date: TrustedData<string>;
    mls_number: TrustedData<string>;
  };

  // Property Details
  details: {
    bedrooms: TrustedData<number>;
    bathrooms: TrustedData<number>;
    square_feet: TrustedData<number>;
    lot_size: TrustedData<number>;
    year_built: TrustedData<number>;
    property_type: TrustedData<string>;
    stories: TrustedData<number>;
    garage_spaces: TrustedData<number>;
  };

  // Valuation
  valuation?: {
    estimated_value: TrustedData<number>;
    price_per_sqft: TrustedData<number>;
    tax_assessed_value: TrustedData<number>;
    last_sold_price: TrustedData<number>;
    last_sold_date: TrustedData<string>;
  };

  // Environmental
  environmental: {
    flood_zone: TrustedData<FloodZoneData>;
    air_quality: TrustedData<AirQualityData>;
    earthquake_risk: TrustedData<EarthquakeData>;
    wildfire_risk?: TrustedData<WildfireData>;
    noise_level?: TrustedData<NoiseData>;
  };

  // Location Intelligence
  location: {
    walkability: TrustedData<WalkabilityData>;
    schools: TrustedData<SchoolData[]>;
    demographics: TrustedData<DemographicsData>;
    broadband: TrustedData<BroadbandData>;
    fair_market_rent: TrustedData<FairMarketRentData>;
    weather: TrustedData<WeatherData>;
  };

  // Nearby Amenities
  amenities: {
    restaurants: TrustedData<AmenityData[]>;
    grocery: TrustedData<AmenityData[]>;
    healthcare: TrustedData<AmenityData[]>;
    parks: TrustedData<AmenityData[]>;
    transit: TrustedData<AmenityData[]>;
  };

  // Market Analysis
  market?: {
    comparable_sales: TrustedData<ComparableData[]>;
    price_history: TrustedData<PriceHistoryData[]>;
    market_trend: TrustedData<MarketTrendData>;
    days_to_sell_avg: TrustedData<number>;
  };

  // Metadata
  generated_at: string;
  total_data_points: number;
  average_confidence: number;
  data_completeness: number; // 0-100 percentage
}

// Sub-types for specific data categories
export interface FloodZoneData {
  zone: string;
  zone_description: string;
  flood_risk: 'high' | 'moderate' | 'low' | 'minimal';
  insurance_required: boolean;
  panel_number?: string;
}

export interface AirQualityData {
  aqi: number;
  category: string;
  pollutant: string;
  health_concern: string;
}

export interface EarthquakeData {
  risk_level: 'high' | 'moderate' | 'low';
  recent_events: number;
  magnitude_avg?: number;
}

export interface WildfireData {
  risk_level: 'extreme' | 'high' | 'moderate' | 'low';
  fire_history: number;
}

export interface NoiseData {
  level_db: number;
  category: 'quiet' | 'moderate' | 'noisy' | 'very_noisy';
  sources: string[];
}

export interface WalkabilityData {
  walk_score: number;
  walk_description: string;
  bike_score?: number;
  bike_description?: string;
  transit_score?: number;
  transit_description?: string;
}

export interface SchoolData {
  name: string;
  type: 'elementary' | 'middle' | 'high' | 'private';
  rating?: number;
  distance_miles: number;
  enrollment?: number;
  grades: string;
}

export interface DemographicsData {
  population: number;
  median_age: number;
  median_income: number;
  owner_occupied_pct: number;
  education_bachelors_pct: number;
}

export interface BroadbandData {
  max_download_speed: number;
  providers: number;
  fiber_available: boolean;
  technology_types: string[];
}

export interface FairMarketRentData {
  efficiency: number;
  one_bedroom: number;
  two_bedroom: number;
  three_bedroom: number;
  four_bedroom: number;
  year: number;
}

export interface WeatherData {
  current_temp: number;
  condition: string;
  humidity: number;
  forecast_high: number;
  forecast_low: number;
}

export interface AmenityData {
  name: string;
  category: string;
  distance_miles: number;
  rating?: number;
  review_count?: number;
  address?: string;
  price_level?: string;
}

export interface ComparableData {
  address: string;
  price: number;
  sqft: number;
  price_per_sqft: number;
  sold_date: string;
  distance_miles: number;
  similarity_score: number;
}

export interface PriceHistoryData {
  date: string;
  event: 'listed' | 'price_change' | 'pending' | 'sold' | 'delisted';
  price: number;
  change_pct?: number;
}

export interface MarketTrendData {
  trend: 'appreciating' | 'stable' | 'depreciating';
  yoy_change_pct: number;
  median_price: number;
  inventory_months: number;
  seller_buyer_market: 'seller' | 'balanced' | 'buyer';
}

// Orchestrator Configuration
export interface OrchestratorConfig {
  cache_ttl_seconds: number;
  parallel_requests: boolean;
  include_fallbacks: boolean;
  min_confidence_threshold: number;
  timeout_ms: number;
  retry_attempts: number;
}

// API Request/Response
export interface PropertyIntelligenceRequest {
  address?: string;
  lat?: number;
  lng?: number;
  property_id?: string;
  sections?: (keyof PropertyIntelligence)[];
  config?: Partial<OrchestratorConfig>;
}

export interface PropertyIntelligenceResponse {
  success: boolean;
  data?: PropertyIntelligence;
  errors?: {
    section: string;
    source: DataSource;
    error: string;
  }[];
  metadata: {
    request_id: string;
    processing_time_ms: number;
    cache_hit: boolean;
    sources_queried: DataSource[];
    sources_succeeded: DataSource[];
  };
}
