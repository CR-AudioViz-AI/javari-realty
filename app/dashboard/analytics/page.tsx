import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Home,
  Eye,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  UserPlus,
  CheckCircle,
  XCircle,
} from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  const isAdmin = profile.role === 'admin' || profile.is_admin

  // Get team member IDs
  let teamMemberIds: string[] = [user.id]
  if (profile.organization_id) {
    const { data: team } = await supabase
      .from('profiles')
      .select('id')
      .eq('organization_id', profile.organization_id)
    if (team) teamMemberIds = team.map(m => m.id)
  }

  // Fetch properties
  let propertiesQuery = supabase.from('properties').select('*')
  if (!isAdmin) {
    propertiesQuery = propertiesQuery.in('listing_agent_id', teamMemberIds)
  }
  const { data: properties } = await propertiesQuery

  // Fetch leads
  let leadsQuery = supabase.from('leads').select('*')
  if (!isAdmin) {
    leadsQuery = leadsQuery.in('agent_id', teamMemberIds)
  }
  const { data: leads } = await leadsQuery

  const allProperties = properties || []
  const allLeads = leads || []

  // Calculate metrics
  const totalListings = allProperties.length
  const activeListings = allProperties.filter(p => p.status === 'active').length
  const pendingListings = allProperties.filter(p => p.status === 'pending').length
  const soldListings = allProperties.filter(p => p.status === 'sold').length

  const totalVolume = allProperties.reduce((sum, p) => sum + (p.price || 0), 0)
  const soldVolume = allProperties.filter(p => p.status === 'sold').reduce((sum, p) => sum + (p.price || 0), 0)
  const pendingVolume = allProperties.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.price || 0), 0)

  const totalLeads = allLeads.length
  const hotLeads = allLeads.filter(l => l.priority === 'high' || l.status === 'hot').length
  const convertedLeads = allLeads.filter(l => l.status === 'closed' || l.status === 'converted').length
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0'

  // Calculate this month vs last month
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const thisMonthLeads = allLeads.filter(l => new Date(l.created_at) >= thisMonth).length
  const lastMonthLeads = allLeads.filter(l => {
    const d = new Date(l.created_at)
    return d >= lastMonth && d < thisMonth
  }).length
  const leadsTrend = lastMonthLeads > 0 ? (((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(0) : '0'

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
    return `$${price}`
  }

  // Pipeline breakdown
  const pipelineData = [
    { stage: 'New', count: allLeads.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
    { stage: 'Contacted', count: allLeads.filter(l => l.status === 'contacted').length, color: 'bg-indigo-500' },
    { stage: 'Qualified', count: allLeads.filter(l => l.status === 'qualified').length, color: 'bg-purple-500' },
    { stage: 'Showing', count: allLeads.filter(l => l.status === 'showing').length, color: 'bg-amber-500' },
    { stage: 'Offer', count: allLeads.filter(l => l.status === 'offer').length, color: 'bg-orange-500' },
    { stage: 'Closed', count: allLeads.filter(l => l.status === 'closed').length, color: 'bg-emerald-500' },
  ]

  // Property type breakdown
  const propertyTypes = allProperties.reduce((acc, p) => {
    const type = p.property_type || 'Other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Track your performance and pipeline metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalListings}</p>
          <p className="text-sm text-gray-500">Listings</p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className={`text-xs flex items-center gap-1 ${pendingVolume > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
              {pendingVolume > 0 && <ArrowUpRight className="w-3 h-3" />}
              Pending
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(pendingVolume)}</p>
          <p className="text-sm text-gray-500">In Pipeline</p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            <span className={`text-xs flex items-center gap-1 ${Number(leadsTrend) > 0 ? 'text-emerald-600' : Number(leadsTrend) < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {Number(leadsTrend) > 0 ? <ArrowUpRight className="w-3 h-3" /> : Number(leadsTrend) < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
              {leadsTrend}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
          <p className="text-sm text-gray-500">Total Leads</p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
          <p className="text-sm text-gray-500">Conversion</p>
        </div>
      </div>

      {/* Volume Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-200 text-sm mb-1">Total Portfolio</p>
            <p className="text-3xl font-bold">{formatPrice(totalVolume)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-1">Sold Volume</p>
            <p className="text-3xl font-bold">{formatPrice(soldVolume)}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm mb-1">Avg. List Price</p>
            <p className="text-3xl font-bold">{totalListings > 0 ? formatPrice(totalVolume / totalListings) : '$0'}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Listing Status */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Listing Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Active</span>
                <span className="font-medium text-gray-900">{activeListings}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${totalListings > 0 ? (activeListings / totalListings) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-gray-900">{pendingListings}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${totalListings > 0 ? (pendingListings / totalListings) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Sold</span>
                <span className="font-medium text-gray-900">{soldListings}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${totalListings > 0 ? (soldListings / totalListings) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{activeListings}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{pendingListings}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{soldListings}</p>
              <p className="text-xs text-gray-500">Sold</p>
            </div>
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Lead Pipeline</h2>
          <div className="space-y-3">
            {pipelineData.map((stage) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{stage.stage}</span>
                  <span className="font-medium text-gray-900">{stage.count}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stage.color} rounded-full transition-all`}
                    style={{ width: `${totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Conversion Funnel Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{hotLeads}</p>
              <p className="text-xs text-gray-500">🔥 Hot Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{convertedLeads}</p>
              <p className="text-xs text-gray-500">✅ Converted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Property Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(propertyTypes).map(([type, count]) => (
            <div key={type} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 capitalize">{type.replace('_', ' ')}</p>
            </div>
          ))}
          {Object.keys(propertyTypes).length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <PieChart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No property data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-700">View All</Link>
        </div>
        <div className="space-y-3">
          {allLeads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                lead.status === 'closed' ? 'bg-emerald-100' :
                lead.priority === 'high' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                {lead.status === 'closed' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : lead.priority === 'high' ? (
                  <Activity className="w-5 h-5 text-red-600" />
                ) : (
                  <UserPlus className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{lead.full_name}</p>
                <p className="text-sm text-gray-500">
                  {lead.status === 'closed' ? 'Converted' : `Status: ${lead.status}`}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {allLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
