// Scoring Calculation Engine
// CR AudioViz AI - Javari Realtor Platform

import { 
  ScoringPreferences, 
  ScoringFactor, 
  PropertyScore, 
  FactorScore,
  PropertyWithScore,
  DEFAULT_SCORING_FACTORS 
} from '@/types/scoring';

interface PropertyData {
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
  images?: string[];
  has_pool?: boolean;
  has_garage?: boolean;
  hoa_fee?: number;
  flood_zone?: string;
  // API-enriched data
  school_rating?: number;
  walk_score?: number;
  transit_score?: number;
  bike_score?: number;
  crime_score?: number;
  internet_speed?: number;
  noise_level?: string;
  air_quality?: number;
  fire_risk?: string;
  rental_estimate?: number;
  appreciation_rate?: number;
}

interface UserContext {
  budget_max: number;
  budget_min?: number;
  work_address?: string;
  commute_time_to_work?: number; // Pre-calculated
  min_beds?: number;
  min_baths?: number;
  min_sqft?: number;
}

export function calculatePropertyScore(
  property: PropertyData,
  preferences: ScoringPreferences,
  userContext: UserContext
): PropertyScore {
  const enabledFactors = preferences.factors.filter(f => f.enabled && f.weight > 0);
  const factorScores: FactorScore[] = [];
  
  let totalWeightedScore = 0;
  let totalMaxPossible = 0;

  for (const factor of enabledFactors) {
    const score = calculateFactorScore(factor, property, userContext);
    factorScores.push(score);
    totalWeightedScore += score.weighted_score;
    totalMaxPossible += score.max_possible;
  }

  // Normalize to 0-100 scale
  const totalScore = totalMaxPossible > 0 
    ? Math.round((totalWeightedScore / totalMaxPossible) * 100) 
    : 0;

  return {
    property_id: property.id,
    user_id: '', // Set by caller
    total_score: totalScore,
    factor_scores: factorScores,
    calculated_at: new Date().toISOString(),
  };
}

function calculateFactorScore(
  factor: ScoringFactor,
  property: PropertyData,
  context: UserContext
): FactorScore {
  let rawValue: string | number | boolean = 'N/A';
  let normalizedScore = 0; // 0-10 scale

  switch (factor.id) {
    // Financial
    case 'price_vs_budget':
      rawValue = property.price;
      if (context.budget_max > 0) {
        const ratio = property.price / context.budget_max;
        if (ratio <= 0.8) normalizedScore = 10;
        else if (ratio <= 0.9) normalizedScore = 9;
        else if (ratio <= 1.0) normalizedScore = 8;
        else if (ratio <= 1.1) normalizedScore = 5;
        else if (ratio <= 1.2) normalizedScore = 3;
        else normalizedScore = 1;
      }
      break;

    case 'hoa_fee':
      rawValue = property.hoa_fee ?? 0;
      if (property.hoa_fee === undefined || property.hoa_fee === 0) {
        normalizedScore = 10;
      } else if (property.hoa_fee <= 100) {
        normalizedScore = 9;
      } else if (property.hoa_fee <= 250) {
        normalizedScore = 7;
      } else if (property.hoa_fee <= 500) {
        normalizedScore = 5;
      } else if (property.hoa_fee <= 750) {
        normalizedScore = 3;
      } else {
        normalizedScore = 1;
      }
      break;

    // Property
    case 'sqft':
      rawValue = property.sqft;
      if (context.min_sqft && property.sqft >= context.min_sqft) {
        normalizedScore = Math.min(10, 7 + ((property.sqft - context.min_sqft) / context.min_sqft) * 3);
      } else if (property.sqft >= 2500) {
        normalizedScore = 10;
      } else if (property.sqft >= 2000) {
        normalizedScore = 8;
      } else if (property.sqft >= 1500) {
        normalizedScore = 6;
      } else if (property.sqft >= 1000) {
        normalizedScore = 4;
      } else {
        normalizedScore = 2;
      }
      break;

    case 'bedrooms':
      rawValue = property.beds;
      if (context.min_beds) {
        if (property.beds >= context.min_beds + 1) normalizedScore = 10;
        else if (property.beds >= context.min_beds) normalizedScore = 8;
        else if (property.beds >= context.min_beds - 1) normalizedScore = 4;
        else normalizedScore = 1;
      } else {
        normalizedScore = Math.min(10, property.beds * 2);
      }
      break;

    case 'bathrooms':
      rawValue = property.baths;
      if (context.min_baths) {
        if (property.baths >= context.min_baths + 0.5) normalizedScore = 10;
        else if (property.baths >= context.min_baths) normalizedScore = 8;
        else if (property.baths >= context.min_baths - 0.5) normalizedScore = 5;
        else normalizedScore = 2;
      } else {
        normalizedScore = Math.min(10, property.baths * 3);
      }
      break;

    case 'lot_size':
      rawValue = property.lot_size ?? 0;
      if (!property.lot_size) {
        normalizedScore = 5; // Neutral if unknown
      } else if (property.lot_size >= 43560) { // 1+ acre
        normalizedScore = 10;
      } else if (property.lot_size >= 21780) { // 0.5 acre
        normalizedScore = 8;
      } else if (property.lot_size >= 10890) { // 0.25 acre
        normalizedScore = 6;
      } else if (property.lot_size >= 5000) {
        normalizedScore = 4;
      } else {
        normalizedScore = 2;
      }
      break;

    case 'year_built':
      rawValue = property.year_built ?? 0;
      const currentYear = new Date().getFullYear();
      const age = currentYear - (property.year_built ?? currentYear);
      if (age <= 5) normalizedScore = 10;
      else if (age <= 15) normalizedScore = 8;
      else if (age <= 30) normalizedScore = 6;
      else if (age <= 50) normalizedScore = 4;
      else normalizedScore = 2;
      break;

    case 'garage':
      rawValue = property.has_garage ?? false;
      normalizedScore = property.has_garage ? 10 : 0;
      break;

    case 'pool':
      rawValue = property.has_pool ?? false;
      normalizedScore = property.has_pool ? 10 : 0;
      break;

    // Location scores
    case 'walk_score':
      rawValue = property.walk_score ?? 0;
      normalizedScore = Math.round((property.walk_score ?? 0) / 10);
      break;

    case 'transit_score':
      rawValue = property.transit_score ?? 0;
      normalizedScore = Math.round((property.transit_score ?? 0) / 10);
      break;

    case 'bike_score':
      rawValue = property.bike_score ?? 0;
      normalizedScore = Math.round((property.bike_score ?? 0) / 10);
      break;

    case 'commute_time':
      rawValue = context.commute_time_to_work ?? 'Unknown';
      if (context.commute_time_to_work === undefined) {
        normalizedScore = 5;
      } else if (context.commute_time_to_work <= 15) {
        normalizedScore = 10;
      } else if (context.commute_time_to_work <= 30) {
        normalizedScore = 8;
      } else if (context.commute_time_to_work <= 45) {
        normalizedScore = 6;
      } else if (context.commute_time_to_work <= 60) {
        normalizedScore = 4;
      } else {
        normalizedScore = 2;
      }
      break;

    // Safety
    case 'crime_score':
      rawValue = property.crime_score ?? 50;
      // crime_score: higher is safer (0-100)
      normalizedScore = Math.round((property.crime_score ?? 50) / 10);
      break;

    case 'flood_risk':
      rawValue = property.flood_zone ?? 'Unknown';
      switch (property.flood_zone?.toUpperCase()) {
        case 'X':
        case 'MINIMAL':
          normalizedScore = 10;
          break;
        case 'B':
        case 'C':
        case 'LOW':
          normalizedScore = 8;
          break;
        case 'MODERATE':
          normalizedScore = 5;
          break;
        case 'A':
        case 'AE':
        case 'HIGH':
          normalizedScore = 2;
          break;
        case 'V':
        case 'VE':
        case 'COASTAL':
          normalizedScore = 1;
          break;
        default:
          normalizedScore = 5;
      }
      break;

    case 'fire_risk':
      rawValue = property.fire_risk ?? 'Unknown';
      switch (property.fire_risk?.toLowerCase()) {
        case 'minimal':
        case 'low':
          normalizedScore = 10;
          break;
        case 'moderate':
          normalizedScore = 6;
          break;
        case 'high':
          normalizedScore = 3;
          break;
        case 'extreme':
          normalizedScore = 1;
          break;
        default:
          normalizedScore = 5;
      }
      break;

    // Schools
    case 'school_rating':
      rawValue = property.school_rating ?? 5;
      normalizedScore = property.school_rating ?? 5;
      break;

    // Environment
    case 'air_quality':
      rawValue = property.air_quality ?? 50;
      // AQI: lower is better (0-500, but typically 0-150)
      if ((property.air_quality ?? 50) <= 25) normalizedScore = 10;
      else if ((property.air_quality ?? 50) <= 50) normalizedScore = 8;
      else if ((property.air_quality ?? 50) <= 100) normalizedScore = 5;
      else normalizedScore = 2;
      break;

    case 'noise_level':
      rawValue = property.noise_level ?? 'Unknown';
      switch (property.noise_level?.toLowerCase()) {
        case 'quiet':
        case 'very quiet':
          normalizedScore = 10;
          break;
        case 'average':
        case 'normal':
          normalizedScore = 7;
          break;
        case 'busy':
        case 'noisy':
          normalizedScore = 4;
          break;
        case 'very noisy':
        case 'loud':
          normalizedScore = 1;
          break;
        default:
          normalizedScore = 5;
      }
      break;

    case 'internet_speed':
      rawValue = property.internet_speed ?? 0;
      if ((property.internet_speed ?? 0) >= 1000) normalizedScore = 10;
      else if ((property.internet_speed ?? 0) >= 500) normalizedScore = 9;
      else if ((property.internet_speed ?? 0) >= 200) normalizedScore = 7;
      else if ((property.internet_speed ?? 0) >= 100) normalizedScore = 5;
      else if ((property.internet_speed ?? 0) >= 50) normalizedScore = 3;
      else normalizedScore = 1;
      break;

    // Investment
    case 'rental_estimate':
      rawValue = property.rental_estimate ?? 0;
      if (!property.rental_estimate || !property.price) {
        normalizedScore = 5;
      } else {
        // Cap rate calculation: (annual rent / price) * 100
        const annualRent = property.rental_estimate * 12;
        const capRate = (annualRent / property.price) * 100;
        if (capRate >= 10) normalizedScore = 10;
        else if (capRate >= 8) normalizedScore = 8;
        else if (capRate >= 6) normalizedScore = 6;
        else if (capRate >= 4) normalizedScore = 4;
        else normalizedScore = 2;
      }
      break;

    case 'appreciation':
      rawValue = property.appreciation_rate ?? 0;
      if ((property.appreciation_rate ?? 0) >= 10) normalizedScore = 10;
      else if ((property.appreciation_rate ?? 0) >= 7) normalizedScore = 8;
      else if ((property.appreciation_rate ?? 0) >= 5) normalizedScore = 6;
      else if ((property.appreciation_rate ?? 0) >= 3) normalizedScore = 4;
      else if ((property.appreciation_rate ?? 0) >= 0) normalizedScore = 2;
      else normalizedScore = 0;
      break;

    default:
      normalizedScore = 5;
  }

  const weightedScore = normalizedScore * factor.weight;
  const maxPossible = 10 * factor.weight;

  return {
    factor_id: factor.id,
    factor_name: factor.name,
    raw_value: rawValue,
    normalized_score: normalizedScore,
    weighted_score: weightedScore,
    weight: factor.weight,
    max_possible: maxPossible,
  };
}

export function rankProperties(
  propertiesWithScores: PropertyWithScore[]
): PropertyWithScore[] {
  return propertiesWithScores
    .sort((a, b) => b.score.total_score - a.score.total_score)
    .map((p, index) => ({
      ...p,
      score: {
        ...p.score,
        rank: index + 1,
      },
    }));
}

export function getDefaultPreferences(userId: string): ScoringPreferences {
  return {
    id: `pref_${Date.now()}`,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    factors: DEFAULT_SCORING_FACTORS,
    preset: 'custom',
  };
}

export function applyPreset(
  preferences: ScoringPreferences,
  presetName: 'family' | 'investor' | 'retiree' | 'first-time' | 'luxury'
): ScoringPreferences {
  const preset = SCORING_PRESETS[presetName];
  if (!preset) return preferences;

  const updatedFactors = preferences.factors.map(factor => {
    const presetOverride = preset.find(p => p.id === factor.id);
    if (presetOverride) {
      return {
        ...factor,
        weight: presetOverride.weight ?? factor.weight,
        enabled: presetOverride.enabled ?? factor.enabled,
      };
    }
    return factor;
  });

  return {
    ...preferences,
    factors: updatedFactors,
    preset: presetName,
    updated_at: new Date().toISOString(),
  };
}

// Import presets
import { SCORING_PRESETS } from '@/types/scoring';
