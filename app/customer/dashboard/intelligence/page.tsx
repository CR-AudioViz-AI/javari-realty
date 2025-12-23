// app/customer/dashboard/intelligence/page.tsx
// Property Intelligence Hub - Customer Dashboard
'use client'

import { useState, useCallback } from 'react'
import { 
  Search, 
  MapPin, 
  Shield, 
  TrendingUp,
  History,
  Bookmark,
  Info
} from 'lucide-react'
import PropertyIntelligenceCard from '@/components/intelligence/PropertyIntelligenceCard'

// Florida county FIPS codes for demo
const FLORIDA_COUNTIES: Record<string, string> = {
  'Lee': '12071',
  'Collier': '12021',
  'Charlotte': '12015',
  'Miami-Dade': '12086',
  'Broward': '12011',
  'Palm Beach': '12099',
  'Orange': '12095',
  'Hillsborough': '12057',
  'Pinellas': '12103',
  'Duval': '12031'
}

export default function IntelligencePage() {
  const [address, setAddress] = useState('')
  const [searchedAddress, setSearchedAddress] = useState('')
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [fipsCode, setFipsCode] = useState<string>('12071') // Default: Lee County
  const [selectedCounty, setSelectedCounty] = useState('Lee')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<Array<{
    address: string
    lat: number
    lng: number
    fips: string
    score?: number
  }>>([])

  const geocodeAddress = useCallback(async (searchAddress: string) => {
    setIsSearching(true)
    setError(null)

    try {
      // Using Nominatim (OpenStreetMap) for geocoding - free, no API key
      const encodedAddress = encodeURIComponent(searchAddress)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=us`,
        {
          headers: {
            'User-Agent': 'CRRealtorPlatform/1.0'
          }
        }
      )

      if (!response.ok) throw new Error('Geocoding failed')

      const results = await response.json()

      if (!results || results.length === 0) {
        throw new Error('Address not found. Please try a more specific address.')
      }

      const result = results[0]
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)

      setCoordinates({ lat, lng })
      setSearchedAddress(searchAddress)
      setFipsCode(FLORIDA_COUNTIES[selectedCounty] || '12071')

    } catch (err: any) {
      setError(err.message || 'Failed to find address')
      setCoordinates(null)
    } finally {
      setIsSearching(false)
    }
  }, [selectedCounty])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      geocodeAddress(address.trim())
    }
  }

  const handleDataLoaded = (data: any) => {
    if (data?.propertyScore && coordinates) {
      // Add to recent searches
      setRecentSearches(prev => {
        const newSearch = {
          address: searchedAddress,
          lat: coordinates.lat,
          lng: coordinates.lng,
          fips: fipsCode,
          score: data.propertyScore.score
        }
        const filtered = prev.filter(s => s.address !== searchedAddress)
        return [newSearch, ...filtered].slice(0, 5)
      })
    }
  }

  const loadRecentSearch = (search: typeof recentSearches[0]) => {
    setAddress(search.address)
    setSearchedAddress(search.address)
    setCoordinates({ lat: search.lat, lng: search.lng })
    setFipsCode(search.fips)
  }

  // Demo addresses for quick testing
  const demoAddresses = [
    { label: 'Fort Myers Beach', address: '1000 Estero Blvd, Fort Myers Beach, FL 33931', county: 'Lee' },
    { label: 'Naples Downtown', address: '800 5th Ave S, Naples, FL 34102', county: 'Collier' },
    { label: 'Cape Coral', address: '1015 Cultural Park Blvd, Cape Coral, FL 33990', county: 'Lee' },
    { label: 'Miami Beach', address: '1000 Ocean Drive, Miami Beach, FL 33139', county: 'Miami-Dade' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Property Intelligence Hub</h1>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Get comprehensive risk assessments for any property using data from FEMA, EPA, USGS, 
            and the National Weather Service. Make informed decisions with government-verified data.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Address Input */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter a Florida address..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* County Selector */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County
                </label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(FLORIDA_COUNTIES).map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSearching || !address.trim()}
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Demo Addresses */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Try a demo address:</p>
            <div className="flex flex-wrap gap-2">
              {demoAddresses.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAddress(demo.address)
                    setSelectedCounty(demo.county)
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Intelligence Card - Main Area */}
          <div className="lg:col-span-2">
            {coordinates ? (
              <PropertyIntelligenceCard
                address={searchedAddress}
                lat={coordinates.lat}
                lng={coordinates.lng}
                fipsCode={fipsCode}
                onDataLoaded={handleDataLoaded}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Enter an Address to Begin
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Search for any Florida property to get a comprehensive risk assessment 
                  including flood zones, disaster history, environmental hazards, and more.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-500" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadRecentSearch(search)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {search.address}
                        </p>
                        {search.score !== undefined && (
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            search.score >= 80 ? 'bg-green-100 text-green-700' :
                            search.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {search.score}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Data Sources Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-500" />
                Data Sources
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">FEMA</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Flood Zones</p>
                    <p className="text-gray-500">National Flood Hazard Layer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600">FEMA</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Disaster History</p>
                    <p className="text-gray-500">OpenFEMA Declarations API</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-green-600">EPA</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Environmental</p>
                    <p className="text-gray-500">Envirofacts Database</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-600">USGS</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Earthquakes</p>
                    <p className="text-gray-500">Earthquake Catalog API</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-sky-600">NWS</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Weather</p>
                    <p className="text-gray-500">National Weather Service API</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Pro Tip
              </h3>
              <p className="text-sm text-blue-800">
                Properties in flood Zone X with a score above 80 typically have the lowest 
                insurance costs and fewest regulatory restrictions. Look for these when 
                advising first-time buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
