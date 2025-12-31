'use client';

import React, { useState, useMemo } from 'react';
import { PropertyWithScore, FactorScore } from '@/types/scoring';
import Image from 'next/image';

interface PropertyComparisonProps {
  properties: PropertyWithScore[];
  onRemoveProperty?: (propertyId: string) => void;
  maxProperties?: number;
}

export function PropertyComparison({ 
  properties, 
  onRemoveProperty,
  maxProperties = 6 
}: PropertyComparisonProps) {
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'sqft'>('score');
  const [highlightFactor, setHighlightFactor] = useState<string | null>(null);

  // Get all unique factors across properties
  const allFactors = useMemo(() => {
    const factorMap = new Map<string, { id: string; name: string; category: string }>();
    properties.forEach(p => {
      p.score.factor_scores.forEach(f => {
        if (!factorMap.has(f.factor_id)) {
          factorMap.set(f.factor_id, {
            id: f.factor_id,
            name: f.factor_name,
            category: getCategoryFromFactorId(f.factor_id),
          });
        }
      });
    });
    return Array.from(factorMap.values());
  }, [properties]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];
    switch (sortBy) {
      case 'score':
        return sorted.sort((a, b) => b.score.total_score - a.score.total_score);
      case 'price':
        return sorted.sort((a, b) => a.property.price - b.property.price);
      case 'sqft':
        return sorted.sort((a, b) => (b.property.sqft || 0) - (a.property.sqft || 0));
      default:
        return sorted;
    }
  }, [properties, sortBy]);

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties to Compare</h3>
        <p className="text-gray-600">
          Save some properties to your favorites to start comparing them side-by-side.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Property Comparison</h2>
          <p className="text-sm text-gray-600">
            Comparing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="score">Best Match</option>
              <option value="price">Lowest Price</option>
              <option value="sqft">Largest</option>
            </select>
          </label>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Property Headers */}
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left bg-gray-50 sticky left-0 z-10 min-w-[200px]">
                <span className="text-gray-500 font-medium">Factor</span>
              </th>
              {sortedProperties.slice(0, maxProperties).map((p, index) => (
                <th key={p.property.id} className="p-4 min-w-[200px]">
                  <div className="relative">
                    {/* Rank Badge */}
                    <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    
                    {/* Property Image */}
                    <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                      {p.property.images?.[0] ? (
                        <Image
                          src={p.property.images[0]}
                          alt={p.property.address}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                          🏠
                        </div>
                      )}
                      {onRemoveProperty && (
                        <button
                          onClick={() => onRemoveProperty(p.property.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Property Info */}
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 truncate">{p.property.address}</p>
                      <p className="text-sm text-gray-600">{p.property.city}, {p.property.state}</p>
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        ${p.property.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {p.property.beds} bed • {p.property.baths} bath • {p.property.sqft?.toLocaleString()} sqft
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Total Score Row */}
            <tr className="border-b bg-indigo-50">
              <td className="p-4 sticky left-0 bg-indigo-50 z-10">
                <span className="font-bold text-indigo-900">🎯 TOTAL SCORE</span>
              </td>
              {sortedProperties.slice(0, maxProperties).map(p => (
                <td key={p.property.id} className="p-4 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${
                    p.score.total_score >= 80 ? 'bg-green-500 text-white' :
                    p.score.total_score >= 60 ? 'bg-yellow-500 text-white' :
                    p.score.total_score >= 40 ? 'bg-orange-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {p.score.total_score}
                  </div>
                </td>
              ))}
            </tr>

            {/* Factor Rows */}
            {allFactors.map(factor => (
              <tr 
                key={factor.id} 
                className={`border-b hover:bg-gray-50 transition-colors ${
                  highlightFactor === factor.id ? 'bg-yellow-50' : ''
                }`}
                onMouseEnter={() => setHighlightFactor(factor.id)}
                onMouseLeave={() => setHighlightFactor(null)}
              >
                <td className="p-4 sticky left-0 bg-white z-10 border-r">
                  <div>
                    <span className="font-medium text-gray-900">{factor.name}</span>
                    <span className="text-xs text-gray-500 block">{factor.category}</span>
                  </div>
                </td>
                {sortedProperties.slice(0, maxProperties).map(p => {
                  const factorScore = p.score.factor_scores.find(f => f.factor_id === factor.id);
                  return (
                    <td key={p.property.id} className="p-4 text-center">
                      {factorScore ? (
                        <FactorScoreCell score={factorScore} />
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>Excellent (8-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span>Good (5-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span>Poor (0-4)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactorScoreCell({ score }: { score: FactorScore }) {
  const getScoreColor = (normalized: number) => {
    if (normalized >= 8) return 'bg-green-100 text-green-800 border-green-200';
    if (normalized >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const formatValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (typeof value === 'number') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return value.toLocaleString();
      return value;
    }
    return value;
  };

  return (
    <div className="space-y-1">
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded border ${getScoreColor(score.normalized_score)}`}>
        <span className="font-bold">{score.normalized_score}</span>
        <span className="text-xs opacity-70">/10</span>
      </div>
      <div className="text-xs text-gray-500">
        {formatValue(score.raw_value)}
      </div>
    </div>
  );
}

function getCategoryFromFactorId(factorId: string): string {
  const categoryMap: Record<string, string> = {
    commute_time: 'Location',
    walk_score: 'Location',
    transit_score: 'Location',
    bike_score: 'Location',
    price_vs_budget: 'Financial',
    hoa_fee: 'Financial',
    rental_estimate: 'Financial',
    appreciation: 'Financial',
    sqft: 'Property',
    bedrooms: 'Property',
    bathrooms: 'Property',
    lot_size: 'Property',
    year_built: 'Property',
    garage: 'Property',
    pool: 'Amenities',
    crime_score: 'Safety',
    flood_risk: 'Safety',
    fire_risk: 'Safety',
    school_rating: 'Schools',
    school_distance: 'Schools',
    air_quality: 'Environment',
    noise_level: 'Environment',
    internet_speed: 'Lifestyle',
  };
  return categoryMap[factorId] || 'Other';
}

export default PropertyComparison;
