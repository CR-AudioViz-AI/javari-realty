'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Search, MapPin, Home, Bed, Bath, Square, DollarSign,
  Filter, Grid, List, Map, Heart, Share2, ChevronDown,
  SlidersHorizontal, X, Loader2, TrendingUp, Building2,
  Clock, Eye, ArrowUpDown, Check, RefreshCw, Wifi, WifiOff,
  ExternalLink, AlertCircle
} from 'lucide-react'

interface PropertyListing {
  id: string
  mlsId: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  lotSize?: string
  yearBuilt?: number
  propertyType: string
  style?: string
  status: string
  daysOnMarket: number
  photos: string[]
  description?: string
  features: string[]
  lat?: number
  lng?: number
  agent?: { name: string; id: string }
  office?: string
  pricePerSqft?: number
  source: string
}

const PROPERTY_TYPES = ['All Types', 'Residential', 'Condo', 'Townhouse', 'Land', 'Multi-Family']
const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 0 },
  { label: 'Under $300K', min: 0, max: 300000 },
  { label: '$300K - $500K', min: 300000, max: 500000 },
  { label: '$500K - $750K', min: 500000, max: 750000 },
  { label: '$750K - $1M', min: 750000, max: 1000000 },
  { label: '$1M - $2M', min: 1000000, max: 2000000 },
  { label: 'Over $2M', min: 2000000, max: 0 },
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null)
  const [apiSource, setApiSource] = useState<string>('')
  
  // Filters
  const [propertyType, setPropertyType] = useState('All Types')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0])
  const [minBeds, setMinBeds] = useState('Any')
  const [minBaths, setMinBaths] = useState('Any')
  const [sortBy, setSortBy] = useState('newest')
  const [statusFilter, setStatusFilter] = useState<string>('active')

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        limit: '24',
        status: statusFilter === 'all' ? '' : statusFilter,
      })
      
      if (priceRange.min > 0) params.set('minprice', String(priceRange.min))
      if (priceRange.max > 0) params.set('maxprice', String(priceRange.max))
      if (minBeds !== 'Any') params.set('minbeds', minBeds.replace('+', ''))
      if (minBaths !== 'Any') params.set('minbaths', minBaths.replace('+', ''))
      if (propertyType !== 'All Types') params.set('type', propertyType.toLowerCase())
      if (searchQuery) params.set('q', searchQuery)
      
      const response = await fetch(`/api/listings?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        let results = data.listings
        
        // Client-side sorting
        switch (sortBy) {
          case 'price_asc': results.sort((a: PropertyListing, b: PropertyListing) => a.price - b.price); break
          case 'price_desc': results.sort((a: PropertyListing, b: PropertyListing) => b.price - a.price); break
          case 'beds': results.sort((a: PropertyListing, b: PropertyListing) => b.beds - a.beds); break
          case 'sqft': results.sort((a: PropertyListing, b: PropertyListing) => b.sqft - a.sqft); break
          default: results.sort((a: PropertyListing, b: PropertyListing) => a.daysOnMarket - b.daysOnMarket)
        }
        
        setListings(results)
        setApiSource(data.source || 'API')
      } else {
        setError(data.error || 'Failed to load listings')
      }
    } catch (err) {
      setError('Failed to connect to listings API')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [propertyType, priceRange, minBeds, minBaths, sortBy, statusFilter])

  const handleSearch = () => {
    fetchListings()
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-amber-100 text-amber-800',
      sold: 'bg-blue-100 text-blue-800',
      closed: 'bg-gray-100 text-gray-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status.toLowerCase()] || styles.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Search */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Search /> Property Search
            <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded ml-2">
              Live MLS Data
            </span>
          </h1>
          
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city, ZIP, address, or MLS#..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="all">All Status</option>
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
            <h2 className="text-xl font-bold flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Searching...
                </>
              ) : (
                <>
                  {listings.length} Properties Found
                  <Wifi className="text-green-500" size={18} />
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              {apiSource && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                  {apiSource}
                </span>
              )}
              {searchQuery ? `Results for "${searchQuery}"` : 'All available listings'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={fetchListings}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              title="Refresh listings"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            
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
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={24} />
              <div>
                <p className="font-semibold text-red-800">Error Loading Listings</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <button
                onClick={fetchListings}
                className="ml-auto bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Fetching live MLS listings...</p>
            </div>
          </div>
        )}

        {/* Grid View */}
        {!loading && !error && viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {listing.photos && listing.photos.length > 0 ? (
                    <img
                      src={listing.photos[0]}
                      alt={listing.address}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Home className="text-gray-400" size={48} />
                    </div>
                  )}
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
                  {listing.photos && listing.photos.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{listing.photos.length - 1} photos
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <p className="text-2xl font-bold text-green-600">${listing.price.toLocaleString()}</p>
                    {listing.pricePerSqft && (
                      <span className="text-xs text-gray-500">${listing.pricePerSqft}/sqft</span>
                    )}
                  </div>
                  <p className="font-semibold mt-1 truncate">{listing.address}</p>
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

                  {listing.features && listing.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {listing.features.slice(0, 2).map((f, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded truncate max-w-24">{f}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-400">
                    <span>MLS# {listing.mlsId}</span>
                    <span>{listing.source}</span>
                  </div>

                  <button 
                    onClick={() => setSelectedListing(listing)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && !error && viewMode === 'list' && (
          <div className="space-y-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-xl border p-4 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img src={listing.photos[0]} alt={listing.address} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="text-gray-400" size={32} />
                      </div>
                    )}
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
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <span className="flex items-center gap-1"><Bed size={16} /> {listing.beds} beds</span>
                      <span className="flex items-center gap-1"><Bath size={16} /> {listing.baths} baths</span>
                      <span className="flex items-center gap-1"><Square size={16} /> {listing.sqft.toLocaleString()} sqft</span>
                      {listing.pricePerSqft && <span className="text-gray-500">${listing.pricePerSqft}/sqft</span>}
                      <span className="text-gray-500">{listing.daysOnMarket} days</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">MLS# {listing.mlsId}</span>
                      <button 
                        onClick={() => setSelectedListing(listing)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && listings.length === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Home className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setPropertyType('All Types')
                setPriceRange(PRICE_RANGES[0])
                setMinBeds('Any')
                setMinBaths('Any')
                setSearchQuery('')
                fetchListings()
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* API Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Wifi className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-blue-800 mb-2">Live MLS Integration</h3>
              <p className="text-sm text-blue-700 mb-3">
                This search is powered by SimplyRETS API providing real MLS listing data format. 
                Demo data is displayed from the free tier.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white px-3 py-1 rounded-lg text-xs text-gray-600 border">
                  Real-time updates
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-xs text-gray-600 border">
                  MLS-standard data
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-xs text-gray-600 border">
                  Property photos
                </span>
                <span className="bg-white px-3 py-1 rounded-lg text-xs text-gray-600 border">
                  Agent info
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedListing(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header Image */}
            <div className="relative h-64 bg-gray-200">
              {selectedListing.photos && selectedListing.photos.length > 0 ? (
                <img src={selectedListing.photos[0]} alt={selectedListing.address} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="text-gray-400" size={64} />
                </div>
              )}
              <button 
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-4">
                {getStatusBadge(selectedListing.status)}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-3xl font-bold text-green-600">${selectedListing.price.toLocaleString()}</p>
                  <p className="text-xl font-semibold mt-1">{selectedListing.address}</p>
                  <p className="text-gray-500">{selectedListing.city}, {selectedListing.state} {selectedListing.zip}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <Heart size={20} />
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 border-y">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedListing.beds}</p>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedListing.baths}</p>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedListing.sqft.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Sq Ft</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedListing.yearBuilt || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Year Built</p>
                </div>
              </div>

              {selectedListing.description && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{selectedListing.description}</p>
                </div>
              )}

              {selectedListing.features && selectedListing.features.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedListing.features.map((f, idx) => (
                      <span key={idx} className="bg-gray-100 px-3 py-1 rounded-lg text-sm">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                <span>MLS# {selectedListing.mlsId}</span>
                <span>{selectedListing.daysOnMarket} days on market</span>
                <span>Source: {selectedListing.source}</span>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                  Schedule Tour
                </button>
                <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-semibold">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
