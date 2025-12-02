'use client';

import { useState, useEffect } from 'react';
import { 
  School, ShieldCheck, Trees, Car, Coffee, ShoppingBag,
  Dumbbell, Hospital, Church, Dog, Utensils, Train,
  TrendingUp, TrendingDown, Minus, MapPin, Star,
  ChevronDown, ChevronUp, ExternalLink, Info
} from 'lucide-react';

interface NeighborhoodData {
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
  crimeGrade?: string;
  schoolRatings?: {
    elementary: number;
    middle: number;
    high: number;
  };
  nearbySchools?: Array<{
    name: string;
    type: 'elementary' | 'middle' | 'high' | 'private';
    rating: number;
    distance: string;
  }>;
  demographics?: {
    medianAge: number;
    medianIncome: number;
    population: number;
    populationGrowth: number;
  };
  amenities?: Array<{
    category: string;
    count: number;
    examples: string[];
  }>;
  marketTrends?: {
    medianPrice: number;
    priceChange: number;
    daysOnMarket: number;
    inventoryLevel: 'low' | 'normal' | 'high';
  };
}

interface NeighborhoodDataProps {
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
}

const AMENITY_ICONS: Record<string, any> = {
  restaurants: Utensils,
  groceries: ShoppingBag,
  coffee: Coffee,
  fitness: Dumbbell,
  parks: Trees,
  healthcare: Hospital,
  transit: Train,
  'dog parks': Dog,
  churches: Church,
};

export default function NeighborhoodData({
  address,
  city,
  state,
  zip,
  latitude,
  longitude,
}: NeighborhoodDataProps) {
  const [data, setData] = useState<NeighborhoodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['scores', 'schools'])
  );

  useEffect(() => {
    fetchNeighborhoodData();
  }, [address, city, state, zip]);

  const fetchNeighborhoodData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/neighborhood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, city, state, zip, latitude, longitude }),
      });

      if (!response.ok) throw new Error('Failed to fetch neighborhood data');

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Unable to load neighborhood data');
      console.error('Neighborhood data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{error}</p>
          <button
            onClick={fetchNeighborhoodData}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Neighborhood Overview
        </h3>
        <p className="text-sm text-gray-600 mt-1">{city}, {state} {zip}</p>
      </div>

      {/* Walk/Transit/Bike Scores */}
      <div className="p-6 border-b">
        <button
          onClick={() => toggleSection('scores')}
          className="w-full flex items-center justify-between mb-4"
        >
          <h4 className="font-medium">Location Scores</h4>
          {expandedSections.has('scores') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.has('scores') && (
          <div className="grid grid-cols-3 gap-4">
            {/* Walk Score */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold mb-2 ${getScoreColor(data?.walkScore || 0)}`}>
                {data?.walkScore || 'N/A'}
              </div>
              <p className="font-medium text-gray-900">Walk Score®</p>
              <p className="text-xs text-gray-500 mt-1">
                {(data?.walkScore || 0) >= 90 ? "Walker's Paradise" :
                 (data?.walkScore || 0) >= 70 ? 'Very Walkable' :
                 (data?.walkScore || 0) >= 50 ? 'Somewhat Walkable' : 'Car-Dependent'}
              </p>
            </div>

            {/* Transit Score */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold mb-2 ${getScoreColor(data?.transitScore || 0)}`}>
                {data?.transitScore || 'N/A'}
              </div>
              <p className="font-medium text-gray-900">Transit Score®</p>
              <p className="text-xs text-gray-500 mt-1">
                {(data?.transitScore || 0) >= 90 ? "Rider's Paradise" :
                 (data?.transitScore || 0) >= 70 ? 'Excellent Transit' :
                 (data?.transitScore || 0) >= 50 ? 'Good Transit' : 'Minimal Transit'}
              </p>
            </div>

            {/* Bike Score */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold mb-2 ${getScoreColor(data?.bikeScore || 0)}`}>
                {data?.bikeScore || 'N/A'}
              </div>
              <p className="font-medium text-gray-900">Bike Score®</p>
              <p className="text-xs text-gray-500 mt-1">
                {(data?.bikeScore || 0) >= 90 ? "Biker's Paradise" :
                 (data?.bikeScore || 0) >= 70 ? 'Very Bikeable' :
                 (data?.bikeScore || 0) >= 50 ? 'Bikeable' : 'Somewhat Bikeable'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Schools */}
      <div className="p-6 border-b">
        <button
          onClick={() => toggleSection('schools')}
          className="w-full flex items-center justify-between mb-4"
        >
          <h4 className="font-medium flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            Schools
          </h4>
          {expandedSections.has('schools') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has('schools') && (
          <div className="space-y-3">
            {data?.nearbySchools?.map((school, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{school.type} • {school.distance}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{school.rating}/10</span>
                </div>
              </div>
            ))}
            
            {(!data?.nearbySchools || data.nearbySchools.length === 0) && (
              <p className="text-gray-500 text-sm">School data not available</p>
            )}

            <a
              href={`https://www.greatschools.org/search/search.page?q=${encodeURIComponent(zip)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline mt-2"
            >
              View all schools on GreatSchools <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Crime & Safety */}
      <div className="p-6 border-b">
        <button
          onClick={() => toggleSection('safety')}
          className="w-full flex items-center justify-between mb-4"
        >
          <h4 className="font-medium flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Crime & Safety
          </h4>
          {expandedSections.has('safety') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has('safety') && (
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getGradeColor(data?.crimeGrade || 'N/A')}`}>
              {data?.crimeGrade || 'N/A'}
            </div>
            <div>
              <p className="font-medium">Crime Grade</p>
              <p className="text-sm text-gray-500">
                {data?.crimeGrade?.startsWith('A') ? 'Very low crime area' :
                 data?.crimeGrade?.startsWith('B') ? 'Low crime area' :
                 data?.crimeGrade?.startsWith('C') ? 'Moderate crime area' : 'Higher crime area'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Nearby Amenities */}
      <div className="p-6 border-b">
        <button
          onClick={() => toggleSection('amenities')}
          className="w-full flex items-center justify-between mb-4"
        >
          <h4 className="font-medium flex items-center gap-2">
            <Coffee className="w-5 h-5 text-orange-600" />
            Nearby Amenities
          </h4>
          {expandedSections.has('amenities') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has('amenities') && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data?.amenities?.map((amenity, i) => {
              const Icon = AMENITY_ICONS[amenity.category.toLowerCase()] || Coffee;
              return (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-sm capitalize">{amenity.category}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{amenity.count}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {amenity.examples.slice(0, 2).join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Market Trends */}
      <div className="p-6">
        <button
          onClick={() => toggleSection('market')}
          className="w-full flex items-center justify-between mb-4"
        >
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Market Trends
          </h4>
          {expandedSections.has('market') ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.has('market') && data?.marketTrends && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Median Price</p>
              <p className="text-xl font-bold text-gray-900">
                ${(data.marketTrends.medianPrice / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Price Change (YoY)</p>
              <p className={`text-xl font-bold flex items-center gap-1 ${
                data.marketTrends.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.marketTrends.priceChange >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {data.marketTrends.priceChange >= 0 ? '+' : ''}{data.marketTrends.priceChange}%
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Avg Days on Market</p>
              <p className="text-xl font-bold text-gray-900">
                {data.marketTrends.daysOnMarket} days
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Inventory</p>
              <p className={`text-xl font-bold capitalize ${
                data.marketTrends.inventoryLevel === 'low' ? 'text-red-600' :
                data.marketTrends.inventoryLevel === 'high' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {data.marketTrends.inventoryLevel}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
