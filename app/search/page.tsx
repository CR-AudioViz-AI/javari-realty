'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  Bed,
  Bath,
  Square,
  Heart,
  Home,
  Building2,
  Grid,
  List,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  property_type: string
  status: string
  photos: string[]
}

export default function PropertySearchPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')

  const [filters, setFilters] = useState({
    search: '',
    city: '',
    min_price: '',
    max_price: '',
    min_beds: '',
    min_baths: '',
    property_type: '',
  })

  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Villa', 'Multi-Family', 'Land']
  const cities = ['Naples', 'Fort Myers', 'Bonita Springs', 'Cape Coral', 'Marco Island', 'Estero']

  useEffect(() => {
    loadProperties()
    checkCustomer()
  }, [])

  async function loadProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties((data || []) as Property[])
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  async function checkCustomer() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (customer) {
      setCustomerId(customer.id)
      
      const { data: saved } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('customer_id', customer.id)

      if (saved) {
        setSavedIds(saved.map((s: { property_id: string }) => s.property_id))
      }
    }
  }

  async function toggleSave(property: Property, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!customerId) {
      router.push('/customer/login')
      return
    }

    if (savedIds.includes(property.id)) {
      await supabase.from('saved_properties').delete().eq('customer_id', customerId).eq('property_id', property.id)
      setSavedIds(prev => prev.filter(id => id !== property.id))
    } else {
      await supabase.from('saved_properties').insert({ customer_id: customerId, property_id: property.id })
      setSavedIds(prev => [...prev, property.id])
    }
  }

  const filtered = properties.filter(p => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!p.address.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.zip.includes(q)) return false
    }
    if (filters.city && p.city !== filters.city) return false
    if (filters.min_price && p.price < parseInt(filters.min_price)) return false
    if (filters.max_price && p.price > parseInt(filters.max_price)) return false
    if (filters.min_beds && p.bedrooms < parseInt(filters.min_beds)) return false
    if (filters.min_baths && p.bathrooms < parseInt(filters.min_baths)) return false
    if (filters.property_type && p.property_type !== filters.property_type) return false
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price
      case 'price_high': return b.price - a.price
      case 'beds': return b.bedrooms - a.bedrooms
      case 'sqft': return b.sqft - a.sqft
      default: return 0
    }
  })

  const formatPrice = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const activeFiltersCount = Object.values(filters).filter(v => v).length

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/customer/dashboard" className="text-gray-600 hover:text-blue-600">My Dashboard</Link>
              <Link href="/customer/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign In</Link>
            </div>
          </div>
        </div>
      </header>

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
              {activeFiltersCount > 0 && <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">{activeFiltersCount}</span>}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select value={filters.city} onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">All Cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <div className="flex gap-2">
                    <input type="number" value={filters.min_price} onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))} placeholder="Min" className="w-1/2 px-3 py-2 border rounded-lg" />
                    <input type="number" value={filters.max_price} onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))} placeholder="Max" className="w-1/2 px-3 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beds & Baths</label>
                  <div className="flex gap-2">
                    <select value={filters.min_beds} onChange={(e) => setFilters(prev => ({ ...prev, min_beds: e.target.value }))} className="w-1/2 px-3 py-2 border rounded-lg">
                      <option value="">Beds</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                    <select value={filters.min_baths} onChange={(e) => setFilters(prev => ({ ...prev, min_baths: e.target.value }))} className="w-1/2 px-3 py-2 border rounded-lg">
                      <option value="">Baths</option>
                      {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select value={filters.property_type} onChange={(e) => setFilters(prev => ({ ...prev, property_type: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">All Types</option>
                    {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setFilters({ search: '', city: '', min_price: '', max_price: '', min_beds: '', min_baths: '', property_type: '' })} className="text-sm text-blue-600 hover:text-blue-700">
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600"><span className="font-semibold text-gray-900">{filtered.length}</span> homes found</p>
          <div className="flex items-center gap-4">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-lg bg-white text-sm">
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="beds">Most Bedrooms</option>
              <option value="sqft">Largest</option>
            </select>
            <div className="flex gap-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}><Grid className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}><List className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : filtered.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(property => (
                <Link key={property.id} href={`/property/${property.id}`} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition group">
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    {property.photos?.[0] ? (
                      <img src={property.photos[0]} alt={property.address} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-400" />
                    )}
                    <button onClick={(e) => toggleSave(property, e)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow hover:bg-white transition">
                      <Heart className={`w-5 h-5 ${savedIds.includes(property.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                    </button>
                    <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">{property.property_type}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                    <p className="text-gray-600 truncate">{property.address}</p>
                    <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zip}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms}</span>
                      <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.sqft?.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(property => (
                <Link key={property.id} href={`/property/${property.id}`} className="bg-white rounded-xl border p-4 hover:shadow-md transition flex gap-4">
                  <div className="w-48 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    {property.photos?.[0] ? (
                      <img src={property.photos[0]} alt={property.address} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                        <p className="text-gray-600">{property.address}</p>
                        <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zip}</p>
                      </div>
                      <button onClick={(e) => toggleSave(property, e)} className="p-2 hover:bg-gray-100 rounded-full">
                        <Heart className={`w-5 h-5 ${savedIds.includes(property.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms} beds</span>
                      <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms} baths</span>
                      <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.sqft?.toLocaleString()} sqft</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{property.property_type}</span>
                    </div>
                  </div>
                </Link>
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
