'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Search, MapPin, Bed, Bath, Square, DollarSign, Home, 
  Heart, Share2, SlidersHorizontal, X, Mic, MicOff,
  ChevronDown, ChevronUp, Map, List, Grid, Star,
  Car, School, Trees, ShoppingBag, Coffee, Dumbbell,
  Filter, Sparkles, Clock, TrendingUp, AlertCircle
} from 'lucide-react';

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size?: number;
  year_built?: number;
  property_type: string;
  status: string;
  description?: string;
  features?: string[];
  images?: string[];
  latitude?: number;
  longitude?: number;
  days_on_market?: number;
  price_per_sqft?: number;
  hoa_fee?: number;
  garage_spaces?: number;
  listing_agent_id?: string;
}

interface SearchFilters {
  query: string;
  cities: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minBeds: number | null;
  maxBeds: number | null;
  minBaths: number | null;
  maxBaths: number | null;
  minSqft: number | null;
  maxSqft: number | null;
  propertyTypes: string[];
  features: string[];
  yearBuiltMin: number | null;
  yearBuiltMax: number | null;
  maxHoa: number | null;
  garageSpaces: number | null;
  maxDaysOnMarket: number | null;
  maxCommuteTime: number | null;
  commuteDestination: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'sqft' | 'beds';
}

const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single Family', icon: '🏠' },
  { value: 'condo', label: 'Condo', icon: '🏢' },
  { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
  { value: 'multi_family', label: 'Multi-Family', icon: '🏗️' },
  { value: 'land', label: 'Land', icon: '🌳' },
  { value: 'mobile', label: 'Mobile Home', icon: '🏕️' },
];

const FEATURES = [
  { value: 'pool', label: 'Pool', icon: '🏊' },
  { value: 'waterfront', label: 'Waterfront', icon: '🌊' },
  { value: 'golf', label: 'Golf Course', icon: '⛳' },
  { value: 'gated', label: 'Gated Community', icon: '🔒' },
  { value: 'new_construction', label: 'New Construction', icon: '🆕' },
  { value: 'smart_home', label: 'Smart Home', icon: '📱' },
  { value: 'solar', label: 'Solar Panels', icon: '☀️' },
  { value: 'ev_charger', label: 'EV Charger', icon: '🔌' },
  { value: 'home_office', label: 'Home Office', icon: '💼' },
  { value: 'guest_house', label: 'Guest House', icon: '🏡' },
  { value: 'fireplace', label: 'Fireplace', icon: '🔥' },
  { value: 'hardwood', label: 'Hardwood Floors', icon: '🪵' },
];

const AI_SEARCH_EXAMPLES = [
  "3 bedroom house under $500k in Naples with pool",
  "Waterfront condo near downtown with 2+ baths",
  "Family home with good schools nearby",
  "Investment property with rental income potential",
  "Modern kitchen, open floor plan, 2 car garage",
  "Pet-friendly community with dog park",
  "55+ community with golf course",
  "Fixer-upper under $300k",
];

export default function SearchPage() {
  const supabase = createClientComponentClient();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    cities: [],
    minPrice: null,
    maxPrice: null,
    minBeds: null,
    maxBeds: null,
    minBaths: null,
    maxBaths: null,
    minSqft: null,
    maxSqft: null,
    propertyTypes: [],
    features: [],
    yearBuiltMin: null,
    yearBuiltMax: null,
    maxHoa: null,
    garageSpaces: null,
    maxDaysOnMarket: null,
    maxCommuteTime: null,
    commuteDestination: '',
    sortBy: 'newest',
  });

  // AI-powered natural language search
  const processAISearch = async (query: string) => {
    if (!query.trim()) return;
    
    setAiProcessing(true);
    setAiSuggestion('');
    
    try {
      const response = await fetch('/api/search/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Apply AI-extracted filters
        setFilters(prev => ({
          ...prev,
          ...data.filters,
          query: query,
        }));
        
        if (data.suggestion) {
          setAiSuggestion(data.suggestion);
        }
      }
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setAiProcessing(false);
    }
  };

  // Fetch properties based on filters
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Apply filters
      if (filters.cities.length > 0) {
        query = query.in('city', filters.cities);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.minBeds) {
        query = query.gte('bedrooms', filters.minBeds);
      }
      if (filters.maxBeds) {
        query = query.lte('bedrooms', filters.maxBeds);
      }
      if (filters.minBaths) {
        query = query.gte('bathrooms', filters.minBaths);
      }
      if (filters.maxBaths) {
        query = query.lte('bathrooms', filters.maxBaths);
      }
      if (filters.minSqft) {
        query = query.gte('square_feet', filters.minSqft);
      }
      if (filters.maxSqft) {
        query = query.lte('square_feet', filters.maxSqft);
      }
      if (filters.propertyTypes.length > 0) {
        query = query.in('property_type', filters.propertyTypes);
      }
      if (filters.yearBuiltMin) {
        query = query.gte('year_built', filters.yearBuiltMin);
      }
      if (filters.yearBuiltMax) {
        query = query.lte('year_built', filters.yearBuiltMax);
      }
      if (filters.maxHoa) {
        query = query.lte('hoa_fee', filters.maxHoa);
      }
      if (filters.garageSpaces) {
        query = query.gte('garage_spaces', filters.garageSpaces);
      }
      if (filters.maxDaysOnMarket) {
        query = query.lte('days_on_market', filters.maxDaysOnMarket);
      }

      // Sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'sqft':
          query = query.order('square_feet', { ascending: false });
          break;
        case 'beds':
          query = query.order('bedrooms', { ascending: false });
          break;
      }

      const { data, count, error } = await query.limit(50);

      if (error) throw error;

      // Calculate price per sqft
      const propertiesWithCalc = (data || []).map(p => ({
        ...p,
        price_per_sqft: p.square_feet ? Math.round(p.price / p.square_feet) : null,
      }));

      setProperties(propertiesWithCalc);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, supabase]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Toggle favorite
  const toggleFavorite = async (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
    
    // Save to database if logged in
    // TODO: Implement saved properties API call
  };

  // Save search
  const saveSearch = async () => {
    const searchName = prompt('Name this search:');
    if (!searchName) return;
    
    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: searchName,
          criteria: filters,
          email_alerts: true,
        }),
      });
      
      if (response.ok) {
        alert('Search saved! You\'ll receive email alerts for new matches.');
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      query: '',
      cities: [],
      minPrice: null,
      maxPrice: null,
      minBeds: null,
      maxBeds: null,
      minBaths: null,
      maxBaths: null,
      minSqft: null,
      maxSqft: null,
      propertyTypes: [],
      features: [],
      yearBuiltMin: null,
      yearBuiltMax: null,
      maxHoa: null,
      garageSpaces: null,
      maxDaysOnMarket: null,
      maxCommuteTime: null,
      commuteDestination: '',
      sortBy: 'newest',
    });
    setAiSuggestion('');
  };

  const activeFilterCount = [
    filters.cities.length > 0,
    filters.minPrice || filters.maxPrice,
    filters.minBeds || filters.maxBeds,
    filters.minBaths || filters.maxBaths,
    filters.minSqft || filters.maxSqft,
    filters.propertyTypes.length > 0,
    filters.features.length > 0,
    filters.yearBuiltMin || filters.yearBuiltMax,
    filters.maxHoa,
    filters.garageSpaces,
    filters.maxDaysOnMarket,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            Find Your Perfect Home
          </h1>
          <p className="text-blue-200 text-center mb-8">
            AI-powered search • {totalCount.toLocaleString()} properties available
          </p>

          {/* AI Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex-1 flex items-center">
                <Sparkles className="w-5 h-5 text-blue-500 ml-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      processAISearch(filters.query);
                    }
                  }}
                  placeholder="Try: '3 bed house under $500k with pool' or 'waterfront condo near downtown'"
                  className="flex-1 px-4 py-4 text-gray-800 text-lg focus:outline-none"
                />
                {filters.query && (
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, query: '' }));
                      clearFilters();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full mr-2"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => processAISearch(filters.query)}
                disabled={aiProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-semibold transition-colors disabled:bg-blue-400"
              >
                {aiProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </div>
                )}
              </button>
            </div>

            {/* AI Suggestion */}
            {aiSuggestion && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-800 text-sm flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{aiSuggestion}</span>
              </div>
            )}

            {/* Quick Search Suggestions */}
            {!filters.query && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {AI_SEARCH_EXAMPLES.slice(0, 4).map((example, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, query: example }));
                      processAISearch(example);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-full transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {/* Price */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium whitespace-nowrap">
                  <DollarSign className="w-4 h-4" />
                  {filters.minPrice || filters.maxPrice ? (
                    <span>
                      {filters.minPrice ? `$${(filters.minPrice / 1000).toFixed(0)}k` : 'Any'} - 
                      {filters.maxPrice ? `$${(filters.maxPrice / 1000).toFixed(0)}k` : 'Any'}
                    </span>
                  ) : (
                    <span>Price</span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Beds */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium whitespace-nowrap">
                  <Bed className="w-4 h-4" />
                  {filters.minBeds ? `${filters.minBeds}+ beds` : 'Beds'}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Baths */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium whitespace-nowrap">
                  <Bath className="w-4 h-4" />
                  {filters.minBaths ? `${filters.minBaths}+ baths` : 'Baths'}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Property Type */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium whitespace-nowrap">
                  <Home className="w-4 h-4" />
                  {filters.propertyTypes.length > 0 
                    ? `${filters.propertyTypes.length} type${filters.propertyTypes.length > 1 ? 's' : ''}`
                    : 'Home Type'}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* More Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeFilterCount > 0 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium whitespace-nowrap"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              {/* Save Search */}
              <button
                onClick={saveSearch}
                className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Save Search</span>
              </button>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-white shadow' : ''}`}
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="sqft">Largest</option>
                <option value="beds">Most Bedrooms</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <div className="flex gap-1">
                  {[null, 1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num ?? 'any'}
                      onClick={() => setFilters(prev => ({ ...prev, minBeds: num }))}
                      className={`flex-1 py-2 text-sm rounded-lg border ${
                        filters.minBeds === num
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {num ?? 'Any'}
                      {num && '+'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <div className="flex gap-1">
                  {[null, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num ?? 'any'}
                      onClick={() => setFilters(prev => ({ ...prev, minBaths: num }))}
                      className={`flex-1 py-2 text-sm rounded-lg border ${
                        filters.minBaths === num
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {num ?? 'Any'}
                      {num && '+'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Footage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minSqft || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, minSqft: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxSqft || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxSqft: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Property Types */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          propertyTypes: prev.propertyTypes.includes(type.value)
                            ? prev.propertyTypes.filter(t => t !== type.value)
                            : [...prev.propertyTypes, type.value]
                        }));
                      }}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm ${
                        filters.propertyTypes.includes(type.value)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map((feature) => (
                    <button
                      key={feature.value}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          features: prev.features.includes(feature.value)
                            ? prev.features.filter(f => f !== feature.value)
                            : [...prev.features, feature.value]
                        }));
                      }}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm ${
                        filters.features.includes(feature.value)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span>{feature.icon}</span>
                      <span>{feature.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Built */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.yearBuiltMin || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, yearBuiltMin: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.yearBuiltMax || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, yearBuiltMax: e.target.value ? Number(e.target.value) : null }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Max HOA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max HOA/Month</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={filters.maxHoa || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxHoa: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              {/* Days on Market */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days on Market</label>
                <select
                  value={filters.maxDaysOnMarket || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxDaysOnMarket: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">New Today</option>
                  <option value="3">Last 3 Days</option>
                  <option value="7">Last Week</option>
                  <option value="14">Last 2 Weeks</option>
                  <option value="30">Last Month</option>
                </select>
              </div>

              {/* Garage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Garage Spaces</label>
                <select
                  value={filters.garageSpaces || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, garageSpaces: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{totalCount.toLocaleString()}</span> properties found
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          /* No Results */
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.has(property.id)}
                onToggleFavorite={() => toggleFavorite(property.id)}
              />
            ))}
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {properties.map((property) => (
              <PropertyListItem
                key={property.id}
                property={property}
                isFavorite={favorites.has(property.id)}
                onToggleFavorite={() => toggleFavorite(property.id)}
              />
            ))}
          </div>
        ) : (
          /* Map View Placeholder */
          <div className="bg-gray-200 rounded-xl h-[600px] flex items-center justify-center">
            <div className="text-center">
              <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Map view coming soon</p>
              <p className="text-sm text-gray-500">Integration with Google Maps / Mapbox</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Property Card Component
function PropertyCard({ 
  property, 
  isFavorite, 
  onToggleFavorite 
}: { 
  property: Property; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const imageUrl = property.images?.[0] || '/placeholder-property.jpg';
  
  return (
    <a 
      href={`/property/${property.id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.address}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        {property.days_on_market && property.days_on_market <= 3 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            New
          </span>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        
        {/* Price */}
        <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-lg">
          <span className="text-lg font-bold text-gray-900">
            ${property.price.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{property.address}</h3>
        <p className="text-gray-600 text-sm truncate">{property.city}, {property.state} {property.zip_code}</p>
        
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.bedrooms} bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.bathrooms} bath
          </span>
          <span className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            {property.square_feet?.toLocaleString()} sqft
          </span>
        </div>
        
        {property.price_per_sqft && (
          <p className="text-xs text-gray-500 mt-2">
            ${property.price_per_sqft}/sqft
          </p>
        )}
      </div>
    </a>
  );
}

// Property List Item Component
function PropertyListItem({ 
  property, 
  isFavorite, 
  onToggleFavorite 
}: { 
  property: Property; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const imageUrl = property.images?.[0] || '/placeholder-property.jpg';
  
  return (
    <a 
      href={`/property/${property.id}`}
      className="flex bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Image */}
      <div className="relative w-72 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={property.address}
          className="w-full h-full object-cover"
        />
        {property.days_on_market && property.days_on_market <= 3 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            New
          </span>
        )}
      </div>
      
      {/* Details */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                ${property.price.toLocaleString()}
              </h3>
              <p className="font-medium text-gray-900 mt-1">{property.address}</p>
              <p className="text-gray-600 text-sm">{property.city}, {property.state} {property.zip_code}</p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite();
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart 
                className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </button>
          </div>
          
          <div className="flex items-center gap-6 mt-4 text-gray-600">
            <span className="flex items-center gap-1">
              <Bed className="w-5 h-5" />
              {property.bedrooms} beds
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-5 h-5" />
              {property.bathrooms} baths
            </span>
            <span className="flex items-center gap-1">
              <Square className="w-5 h-5" />
              {property.square_feet?.toLocaleString()} sqft
            </span>
            {property.lot_size && (
              <span className="flex items-center gap-1">
                <Trees className="w-5 h-5" />
                {property.lot_size.toLocaleString()} sqft lot
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            {property.property_type?.replace('_', ' ')} • {property.year_built ? `Built ${property.year_built}` : ''}
          </div>
          {property.price_per_sqft && (
            <div className="text-sm text-gray-500">
              ${property.price_per_sqft}/sqft
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
