'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, MapPin, Bed, Bath, Square, Heart, 
  SlidersHorizontal, X, Loader2, RefreshCw,
  Grid3X3, List, Home, Calendar, DollarSign,
  TrendingDown, Sparkles, Building, ChevronLeft, ChevronRight
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
  yearBuilt?: number
  propertyType: string
  status: string
  photos: string[]
  description?: string
  mlsNumber?: string
  daysOnMarket?: number
  lotSize?: string
  source: string
  listingAgent?: {
    name: string
    brokerage?: string
  }
}

// Convert thumbnail URL to FULL HD original resolution
function getHighResPhoto(url: string): string {
  if (!url) return ''
  
  // Realtor.com photos: change 's' suffix to 'o' for ORIGINAL full resolution
  // Thumbnail: https://ap.rdcpix.com/xxx-m745489497s.jpg (3.9 KB - blurry)
  // Original:  https://ap.rdcpix.com/xxx-m745489497o.jpg (204 KB - FULL HD!)
  if (url.includes('rdcpix.com')) {
    // Replace 's' suffix with 'o' for original quality
    // Pattern: -m{numbers}s.jpg or -b{numbers}s.jpg or -f{numbers}s.jpg
    return url
      .replace(/(-[mbfe]\d+)s\.jpg$/i, '$1o.jpg')
      .replace(/(-[mbfe]\d+)s\.webp$/i, '$1o.webp')
      .replace(/(-[mbfe]\d+)s\.png$/i, '$1o.png')
  }
  
  return url
}

// Placeholder for properties without photos
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [properties, setProperties] = useState<PropertyListing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sources, setSources] = useState<string[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<string, number>>({})
  
  // Filters
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [beds, setBeds] = useState('')
  const [baths, setBaths] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const US_STATES = [
    { code: '', name: 'All States' },
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
  ]

  const searchProperties = async () => {
    if (!searchQuery.trim() && !selectedState) {
      setError('Please enter a city, ZIP code, or select a state')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Parse search query
      let city = ''
      let state = selectedState
      let zip = ''

      const query = searchQuery.trim()
      
      // Check if it's a ZIP code (5 digits)
      if (/^\d{5}$/.test(query)) {
        zip = query
      } 
      // Check if it's "City, State" format
      else if (query.includes(',')) {
        const parts = query.split(',').map(p => p.trim())
        city = parts[0]
        if (parts[1] && parts[1].length === 2) {
          state = parts[1].toUpperCase()
        } else if (parts[1]) {
          // Find state code from name
          const stateMatch = US_STATES.find(s => 
            s.name.toLowerCase() === parts[1].toLowerCase()
          )
          if (stateMatch) state = stateMatch.code
        }
      }
      // Just a city name
      else if (query) {
        city = query
      }

      // Build API URL
      const params = new URLSearchParams()
      if (city) params.append('city', city)
      if (state) params.append('state', state)
      if (zip) params.append('zip', zip)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (beds) params.append('beds', beds)
      if (baths) params.append('baths', baths)
      params.append('limit', '100') // Get more results

      const response = await fetch(`/api/mls/search?${params.toString()}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setProperties([])
      } else {
        // Filter by property type if selected
        let filteredProperties = data.properties || []
        if (propertyType) {
          filteredProperties = filteredProperties.filter((p: PropertyListing) => 
            p.propertyType.toLowerCase().includes(propertyType.toLowerCase())
          )
        }
        setProperties(filteredProperties)
        setSources(data.sources?.queried || [])
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search properties. Please try again.')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchProperties()
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const nextPhoto = (propertyId: string, totalPhotos: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalPhotos
    }))
  }

  const prevPhoto = (propertyId: string, totalPhotos: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalPhotos) % totalPhotos
    }))
  }

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setBeds('')
    setBaths('')
    setPropertyType('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Find Your Dream Home</h1>
          <p className="text-blue-100 mb-8">Search properties across the United States</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter city, ZIP code, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              {US_STATES.map(state => (
                <option key={state.code} value={state.code}>{state.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-lg flex items-center gap-2 ${
                showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            <button
              onClick={searchProperties}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 font-medium"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-800 font-semibold">Filters</h3>
                <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Min Price</label>
                  <select
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                  >
                    <option value="">No Min</option>
                    <option value="100000">$100K</option>
                    <option value="200000">$200K</option>
                    <option value="300000">$300K</option>
                    <option value="400000">$400K</option>
                    <option value="500000">$500K</option>
                    <option value="750000">$750K</option>
                    <option value="1000000">$1M</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Max Price</label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                  >
                    <option value="">No Max</option>
                    <option value="200000">$200K</option>
                    <option value="300000">$300K</option>
                    <option value="400000">$400K</option>
                    <option value="500000">$500K</option>
                    <option value="750000">$750K</option>
                    <option value="1000000">$1M</option>
                    <option value="2000000">$2M</option>
                    <option value="5000000">$5M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Beds</label>
                  <select
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Baths</label>
                  <select
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                  >
                    <option value="">All Types</option>
                    <option value="single_family">Single Family</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="multi_family">Multi-Family</option>
                    <option value="land">Land</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Data Source Banner */}
        {sources.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Live MLS Data</span>
            <span className="text-green-600">from: {sources.join(', ')}</span>
          </div>
        )}

        {/* Results Header */}
        {properties.length > 0 && (
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {properties.length} Properties Found
              </h2>
              <p className="text-gray-500">
                Results for "{searchQuery || selectedState}"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={searchProperties}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Searching MLS databases...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && !error && (
          <div className="text-center py-20">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Start Your Search</h3>
            <p className="text-gray-400 mb-6">Enter a city, ZIP code, or select a state to find properties</p>
            
            {/* Quick Search Suggestions */}
            <div className="flex flex-wrap justify-center gap-3">
              {['Naples, FL', 'Austin, TX', 'Denver, CO', 'Phoenix, AZ', 'Charlotte, NC'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion)
                    setTimeout(() => searchProperties(), 100)
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Property Grid */}
        {!loading && properties.length > 0 && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
          }>
            {properties.map((property) => {
              const photos = property.photos.length > 0 ? property.photos : [PLACEHOLDER_IMAGE]
              const currentIndex = currentPhotoIndex[property.id] || 0
              const currentPhoto = getHighResPhoto(photos[currentIndex])
              
              return viewMode === 'grid' ? (
                // Grid View Card
                <Link
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Image with Navigation */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={currentPhoto}
                      alt={property.address}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                    
                    {/* Photo Navigation */}
                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={(e) => prevPhoto(property.id, photos.length, e)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => nextPhoto(property.id, photos.length, e)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        {/* Photo Dots */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {photos.slice(0, 5).map((_, idx) => (
                            <span
                              key={idx}
                              className={`w-2 h-2 rounded-full ${
                                idx === currentIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                          {photos.length > 5 && (
                            <span className="text-white text-xs ml-1">+{photos.length - 5}</span>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        property.status === 'for_sale' ? 'bg-green-500 text-white' :
                        property.status === 'pending' ? 'bg-yellow-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {property.status === 'for_sale' ? 'Active' : 
                         property.status === 'ready_to_build' ? 'New Build' : 
                         property.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(property.id)
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white shadow-md"
                    >
                      <Heart className={`w-5 h-5 ${
                        favorites.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`} />
                    </button>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatPrice(property.price)}
                    </div>
                    
                    {/* Property Stats */}
                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.beds} bd
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.baths} ba
                      </span>
                      {property.sqft > 0 && (
                        <span className="flex items-center gap-1">
                          <Square className="w-4 h-4" />
                          {property.sqft.toLocaleString()} sqft
                        </span>
                      )}
                    </div>
                    
                    {/* Address */}
                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">
                        {property.address}, {property.city}, {property.state} {property.zip}
                      </span>
                    </div>
                    
                    {/* Property Type & Days on Market */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {property.propertyType}
                      </span>
                      {property.daysOnMarket !== undefined && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {property.daysOnMarket} days
                        </span>
                      )}
                    </div>

                    {/* Additional Details */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      {property.lotSize && (
                        <span>Lot: {property.lotSize}</span>
                      )}
                      {property.yearBuilt && (
                        <span>Built: {property.yearBuilt}</span>
                      )}
                      {property.mlsNumber && (
                        <span>MLS# {property.mlsNumber}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                // List View Card
                <Link
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all flex"
                >
                  <div className="relative w-80 flex-shrink-0">
                    <Image
                      src={currentPhoto}
                      alt={property.address}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-500 text-white">
                        {property.status === 'for_sale' ? 'Active' : property.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {formatPrice(property.price)}
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" /> {property.beds} beds
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" /> {property.baths} baths
                          </span>
                          {property.sqft > 0 && (
                            <span className="flex items-center gap-1">
                              <Square className="w-4 h-4" /> {property.sqft.toLocaleString()} sqft
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(property.id)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Heart className={`w-6 h-6 ${
                          favorites.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      {property.address}, {property.city}, {property.state} {property.zip}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{property.propertyType}</span>
                      {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
                      {property.lotSize && <span>Lot: {property.lotSize}</span>}
                      {property.daysOnMarket !== undefined && (
                        <span>{property.daysOnMarket} days on market</span>
                      )}
                    </div>
                    {property.listingAgent?.brokerage && (
                      <div className="mt-2 text-xs text-gray-400">
                        Listed by {property.listingAgent.brokerage}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
