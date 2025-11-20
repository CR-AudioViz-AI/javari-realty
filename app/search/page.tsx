import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Filter, Map, List, Grid, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'

interface SearchParams {
  location?: string
  type?: string
  min?: string
  max?: string
  beds?: string
  baths?: string
  page?: string
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createClient()
  
  // Parse filters
  const location = searchParams.location || ''
  const propertyType = searchParams.type || ''
  const minPrice = parseInt(searchParams.min || '0')
  const maxPrice = parseInt(searchParams.max || '10000000')
  const minBeds = parseInt(searchParams.beds || '0')
  const minBaths = parseInt(searchParams.baths || '0')
  const page = parseInt(searchParams.page || '1')
  const perPage = 24

  // Build query
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  // Apply filters
  if (location) {
    query = query.or(`city.ilike.%${location}%,state.ilike.%${location}%,zip_code.ilike.%${location}%,address.ilike.%${location}%`)
  }

  if (propertyType && propertyType !== 'any') {
    query = query.eq('property_type', propertyType)
  }

  if (minPrice > 0) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice < 10000000) {
    query = query.lte('price', maxPrice)
  }

  if (minBeds > 0) {
    query = query.gte('bedrooms', minBeds)
  }

  if (minBaths > 0) {
    query = query.gte('bathrooms', minBaths)
  }

  // Pagination
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  query = query
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data: properties, error, count } = await query

  const totalPages = count ? Math.ceil(count / perPage) : 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CR</span>
              </div>
              <span className="text-xl font-bold">CR Realtor</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
              <Link href="/auth/signup?role=realtor" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                For Realtors
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb & Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Search Results</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {count?.toLocaleString() || 0} Properties Found
              {location && ` in ${location}`}
            </h1>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-blue-600 text-white rounded-lg">
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <List className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Map className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </h2>
                <Link href="/search" className="text-sm text-blue-600 hover:underline">
                  Clear All
                </Link>
              </div>

              <form action="/search" method="GET" className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={location}
                    placeholder="City, ZIP, or neighborhood"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="type"
                    defaultValue={propertyType}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="single_family">Single Family</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="multi_family">Multi-Family</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="min"
                      defaultValue={minPrice > 0 ? minPrice : ''}
                      placeholder="Min"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      name="max"
                      defaultValue={maxPrice < 10000000 ? maxPrice : ''}
                      placeholder="Max"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      name="max"
                      value="250000"
                      className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                      Under $250K
                    </button>
                    <button
                      type="submit"
                      name="max"
                      value="500000"
                      className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                      Under $500K
                    </button>
                    <button
                      type="submit"
                      name="max"
                      value="1000000"
                      className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                      Under $1M
                    </button>
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="submit"
                        name="beds"
                        value={num}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          minBeds === num
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {num === 0 ? 'Any' : num === 4 ? '4+' : num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="submit"
                        name="baths"
                        value={num}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          minBaths === num
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {num === 0 ? 'Any' : num === 4 ? '4+' : num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Apply Filters
                </button>
              </form>

              {/* Saved Searches CTA */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-sm mb-2">Save This Search</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Get email alerts when new properties match your criteria
                </p>
                <Link
                  href="/auth/signup"
                  className="block w-full px-4 py-2 bg-blue-600 text-white text-center text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </aside>

          {/* Property Grid */}
          <main className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">Error loading properties. Please try again.</p>
              </div>
            )}

            {properties && properties.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search in a different area
                </p>
                <Link
                  href="/search"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Clear Filters
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties?.map((property: any) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                >
                  {/* Property Image */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {property.photos && property.photos[0] ? (
                      <img
                        src={property.photos[0]}
                        alt={property.address}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Favorite & Share Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ${property.price?.toLocaleString()}
                      {property.listing_type === 'rent' && <span className="text-base text-gray-500">/mo</span>}
                    </div>

                    <div className="text-gray-900 font-semibold mb-1 line-clamp-1">
                      {property.address}
                    </div>
                    <div className="text-gray-600 text-sm mb-4">
                      {property.city}, {property.state} {property.zip_code}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 border-t pt-4">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center space-x-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.square_feet && (
                        <div className="flex items-center space-x-1">
                          <Square className="w-4 h-4" />
                          <span>{property.square_feet.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {property.property_type && (
                      <div className="mt-3">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {property.property_type.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                {page > 1 && (
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                )}

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  if (pageNum > totalPages) return null
                  return (
                    <Link
                      key={pageNum}
                      href={`/search?${new URLSearchParams({ ...searchParams, page: pageNum.toString() }).toString()}`}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        pageNum === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                })}

                {page < totalPages && (
                  <Link
                    href={`/search?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
