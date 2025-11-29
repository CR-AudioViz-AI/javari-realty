'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Heart,
  Home,
  Building2,
  Grid,
  List,
  ChevronDown,
  X,
  Loader2,
  ArrowUpDown,
  Eye,
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
  property_type: string
  status: string
  photos: string[]
  description?: string
  year_built?: number
  lot_size?: number
}

export default function PropertySearchPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [filtered, setFiltered] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('newest')

  const [filters, setFilters] = useState({
    search: '',
    city: '',
    min_price: '',
    max_price: '',
    min_beds: '',
    min_baths: '',
    property_type: '',
    status: 'active',
  })

  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Villa', 'Multi-Family', 'Land']
  const cities = ['Naples', 'Fort Myers', 'Bonita Springs', 'Cape Coral', 'Marco Island', 'Estero']

  useEffect(() => {
    loadProperties()
    loadSavedProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, filters, sortBy])

  async function loadProperties() {
    // Demo properties
    const demoProperties: Property[] = [
      { id: '1', address: '123 Gulf Shore Blvd', city: 'Naples', state: 'FL', zip: '34102', price: 2850000, beds: 4, baths: 4, sqft: 3200, property_type: 'Single Family', status: 'active', photos: [], year_built: 2019 },
      { id: '2', address: '456 Pelican Bay Dr', city: 'Naples', state: 'FL', zip: '34108', price: 1250000, beds: 3, baths: 2, sqft: 2100, property_type: 'Condo', status: 'active', photos: [], year_built: 2015 },
      { id: '3', address: '789 Coconut Rd', city: 'Bonita Springs', state: 'FL', zip: '34134', price: 875000, beds: 3, baths: 2, sqft: 1800, property_type: 'Villa', status: 'active', photos: [], year_built: 2018 },
      { id: '4', address: '321 McGregor Blvd', city: 'Fort Myers', state: 'FL', zip: '33901', price: 550000, beds: 4, baths: 3, sqft: 2400, property_type: 'Single Family', status: 'active', photos: [], year_built: 2010 },
      { id: '5', address: '555 Marco Island Dr', city: 'Marco Island', state: 'FL', zip: '34145', price: 3500000, beds: 5, baths: 5, sqft: 4500, property_type: 'Single Family', status: 'active', photos: [], year_built: 2021 },
      { id: '6', address: '888 Estero Blvd', city: 'Estero', state: 'FL', zip: '33928', price: 425000, beds: 2, baths: 2, sqft: 1400, property_type: 'Condo', status: 'active', photos: [], year_built: 2017 },
      { id: '7', address: '222 Cape Coral Pkwy', city: 'Cape Coral', state: 'FL', zip: '33904', price: 650000, beds: 4, baths: 2, sqft: 2000, property_type: 'Single Family', status: 'active', photos: [], year_built: 2012 },
      { id: '8', address: '777 Vanderbilt Beach Rd', city: 'Naples', state: 'FL', zip: '34108', price: 1750000, beds: 3, baths: 3, sqft: 2800, property_type: 'Townhouse', status: 'active', photos: [], year_built: 2020 },
    ]
    setProperties(demoProperties)
    setLoading(false)
  }

  function loadSavedProperties() {
    const customer = localStorage.getItem('cr_current_customer')
    if (customer) {
      const data = JSON.parse(customer)
      setSavedIds(data.saved_properties?.map((p: any) => p.id) || [])
    }
  }

  function applyFilters() {
    let result = [...properties]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.zip.includes(q)
      )
    }

    if (filters.city) {
      result = result.filter(p => p.city === filters.city)
    }

    if (filters.min_price) {
      result = result.filter(p => p.price >= parseInt(filters.min_price))
    }

    if (filters.max_price) {
      result = result.filter(p => p.price <= parseInt(filters.max_price))
    }

    if (filters.min_beds) {
      result = result.filter(p => p.beds >= parseInt(filters.min_beds))
    }

    if (filters.min_baths) {
      result = result.filter(p => p.baths >= parseInt(filters.min_baths))
    }

    if (filters.property_type) {
      result = result.filter(p => p.property_type === filters.property_type)
    }

    if (filters.status) {
      result = result.filter(p => p.status === filters.status)
    }

    // Sort
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'beds':
        result.sort((a, b) => b.beds - a.beds)
        break
      case 'sqft':
        result.sort((a, b) => b.sqft - a.sqft)
        break
      default:
        result.sort((a, b) => b.id.localeCompare(a.id))
    }

    setFiltered(result)
  }

  function toggleSave(property: Property) {
    const customer = localStorage.getItem('cr_current_customer')
    if (!customer) {
      router.push('/customer/login')
      return
    }

    const data = JSON.parse(customer)
    const customers = JSON.parse(localStorage.getItem('cr_customers') || '[]')
    const customerIndex = customers.findIndex((c: any) => c.id === data.id)

    if (savedIds.includes(property.id)) {
      // Remove
      data.saved_properties = (data.saved_properties || []).filter((p: any) => p.id !== property.id)
      setSavedIds(prev => prev.filter(id => id !== property.id))
    } else {
      // Add
      const savedProp = {
        id: property.id,
        address: property.address,
        city: property.city,
        price: property.price,
        beds: property.beds,
        baths: property.baths,
        sqft: property.sqft,
        saved_at: new Date().toISOString(),
      }
      data.saved_properties = [...(data.saved_properties || []), savedProp]
      setSavedIds(prev => [...prev, property.id])
    }

    if (customerIndex >= 0) {
      customers[customerIndex] = data
      localStorage.setItem('cr_customers', JSON.stringify(customers))
    }
    localStorage.setItem('cr_current_customer', JSON.stringify(data))
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  }

  function clearFilters() {
    setFilters({
      search: '',
      city: '',
      min_price: '',
      max_price: '',
      min_beds: '',
      min_baths: '',
      property_type: '',
      status: 'active',
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, val]) => val && key !== 'status').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CR Realty</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/customer/dashboard" className="text-gray-600 hover:text-blue-600">
                My Dashboard
              </Link>
              <Link href="/customer/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by address, city, or ZIP..."
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-xl flex items-center gap-2 ${showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">{activeFiltersCount}</span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beds & Baths</label>
                  <div className="flex gap-2">
                    <select
                      value={filters.min_beds}
                      onChange={(e) => setFilters(prev => ({ ...prev, min_beds: e.target.value }))}
                      className="w-1/2 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Beds</option>
                      {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>{n}+</option>
                      ))}
                    </select>
                    <select
                      value={filters.min_baths}
                      onChange={(e) => setFilters(prev => ({ ...prev, min_baths: e.target.value }))}
                      className="w-1/2 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Baths</option>
                      {[1,2,3,4].map(n => (
                        <option key={n} value={n}>{n}+</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    value={filters.property_type}
                    onChange={(e) => setFilters(prev => ({ ...prev, property_type: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> homes found
          </p>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="beds">Most Bedrooms</option>
              <option value="sqft">Largest</option>
            </select>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(property => (
                <div key={property.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group">
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                    <button
                      onClick={() => toggleSave(property)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
                    >
                      <Heart className={`w-5 h-5 ${savedIds.includes(property.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                    </button>
                    <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      {property.property_type}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                    <p className="text-gray-600 truncate">{property.address}</p>
                    <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zip}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.baths}</span>
                      <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.sqft.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(property => (
                <div key={property.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition flex gap-4">
                  <div className="w-48 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                        <p className="text-gray-600">{property.address}</p>
                        <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zip}</p>
                      </div>
                      <button
                        onClick={() => toggleSave(property)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Heart className={`w-5 h-5 ${savedIds.includes(property.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.beds} beds</span>
                      <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.baths} baths</span>
                      <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.sqft.toLocaleString()} sqft</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{property.property_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="font-medium text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}
