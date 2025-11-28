import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Building2,
  MapPin,
  Eye,
  Edit,
  Home,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react'

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string }
}) {
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

  const isAdmin = profile.role === 'admin' || profile.is_admin

  // Get team member IDs for organization-wide view
  let teamMemberIds: string[] = [user.id]
  let teamProfiles: Record<string, { first_name: string; last_name: string }> = {}
  
  if (profile.organization_id) {
    const { data: team } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('organization_id', profile.organization_id)
    
    if (team) {
      teamMemberIds = team.map(m => m.id)
      team.forEach(m => {
        teamProfiles[m.id] = { first_name: m.first_name, last_name: m.last_name }
      })
    }
  }

  // Build properties query - NO foreign key join (FK doesn't exist in DB)
  let propertiesQuery = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  // Admin sees ALL, team members see organization properties
  if (!isAdmin) {
    propertiesQuery = propertiesQuery.in('listing_agent_id', teamMemberIds)
  }

  // Apply status filter from URL
  const statusFilter = searchParams.status
  if (statusFilter && statusFilter !== 'all') {
    propertiesQuery = propertiesQuery.eq('status', statusFilter)
  }

  const { data: properties, error } = await propertiesQuery

  if (error) {
    console.error('Properties query error:', error)
  }

  // If admin, fetch ALL agent profiles for display
  if (isAdmin && properties && properties.length > 0) {
    const agentIds = [...new Set(properties.map(p => p.listing_agent_id).filter(Boolean))]
    const { data: agents } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', agentIds)
    
    if (agents) {
      agents.forEach(a => {
        teamProfiles[a.id] = { first_name: a.first_name, last_name: a.last_name }
      })
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
    return `$${(price / 1000).toFixed(0)}K`
  }

  // Calculate stats
  const allProperties = properties || []
  const totalVolume = allProperties.reduce((sum, p) => sum + (p.price || 0), 0)
  const activeCount = allProperties.filter(p => p.status === 'active').length
  const pendingCount = allProperties.filter(p => p.status === 'pending').length
  const soldCount = allProperties.filter(p => p.status === 'sold').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500">
            {allProperties.length} listings • {formatPrice(totalVolume)} total value
            {isAdmin && (
              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Admin View
              </span>
            )}
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

      {/* Quick Stats - Clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/properties?status=all"
          className={`bg-white rounded-xl border p-4 hover:shadow-md transition cursor-pointer ${
            !statusFilter || statusFilter === 'all' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{allProperties.length}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/properties?status=active"
          className={`bg-white rounded-xl border p-4 hover:shadow-md transition cursor-pointer ${
            statusFilter === 'active' ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/properties?status=pending"
          className={`bg-white rounded-xl border p-4 hover:shadow-md transition cursor-pointer ${
            statusFilter === 'pending' ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/properties?status=sold"
          className={`bg-white rounded-xl border p-4 hover:shadow-md transition cursor-pointer ${
            statusFilter === 'sold' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sold</p>
              <p className="text-2xl font-bold text-blue-600">{soldCount}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Portfolio Value Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Portfolio Value</p>
            <p className="text-3xl font-bold">{formatPrice(totalVolume)}</p>
            <p className="text-blue-200 text-sm mt-1">
              Avg. {allProperties.length > 0 ? formatPrice(totalVolume / allProperties.length) : '$0'} per listing
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/properties?status=all"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            !statusFilter || statusFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({allProperties.length})
        </Link>
        <Link
          href="/dashboard/properties?status=active"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === 'active'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active ({activeCount})
        </Link>
        <Link
          href="/dashboard/properties?status=pending"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({pendingCount})
        </Link>
        <Link
          href="/dashboard/properties?status=sold"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === 'sold'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sold ({soldCount})
        </Link>
      </div>

      {/* Properties Grid */}
      {allProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProperties.map((property) => {
            const agent = teamProfiles[property.listing_agent_id]
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Home className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      property.status === 'active' ? 'bg-emerald-500 text-white' :
                      property.status === 'pending' ? 'bg-amber-500 text-white' :
                      property.status === 'sold' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                    </span>
                    {property.featured && (
                      <span className="px-2.5 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-semibold">
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
                      title="View Property"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
                      title="Edit Property"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link href={`/properties/${property.id}`} className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1">
                        {property.title}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-emerald-600 whitespace-nowrap">
                      {formatPrice(property.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{property.address || `${property.city}, ${property.state}`}</span>
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

                  {/* Agent Info */}
                  {agent && (
                    <div className="pt-3 border-t flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                        {agent.first_name?.[0]}{agent.last_name?.[0]}
                      </div>
                      <span className="text-sm text-gray-500">
                        {agent.first_name} {agent.last_name}
                        {isMyListing && <span className="text-blue-600 ml-1">(You)</span>}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter && statusFilter !== 'all' 
              ? `No ${statusFilter} Properties`
              : 'No Properties Yet'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {statusFilter && statusFilter !== 'all'
              ? `There are no ${statusFilter} listings.`
              : 'Add your first listing to get started.'
            }
          </p>
          {(!statusFilter || statusFilter === 'all') ? (
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Link>
          ) : (
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              View All Properties
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
