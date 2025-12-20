'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, MapPin, Bed, Bath, Square, Heart, Grid, List, Map,
  SlidersHorizontal, ChevronDown, Home, DollarSign, X, Info
} from 'lucide-react'

// Sample nationwide properties - in production, comes from MLS API
const ALL_PROPERTIES = [
  // Florida
  { id: '1', address: '2850 Winkler Ave', city: 'Fort Myers', state: 'FL', zip: '33916', price: 425000, beds: 4, baths: 3, sqft: 2400, yearBuilt: 2018, status: 'Active', daysOnMarket: 12, photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '2', address: '1540 SW 52nd Terrace', city: 'Cape Coral', state: 'FL', zip: '33914', price: 389000, beds: 3, baths: 2, sqft: 1850, yearBuilt: 2015, status: 'Active', daysOnMarket: 8, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '3', address: '8745 Coastline Ct', city: 'Naples', state: 'FL', zip: '34108', price: 1250000, beds: 4, baths: 3.5, sqft: 3200, yearBuilt: 2020, status: 'Active', daysOnMarket: 21, photo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '4', address: '2100 Gulf Shore Blvd', city: 'Naples', state: 'FL', zip: '34102', price: 2150000, beds: 5, baths: 5.5, sqft: 4500, yearBuilt: 2021, status: 'Active', daysOnMarket: 5, photo: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '5', address: '456 Estero Blvd', city: 'Bonita Springs', state: 'FL', zip: '34134', price: 549000, beds: 4, baths: 3, sqft: 2100, yearBuilt: 2017, status: 'Active', daysOnMarket: 14, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '6', address: '789 Marco Island Dr', city: 'Marco Island', state: 'FL', zip: '34145', price: 895000, beds: 3, baths: 3, sqft: 2000, yearBuilt: 2019, status: 'Pending', daysOnMarket: 45, photo: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop', propertyType: 'Condo' },
  // California
  { id: '10', address: '1234 Ocean View Dr', city: 'San Diego', state: 'CA', zip: '92101', price: 1850000, beds: 4, baths: 3, sqft: 2800, yearBuilt: 2019, status: 'Active', daysOnMarket: 15, photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '11', address: '456 Sunset Blvd', city: 'Los Angeles', state: 'CA', zip: '90028', price: 2450000, beds: 5, baths: 4, sqft: 3500, yearBuilt: 2021, status: 'Active', daysOnMarket: 7, photo: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '12', address: '789 Marina Way', city: 'San Francisco', state: 'CA', zip: '94105', price: 1650000, beds: 2, baths: 2, sqft: 1400, yearBuilt: 2018, status: 'Active', daysOnMarket: 22, photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', propertyType: 'Condo' },
  // Texas
  { id: '20', address: '789 Ranch Road', city: 'Austin', state: 'TX', zip: '78701', price: 625000, beds: 4, baths: 2.5, sqft: 2600, yearBuilt: 2020, status: 'Active', daysOnMarket: 18, photo: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '21', address: '321 Main St', city: 'Houston', state: 'TX', zip: '77002', price: 485000, beds: 3, baths: 2, sqft: 2100, yearBuilt: 2018, status: 'Active', daysOnMarket: 12, photo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', propertyType: 'Townhouse' },
  { id: '22', address: '555 Oak Lawn Ave', city: 'Dallas', state: 'TX', zip: '75201', price: 725000, beds: 4, baths: 3, sqft: 2800, yearBuilt: 2019, status: 'Active', daysOnMarket: 9, photo: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  // New York
  { id: '30', address: '100 Park Ave Unit 25A', city: 'New York', state: 'NY', zip: '10017', price: 3200000, beds: 3, baths: 2.5, sqft: 1800, yearBuilt: 2015, status: 'Active', daysOnMarket: 30, photo: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', propertyType: 'Condo' },
  // Colorado
  { id: '40', address: '555 Mountain View Rd', city: 'Denver', state: 'CO', zip: '80202', price: 725000, beds: 4, baths: 3, sqft: 2400, yearBuilt: 2019, status: 'Active', daysOnMarket: 9, photo: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  // Arizona
  { id: '50', address: '777 Desert Rose Ln', city: 'Phoenix', state: 'AZ', zip: '85001', price: 475000, beds: 4, baths: 2, sqft: 2200, yearBuilt: 2020, status: 'Active', daysOnMarket: 14, photo: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  // Washington
  { id: '60', address: '888 Rainy St', city: 'Seattle', state: 'WA', zip: '98101', price: 895000, beds: 3, baths: 2.5, sqft: 1900, yearBuilt: 2018, status: 'Active', daysOnMarket: 11, photo: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', propertyType: 'Townhouse' },
  // Georgia
  { id: '70', address: '999 Peachtree Ave', city: 'Atlanta', state: 'GA', zip: '30301', price: 545000, beds: 4, baths: 3, sqft: 2500, yearBuilt: 2017, status: 'Active', daysOnMarket: 16, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  // More Florida
  { id: '7', address: '123 Lehigh Dr', city: 'Lehigh Acres', state: 'FL', zip: '33936', price: 285000, beds: 3, baths: 2, sqft: 1500, yearBuilt: 2016, status: 'Active', daysOnMarket: 28, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '8', address: '456 Golden Gate Pkwy', city: 'Golden Gate', state: 'FL', zip: '34116', price: 475000, beds: 4, baths: 2, sqft: 2000, yearBuilt: 2018, status: 'Active', daysOnMarket: 19, photo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', propertyType: 'Single Family' },
  { id: '9', address: '789 Coconut Rd', city: 'Estero', state: 'FL', zip: '33928', price: 725000, beds: 4, baths: 3, sqft: 2700, yearBuilt: 2019, status: 'Active', daysOnMarket: 10, photo: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', propertyType: 'Single Family' },
]

const US_STATES = [
  { code: '', name: 'All States' },
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington D.C.' }
]

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 0 },
  { label: 'Under $300K', min: 0, max: 300000 },
  { label: '$300K - $500K', min: 300000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: '$2M+', min: 2000000, max: 0 }
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [beds, setBeds] = useState(0)
  const [propertyType, setPropertyType] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showDataNotice, setShowDataNotice] = useState(true)

  // Filter properties
  const filteredProperties = ALL_PROPERTIES.filter(p => {
    // Search query (city, state, zip, address)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        p.city.toLowerCase().includes(query) ||
        p.state.toLowerCase().includes(query) ||
        p.zip.includes(query) ||
        p.address.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }
    
    // State filter
    if (selectedState && p.state !== selectedState) return false
    
    // Price filter
    if (priceRange.min > 0 && p.price < priceRange.min) return false
    if (priceRange.max > 0 && p.price > priceRange.max) return false
    
    // Beds filter
    if (beds > 0 && p.beds < beds) return false
    
    // Property type filter
    if (propertyType && p.propertyType !== propertyType) return false
    
    return true
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'beds': return b.beds - a.beds
      case 'sqft': return b.sqft - a.sqft
      case 'newest': return a.daysOnMarket - b.daysOnMarket
      default: return 0
    }
  })

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev)
      if (newFavs.has(id)) {
        newFavs.delete(id)
      } else {
        newFavs.add(id)
      }
      return newFavs
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Dream Home</h1>
          <p className="text-blue-100 mb-6">Search properties across the United States</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city, state, or ZIP code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {US_STATES.map(state => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price Range</label>
                  <select
                    onChange={(e) => {
                      const range = PRICE_RANGES[parseInt(e.target.value)]
                      setPriceRange({ min: range.min, max: range.max })
                    }}
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                  >
                    {PRICE_RANGES.map((range, idx) => (
                      <option key={idx} value={idx}>{range.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Bedrooms</label>
                  <select
                    value={beds}
                    onChange={(e) => setBeds(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                  >
                    <option value={0}>Any</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                    <option value={5}>5+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                  >
                    <option value="">All Types</option>
                    <option value="Single Family">Single Family</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-Family">Multi-Family</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-gray-900"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="beds">Most Bedrooms</option>
                    <option value="sqft">Largest</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Data Notice */}
      {showDataNotice && (
        <div className="bg-yellow-50 border-b border-yellow-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-800">
              <Info className="w-5 h-5" />
              <span className="text-sm">
                <strong>Demo Mode:</strong> Showing sample data. For real MLS data like Zillow, an IDX license or API subscription is required.
              </span>
            </div>
            <button onClick={() => setShowDataNotice(false)} className="text-yellow-600 hover:text-yellow-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {sortedProperties.length} Properties Found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedState && ` in ${US_STATES.find(s => s.code === selectedState)?.name}`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Property Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {sortedProperties.map(property => (
            <Link 
              key={property.id} 
              href={`/property/${property.id}`}
              className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'}`}>
                <Image
                  src={property.photo}
                  alt={property.address}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(property.id)
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Heart className={`w-5 h-5 ${favorites.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    property.status === 'Active' ? 'bg-green-500 text-white' :
                    property.status === 'Pending' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatPrice(property.price)}
                </div>
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" /> {property.beds} bd
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {property.baths} ba
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4" /> {property.sqft.toLocaleString()} sqft
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  {property.address}, {property.city}, {property.state} {property.zip}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm text-gray-400">
                  <span>{property.propertyType}</span>
                  <span>{property.daysOnMarket} days on market</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {sortedProperties.length === 0 && (
          <div className="text-center py-16">
            <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No properties found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          © 2025 CR AudioViz AI, LLC. All rights reserved.
          <div className="mt-2">
            Powered by CR Realtor Platform • Data deemed reliable but not guaranteed
          </div>
        </div>
      </footer>
    </div>
  )
}
