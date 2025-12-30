// =============================================================================
// ENHANCED PROPERTY INTELLIGENCE CARD WITH TRUST LAYERS
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:22 PM EST
// Displays comprehensive property data with visual trust indicators
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  MapPin,
  Droplets,
  Wind,
  GraduationCap,
  Users,
  Wifi,
  Sun,
  Utensils,
  ShoppingCart,
  Heart,
  Trees,
  Train,
  TrendingUp,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TrustBadge, TrustedValue } from '@/components/trust/TrustBadge';
import { PropertyIntelligence, TrustedData } from '@/types/property-intelligence';

interface PropertyIntelligenceCardProps {
  address?: string;
  lat?: number;
  lng?: number;
  propertyId?: string;
  initialData?: PropertyIntelligence;
  showAllSections?: boolean;
  className?: string;
}

export function PropertyIntelligenceCardWithTrust({
  address,
  lat,
  lng,
  propertyId,
  initialData,
  showAllSections = false,
  className = '',
}: PropertyIntelligenceCardProps) {
  const [data, setData] = useState<PropertyIntelligence | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(showAllSections ? ['environmental', 'location', 'amenities'] : ['environmental'])
  );

  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [address, lat, lng, propertyId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (address) params.set('address', address);
      if (lat) params.set('lat', lat.toString());
      if (lng) params.set('lng', lng.toString());
      if (propertyId) params.set('property_id', propertyId);

      const response = await fetch(`/api/property-intelligence/orchestrate?${params}`);
      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to load property intelligence');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading property intelligence...</p>
          <p className="text-sm text-gray-400">Aggregating data from multiple sources</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="text-gray-900 font-medium">Unable to Load Data</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">Property Intelligence</h2>
              <p className="text-blue-100 text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {data.address.value}
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 divide-x border-b">
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{data.total_data_points}</p>
          <p className="text-xs text-gray-500">Data Points</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{data.average_confidence}%</p>
          <p className="text-xs text-gray-500">Avg. Confidence</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{data.data_completeness}%</p>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      {/* Environmental Section */}
      <Section
        title="Environmental Data"
        icon={<Droplets className="h-5 w-5" />}
        isExpanded={expandedSections.has('environmental')}
        onToggle={() => toggleSection('environmental')}
      >
        <div className="grid md:grid-cols-3 gap-4">
          {/* Flood Zone */}
          <DataCard
            icon={<Droplets className="h-5 w-5 text-blue-600" />}
            title="Flood Zone"
            trust={data.environmental.flood_zone.trust}
          >
            <p className="text-xl font-bold text-gray-900">
              Zone {data.environmental.flood_zone.value.zone}
            </p>
            <p className="text-sm text-gray-600">
              {data.environmental.flood_zone.value.zone_description}
            </p>
            <p className={`text-sm mt-1 ${
              data.environmental.flood_zone.value.insurance_required 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {data.environmental.flood_zone.value.insurance_required 
                ? '⚠️ Flood insurance required' 
                : '✓ Flood insurance not required'}
            </p>
          </DataCard>

          {/* Air Quality */}
          <DataCard
            icon={<Wind className="h-5 w-5 text-green-600" />}
            title="Air Quality"
            trust={data.environmental.air_quality.trust}
          >
            <p className="text-xl font-bold text-gray-900">
              AQI: {data.environmental.air_quality.value.aqi}
            </p>
            <p className="text-sm text-gray-600">
              {data.environmental.air_quality.value.category}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Primary pollutant: {data.environmental.air_quality.value.pollutant}
            </p>
          </DataCard>

          {/* Earthquake Risk */}
          <DataCard
            icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
            title="Earthquake Risk"
            trust={data.environmental.earthquake_risk.trust}
          >
            <p className="text-xl font-bold text-gray-900 capitalize">
              {data.environmental.earthquake_risk.value.risk_level} Risk
            </p>
            <p className="text-sm text-gray-600">
              {data.environmental.earthquake_risk.value.recent_events} recent events nearby
            </p>
          </DataCard>
        </div>
      </Section>

      {/* Location Intelligence Section */}
      <Section
        title="Location Intelligence"
        icon={<MapPin className="h-5 w-5" />}
        isExpanded={expandedSections.has('location')}
        onToggle={() => toggleSection('location')}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Walkability */}
          <DataCard
            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
            title="Walk Score"
            trust={data.location.walkability.trust}
          >
            <p className="text-3xl font-bold text-gray-900">
              {data.location.walkability.value.walk_score}
            </p>
            <p className="text-sm text-gray-600">
              {data.location.walkability.value.walk_description}
            </p>
            {data.location.walkability.value.bike_score && (
              <p className="text-sm text-gray-500 mt-1">
                🚴 Bike Score: {data.location.walkability.value.bike_score}
              </p>
            )}
            {data.location.walkability.value.transit_score && (
              <p className="text-sm text-gray-500">
                🚌 Transit Score: {data.location.walkability.value.transit_score}
              </p>
            )}
          </DataCard>

          {/* Demographics */}
          <DataCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            title="Demographics"
            trust={data.location.demographics.trust}
          >
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Population:</span> <span className="font-medium">{data.location.demographics.value.population.toLocaleString()}</span></p>
              <p><span className="text-gray-500">Median Age:</span> <span className="font-medium">{data.location.demographics.value.median_age}</span></p>
              <p><span className="text-gray-500">Median Income:</span> <span className="font-medium">${data.location.demographics.value.median_income.toLocaleString()}</span></p>
              <p><span className="text-gray-500">Owner Occupied:</span> <span className="font-medium">{data.location.demographics.value.owner_occupied_pct}%</span></p>
            </div>
          </DataCard>

          {/* Broadband */}
          <DataCard
            icon={<Wifi className="h-5 w-5 text-cyan-600" />}
            title="Internet"
            trust={data.location.broadband.trust}
          >
            <p className="text-xl font-bold text-gray-900">
              {data.location.broadband.value.max_download_speed} Mbps
            </p>
            <p className="text-sm text-gray-600">
              {data.location.broadband.value.providers} providers available
            </p>
            <p className={`text-sm mt-1 ${
              data.location.broadband.value.fiber_available 
                ? 'text-green-600' 
                : 'text-gray-500'
            }`}>
              {data.location.broadband.value.fiber_available 
                ? '✓ Fiber available' 
                : '○ No fiber'}
            </p>
          </DataCard>

          {/* Weather */}
          <DataCard
            icon={<Sun className="h-5 w-5 text-yellow-600" />}
            title="Current Weather"
            trust={data.location.weather.trust}
          >
            <p className="text-xl font-bold text-gray-900">
              {data.location.weather.value.current_temp}°F
            </p>
            <p className="text-sm text-gray-600">
              {data.location.weather.value.condition}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              H: {data.location.weather.value.forecast_high}° L: {data.location.weather.value.forecast_low}°
            </p>
          </DataCard>

          {/* Fair Market Rent */}
          <DataCard
            icon={<Home className="h-5 w-5 text-indigo-600" />}
            title="Fair Market Rent"
            trust={data.location.fair_market_rent.trust}
          >
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">1BR:</span> <span className="font-medium">${data.location.fair_market_rent.value.one_bedroom.toLocaleString()}</span></p>
              <p><span className="text-gray-500">2BR:</span> <span className="font-medium">${data.location.fair_market_rent.value.two_bedroom.toLocaleString()}</span></p>
              <p><span className="text-gray-500">3BR:</span> <span className="font-medium">${data.location.fair_market_rent.value.three_bedroom.toLocaleString()}</span></p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              FY {data.location.fair_market_rent.value.year}
            </p>
          </DataCard>

          {/* Schools */}
          <DataCard
            icon={<GraduationCap className="h-5 w-5 text-emerald-600" />}
            title="Nearby Schools"
            trust={data.location.schools.trust}
            className="md:col-span-2 lg:col-span-1"
          >
            {data.location.schools.value.length > 0 ? (
              <div className="space-y-2">
                {data.location.schools.value.slice(0, 3).map((school, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium text-gray-900">{school.name}</p>
                    <p className="text-gray-500">
                      {school.type} • {school.distance_miles.toFixed(1)} mi
                      {school.rating && ` • ⭐ ${school.rating}`}
                    </p>
                  </div>
                ))}
                {data.location.schools.value.length > 3 && (
                  <p className="text-xs text-blue-600">
                    +{data.location.schools.value.length - 3} more schools
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No schools data available</p>
            )}
          </DataCard>
        </div>
      </Section>

      {/* Amenities Section */}
      <Section
        title="Nearby Amenities"
        icon={<ShoppingCart className="h-5 w-5" />}
        isExpanded={expandedSections.has('amenities')}
        onToggle={() => toggleSection('amenities')}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AmenityCard
            icon={<Utensils className="h-5 w-5 text-orange-600" />}
            title="Restaurants"
            data={data.amenities.restaurants}
          />
          <AmenityCard
            icon={<ShoppingCart className="h-5 w-5 text-green-600" />}
            title="Grocery"
            data={data.amenities.grocery}
          />
          <AmenityCard
            icon={<Heart className="h-5 w-5 text-red-600" />}
            title="Healthcare"
            data={data.amenities.healthcare}
          />
          <AmenityCard
            icon={<Trees className="h-5 w-5 text-emerald-600" />}
            title="Parks"
            data={data.amenities.parks}
          />
          <AmenityCard
            icon={<Train className="h-5 w-5 text-blue-600" />}
            title="Transit"
            data={data.amenities.transit}
          />
        </div>
      </Section>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
        <span>Generated: {new Date(data.generated_at).toLocaleString()}</span>
        <span>Data from {new Set([
          data.environmental.flood_zone.trust.source,
          data.environmental.air_quality.trust.source,
          data.location.walkability.trust.source,
          data.location.demographics.trust.source,
        ]).size}+ verified sources</span>
      </div>
    </div>
  );
}

// Helper Components
function Section({ 
  title, 
  icon, 
  children, 
  isExpanded, 
  onToggle 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-6 pb-6"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

function DataCard({ 
  icon, 
  title, 
  trust, 
  children,
  className = ''
}: { 
  icon: React.ReactNode; 
  title: string; 
  trust: TrustedData<unknown>['trust'];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-700">{title}</span>
        </div>
        <TrustBadge trust={trust} size="sm" />
      </div>
      {children}
    </div>
  );
}

function AmenityCard({ 
  icon, 
  title, 
  data 
}: { 
  icon: React.ReactNode; 
  title: string; 
  data: TrustedData<Array<{ name: string; distance_miles: number; rating?: number }>>
}) {
  return (
    <DataCard icon={icon} title={title} trust={data.trust}>
      {data.value.length > 0 ? (
        <div className="space-y-2">
          {data.value.slice(0, 3).map((item, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-gray-500">
                {item.distance_miles.toFixed(1)} mi
                {item.rating && ` • ⭐ ${item.rating.toFixed(1)}`}
              </p>
            </div>
          ))}
          {data.value.length > 3 && (
            <p className="text-xs text-blue-600">+{data.value.length - 3} more</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No data available</p>
      )}
    </DataCard>
  );
}

export default PropertyIntelligenceCardWithTrust;
