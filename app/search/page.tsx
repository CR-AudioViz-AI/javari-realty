'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, MapPin, Bed, Bath, Square, DollarSign, Home, 
  Heart, Share2, SlidersHorizontal, X, Sparkles, 
  ChevronDown, Map, List, Grid, Star, Trees, AlertCircle
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
  property_type: string;
  status: string;
  images?: string[];
  days_on_market?: number;
  price_per_sqft?: number;
}

interface SearchFilters {
  query: string;
  cities: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minBeds: number | null;
  minBaths: number | null;
  minSqft: number | null;
  maxSqft: number | null;
  propertyTypes: string[];
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'sqft' | 'beds';
}

const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single Family', icon: '🏠' },
  { value: 'condo', label: 'Condo', icon: '🏢' },
  { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
  { value: 'land', label: 'Land', icon: '🌳' },
];

const AI_SEARCH_EXAMPLES = [
  "3 bedroom house under $500k with pool",
  "Waterfront condo near downtown",
  "Family home with good schools nearby",
  "Modern kitchen, open floor plan",
];

export default function SearchPage() {
  const supabase = createClient();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    cities: [],
    minPrice: null,
    maxPrice: null,
    minBeds: null,
    minBaths: null,
    minSqft: null,
    maxSqft: null,
    propertyTypes: [],
    sortBy: 'newest',
  });

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
        setFilters(prev => ({ ...prev, ...data.filters, query }));
        if (data.suggestion) setAiSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setAiProcessing(false);
    }
  };

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('properties').select('*', { count: 'exact' }).eq('status', 'active');
      if (filters.minPrice) query = query.gte('price', filters.minPrice);
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
      if (filters.minBeds) query = query.gte('bedrooms', filters.minBeds);
      if (filters.minBaths) query = query.gte('bathrooms', filters.minBaths);
      if (filters.minSqft) query = query.gte('square_feet', filters.minSqft);
      if (filters.maxSqft) query = query.lte('square_feet', filters.maxSqft);
      if (filters.propertyTypes.length > 0) query = query.in('property_type', filters.propertyTypes);
      
      switch (filters.sortBy) {
        case 'price_asc': query = query.order('price', { ascending: true }); break;
        case 'price_desc': query = query.order('price', { ascending: false }); break;
        case 'newest': query = query.order('created_at', { ascending: false }); break;
        case 'sqft': query = query.order('square_feet', { ascending: false }); break;
        case 'beds': query = query.order('bedrooms', { ascending: false }); break;
      }

      const { data, count, error } = await query.limit(50);
      if (error) throw error;
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

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) newFavorites.delete(propertyId);
      else newFavorites.add(propertyId);
      return newFavorites;
    });
  };

  const clearFilters = () => {
    setFilters({ query: '', cities: [], minPrice: null, maxPrice: null, minBeds: null, minBaths: null, minSqft: null, maxSqft: null, propertyTypes: [], sortBy: 'newest' });
    setAiSuggestion('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Find Your Perfect Home</h1>
          <p className="text-blue-200 text-center mb-8">AI-powered search • {totalCount.toLocaleString()} properties</p>
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex-1 flex items-center">
                <Sparkles className="w-5 h-5 text-blue-500 ml-4" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') processAISearch(filters.query); }}
                  placeholder="Try: '3 bed house under $500k with pool'"
                  className="flex-1 px-4 py-4 text-gray-800 text-lg focus:outline-none"
                />
                {filters.query && (
                  <button onClick={clearFilters} className="p-2 hover:bg-gray-100 rounded-full mr-2">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              <button onClick={() => processAISearch(filters.query)} disabled={aiProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-semibold disabled:bg-blue-400">
                {aiProcessing ? 'Searching...' : 'Search'}
              </button>
            </div>
            {aiSuggestion && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-800 text-sm flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5" /><span>{aiSuggestion}</span>
              </div>
            )}
            {!filters.query && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {AI_SEARCH_EXAMPLES.map((example, i) => (
                  <button key={i} onClick={() => { setFilters(prev => ({ ...prev, query: example })); processAISearch(example); }}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-full">{example}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
              <SlidersHorizontal className="w-4 h-4" /><span>Filters</span>
            </button>
            {(filters.minPrice || filters.maxPrice || filters.minBeds || filters.propertyTypes.length > 0) && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                <X className="w-4 h-4" />Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('map')} className={`p-2 rounded ${viewMode === 'map' ? 'bg-white shadow' : ''}`}><Map className="w-4 h-4" /></button>
            </div>
            <select value={filters.sortBy} onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="sqft">Largest</option>
            </select>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border-b shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <div className="flex gap-1">
                {[null, 1, 2, 3, 4, 5].map((num) => (
                  <button key={num ?? 'any'} onClick={() => setFilters(prev => ({ ...prev, minBeds: num }))}
                    className={`flex-1 py-2 text-sm rounded-lg border ${filters.minBeds === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}>
                    {num ?? 'Any'}{num && '+'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <div className="flex gap-1">
                {[null, 1, 2, 3, 4].map((num) => (
                  <button key={num ?? 'any'} onClick={() => setFilters(prev => ({ ...prev, minBaths: num }))}
                    className={`flex-1 py-2 text-sm rounded-lg border ${filters.minBaths === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}>
                    {num ?? 'Any'}{num && '+'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minSqft || ''} onChange={(e) => setFilters(prev => ({ ...prev, minSqft: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                <input type="number" placeholder="Max" value={filters.maxSqft || ''} onChange={(e) => setFilters(prev => ({ ...prev, maxSqft: e.target.value ? Number(e.target.value) : null }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-gray-600 mb-4"><span className="font-semibold text-gray-900">{totalCount.toLocaleString()}</span> properties found</p>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <button onClick={clearFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <a key={property.id} href={`/property/${property.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  {property.images?.[0] ? (
                    <img src={property.images[0]} alt={property.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Home className="w-12 h-12 text-gray-400" /></div>
                  )}
                  {property.days_on_market && property.days_on_market <= 3 && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
                  )}
                  <button onClick={(e) => { e.preventDefault(); toggleFavorite(property.id); }}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white">
                    <Heart className={`w-5 h-5 ${favorites.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-lg">
                    <span className="text-lg font-bold text-gray-900">${property.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{property.address}</h3>
                  <p className="text-gray-600 text-sm truncate">{property.city}, {property.state} {property.zip_code}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms} bed</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms} bath</span>
                    <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.square_feet?.toLocaleString()} sqft</span>
                  </div>
                  {property.price_per_sqft && <p className="text-xs text-gray-500 mt-2">${property.price_per_sqft}/sqft</p>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
