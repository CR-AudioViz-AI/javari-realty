import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Building2,
  MapPin,
  Eye,
  Edit,
  MoreHorizontal,
  Home,
  DollarSign,
} from 'lucide-react'

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/auth/login')
  }

  // Get team member IDs for organization-wide view
  let teamMemberIds: string[] = [user.id]
  if (profile.organization_id) {
    const { data: team } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('organization_id', profile.organization_id)
    teamMemberIds = team?.map(m => m.id) || [user.id]
  }

  // Get ALL team properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*, profiles!listing_agent_id(first_name, last_name)')
    .in('listing_agent_id', teamMemberIds)
    .order('created_at', { ascending: false })

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
    return `$${(price / 1000).toFixed(0)}K`
  }

  const totalVolume = properties?.reduce((sum, p) => sum + (p.price || 0), 0) || 0
  const activeCount = properties?.filter(p => p.status === 'active').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500">
            {properties?.length || 0} listings • {formatPrice(totalVolume)} total value
          </p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Listings</p>
          <p className="text-2xl font-bold text-gray-900">{properties?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalVolume)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Avg. Price</p>
          <p className="text-2xl font-bold text-gray-900">
            {properties?.length ? formatPrice(totalVolume / properties.length) : '$0'}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2.5 bg-white border rounded-xl hover:bg-gray-50 transition">
          <Filter className="w-4 h-4 mr-2 text-gray-500" />
          Filters
        </button>
      </div>

      {/* Properties Grid */}
      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const agent = property.profiles
            const isMyListing = property.listing_agent_id === user.id
            
            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {property.photos?.[0] ? (
                    <img
                      src={property.photos[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      property.status === 'active' ? 'bg-emerald-500 text-white' :
                      property.status === 'pending' ? 'bg-amber-500 text-white' :
                      property.status === 'sold' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {property.status}
                    </span>
                    {property.featured && (
                      <span className="ml-2 px-2.5 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* My Listing Badge */}
                  {isMyListing && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                        My Listing
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <Link
                      href={`/properties/${property.id}`}
                      className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link href={`/properties/${property.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1">
                        {property.title}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-emerald-600 whitespace-nowrap">
                      {formatPrice(property.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{property.city}, {property.state}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {property.bedrooms && (
                      <span>{property.bedrooms} bed</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} bath</span>
                    )}
                    {property.square_feet && (
                      <span>{property.square_feet.toLocaleString()} sqft</span>
                    )}
                  </div>

                  {/* Agent */}
                  {agent && !isMyListing && (
                    <div className="pt-3 border-t flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                        {agent.first_name?.[0]}{agent.last_name?.[0]}
                      </div>
                      <span className="text-sm text-gray-500">
                        {agent.first_name} {agent.last_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
          <p className="text-gray-500 mb-6">Add your first listing to get started.</p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Link>
        </div>
      )}
    </div>
  )
}
