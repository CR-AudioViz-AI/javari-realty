// components/property-comparison.tsx
// Side-by-side property comparison tool
// Created: December 1, 2025 - 2:10 PM EST

'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Home, Bed, Bath, Square, Calendar, DollarSign, MapPin, Check, Minus, Star, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip_code: string
  price: number
  bedrooms: number
  bathrooms: number
  square_feet: number
  lot_size?: number
  year_built?: number
  property_type: string
  images?: string[]
  features?: string[]
  hoa_fee?: number
  garage_spaces?: number
  stories?: number
  days_on_market?: number
}

interface PropertyComparisonProps {
  properties: Property[]
  onRemove?: (id: string) => void
  onAddSlot?: () => void
  maxProperties?: number
}

const COMPARISON_FIELDS = [
  { key: 'price', label: 'Price', format: 'currency', better: 'lower' },
  { key: 'bedrooms', label: 'Bedrooms', format: 'number', better: 'higher' },
  { key: 'bathrooms', label: 'Bathrooms', format: 'decimal', better: 'higher' },
  { key: 'square_feet', label: 'Square Feet', format: 'number', better: 'higher' },
  { key: 'price_per_sqft', label: 'Price/Sq Ft', format: 'currency', better: 'lower', calculated: true },
  { key: 'lot_size', label: 'Lot Size (acres)', format: 'decimal', better: 'higher' },
  { key: 'year_built', label: 'Year Built', format: 'year', better: 'higher' },
  { key: 'hoa_fee', label: 'HOA Fee', format: 'currency', better: 'lower' },
  { key: 'garage_spaces', label: 'Garage', format: 'number', better: 'higher' },
  { key: 'stories', label: 'Stories', format: 'number', better: null },
  { key: 'days_on_market', label: 'Days on Market', format: 'number', better: 'lower' },
  { key: 'property_type', label: 'Property Type', format: 'text', better: null },
]

export default function PropertyComparison({ 
  properties, 
  onRemove, 
  onAddSlot,
  maxProperties = 4 
}: PropertyComparisonProps) {
  const [highlightBest, setHighlightBest] = useState(true)

  const formatValue = (value: any, format: string) => {
    if (value === null || value === undefined) return '—'
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      case 'number':
        return new Intl.NumberFormat('en-US').format(value)
      case 'decimal':
        return value.toFixed(1)
      case 'year':
        return value.toString()
      default:
        return value?.toString() || '—'
    }
  }

  const getCalculatedValue = (property: Property, key: string) => {
    if (key === 'price_per_sqft') {
      if (property.price && property.square_feet) {
        return Math.round(property.price / property.square_feet)
      }
      return null
    }
    return (property as any)[key]
  }

  const getBestValue = (field: typeof COMPARISON_FIELDS[0]) => {
    if (!field.better || properties.length < 2) return null
    
    const values = properties.map(p => {
      const val = field.calculated ? getCalculatedValue(p, field.key) : (p as any)[field.key]
      return { id: p.id, value: val }
    }).filter(v => v.value !== null && v.value !== undefined)

    if (values.length === 0) return null

    if (field.better === 'higher') {
      const max = Math.max(...values.map(v => v.value))
      return values.filter(v => v.value === max).map(v => v.id)
    } else {
      const min = Math.min(...values.map(v => v.value))
      return values.filter(v => v.value === min).map(v => v.id)
    }
  }

  // Get all unique features across all properties
  const allFeatures = [...new Set(properties.flatMap(p => p.features || []))]

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Compare Properties</h3>
          <p className="text-sm text-gray-500">{properties.length} of {maxProperties} properties</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={highlightBest}
            onChange={(e) => setHighlightBest(e.target.checked)}
            className="rounded border-gray-300"
          />
          Highlight best values
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Property Headers */}
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left bg-gray-50 w-40 sticky left-0 z-10">
                <span className="text-sm font-medium text-gray-500">Property</span>
              </th>
              {properties.map((property, idx) => (
                <th key={property.id} className="p-4 min-w-[200px]">
                  <div className="relative">
                    {onRemove && (
                      <button
                        onClick={() => onRemove(property.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.address}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Home className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 text-sm truncate">{property.address}</p>
                    <p className="text-xs text-gray-500">{property.city}, {property.state}</p>
                  </div>
                </th>
              ))}
              {properties.length < maxProperties && onAddSlot && (
                <th className="p-4 min-w-[200px]">
                  <button
                    onClick={onAddSlot}
                    className="w-full aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-sm font-medium">Add Property</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {/* Comparison Fields */}
            {COMPARISON_FIELDS.map(field => {
              const bestIds = highlightBest ? getBestValue(field) : null

              return (
                <tr key={field.key} className="border-b hover:bg-gray-50">
                  <td className="p-3 bg-gray-50 sticky left-0 z-10">
                    <span className="text-sm font-medium text-gray-700">{field.label}</span>
                  </td>
                  {properties.map(property => {
                    const value = field.calculated 
                      ? getCalculatedValue(property, field.key) 
                      : (property as any)[field.key]
                    const isBest = bestIds?.includes(property.id)

                    return (
                      <td key={property.id} className="p-3 text-center">
                        <span className={`text-sm ${isBest ? 'font-semibold text-green-600 bg-green-50 px-2 py-1 rounded' : 'text-gray-900'}`}>
                          {formatValue(value, field.format)}
                          {isBest && <Star className="w-3 h-3 inline ml-1 fill-current" />}
                        </span>
                      </td>
                    )
                  })}
                  {properties.length < maxProperties && onAddSlot && <td className="p-3"></td>}
                </tr>
              )
            })}

            {/* Features Section */}
            {allFeatures.length > 0 && (
              <>
                <tr className="bg-gray-100">
                  <td colSpan={properties.length + 2} className="p-3">
                    <span className="text-sm font-semibold text-gray-700">Features</span>
                  </td>
                </tr>
                {allFeatures.slice(0, 15).map(feature => (
                  <tr key={feature} className="border-b hover:bg-gray-50">
                    <td className="p-2 bg-gray-50 sticky left-0 z-10">
                      <span className="text-sm text-gray-700">{feature}</span>
                    </td>
                    {properties.map(property => (
                      <td key={property.id} className="p-2 text-center">
                        {property.features?.includes(feature) ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                    {properties.length < maxProperties && onAddSlot && <td className="p-2"></td>}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {properties.length >= 2 && (
        <div className="p-4 bg-blue-50 border-t">
          <h4 className="font-medium text-blue-900 mb-2">Quick Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Lowest Price</p>
              <p className="font-semibold">
                {formatValue(Math.min(...properties.map(p => p.price)), 'currency')}
              </p>
            </div>
            <div>
              <p className="text-blue-600">Most Space</p>
              <p className="font-semibold">
                {formatValue(Math.max(...properties.map(p => p.square_feet || 0)), 'number')} sq ft
              </p>
            </div>
            <div>
              <p className="text-blue-600">Best Value</p>
              <p className="font-semibold">
                {formatValue(
                  Math.min(...properties.filter(p => p.price && p.square_feet).map(p => p.price / p.square_feet)),
                  'currency'
                )}/sq ft
              </p>
            </div>
            <div>
              <p className="text-blue-600">Newest</p>
              <p className="font-semibold">
                {Math.max(...properties.map(p => p.year_built || 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
