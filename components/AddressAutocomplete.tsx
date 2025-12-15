'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'

interface AddressResult {
  display_name: string
  address: {
    house_number?: string
    road?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
    county?: string
    country?: string
  }
  lat: string
  lon: string
}

interface AddressAutocompleteProps {
  onSelect: (address: {
    address: string
    city: string
    state: string
    zip_code: string
    county: string
    latitude: number
    longitude: number
  }) => void
  defaultValue?: string
  placeholder?: string
  className?: string
}

export default function AddressAutocomplete({ 
  onSelect, 
  defaultValue = '', 
  placeholder = 'Start typing an address...',
  className = ''
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<AddressResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search using Nominatim (OpenStreetMap) - FREE
  const searchAddress = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      // Nominatim is 100% free, just respect their usage policy (1 req/sec)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `countrycodes=us&` +
        `limit=5`,
        {
          headers: {
            'User-Agent': 'CR-Realtor-Platform/1.0'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setShowDropdown(data.length > 0)
      }
    } catch (error) {
      console.error('Address search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setSelectedIndex(-1)
    
    // Debounce API calls (respect Nominatim's 1 req/sec limit)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchAddress(value), 500)
  }

  const handleSelect = (result: AddressResult) => {
    const addr = result.address
    const streetAddress = [addr.house_number, addr.road].filter(Boolean).join(' ')
    const city = addr.city || addr.town || addr.village || ''
    
    // Get state abbreviation
    const stateAbbr = getStateAbbreviation(addr.state || '')
    
    setQuery(streetAddress || result.display_name.split(',')[0])
    setShowDropdown(false)
    
    onSelect({
      address: streetAddress || result.display_name.split(',')[0],
      city: city,
      state: stateAbbr,
      zip_code: addr.postcode || '',
      county: addr.county?.replace(' County', '') || '',
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-2.5 text-gray-400 animate-spin" size={18} />
        )}
        {query && !loading && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(result)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 flex items-start gap-3 ${
                selectedIndex === index ? 'bg-blue-50' : ''
              }`}
            >
              <MapPin className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {result.display_name.split(',')[0]}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {result.display_name.split(',').slice(1, 4).join(',')}
                </p>
              </div>
            </button>
          ))}
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t">
            Powered by OpenStreetMap
          </div>
        </div>
      )}
    </div>
  )
}

// State name to abbreviation mapping
function getStateAbbreviation(stateName: string): string {
  const states: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY'
  }
  const abbr = states[stateName.toLowerCase()]
  return abbr || stateName.substring(0, 2).toUpperCase()
}
