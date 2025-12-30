// =============================================================================
// INTENT-BASED SEARCH - Type Definitions
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:42 PM EST
// Phase 3: AI as Actions, Not Chat - Persona-driven search
// =============================================================================

export type BuyerPersona = 
  | 'first_time_buyer'
  | 'growing_family'
  | 'downsizer'
  | 'investor'
  | 'luxury_buyer'
  | 'relocator'
  | 'retiree'
  | 'vacation_home'
  | 'fixer_upper';

export type SearchIntent = 
  | 'find_home'
  | 'compare_properties'
  | 'check_affordability'
  | 'explore_neighborhood'
  | 'investment_analysis'
  | 'schedule_tour'
  | 'get_preapproved';

export interface PersonaProfile {
  id: BuyerPersona;
  name: string;
  description: string;
  icon: string;
  typical_needs: string[];
  priority_factors: PriorityFactor[];
  budget_range?: { min: number; max: number };
  property_types: string[];
  deal_breakers: string[];
  nice_to_haves: string[];
  questions_to_ask: string[];
  financing_considerations: string[];
}

export interface PriorityFactor {
  factor: string;
  weight: number; // 0-100
  description: string;
}

export interface IntentSearch {
  id: string;
  user_id: string;
  persona: BuyerPersona;
  intent: SearchIntent;
  
  // Natural language query
  query: string;
  parsed_criteria: ParsedSearchCriteria;
  
  // Results
  results: SearchResult[];
  ai_summary: string;
  suggested_actions: SuggestedAction[];
  
  // Metadata
  created_at: string;
  search_time_ms: number;
}

export interface ParsedSearchCriteria {
  location?: {
    city?: string;
    state?: string;
    zip?: string;
    neighborhood?: string;
    radius_miles?: number;
  };
  price?: {
    min?: number;
    max?: number;
    flexibility?: 'strict' | 'flexible' | 'very_flexible';
  };
  property?: {
    types?: string[];
    bedrooms_min?: number;
    bedrooms_max?: number;
    bathrooms_min?: number;
    square_feet_min?: number;
    square_feet_max?: number;
    year_built_min?: number;
    lot_size_min?: number;
  };
  features?: {
    must_have: string[];
    nice_to_have: string[];
    exclude: string[];
  };
  lifestyle?: {
    commute_to?: string;
    max_commute_minutes?: number;
    school_rating_min?: number;
    walkability_min?: number;
    pets?: boolean;
    home_office?: boolean;
  };
  timeline?: {
    move_by?: string;
    urgency: 'immediate' | 'soon' | 'flexible' | 'exploring';
  };
}

export interface SearchResult {
  property_id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  photos: string[];
  
  // AI-enhanced fields
  match_score: number; // 0-100
  match_reasons: string[];
  potential_concerns: string[];
  personalized_highlights: string[];
  
  // Contextual actions
  actions: ContextualAction[];
}

export interface ContextualAction {
  id: string;
  type: ActionType;
  label: string;
  icon: string;
  description: string;
  primary: boolean;
  data?: Record<string, unknown>;
}

export type ActionType = 
  | 'schedule_tour'
  | 'save_property'
  | 'compare'
  | 'calculate_mortgage'
  | 'check_commute'
  | 'view_schools'
  | 'neighborhood_report'
  | 'share'
  | 'contact_agent'
  | 'make_offer'
  | 'request_info'
  | 'virtual_tour'
  | 'price_history'
  | 'similar_homes';

export interface SuggestedAction {
  id: string;
  action: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  type: ActionType;
  cta: string;
}

// Pre-defined persona profiles
export const PERSONA_PROFILES: Record<BuyerPersona, PersonaProfile> = {
  first_time_buyer: {
    id: 'first_time_buyer',
    name: 'First-Time Buyer',
    description: 'New to home buying, needs guidance through the process',
    icon: '🏠',
    typical_needs: ['Affordable starter home', 'Low maintenance', 'Good resale value', 'Move-in ready'],
    priority_factors: [
      { factor: 'Price', weight: 95, description: 'Budget is typically tight' },
      { factor: 'Monthly Payment', weight: 90, description: 'Must fit within income' },
      { factor: 'Condition', weight: 85, description: 'Prefer move-in ready' },
      { factor: 'Location', weight: 80, description: 'Commute and safety' },
      { factor: 'Future Value', weight: 75, description: 'Investment potential' },
    ],
    property_types: ['condo', 'townhouse', 'single_family'],
    deal_breakers: ['Major repairs needed', 'HOA over $500/mo', 'Flood zone'],
    nice_to_haves: ['Updated kitchen', 'Parking', 'Outdoor space', 'Storage'],
    questions_to_ask: [
      'What are the total monthly costs including HOA, taxes, insurance?',
      'Are there any known issues or repairs needed?',
      'What improvements have been made recently?',
      'How long has the property been on the market?',
    ],
    financing_considerations: ['FHA loans', 'Down payment assistance', 'First-time buyer programs'],
  },
  growing_family: {
    id: 'growing_family',
    name: 'Growing Family',
    description: 'Needs more space for children, focuses on schools and safety',
    icon: '👨‍👩‍👧‍👦',
    typical_needs: ['More bedrooms', 'Good schools', 'Safe neighborhood', 'Yard space'],
    priority_factors: [
      { factor: 'School District', weight: 95, description: 'Top priority for families' },
      { factor: 'Safety', weight: 95, description: 'Low crime area' },
      { factor: 'Space', weight: 90, description: 'Room to grow' },
      { factor: 'Yard', weight: 85, description: 'Outdoor play area' },
      { factor: 'Storage', weight: 80, description: 'Kids have lots of stuff' },
    ],
    property_types: ['single_family', 'townhouse'],
    deal_breakers: ['Poor schools', 'Busy street', 'No yard', 'Pool (safety concern)'],
    nice_to_haves: ['Playroom', 'Finished basement', 'Multiple bathrooms', 'Cul-de-sac'],
    questions_to_ask: [
      'What are the school ratings and boundaries?',
      'Are there other families with children in the neighborhood?',
      'What is the crime rate in this area?',
      'Is the backyard fenced?',
    ],
    financing_considerations: ['Conventional loans', 'Room for budget flexibility'],
  },
  investor: {
    id: 'investor',
    name: 'Real Estate Investor',
    description: 'Focused on ROI, cash flow, and appreciation potential',
    icon: '📈',
    typical_needs: ['Positive cash flow', 'Appreciation potential', 'Low maintenance', 'Good rental market'],
    priority_factors: [
      { factor: 'Cap Rate', weight: 95, description: 'Return on investment' },
      { factor: 'Rental Demand', weight: 90, description: 'Vacancy risk' },
      { factor: 'Price per Sq Ft', weight: 85, description: 'Value assessment' },
      { factor: 'Appreciation', weight: 80, description: 'Long-term growth' },
      { factor: 'Maintenance', weight: 75, description: 'Operating costs' },
    ],
    property_types: ['multi_family', 'single_family', 'condo'],
    deal_breakers: ['Negative cash flow', 'Major deferred maintenance', 'Declining area'],
    nice_to_haves: ['Already rented', 'Below market rent (upside)', 'Multiple units', 'Separate utilities'],
    questions_to_ask: [
      'What is the current rent roll and lease terms?',
      'What are the actual operating expenses?',
      'What is the vacancy history?',
      'Are there any rent control restrictions?',
    ],
    financing_considerations: ['Investment property loans', 'DSCR loans', '1031 exchange'],
  },
  downsizer: {
    id: 'downsizer',
    name: 'Downsizer',
    description: 'Looking to simplify with less space and maintenance',
    icon: '🏡',
    typical_needs: ['Less maintenance', 'Single level', 'Smaller space', 'Accessible'],
    priority_factors: [
      { factor: 'Maintenance', weight: 95, description: 'Want easy upkeep' },
      { factor: 'Accessibility', weight: 90, description: 'Single story preferred' },
      { factor: 'Location', weight: 85, description: 'Near amenities and family' },
      { factor: 'Community', weight: 80, description: 'Active adult communities' },
      { factor: 'Security', weight: 75, description: 'Safe and secure' },
    ],
    property_types: ['condo', 'townhouse', 'single_family'],
    deal_breakers: ['Multiple stories', 'Large yard', 'Far from medical facilities'],
    nice_to_haves: ['HOA maintenance', 'Community amenities', 'Guest room', 'Storage'],
    questions_to_ask: [
      'What does the HOA cover?',
      'Are there age restrictions?',
      'What is the community like?',
      'How close are medical facilities?',
    ],
    financing_considerations: ['Cash purchase common', 'Reverse mortgage eligible', 'Bridge loans'],
  },
  luxury_buyer: {
    id: 'luxury_buyer',
    name: 'Luxury Buyer',
    description: 'Seeking premium properties with high-end finishes and amenities',
    icon: '💎',
    typical_needs: ['Premium location', 'High-end finishes', 'Privacy', 'Unique features'],
    priority_factors: [
      { factor: 'Location', weight: 95, description: 'Premier address' },
      { factor: 'Quality', weight: 95, description: 'Finest materials and craftsmanship' },
      { factor: 'Privacy', weight: 90, description: 'Exclusive and secure' },
      { factor: 'Views', weight: 85, description: 'Spectacular vistas' },
      { factor: 'Amenities', weight: 80, description: 'Pool, theater, wine cellar' },
    ],
    property_types: ['single_family', 'condo', 'estate'],
    deal_breakers: ['Builder grade finishes', 'No privacy', 'Dated design'],
    nice_to_haves: ['Smart home', 'Chef kitchen', 'Home theater', 'Wine cellar', 'Pool'],
    questions_to_ask: [
      'Who was the architect/builder?',
      'What smart home features are included?',
      'What is the HOA and what does it include?',
      'Are there any deed restrictions?',
    ],
    financing_considerations: ['Jumbo loans', 'Private banking', 'Cash common'],
  },
  relocator: {
    id: 'relocator',
    name: 'Relocator',
    description: 'Moving to a new area, needs neighborhood insights',
    icon: '✈️',
    typical_needs: ['Area orientation', 'Commute information', 'Neighborhood comparison', 'Local insights'],
    priority_factors: [
      { factor: 'Commute', weight: 95, description: 'Access to work' },
      { factor: 'Neighborhood', weight: 90, description: 'Right fit for lifestyle' },
      { factor: 'Value', weight: 85, description: 'Fair price for area' },
      { factor: 'Amenities', weight: 80, description: 'Nearby services and activities' },
      { factor: 'Community', weight: 75, description: 'Social fit' },
    ],
    property_types: ['single_family', 'condo', 'townhouse'],
    deal_breakers: ['Long commute', 'Isolated location', 'Limited services'],
    nice_to_haves: ['Move-in ready', 'Near similar demographics', 'Good restaurants', 'Recreation'],
    questions_to_ask: [
      'What is the commute like at rush hour?',
      'What are the best neighborhoods for my lifestyle?',
      'What should I know about the local market?',
      'Are there relocation services available?',
    ],
    financing_considerations: ['Relocation assistance', 'Bridge loans', 'Employer programs'],
  },
  retiree: {
    id: 'retiree',
    name: 'Retiree',
    description: 'Planning for retirement living with focus on lifestyle',
    icon: '🌴',
    typical_needs: ['Low maintenance', 'Active community', 'Healthcare access', 'Climate'],
    priority_factors: [
      { factor: 'Healthcare', weight: 95, description: 'Near medical facilities' },
      { factor: 'Climate', weight: 90, description: 'Preferred weather' },
      { factor: 'Maintenance', weight: 90, description: 'Easy upkeep' },
      { factor: 'Community', weight: 85, description: 'Social activities' },
      { factor: 'Cost of Living', weight: 80, description: 'Fixed income considerations' },
    ],
    property_types: ['condo', 'townhouse', 'single_family'],
    deal_breakers: ['Far from healthcare', 'High maintenance', 'Isolated'],
    nice_to_haves: ['55+ community', 'Golf course', 'Pool', 'Clubhouse', 'Single story'],
    questions_to_ask: [
      'What are the age requirements?',
      'What activities are available?',
      'How close is the nearest hospital?',
      'What is the monthly cost all-in?',
    ],
    financing_considerations: ['Cash common', 'Reverse mortgage', 'Fixed income friendly'],
  },
  vacation_home: {
    id: 'vacation_home',
    name: 'Vacation Home Buyer',
    description: 'Looking for a getaway property, possibly with rental potential',
    icon: '🏖️',
    typical_needs: ['Location appeal', 'Rental potential', 'Low maintenance', 'Furnished option'],
    priority_factors: [
      { factor: 'Location', weight: 95, description: 'Desirable destination' },
      { factor: 'Rental Income', weight: 85, description: 'Offset costs' },
      { factor: 'Maintenance', weight: 80, description: 'Remote management' },
      { factor: 'Amenities', weight: 75, description: 'Recreation access' },
      { factor: 'Appreciation', weight: 70, description: 'Investment value' },
    ],
    property_types: ['condo', 'single_family', 'cabin'],
    deal_breakers: ['HOA rental restrictions', 'High maintenance', 'Poor accessibility'],
    nice_to_haves: ['Water view', 'Pool access', 'Furnished', 'Property management'],
    questions_to_ask: [
      'What are the rental restrictions?',
      'What is the rental income potential?',
      'Is there property management available?',
      'What are the seasonal considerations?',
    ],
    financing_considerations: ['Second home loans', 'Investment property rates', 'HELOC'],
  },
  fixer_upper: {
    id: 'fixer_upper',
    name: 'Fixer-Upper Buyer',
    description: 'Looking for value through renovation potential',
    icon: '🔨',
    typical_needs: ['Below market price', 'Good bones', 'Renovation potential', 'Equity opportunity'],
    priority_factors: [
      { factor: 'Price vs ARV', weight: 95, description: 'Profit potential' },
      { factor: 'Structure', weight: 90, description: 'Sound foundation and bones' },
      { factor: 'Location', weight: 85, description: 'Neighborhood supports value' },
      { factor: 'Scope', weight: 80, description: 'Manageable renovation' },
      { factor: 'Permits', weight: 75, description: 'Renovation friendly area' },
    ],
    property_types: ['single_family', 'multi_family'],
    deal_breakers: ['Foundation issues', 'Mold', 'Location limits value', 'Permit issues'],
    nice_to_haves: ['Cosmetic only', 'Good layout', 'Expansion potential', 'Motivated seller'],
    questions_to_ask: [
      'What is the after-repair value?',
      'Are there any structural issues?',
      'What permits will be required?',
      'Why is the seller selling?',
    ],
    financing_considerations: ['FHA 203k', 'Renovation loans', 'Hard money', 'HELOC'],
  },
};

// Search intent configurations
export const SEARCH_INTENTS: Record<SearchIntent, { label: string; description: string; actions: ActionType[] }> = {
  find_home: {
    label: 'Find My Home',
    description: 'Search for properties matching your criteria',
    actions: ['schedule_tour', 'save_property', 'compare', 'contact_agent'],
  },
  compare_properties: {
    label: 'Compare Properties',
    description: 'Side-by-side comparison of selected homes',
    actions: ['compare', 'calculate_mortgage', 'save_property'],
  },
  check_affordability: {
    label: 'Check Affordability',
    description: 'See what you can afford and monthly payments',
    actions: ['calculate_mortgage', 'contact_agent', 'request_info'],
  },
  explore_neighborhood: {
    label: 'Explore Neighborhoods',
    description: 'Learn about different areas and communities',
    actions: ['neighborhood_report', 'check_commute', 'view_schools'],
  },
  investment_analysis: {
    label: 'Investment Analysis',
    description: 'Analyze properties for investment potential',
    actions: ['calculate_mortgage', 'price_history', 'similar_homes'],
  },
  schedule_tour: {
    label: 'Schedule Tours',
    description: 'Book property viewings',
    actions: ['schedule_tour', 'virtual_tour', 'contact_agent'],
  },
  get_preapproved: {
    label: 'Get Pre-Approved',
    description: 'Start the mortgage pre-approval process',
    actions: ['contact_agent', 'request_info'],
  },
};
