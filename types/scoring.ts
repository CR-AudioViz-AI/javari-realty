// Personal Scoring Matrix Types
// CR AudioViz AI - Javari Realtor Platform

export interface ScoringFactor {
  id: string;
  name: string;
  category: ScoringCategory;
  description: string;
  weight: number; // 1-10
  enabled: boolean;
  dataSource: 'property' | 'api' | 'calculated';
}

export type ScoringCategory = 
  | 'location'
  | 'property'
  | 'financial'
  | 'lifestyle'
  | 'safety'
  | 'schools'
  | 'environment'
  | 'amenities';

export interface ScoringPreferences {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  factors: ScoringFactor[];
  // Quick presets
  preset?: 'family' | 'investor' | 'retiree' | 'first-time' | 'luxury' | 'custom';
}

export interface PropertyScore {
  property_id: string;
  user_id: string;
  total_score: number; // 0-100
  factor_scores: FactorScore[];
  calculated_at: string;
  rank?: number; // Position among saved properties
}

export interface FactorScore {
  factor_id: string;
  factor_name: string;
  raw_value: string | number | boolean;
  normalized_score: number; // 0-10
  weighted_score: number; // normalized * weight
  weight: number;
  max_possible: number;
}

export interface PropertyComparison {
  properties: PropertyWithScore[];
  comparison_date: string;
  user_preferences: ScoringPreferences;
}

export interface PropertyWithScore {
  property: {
    id: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    lot_size?: number;
    year_built?: number;
    property_type: string;
    images: string[];
    // Additional data
    has_pool?: boolean;
    has_garage?: boolean;
    hoa_fee?: number;
    flood_zone?: string;
    school_rating?: number;
    walk_score?: number;
    transit_score?: number;
    crime_score?: number;
    internet_speed?: number;
    noise_level?: string;
  };
  score: PropertyScore;
}

// Default scoring factors
export const DEFAULT_SCORING_FACTORS: ScoringFactor[] = [
  // Location
  { id: 'commute_time', name: 'Commute Time', category: 'location', description: 'Time to work address', weight: 5, enabled: true, dataSource: 'calculated' },
  { id: 'walk_score', name: 'Walk Score', category: 'location', description: 'Walkability rating', weight: 5, enabled: true, dataSource: 'api' },
  { id: 'transit_score', name: 'Transit Score', category: 'location', description: 'Public transit access', weight: 3, enabled: true, dataSource: 'api' },
  { id: 'bike_score', name: 'Bike Score', category: 'location', description: 'Bikeability rating', weight: 3, enabled: false, dataSource: 'api' },
  
  // Property
  { id: 'price_vs_budget', name: 'Price vs Budget', category: 'financial', description: 'How price compares to your budget', weight: 10, enabled: true, dataSource: 'calculated' },
  { id: 'sqft', name: 'Square Footage', category: 'property', description: 'Total living space', weight: 6, enabled: true, dataSource: 'property' },
  { id: 'bedrooms', name: 'Bedrooms', category: 'property', description: 'Number of bedrooms', weight: 8, enabled: true, dataSource: 'property' },
  { id: 'bathrooms', name: 'Bathrooms', category: 'property', description: 'Number of bathrooms', weight: 6, enabled: true, dataSource: 'property' },
  { id: 'lot_size', name: 'Lot Size', category: 'property', description: 'Property land area', weight: 4, enabled: false, dataSource: 'property' },
  { id: 'year_built', name: 'Year Built', category: 'property', description: 'Age of property', weight: 4, enabled: true, dataSource: 'property' },
  { id: 'garage', name: 'Garage', category: 'property', description: 'Has garage', weight: 5, enabled: true, dataSource: 'property' },
  
  // Amenities
  { id: 'pool', name: 'Pool', category: 'amenities', description: 'Has swimming pool', weight: 6, enabled: true, dataSource: 'property' },
  { id: 'hoa_fee', name: 'HOA Fee', category: 'financial', description: 'Monthly HOA cost', weight: 5, enabled: true, dataSource: 'property' },
  
  // Safety
  { id: 'crime_score', name: 'Crime Safety', category: 'safety', description: 'Area crime statistics', weight: 8, enabled: true, dataSource: 'api' },
  { id: 'flood_risk', name: 'Flood Risk', category: 'safety', description: 'FEMA flood zone risk', weight: 7, enabled: true, dataSource: 'api' },
  { id: 'fire_risk', name: 'Fire Risk', category: 'safety', description: 'Wildfire risk level', weight: 5, enabled: false, dataSource: 'api' },
  
  // Schools
  { id: 'school_rating', name: 'School Rating', category: 'schools', description: 'Nearby school quality', weight: 8, enabled: true, dataSource: 'api' },
  { id: 'school_distance', name: 'School Distance', category: 'schools', description: 'Distance to schools', weight: 4, enabled: false, dataSource: 'calculated' },
  
  // Environment
  { id: 'air_quality', name: 'Air Quality', category: 'environment', description: 'EPA air quality index', weight: 4, enabled: false, dataSource: 'api' },
  { id: 'noise_level', name: 'Noise Level', category: 'environment', description: 'Ambient noise estimate', weight: 5, enabled: false, dataSource: 'api' },
  { id: 'internet_speed', name: 'Internet Speed', category: 'lifestyle', description: 'Available broadband speeds', weight: 6, enabled: true, dataSource: 'api' },
  
  // Investment
  { id: 'rental_estimate', name: 'Rental Potential', category: 'financial', description: 'Estimated rental income', weight: 3, enabled: false, dataSource: 'calculated' },
  { id: 'appreciation', name: 'Appreciation Trend', category: 'financial', description: '5-year price trend', weight: 4, enabled: false, dataSource: 'api' },
];

// Preset configurations
export const SCORING_PRESETS: Record<string, Partial<ScoringFactor>[]> = {
  family: [
    { id: 'school_rating', weight: 10, enabled: true },
    { id: 'crime_score', weight: 10, enabled: true },
    { id: 'bedrooms', weight: 9, enabled: true },
    { id: 'pool', weight: 7, enabled: true },
    { id: 'lot_size', weight: 6, enabled: true },
  ],
  investor: [
    { id: 'price_vs_budget', weight: 10, enabled: true },
    { id: 'rental_estimate', weight: 10, enabled: true },
    { id: 'appreciation', weight: 9, enabled: true },
    { id: 'hoa_fee', weight: 8, enabled: true },
    { id: 'school_rating', weight: 3, enabled: false },
  ],
  retiree: [
    { id: 'walk_score', weight: 9, enabled: true },
    { id: 'transit_score', weight: 8, enabled: true },
    { id: 'crime_score', weight: 10, enabled: true },
    { id: 'bedrooms', weight: 4, enabled: true },
    { id: 'school_rating', weight: 1, enabled: false },
  ],
  'first-time': [
    { id: 'price_vs_budget', weight: 10, enabled: true },
    { id: 'commute_time', weight: 8, enabled: true },
    { id: 'hoa_fee', weight: 7, enabled: true },
    { id: 'year_built', weight: 6, enabled: true },
  ],
  luxury: [
    { id: 'sqft', weight: 9, enabled: true },
    { id: 'lot_size', weight: 8, enabled: true },
    { id: 'pool', weight: 9, enabled: true },
    { id: 'price_vs_budget', weight: 3, enabled: true },
  ],
};
