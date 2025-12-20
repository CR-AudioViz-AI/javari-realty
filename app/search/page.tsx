'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, MapPin, Bed, Bath, Square, Heart, Grid, List,
  SlidersHorizontal, ChevronDown, Home, DollarSign, X, Info,
  Loader2, AlertCircle, RefreshCw
} from 'lucide-react'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt?: number
  status: string
  daysOnMarket?: number
  photos: string[]
  propertyType: string
  source: string
  mlsNumber?: string
  description?: string
  lotSize?: string
  pool?: boolean
  waterfront?: boolean
  listingAgent?: {
    name: string
    phone?: string
    email?: string
    brokerage?: string
  }
}

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

// Fallback placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [beds, setBeds] = useState(0)
  const [baths, setBaths] = useState(0)
  const [propertyType, setPropertyType] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  // API state
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [apiSources, setApiSources] = useState<string[]>([])
  const [totalResults, setTotalResults] = useState(0)

  // Parse search query for city/state/zip
  const parseSearchQuery = (query: string) => {
    const trimmed = query.trim()
    
    // Check if it's a zip code (5 digits)
    if (/^\d{5}$/.test(trimmed)) {
      return { zip: trimmed }
    }
    
    // Check for "City, State" format
    const cityStateMatch = trimmed.match(/^([^,]+),\s*([A-Za-z]{2})$/i)
    if (cityStateMatch) {
      return { 
        city: cityStateMatch[1].trim(), 
        state: cityStateMatch[2].toUpperCase() 
      }
    }
    
    // Check for just state code
    const stateCode = US_STATES.find(s => 
      s.code.toLowerCase() === trimmed.toLowerCase() ||
      s.name.toLowerCase() === trimmed.toLowerCase()
    )
    if (stateCode && stateCode.code) {
      return { state: stateCode.code }
    }
    
    // Default to city search
    return { city: trimmed }
  }

  // Search properties from MLS API
  const searchProperties = useCallback(async () => {
    if (!searchQuery.trim() && !selectedState) {
      setError('Please enter a city, state, or ZIP code to search')
      return
    }

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const params = new URLSearchParams()
      
      // Parse the search query
      const parsed = parseSearchQuery(searchQuery)
      if (parsed.city) params.append('city', parsed.city)
      if (parsed.state) params.append('state', parsed.state)
      if (parsed.zip) params.append('zip', parsed.zip)
      
      // Override with selected state if set
      if (selectedState) params.append('state', selectedState)
      
      // Add filters
      if (priceRange.min > 0) params.append('minPrice', priceRange.min.toString())
      if (priceRange.max > 0) params.append('maxPrice', priceRange.max.toString())
      if (beds > 0) params.append('beds', beds.toString())
      if (baths > 0) params.append('baths', baths.toString())
      
      params.append('limit', '50')

      const response = await fetch(`/api/mls/search?${params.toString()}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setProperties([])
      } else {
        setProperties(data.properties || [])
        setTotalResults(data.total || 0)
        setApiSources(data.sources?.queried || [])
        
        if (data.properties?.length === 0) {
          setError('No properties found for this location. Try a different search.')
        }
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search properties. Please try again.')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedState, priceRange, beds, baths])

  // Handle search on enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchProperties()
    }
  }

  // Toggle favorite
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

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Get property image
  const getPropertyImage = (property: Property) => {
    if (property.photos && property.photos.length > 0 && property.photos[0]) {
      return property.photos[0]
    }
    return PLACEHOLDER_IMAGE
  }

  // Filter properties by type if selected
  const filteredProperties = propertyType 
    ? properties.filter(p => p.propertyType?.toLowerCase().includes(propertyType.toLowerCase()))
    : properties

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Find Your Dream Home</h1>
          <p className="text-blue-100 mb-8">Search properties across the United States</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by city, state, or ZIP code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              />
            </div>
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            >
              {US_STATES.map(state => (
                <option key={state.code} value={state.code}>{state.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-gray-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
            
            <button
              onClick={searchProperties}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-lg p-4 mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={`${priceRange.min}-${priceRange.max}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number)
                    setPriceRange({ min, max })
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                >
                  {PRICE_RANGES.map((range, i) => (
                    <option key={i} value={`${range.min}-${range.max}`}>{range.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select
                  value={baths}
                  onChange={(e) => setBaths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                >
                  <option value="">All Types</option>
                  <option value="single">Single Family</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="multi">Multi-Family</option>
                  <option value="land">Land</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* API Sources Banner */}
        {searched && apiSources.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm">
              <strong>Live MLS Data</strong> from: {apiSources.join(', ')}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <p className="text-red-600 text-sm">Try searching for a specific city like "Naples, FL" or a ZIP code like "33901"</p>
            </div>
          </div>
        )}

        {/* Results Header */}
        {searched && !loading && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {totalResults} {totalResults === 1 ? 'Property' : 'Properties'} Found
              </h2>
              {searchQuery && (
                <p className="text-gray-500">Results for "{searchQuery}"</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={searchProperties}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Searching multiple MLS sources...</p>
            <p className="text-gray-400 text-sm">This may take a moment</p>
          </div>
        )}

        {/* Initial State - No Search Yet */}
        {!searched && !loading && (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Search for Properties</h3>
            <p className="text-gray-400">Enter a city, state, or ZIP code to find available homes</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => { setSearchQuery('Naples, FL'); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
              >
                Naples, FL
              </button>
              <button 
                onClick={() => { setSearchQuery('Cape Coral, FL'); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
              >
                Cape Coral, FL
              </button>
              <button 
                onClick={() => { setSearchQuery('Fort Myers, FL'); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
              >
                Fort Myers, FL
              </button>
              <button 
                onClick={() => { setSearchQuery('Austin, TX'); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
              >
                Austin, TX
              </button>
              <button 
                onClick={() => { setSearchQuery('Denver, CO'); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
              >
                Denver, CO
              </button>
            </div>
          </div>
        )}

        {/* Property Grid */}
        {!loading && filteredProperties.length > 0 && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
          }>
            {filteredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Property Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[4/3]'}`}>
                  <Image
                    src={getPropertyImage(property)}
                    alt={property.address}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      property.status?.toLowerCase() === 'active' || property.status === 'for_sale'
                        ? 'bg-green-500 text-white'
                        : property.status?.toLowerCase() === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {property.status === 'for_sale' ? 'Active' : property.status || 'Active'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(property.id)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                {/* Property Info */}
                <div className="p-4 flex-1">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatPrice(property.price)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 text-sm mb-2">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.beds} bd
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.baths} ba
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {property.sqft?.toLocaleString()} sqft
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-1 text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{property.propertyType || 'Single Family'}</span>
                    {property.daysOnMarket && (
                      <span className="text-gray-400">{property.daysOnMarket} days on market</span>
                    )}
                  </div>
                  
                  {/* Source Badge */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Source: {property.source}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {searched && !loading && filteredProperties.length === 0 && !error && (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Properties Found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or searching a different location</p>
          </div>
        )}
      </main>
    </div>
  )
}
