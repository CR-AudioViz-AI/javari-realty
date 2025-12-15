'use client'

import { useState } from 'react'
import {
  Scale, Plus, X, Home, DollarSign, Bed, Bath, Square,
  MapPin, Calendar, Car, Trees, Droplet, Zap, Check,
  TrendingUp, TrendingDown, Minus, Share2, Download,
  Printer, Star, Building2, Clock
} from 'lucide-react'

interface CompareProperty {
  id: string
  address: string
  price: number
  pricePerSqft: number
  beds: number
  baths: number
  sqft: number
  lotSize: number
  yearBuilt: number
  garage: number
  pool: boolean
  waterfront: boolean
  hoa: number
  taxes: number
  daysOnMarket: number
  status: 'active' | 'pending' | 'sold'
  type: string
  features: string[]
  image?: string
}

const SAMPLE_PROPERTIES: CompareProperty[] = [
  {
    id: '1',
    address: '2850 Winkler Ave, Fort Myers',
    price: 425000,
    pricePerSqft: 177,
    beds: 4,
    baths: 3,
    sqft: 2400,
    lotSize: 0.25,
    yearBuilt: 2018,
    garage: 2,
    pool: true,
    waterfront: false,
    hoa: 150,
    taxes: 4200,
    daysOnMarket: 12,
    status: 'active',
    type: 'Single Family',
    features: ['Pool', 'Updated Kitchen', 'Granite Counters', 'Stainless Appliances']
  },
  {
    id: '2',
    address: '1420 SE 47th St, Cape Coral',
    price: 389000,
    pricePerSqft: 162,
    beds: 3,
    baths: 2,
    sqft: 2400,
    lotSize: 0.30,
    yearBuilt: 2015,
    garage: 2,
    pool: false,
    waterfront: true,
    hoa: 0,
    taxes: 3800,
    daysOnMarket: 28,
    status: 'active',
    type: 'Single Family',
    features: ['Gulf Access', 'Boat Dock', 'Open Floor Plan', 'Tile Floors']
  },
  {
    id: '3',
    address: '3500 Oasis Blvd, Cape Coral',
    price: 459000,
    pricePerSqft: 191,
    beds: 4,
    baths: 2.5,
    sqft: 2400,
    lotSize: 0.22,
    yearBuilt: 2020,
    garage: 3,
    pool: true,
    waterfront: false,
    hoa: 200,
    taxes: 4800,
    daysOnMarket: 5,
    status: 'active',
    type: 'Single Family',
    features: ['Pool', 'Smart Home', 'Impact Windows', 'Metal Roof', 'Solar Panels']
  },
]

export default function PropertyComparisonPage() {
  const [selectedProperties, setSelectedProperties] = useState<CompareProperty[]>([
    SAMPLE_PROPERTIES[0],
    SAMPLE_PROPERTIES[1]
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [highlightBest, setHighlightBest] = useState(true)

  const addProperty = (property: CompareProperty) => {
    if (selectedProperties.length < 4 && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property])
    }
    setShowAddModal(false)
  }

  const removeProperty = (id: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== id))
  }

  const findBest = (key: keyof CompareProperty, type: 'low' | 'high') => {
    if (!highlightBest || selectedProperties.length < 2) return null
    const values = selectedProperties.map(p => p[key] as number).filter(v => typeof v === 'number')
    if (type === 'low') return Math.min(...values)
    return Math.max(...values)
  }

  const isBest = (value: number, key: keyof CompareProperty, type: 'low' | 'high') => {
    const best = findBest(key, type)
    return best === value
  }

  const CompareRow = ({ 
    label, 
    propKey, 
    format = (v: any) => v?.toString() || '-',
    bestType = 'high',
    icon: Icon
  }: { 
    label: string
    propKey: keyof CompareProperty
    format?: (v: any) => string
    bestType?: 'low' | 'high'
    icon?: any
  }) => (
    <tr className="border-b">
      <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-gray-400" />}
        {label}
      </td>
      {selectedProperties.map(p => {
        const value = p[propKey]
        const best = typeof value === 'number' && isBest(value, propKey, bestType)
        return (
          <td key={p.id} className={`py-3 px-4 text-center ${best ? 'bg-green-50 font-semibold text-green-700' : ''}`}>
            {format(value)}
            {best && <Star className="inline ml-1 text-green-500" size={14} />}
          </td>
        )
      })}
      {selectedProperties.length < 4 && <td className="py-3 px-4" />}
    </tr>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Scale className="text-blue-600" /> Property Comparison
          </h1>
          <p className="text-gray-600 mt-1">Compare up to 4 properties side by side</p>
        </div>
        
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={highlightBest}
              onChange={(e) => setHighlightBest(e.target.checked)}
              className="rounded"
            />
            Highlight best values
          </label>
          <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Share2 size={16} /> Share
          </button>
          <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-4 text-left font-semibold text-gray-700 w-48">Property</th>
                {selectedProperties.map(p => (
                  <th key={p.id} className="py-4 px-4 text-center min-w-[200px]">
                    <div className="relative">
                      <button
                        onClick={() => removeProperty(p.id)}
                        className="absolute -top-1 -right-1 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <X size={14} />
                      </button>
                      <div className="bg-gray-200 h-32 rounded-lg mb-2 flex items-center justify-center">
                        <Home className="text-gray-400" size={48} />
                      </div>
                      <p className="font-semibold text-sm truncate">{p.address.split(',')[0]}</p>
                      <p className="text-xs text-gray-500">{p.address.split(',').slice(1).join(',')}</p>
                    </div>
                  </th>
                ))}
                {selectedProperties.length < 4 && (
                  <th className="py-4 px-4 text-center min-w-[200px]">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <Plus size={32} />
                      <span className="text-sm mt-1">Add Property</span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* Price Section */}
              <tr className="bg-blue-50">
                <td colSpan={selectedProperties.length + 2} className="py-2 px-4 font-bold text-blue-800">
                  💰 Pricing
                </td>
              </tr>
              <CompareRow 
                label="List Price" 
                propKey="price" 
                format={(v) => `$${v?.toLocaleString()}`}
                bestType="low"
                icon={DollarSign}
              />
              <CompareRow 
                label="Price/Sq Ft" 
                propKey="pricePerSqft" 
                format={(v) => `$${v}`}
                bestType="low"
              />
              <CompareRow 
                label="Annual Taxes" 
                propKey="taxes" 
                format={(v) => `$${v?.toLocaleString()}`}
                bestType="low"
              />
              <CompareRow 
                label="HOA/Month" 
                propKey="hoa" 
                format={(v) => v > 0 ? `$${v}` : 'None'}
                bestType="low"
              />

              {/* Property Details */}
              <tr className="bg-green-50">
                <td colSpan={selectedProperties.length + 2} className="py-2 px-4 font-bold text-green-800">
                  🏠 Property Details
                </td>
              </tr>
              <CompareRow 
                label="Bedrooms" 
                propKey="beds" 
                icon={Bed}
              />
              <CompareRow 
                label="Bathrooms" 
                propKey="baths" 
                icon={Bath}
              />
              <CompareRow 
                label="Square Feet" 
                propKey="sqft" 
                format={(v) => `${v?.toLocaleString()} sq ft`}
                icon={Square}
              />
              <CompareRow 
                label="Lot Size" 
                propKey="lotSize" 
                format={(v) => `${v} acres`}
                icon={Trees}
              />
              <CompareRow 
                label="Year Built" 
                propKey="yearBuilt" 
              />
              <CompareRow 
                label="Garage" 
                propKey="garage" 
                format={(v) => v > 0 ? `${v}-car` : 'None'}
                icon={Car}
              />

              {/* Amenities */}
              <tr className="bg-purple-50">
                <td colSpan={selectedProperties.length + 2} className="py-2 px-4 font-bold text-purple-800">
                  ✨ Amenities
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50 flex items-center gap-2">
                  <Droplet size={16} className="text-gray-400" />
                  Pool
                </td>
                {selectedProperties.map(p => (
                  <td key={p.id} className={`py-3 px-4 text-center ${p.pool ? 'text-green-600' : 'text-gray-400'}`}>
                    {p.pool ? <Check className="mx-auto" size={20} /> : <Minus className="mx-auto" size={20} />}
                  </td>
                ))}
                {selectedProperties.length < 4 && <td className="py-3 px-4" />}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50 flex items-center gap-2">
                  <Droplet size={16} className="text-gray-400" />
                  Waterfront
                </td>
                {selectedProperties.map(p => (
                  <td key={p.id} className={`py-3 px-4 text-center ${p.waterfront ? 'text-green-600' : 'text-gray-400'}`}>
                    {p.waterfront ? <Check className="mx-auto" size={20} /> : <Minus className="mx-auto" size={20} />}
                  </td>
                ))}
                {selectedProperties.length < 4 && <td className="py-3 px-4" />}
              </tr>

              {/* Features */}
              <tr className="border-b">
                <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">Features</td>
                {selectedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {p.features.slice(0, 4).map(f => (
                        <span key={f} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{f}</span>
                      ))}
                    </div>
                  </td>
                ))}
                {selectedProperties.length < 4 && <td className="py-3 px-4" />}
              </tr>

              {/* Market Info */}
              <tr className="bg-amber-50">
                <td colSpan={selectedProperties.length + 2} className="py-2 px-4 font-bold text-amber-800">
                  📊 Market Info
                </td>
              </tr>
              <CompareRow 
                label="Days on Market" 
                propKey="daysOnMarket" 
                format={(v) => `${v} days`}
                bestType="low"
                icon={Clock}
              />
              <tr className="border-b">
                <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50">Status</td>
                {selectedProperties.map(p => (
                  <td key={p.id} className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === 'active' ? 'bg-green-100 text-green-800' :
                      p.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                ))}
                {selectedProperties.length < 4 && <td className="py-3 px-4" />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {selectedProperties.length >= 2 && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Quick Analysis
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Lowest Price</p>
              <p className="font-bold text-green-600">
                ${Math.min(...selectedProperties.map(p => p.price)).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                {selectedProperties.find(p => p.price === Math.min(...selectedProperties.map(p => p.price)))?.address.split(',')[0]}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Best Value ($/sqft)</p>
              <p className="font-bold text-blue-600">
                ${Math.min(...selectedProperties.map(p => p.pricePerSqft))}/sqft
              </p>
              <p className="text-xs text-gray-400">
                {selectedProperties.find(p => p.pricePerSqft === Math.min(...selectedProperties.map(p => p.pricePerSqft)))?.address.split(',')[0]}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Newest Build</p>
              <p className="font-bold text-purple-600">
                Built {Math.max(...selectedProperties.map(p => p.yearBuilt))}
              </p>
              <p className="text-xs text-gray-400">
                {selectedProperties.find(p => p.yearBuilt === Math.max(...selectedProperties.map(p => p.yearBuilt)))?.address.split(',')[0]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Property to Compare</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              {SAMPLE_PROPERTIES.filter(p => !selectedProperties.find(sp => sp.id === p.id)).map(p => (
                <button
                  key={p.id}
                  onClick={() => addProperty(p)}
                  className="w-full text-left p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <p className="font-semibold">{p.address}</p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>${p.price.toLocaleString()}</span>
                    <span>{p.beds}bd/{p.baths}ba</span>
                    <span>{p.sqft.toLocaleString()} sqft</span>
                  </div>
                </button>
              ))}
              
              {SAMPLE_PROPERTIES.filter(p => !selectedProperties.find(sp => sp.id === p.id)).length === 0 && (
                <p className="text-center text-gray-500 py-8">All available properties are already in comparison</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
