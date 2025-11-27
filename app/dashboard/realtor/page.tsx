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
} from 'lucide-react'

export default async function RealtorDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Realtor'

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('realtor_id', user.id)

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('listing_agent_id', user.id)

  const activeLeads = leads?.filter((l: any) => l.status === 'new' || l.status === 'contacted').length || 0
  const activeListings = properties?.filter((p: any) => p.status === 'active').length || 0
  const totalVolume = properties?.reduce((sum: number, p: any) => sum + (p.price || 0), 0) || 0

  const metrics = [
    {
      name: 'Active Leads',
      value: activeLeads.toString(),
      icon: Users,
      change: activeLeads > 0 ? 'Needs follow-up' : 'No new leads',
      changeType: activeLeads > 0 ? 'positive' : 'neutral',
    },
    {
      name: 'Active Listings',
      value: activeListings.toString(),
      icon: Building2,
      change: `${properties?.length || 0} total`,
      changeType: 'positive',
    },
    {
      name: 'Pending',
      value: '0',
      icon: TrendingUp,
      change: 'Transactions',
      changeType: 'neutral',
    },
    {
      name: 'Listing Volume',
      value: totalVolume >= 1000000 ? `$${(totalVolume / 1000000).toFixed(1)}M` : `$${(totalVolume / 1000).toFixed(0)}K`,
      icon: DollarSign,
      change: 'Active listings',
      changeType: 'positive',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {displayName}!</h2>
            <p className="text-blue-100">Here&apos;s what&apos;s happening with your business today.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
            <Link href="/dashboard/properties" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {properties && properties.length > 0 ? (
              properties.slice(0, 4).map((property: any) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{property.title || property.address}</p>
                    <p className="text-sm text-gray-600">${property.price?.toLocaleString()} • {property.city}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </span>
                    <Link href={`/properties/${property.id}`} className="p-1 text-gray-400 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No listings yet</p>
                <Link href="/dashboard/properties/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Listing
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {leads && leads.length > 0 ? (
              leads.slice(0, 4).map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-900">{lead.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">{lead.email || lead.source || 'Direct inquiry'}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    lead.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No leads yet</p>
                <p className="text-sm text-gray-400 mt-1">Leads appear when customers contact you</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/properties/new" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-gray-600">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Add Listing</span>
          </Link>
          <Link href="/dashboard/leads" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-gray-600">
            <Users className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">View Leads</span>
          </Link>
          <Link href="/dashboard/properties" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-gray-600">
            <Building2 className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">My Listings</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-gray-600">
            <Eye className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Browse All</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
