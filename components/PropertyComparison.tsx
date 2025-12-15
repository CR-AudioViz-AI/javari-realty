'use client'

import { useState } from 'react'
import {
  Home, Bed, Bath, Square, DollarSign, MapPin, Calendar,
  TrendingUp, TrendingDown, Minus, X, Plus, Check
} from 'lucide-react'

interface Property {
  id: string
  title: string
  address: string
  city: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  year_built?: number
  lot_size?: number
  garage_spaces?: number
  hoa_fee?: number
  property_type?: string
  days_on_market?: number
  price_per_sqft?: number
}

interface PropertyComparisonProps {
  properties: Property[]
  onRemove?: (id: string) => void
  className?: string
}

export default function PropertyComparison({
  properties,
  onRemove,
  className = ''
}: PropertyComparisonProps) {
  if (properties.length === 0) {
    return (
      <div className={`bg-white rounded-xl border p-8 text-center ${className}`}>
        <Home className="mx-auto mb-3 text-gray-300" size={48} />
        <p className="text-gray-500">Add properties to compare</p>
        <p className="text-sm text-gray-400 mt-1">Select up to 4 properties for side-by-side comparison</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

  const getBestValue = (values: (number | undefined)[], higherIsBetter: boolean = true) => {
    const validValues = values.filter((v): v is number => v !== undefined)
    if (validValues.length === 0) return undefined
    return higherIsBetter ? Math.max(...validValues) : Math.min(...validValues)
  }

  const getComparisonIcon = (value: number | undefined, best: number | undefined, higherIsBetter: boolean = true) => {
    if (value === undefined || best === undefined) return <Minus className="text-gray-400" size={16} />
    if (value === best) return <TrendingUp className="text-green-500" size={16} />
    if (higherIsBetter) {
      return value < best ? <TrendingDown className="text-red-400" size={16} /> : <Check className="text-green-500" size={16} />
    } else {
      return value > best ? <TrendingDown className="text-red-400" size={16} /> : <Check className="text-green-500" size={16} />
    }
  }

  // Calculate best values for highlighting
  const bestPrice = getBestValue(properties.map(p => p.price), false) // Lower is better
  const bestSqft = getBestValue(properties.map(p => p.sqft), true)
  const bestPricePerSqft = getBestValue(properties.map(p => p.price_per_sqft || p.price / p.sqft), false)
  const bestBeds = getBestValue(properties.map(p => p.bedrooms), true)
  const bestBaths = getBestValue(properties.map(p => p.bathrooms), true)
  const bestLot = getBestValue(properties.map(p => p.lot_size), true)

  const comparisonRows = [
    {
      label: 'Price',
      icon: DollarSign,
      values: properties.map(p => formatCurrency(p.price)),
      rawValues: properties.map(p => p.price),
      best: bestPrice,
      higherIsBetter: false
    },
    {
      label: 'Price/Sq Ft',
      icon: TrendingUp,
      values: properties.map(p => formatCurrency(p.price_per_sqft || Math.round(p.price / p.sqft))),
      rawValues: properties.map(p => p.price_per_sqft || p.price / p.sqft),
      best: bestPricePerSqft,
      higherIsBetter: false
    },
    {
      label: 'Square Feet',
      icon: Square,
      values: properties.map(p => p.sqft?.toLocaleString() || '-'),
      rawValues: properties.map(p => p.sqft),
      best: bestSqft,
      higherIsBetter: true
    },
    {
      label: 'Bedrooms',
      icon: Bed,
      values: properties.map(p => p.bedrooms?.toString() || '-'),
      rawValues: properties.map(p => p.bedrooms),
      best: bestBeds,
      higherIsBetter: true
    },
    {
      label: 'Bathrooms',
      icon: Bath,
      values: properties.map(p => p.bathrooms?.toString() || '-'),
      rawValues: properties.map(p => p.bathrooms),
      best: bestBaths,
      higherIsBetter: true
    },
    {
      label: 'Year Built',
      icon: Calendar,
      values: properties.map(p => p.year_built?.toString() || '-'),
      rawValues: properties.map(p => p.year_built),
      best: getBestValue(properties.map(p => p.year_built), true),
      higherIsBetter: true
    },
    {
      label: 'Lot Size',
      icon: Home,
      values: properties.map(p => p.lot_size ? `${p.lot_size} acres` : '-'),
      rawValues: properties.map(p => p.lot_size),
      best: bestLot,
      higherIsBetter: true
    },
    {
      label: 'Garage',
      icon: Home,
      values: properties.map(p => p.garage_spaces ? `${p.garage_spaces} car` : '-'),
      rawValues: properties.map(p => p.garage_spaces),
      best: getBestValue(properties.map(p => p.garage_spaces), true),
      higherIsBetter: true
    },
    {
      label: 'HOA Fee',
      icon: DollarSign,
      values: properties.map(p => p.hoa_fee ? `${formatCurrency(p.hoa_fee)}/mo` : 'None'),
      rawValues: properties.map(p => p.hoa_fee || 0),
      best: getBestValue(properties.map(p => p.hoa_fee || 0), false),
      higherIsBetter: false
    },
  ]

  return (
    <div className={`bg-white rounded-xl border overflow-hidden ${className}`}>
      {/* Header with property cards */}
      <div className="grid" style={{ gridTemplateColumns: `150px repeat(${properties.length}, 1fr)` }}>
        <div className="p-4 bg-gray-50 font-medium text-gray-600">Compare</div>
        {properties.map(property => (
          <div key={property.id} className="p-4 border-l relative">
            {onRemove && (
              <button
                onClick={() => onRemove(property.id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
            <h3 className="font-semibold text-gray-900 pr-6 line-clamp-2">{property.title || property.address}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin size={12} /> {property.city}
            </p>
            <p className="text-lg font-bold text-green-600 mt-2">
              {formatCurrency(property.price)}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison rows */}
      {comparisonRows.map((row, idx) => (
        <div 
          key={row.label}
          className={`grid ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}
          style={{ gridTemplateColumns: `150px repeat(${properties.length}, 1fr)` }}
        >
          <div className="p-3 flex items-center gap-2 text-sm font-medium text-gray-600">
            <row.icon size={16} className="text-gray-400" />
            {row.label}
          </div>
          {row.values.map((value, i) => (
            <div key={i} className="p-3 border-l flex items-center justify-between">
              <span className={`font-medium ${
                row.rawValues[i] === row.best ? 'text-green-600' : 'text-gray-900'
              }`}>
                {value}
              </span>
              {getComparisonIcon(row.rawValues[i], row.best, row.higherIsBetter)}
            </div>
          ))}
        </div>
      ))}

      {/* Summary */}
      <div className="p-4 bg-blue-50 border-t">
        <h4 className="font-medium text-blue-900 mb-2">Quick Analysis</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {bestPrice && (
            <li>• Best price: {formatCurrency(bestPrice)} ({properties.find(p => p.price === bestPrice)?.address?.split(',')[0]})</li>
          )}
          {bestPricePerSqft && (
            <li>• Best value per sq ft: {formatCurrency(bestPricePerSqft)}/sqft</li>
          )}
          {bestSqft && (
            <li>• Most space: {bestSqft.toLocaleString()} sq ft</li>
          )}
        </ul>
      </div>
    </div>
  )
}
