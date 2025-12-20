'use client'

import { useState, useEffect } from 'react'
import { 
  Search, MapPin, Home, Bed, Bath, Square, DollarSign,
  Filter, Grid, List, Map, Heart, Share2, ChevronDown,
  SlidersHorizontal, X, Loader2, TrendingUp, Building2,
  Clock, Eye, ArrowUpDown, Phone, Mail, Calendar
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface PropertyListing {
  id: string
  mlsId: string
  address: {
    full: string
    city: string
    state: string
    zip: string
  }
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt?: number
  propertyType: string
  status: 'Active' | 'Pending' | 'Sold' | 'For Rent'
  daysOnMarket: number
  photos: string[]
  description?: string
  features: string[]
  pricePerSqft?: number
  agent?: {
    name: string
    phone?: string
  }
  source: string
}

// Southwest Florida Properties with Real Photos
const SWFL_PROPERTIES: PropertyListing[] = [
  {
    id: '1', mlsId: 'NAPLES-001',
    address: { full: '2850 Winkler Ave', city: 'Fort Myers', state: 'FL', zip: '33916' },
    price: 425000, beds: 4, baths: 3, sqft: 2400, yearBuilt: 2018,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 14,
    photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
    description: 'Beautiful 4-bedroom home with modern updates, pool, and 2-car garage.',
    features: ['Pool', 'Updated Kitchen', '2-Car Garage', 'Open Floor Plan'],
    pricePerSqft: 177, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '2', mlsId: 'CAPE-002',
    address: { full: '1420 SE 47th St', city: 'Cape Coral', state: 'FL', zip: '33904' },
    price: 389000, beds: 3, baths: 2, sqft: 2100, yearBuilt: 2015,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 28,
    photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    description: 'Gulf access home with boat dock and open floor plan.',
    features: ['Gulf Access', 'Boat Dock', 'Open Floor Plan', 'Lanai'],
    pricePerSqft: 185, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '3', mlsId: 'CAPE-003',
    address: { full: '3500 Oasis Blvd', city: 'Cape Coral', state: 'FL', zip: '33914' },
    price: 459000, beds: 4, baths: 2.5, sqft: 2650, yearBuilt: 2020,
    propertyType: 'Single Family', status: 'Pending', daysOnMarket: 7,
    photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
    description: 'New construction with smart home features and pool.',
    features: ['Pool', 'Smart Home', 'Impact Windows', 'Solar Ready'],
    pricePerSqft: 173, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '4', mlsId: 'FM-004',
    address: { full: '8901 Cypress Lake Dr', city: 'Fort Myers', state: 'FL', zip: '33919' },
    price: 675000, beds: 5, baths: 4, sqft: 3200, yearBuilt: 2021,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 5,
    photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    description: 'Luxury lakefront home with pool and gourmet kitchen.',
    features: ['Pool', 'Lake View', '3-Car Garage', 'Gourmet Kitchen'],
    pricePerSqft: 211, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '5', mlsId: 'NAPLES-005',
    address: { full: '1250 5th Ave S', city: 'Naples', state: 'FL', zip: '34102' },
    price: 1250000, beds: 4, baths: 3.5, sqft: 3800, yearBuilt: 2019,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 12,
    photos: ['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80'],
    description: 'Downtown Naples luxury home near 5th Avenue shops.',
    features: ['Pool', 'Downtown Location', 'Chef Kitchen', 'Hurricane Shutters'],
    pricePerSqft: 329, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '6', mlsId: 'CAPE-006',
    address: { full: '4521 Del Prado Blvd S', city: 'Cape Coral', state: 'FL', zip: '33904' },
    price: 325000, beds: 3, baths: 2, sqft: 1650, yearBuilt: 2008,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 21,
    photos: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80'],
    description: 'Move-in ready home with updated kitchen.',
    features: ['Updated Kitchen', 'New Roof 2022', 'Tile Throughout', 'Screened Lanai'],
    pricePerSqft: 197, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '7', mlsId: 'BONITA-007',
    address: { full: '28500 Bonita Crossings Blvd', city: 'Bonita Springs', state: 'FL', zip: '34135' },
    price: 549000, beds: 4, baths: 3, sqft: 2800, yearBuilt: 2017,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 18,
    photos: ['https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80'],
    description: 'Gated community home with golf course views.',
    features: ['Gated Community', 'Golf Course View', 'Pool', 'HOA Amenities'],
    pricePerSqft: 196, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '8', mlsId: 'LEHIGH-008',
    address: { full: '2100 Corkscrew Rd', city: 'Lehigh Acres', state: 'FL', zip: '33936' },
    price: 285000, beds: 3, baths: 2, sqft: 1450, yearBuilt: 2012,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 35,
    photos: ['https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80'],
    description: 'Affordable home - perfect for first-time buyers.',
    features: ['No HOA', 'Large Lot', 'New AC 2023', 'Freshly Painted'],
    pricePerSqft: 197, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '9', mlsId: 'NAPLES-009',
    address: { full: '9876 Pelican Bay Blvd', city: 'Naples', state: 'FL', zip: '34108' },
    price: 2150000, beds: 5, baths: 5.5, sqft: 4500, yearBuilt: 2022,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 8,
    photos: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'],
    description: 'Pelican Bay luxury estate with beach access.',
    features: ['Beach Access', 'Wine Cellar', 'Home Theater', 'Infinity Pool'],
    pricePerSqft: 478, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '10', mlsId: 'MARCO-010',
    address: { full: '1560 Collier Blvd', city: 'Marco Island', state: 'FL', zip: '34145' },
    price: 895000, beds: 3, baths: 3, sqft: 2200, yearBuilt: 2016,
    propertyType: 'Condo', status: 'Active', daysOnMarket: 15,
    photos: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'],
    description: 'Beachfront condo with stunning Gulf views.',
    features: ['Gulf Views', 'Beach Access', 'Resort Amenities', 'Turnkey'],
    pricePerSqft: 407, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '11', mlsId: 'ESTERO-011',
    address: { full: '20100 Miromar Lakes Blvd', city: 'Estero', state: 'FL', zip: '33913' },
    price: 725000, beds: 4, baths: 3, sqft: 2950, yearBuilt: 2018,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 22,
    photos: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'],
    description: 'Miromar Lakes waterfront with private dock.',
    features: ['Waterfront', 'Private Dock', 'Golf Community', 'Resort Pool'],
    pricePerSqft: 246, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  },
  {
    id: '12', mlsId: 'GGE-012',
    address: { full: '4455 Golden Gate Blvd E', city: 'Golden Gate Estates', state: 'FL', zip: '34120' },
    price: 475000, beds: 4, baths: 2, sqft: 2100, yearBuilt: 2019,
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 30,
    photos: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'],
    description: '2.5 acre estate with room for horses.',
    features: ['2.5 Acres', 'Horse Friendly', 'Private Well', 'No HOA'],
    pricePerSqft: 226, agent: { name: 'Tony Harvey', phone: '(239) 777-0155' }, source: 'MLS'
  }
]

const CITIES = ['All Cities', 'Naples', 'Fort Myers', 'Cape Coral', 'Bonita Springs', 'Marco Island', 'Estero', 'Lehigh Acres', 'Golden Gate Estates']
const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 999999999 },
  { label: 'Under $300K', min: 0, max: 300000 },
  { label: '$300K - $500K', min: 300000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: '$2M+', min: 2000000, max: 999999999 }
]
const BEDS = ['Any', '1+', '2+', '3+', '4+', '5+']
const PROPERTY_TYPES = ['All Types', 'Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land']

export default function PropertySearchPage() {
  const [properties, setProperties] = useState<PropertyListing[]>(SWFL_PROPERTIES)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0])
  const [minBeds, setMinBeds] = useState('Any')
  const [propertyType, setPropertyType] = useState('All Types')
  const [sortBy, setSortBy] = useState('newest')

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    if (selectedCity !== 'All Cities' && prop.address.city !== selectedCity) return false
    if (prop.price < priceRange.min || prop.price > priceRange.max) return false
    if (minBeds !== 'Any' && prop.beds < parseInt(minBeds)) return false
    if (propertyType !== 'All Types' && prop.propertyType !== propertyType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return prop.address.full.toLowerCase().includes(query) ||
             prop.address.city.toLowerCase().includes(query) ||
             prop.address.zip.includes(query)
    }
    return true
  }).sort((a, b) => {
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
      if (newFavs.has(id)) newFavs.delete(id)
      else newFavs.add(id)
      return newFavs
    })
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
    return `$${(price / 1000).toFixed(0)}K`
  }

  // Market Stats
  const stats = {
    totalListings: filteredProperties.length,
    medianPrice: Math.round(filteredProperties.reduce((a, b) => a + b.price, 0) / filteredProperties.length || 0),
    avgDaysOnMarket: Math.round(filteredProperties.reduce((a, b) => a + b.daysOnMarket, 0) / filteredProperties.length || 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find Your Dream Home in Southwest Florida
          </h1>
          <p className="text-xl text-blue-100 text-center mb-8">
            {stats.totalListings.toLocaleString()} homes available • Median price {formatPrice(stats.medianPrice)}
          </p>
          
          {/* Main Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by address, city, or ZIP code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-4 rounded-lg text-gray-900 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-xl mt-4 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Price Range</label>
                  <select
                    value={priceRange.label}
                    onChange={(e) => setPriceRange(PRICE_RANGES.find(p => p.label === e.target.value) || PRICE_RANGES[0])}
                    className="w-full p-3 border rounded-lg text-gray-900"
                  >
                    {PRICE_RANGES.map(range => (
                      <option key={range.label} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Bedrooms</label>
                  <select
                    value={minBeds}
                    onChange={(e) => setMinBeds(e.target.value)}
                    className="w-full p-3 border rounded-lg text-gray-900"
                  >
                    {BEDS.map(bed => (
                      <option key={bed} value={bed}>{bed}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full p-3 border rounded-lg text-gray-900"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border rounded-lg text-gray-900"
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

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} Homes for Sale
              {selectedCity !== 'All Cities' && ` in ${selectedCity}`}
            </h2>
            <p className="text-gray-600">
              Avg. {stats.avgDaysOnMarket} days on market • Updated just now
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded ${viewMode === 'map' ? 'bg-white shadow' : ''}`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">No properties found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : 'h-64'}`}>
                  <img
                    src={property.photos[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
                    alt={property.address.full}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    property.status === 'Active' ? 'bg-green-500 text-white' :
                    property.status === 'Pending' ? 'bg-yellow-500 text-white' :
                    property.status === 'Sold' ? 'bg-red-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {property.status}
                  </div>
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  {/* Days on Market */}
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {property.daysOnMarket} days
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      ${property.price.toLocaleString()}
                    </h3>
                    {property.pricePerSqft && (
                      <span className="text-sm text-gray-500">${property.pricePerSqft}/sqft</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-700 mb-3">
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

                  <p className="text-gray-600 flex items-start gap-1 mb-3">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    {property.address.full}, {property.address.city}, {property.address.state} {property.address.zip}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Agent & Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{property.agent?.name}</span>
                      <br />
                      <span className="text-blue-600">{property.agent?.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <Link
                        href={`/property/${property.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Market Stats Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6 text-center">Southwest Florida Real Estate Market</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">24,000+</div>
              <div className="text-gray-400">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">$485K</div>
              <div className="text-gray-400">Median Home Price</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400">42</div>
              <div className="text-gray-400">Avg Days on Market</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400">+2.3%</div>
              <div className="text-gray-400">Price Change (30 days)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
