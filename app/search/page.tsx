'use client'

import { useState, useEffect } from 'react'
import {
  Search, MapPin, Home, Bed, Bath, Square, DollarSign,
  Filter, Grid, List, Map, Heart, Share2, ChevronDown,
  SlidersHorizontal, X, Loader2, TrendingUp, Building2,
  Clock, Eye, ArrowUpDown, Check
} from 'lucide-react'

interface PropertyListing {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  lotSize?: number
  yearBuilt?: number
  propertyType: string
  status: 'for_sale' | 'pending' | 'sold' | 'for_rent'
  daysOnMarket: number
  photos: string[]
  description?: string
  features: string[]
  lat?: number
  lng?: number
  mls?: string
  source: string
  pricePerSqft?: number
}

// Sample data simulating API response
const SAMPLE_LISTINGS: PropertyListing[] = [
  {
    id: '1',
    address: '2850 Winkler Ave',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33916',
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    yearBuilt: 2018,
    propertyType: 'Single Family',
    status: 'for_sale',
    daysOnMarket: 14,
    photos: [],
    features: ['Pool', 'Updated Kitchen', '2-Car Garage'],
    source: 'MLS',
    pricePerSqft: 177
  },
  {
    id: '2',
    address: '1420 SE 47th St',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33904',
    price: 389000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    yearBuilt: 2015,
    propertyType: 'Single Family',
    status: 'for_sale',
    daysOnMarket: 28,
    photos: [],
    features: ['Gulf Access', 'Boat Dock', 'Open Floor Plan'],
    source: 'Zillow',
    pricePerSqft: 185
  },
  {
    id: '3',
    address: '3500 Oasis Blvd',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33914',
    price: 459000,
    beds: 4,
    baths: 2.5,
    sqft: 2650,
    yearBuilt: 2020,
    propertyType: 'Single Family',
    status: 'pending',
    daysOnMarket: 7,
    photos: [],
    features: ['Pool', 'Smart Home', 'Impact Windows', 'Solar'],
    source: 'Realtor.com',
    pricePerSqft: 173
  },
  {
    id: '4',
    address: '8901 Cypress Lake Dr',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33919',
    price: 675000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    yearBuilt: 2021,
    propertyType: 'Single Family',
    status: 'for_sale',
    daysOnMarket: 5,
    photos: [],
    features: ['Pool', 'Lake View', '3-Car Garage', 'Gourmet Kitchen'],
    source: 'MLS',
    pricePerSqft: 211
  },
  {
    id: '5',
    address: '15620 Laguna Hills Dr',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33908',
    price: 525000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    yearBuilt: 2019,
    propertyType: 'Single Family',
    status: 'for_sale',
    daysOnMarket: 21,
    photos: [],
    features: ['Pool', 'Screened Lanai', 'Tile Throughout'],
    source: 'Redfin',
    pricePerSqft: 188
  },
  {
    id: '6',
    address: '4521 Del Prado Blvd S',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33904',
    price: 299000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    yearBuilt: 2010,
    propertyType: 'Condo',
    status: 'for_sale',
    daysOnMarket: 35,
    photos: [],
    features: ['Community Pool', 'Fitness Center', 'Updated'],
    source: 'Zillow',
    pricePerSqft: 181
  },
  {
    id: '7',
    address: '1850 NE Pine Island Rd',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33909',
    price: 849000,
    beds: 5,
    baths: 4.5,
    sqft: 4100,
    yearBuilt: 2022,
    propertyType: 'Single Family',
    status: 'for_sale',
    daysOnMarket: 3,
    photos: [],
    features: ['Gulf Access', 'Pool', 'Dock', 'Smart Home', 'Solar'],
    source: 'MLS',
    pricePerSqft: 207
  },
  {
    id: '8',
    address: '12780 Kenwood Ln',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33913',
    price: 375000,
    beds: 3,
    baths: 2,
    sqft: 1900,
    yearBuilt: 2016,
    propertyType: 'Single Family',
    status: 'for_sale',
    daysOnMarket: 18,
    photos: [],
    features: ['Community Pool', 'Clubhouse', 'Gated'],
    source: 'Realtor.com',
    pricePerSqft: 197
  }
]

const PROPERTY_TYPES = ['All Types', 'Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land']
const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under $300K', min: 0, max: 300000 },
  { label: '$300K - $500K', min: 300000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: 'Over $1M', min: 1000000, max: Infinity },
]
const BED_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+']
const BATH_OPTIONS = ['Any', '1+', '2+', '3+', '4+']
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Beds', value: 'beds' },
  { label: 'Sqft', value: 'sqft' },
]

export default function PropertySearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Filters
  const [propertyType, setPropertyType] = useState('All Types')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0])
  const [minBeds, setMinBeds] = useState('Any')
  const [minBaths, setMinBaths] = useState('Any')
  const [sortBy, setSortBy] = useState('newest')
  const [statusFilter, setStatusFilter] = useState<'all' | 'for_sale' | 'pending' | 'sold'>('for_sale')

  // Simulate API search
  const searchProperties = async () => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let results = [...SAMPLE_LISTINGS]
    
    // Apply filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(p => 
        p.city.toLowerCase().includes(query) ||
        p.address.toLowerCase().includes(query) ||
        p.zip.includes(query)
      )
    }
    
    if (propertyType !== 'All Types') {
      results = results.filter(p => p.propertyType === propertyType)
    }
    
    results = results.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
    
    if (minBeds !== 'Any') {
      const beds = parseInt(minBeds)
      results = results.filter(p => p.beds >= beds)
    }
    
    if (minBaths !== 'Any') {
      const baths = parseInt(minBaths)
      results = results.filter(p => p.baths >= baths)
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(p => p.status === statusFilter)
    }
    
    // Sort
    switch (sortBy) {
      case 'price_asc': results.sort((a, b) => a.price - b.price); break
      case 'price_desc': results.sort((a, b) => b.price - a.price); break
      case 'beds': results.sort((a, b) => b.beds - a.beds); break
      case 'sqft': results.sort((a, b) => b.sqft - a.sqft); break
      default: results.sort((a, b) => a.daysOnMarket - b.daysOnMarket)
    }
    
    setListings(results)
    setLoading(false)
  }

  useEffect(() => {
    searchProperties()
  }, [propertyType, priceRange, minBeds, minBaths, sortBy, statusFilter])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const getStatusBadge = (status: PropertyListing['status']) => {
    const styles = {
      for_sale: 'bg-green-100 text-green-800',
      pending: 'bg-amber-100 text-amber-800',
      sold: 'bg-blue-100 text-blue-800',
      for_rent: 'bg-purple-100 text-purple-800'
    }
    const labels = {
      for_sale: 'For Sale',
      pending: 'Pending',
      sold: 'Sold',
      for_rent: 'For Rent'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Search */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Search /> Find Your Dream Home
          </h1>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city, ZIP, or address..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && searchProperties()}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal size={20} />
                Filters
                {showFilters && <X size={16} />}
              </button>
              
              <button
                onClick={searchProperties}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Search size={20} />
                Search
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price Range</label>
                  <select
                    value={priceRange.label}
                    onChange={(e) => setPriceRange(PRICE_RANGES.find(p => p.label === e.target.value) || PRICE_RANGES[0])}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {PRICE_RANGES.map(range => (
                      <option key={range.label} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Bedrooms</label>
                  <select
                    value={minBeds}
                    onChange={(e) => setMinBeds(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {BED_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Bathrooms</label>
                  <select
                    value={minBaths}
                    onChange={(e) => setMinBaths(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {BATH_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All</option>
                    <option value="for_sale">For Sale</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Results Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {loading ? 'Searching...' : `${listings.length} Properties Found`}
            </h2>
            <p className="text-sm text-gray-500">
              {searchQuery ? `Results for "${searchQuery}"` : 'Southwest Florida'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                <Map size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Home className="text-gray-400" size={48} />
                  </div>
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(listing.status)}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1">
                    <button 
                      onClick={() => toggleFavorite(listing.id)}
                      className={`p-1.5 rounded-full shadow ${
                        favorites.includes(listing.id) ? 'bg-red-500 text-white' : 'bg-white'
                      }`}
                    >
                      <Heart size={16} fill={favorites.includes(listing.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-1.5 bg-white rounded-full shadow">
                      <Share2 size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {listing.daysOnMarket} days on market
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 text-gray-700 px-2 py-1 rounded text-xs">
                    {listing.source}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-2xl font-bold text-green-600">${listing.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">${listing.pricePerSqft}/sqft</p>
                  <p className="font-semibold mt-2">{listing.address}</p>
                  <p className="text-sm text-gray-500">{listing.city}, {listing.state} {listing.zip}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Bed size={16} /> {listing.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={16} /> {listing.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Square size={16} /> {listing.sqft.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {listing.features.slice(0, 3).map(f => (
                      <span key={f} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{f}</span>
                    ))}
                  </div>

                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Eye size={16} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === 'list' && (
          <div className="space-y-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl border p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="text-gray-400" size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-2xl font-bold text-green-600">${listing.price.toLocaleString()}</p>
                          {getStatusBadge(listing.status)}
                        </div>
                        <p className="font-semibold">{listing.address}</p>
                        <p className="text-sm text-gray-500">{listing.city}, {listing.state} {listing.zip}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleFavorite(listing.id)}
                          className={`p-2 rounded-lg border ${favorites.includes(listing.id) ? 'bg-red-50 border-red-200 text-red-500' : ''}`}
                        >
                          <Heart size={18} fill={favorites.includes(listing.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button className="p-2 rounded-lg border">
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <span className="flex items-center gap-1"><Bed size={16} /> {listing.beds} beds</span>
                      <span className="flex items-center gap-1"><Bath size={16} /> {listing.baths} baths</span>
                      <span className="flex items-center gap-1"><Square size={16} /> {listing.sqft.toLocaleString()} sqft</span>
                      <span className="text-gray-500">${listing.pricePerSqft}/sqft</span>
                      <span className="text-gray-500">{listing.daysOnMarket} days</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1">
                        {listing.features.map(f => (
                          <span key={f} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{f}</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">via {listing.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {!loading && viewMode === 'map' && (
          <div className="bg-white rounded-xl border p-6">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-600 font-medium">Interactive Map View</p>
                <p className="text-sm text-gray-500">Map integration with property markers</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && listings.length === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Home className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* API Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-3">🔌 API Integration Ready</h3>
          <p className="text-sm text-blue-700 mb-4">
            This search is powered by sample data. Connect to real MLS feeds with these free-tier APIs:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-sm">RapidAPI - Realtor</p>
              <p className="text-xs text-gray-500">100 req/month FREE</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-sm">RapidAPI - Zillow</p>
              <p className="text-xs text-gray-500">Free tier available</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-sm">Apify MLS Scraper</p>
              <p className="text-xs text-gray-500">Free trial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
