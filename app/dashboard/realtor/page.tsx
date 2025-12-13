import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Plus,
  Eye,
  Edit,
  MapPin,
  ArrowUpRight,
  Home,
  Star,
  CheckCircle,
  Clock,
} from 'lucide-react'

export default async function RealtorDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  const displayName = profile.full_name || 'Realtor'
  const organization = profile.organizations
  const isAdmin = profile.role === 'admin' || profile.is_admin

  // Get team members if in an organization
  let teamMembers: any[] = []
  let teamMemberIds: string[] = [user.id]
  
  if (false && profile.organization_id) { // Disabled - organization_id not in schema
    const { data: team } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, specialties')
      .eq('organization_id', profile.organization_id)
      .eq('role', 'agent')
    
    teamMembers = team || []
    teamMemberIds = teamMembers.map(m => m.id)
  }

  // Get ALL team properties - NO foreign key join
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .in('agent_id', teamMemberIds)
    .order('price', { ascending: false })

  // Get ALL team leads
  const { data: leads } = await supabase
    .from('realtor_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  // My properties vs team properties
  const myProperties = properties?.filter(p => p.agent_id === user.id) || []
  const teamProperties = properties || []
  
  const activeLeads = leads?.filter((l) => l.status === 'new' || l.status === 'contacted').length || 0
  const qualifiedLeads = leads?.filter((l) => l.status === 'qualified').length || 0
  const activeListings = teamProperties?.filter((p) => p.status === 'active').length || 0
  const pendingListings = teamProperties?.filter((p) => p.status === 'pending').length || 0
  const myActiveListings = myProperties?.filter((p) => p.status === 'active').length || 0
  const totalVolume = teamProperties?.reduce((sum, p) => sum + (p.price || 0), 0) || 0
  const featuredListings = teamProperties?.filter((p) => p.featured) || []

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`
    }
    return `$${(price / 1000).toFixed(0)}K`
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Team Branding */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            {organization?.logo_url && (
              <div className="hidden lg:block w-20 h-20 rounded-xl bg-white/10 p-2">
                <img 
                  src={organization.logo_url} 
                  alt={organization.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">
                {organization?.name || 'Welcome back'}
              </p>
              <h1 className="text-3xl font-bold mb-2">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {profile.full_name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-blue-100/80 max-w-xl">
                {organization?.settings?.tagline || "Here's what's happening with your real estate business today."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center px-5 py-2.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-blue-50 transition shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Link>
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center px-5 py-2.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition border border-white/20"
            >
              <Users className="w-4 h-4 mr-2" />
              View Leads
            </Link>
          </div>
        </div>
      </div>

      {/* Clickable Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/leads"
          className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition" />
          <div className="relative">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Leads</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{activeLeads}</p>
            <p className="text-sm text-gray-400">{qualifiedLeads} qualified</p>
          </div>
        </Link>

        <Link
          href="/dashboard/properties?status=active"
          className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition" />
          <div className="relative">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Team Listings</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{activeListings}</p>
            <p className="text-sm text-gray-400">{myActiveListings} mine</p>
          </div>
        </Link>

        <Link
          href="/dashboard/properties"
          className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition" />
          <div className="relative">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Portfolio Value</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{formatPrice(totalVolume)}</p>
            <p className="text-sm text-gray-400">{teamProperties?.length || 0} properties</p>
          </div>
        </Link>

        <Link
          href="/dashboard/properties?status=pending"
          className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500 to-amber-600 opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition" />
          <div className="relative">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Featured</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{featuredListings.length}</p>
            <p className="text-sm text-gray-400">Premium listings</p>
          </div>
        </Link>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/properties?status=all"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          All ({teamProperties?.length || 0})
        </Link>
        <Link
          href="/dashboard/properties?status=active"
          className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full text-sm font-medium transition flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Active ({activeListings})
        </Link>
        <Link
          href="/dashboard/properties?status=pending"
          className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-full text-sm font-medium transition flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Pending ({pendingListings})
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties Section - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Listings */}
          {featuredListings.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl">
                      <Star className="w-5 h-5 text-amber-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Featured Listings</h2>
                  </div>
                  <Link href="/dashboard/properties" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    View all <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {featuredListings.slice(0, 3).map((property) => (
                  <div key={property.id} className="p-4 hover:bg-gray-50 transition group">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {property.photos?.[0] ? (
                          <img 
                            src={property.photos[0]} 
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                          Featured
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {property.city}, {property.state}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-lg font-bold text-emerald-600">
                            {formatPrice(property.price)}
                          </span>
                          <span className="text-sm text-gray-400">
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.square_feet?.toLocaleString()} sqft
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/properties/${property.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link 
                          href={`/dashboard/properties/${property.id}/edit`}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Team Properties */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Team Listings</h2>
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    {teamProperties?.length || 0}
                  </span>
                </div>
                <Link href="/dashboard/properties" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  Manage <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {teamProperties && teamProperties.length > 0 ? (
                teamProperties.filter(p => !p.featured).slice(0, 5).map((property) => (
                  <div key={property.id} className="p-4 hover:bg-gray-50 transition group">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {property.photos?.[0] ? (
                          <img 
                            src={property.photos[0]} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition">
                              {property.title}
                            </h3>
                            <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                          </div>
                          <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                          {property.bedrooms && <span>{property.bedrooms} bed</span>}
                          {property.bathrooms && <span>{property.bathrooms} bath</span>}
                          {property.square_feet && <span>{property.square_feet.toLocaleString()} sqft</span>}
                          {property.agent_id === user.id && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Mine</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Yet</h3>
                  <p className="text-gray-500 mb-4">Add your first property listing to get started.</p>
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
          </div>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Recent Leads */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <Users className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
                </div>
                <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {leads && leads.length > 0 ? (
                leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{lead.full_name}</h4>
                        <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                        {lead.notes && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{lead.notes}</p>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                        lead.status === 'contacted' ? 'bg-amber-50 text-amber-600' :
                        lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No leads yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          {teamMembers.length > 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-xl">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Team</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {member.full_name?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {member.full_name || 'Team Member'}
                        {member.id === user.id && <span className="text-blue-600 text-sm ml-1">(You)</span>}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.specialties?.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Avg. List Price</span>
                <span className="font-semibold">
                  {teamProperties && teamProperties.length > 0 
                    ? formatPrice(totalVolume / teamProperties.length)
                    : '$0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">High Priority Leads</span>
                <span className="font-semibold">
                  {leads?.filter(l => l.priority === 'high').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">This Month&apos;s Leads</span>
                <span className="font-semibold">
                  {leads?.filter(l => {
                    const created = new Date(l.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
