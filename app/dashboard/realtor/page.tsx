import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import { Database } from '@/types/database.complete'

type Profile = Database['public']['Tables']['profiles']['Row']
type Lead = Database['public']['Tables']['leads']['Row']
type Property = Database['public']['Tables']['properties']['Row']
type Transaction = Database['public']['Tables']['transactions']['Row']

export default async function RealtorDashboard() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = (await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()) as { data: Profile | null; error: any }

  if (!profile) {
    redirect('/auth/login')
  }

  // Get dashboard metrics
  const { data: leads } = (await supabase
    .from('leads')
    .select('*')
    .eq('realtor_id', user.id)) as { data: Lead[] | null; error: any }

  const { data: properties } = (await supabase
    .from('properties')
    .select('*')
    .eq('listing_agent_id', user.id)) as { data: Property[] | null; error: any }

  const { data: transactions } = (await supabase
    .from('transactions')
    .select('*')
    .or(`buyer_agent_id.eq.${user.id},seller_agent_id.eq.${user.id}`)) as { data: Transaction[] | null; error: any }

  const activeLeads = leads?.filter((l) => l.status === 'new' || l.status === 'contacted').length || 0
  const activeListings = properties?.filter((p) => p.status === 'active').length || 0
  const activeTransactions = transactions?.filter((t) => t.stage !== 'completed' && t.stage !== 'cancelled').length || 0
  
  const totalVolume = transactions
    ?.filter((t) => t.stage === 'completed')
    .reduce((sum, t) => sum + (t.final_price || 0), 0) || 0

  const metrics = [
    {
      name: 'Active Leads',
      value: activeLeads.toString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Active Listings',
      value: activeListings.toString(),
      icon: Building2,
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Active Transactions',
      value: activeTransactions.toString(),
      icon: CheckCircle,
      change: '2 closing this month',
      changeType: 'neutral',
    },
    {
      name: 'Total Volume',
      value: `$${(totalVolume / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      change: '+23%',
      changeType: 'positive',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {profile.full_name || 'Realtor'}!
        </h2>
        <p className="text-blue-100">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span
                className={`text-sm font-medium ${
                  metric.changeType === 'positive'
                    ? 'text-green-600'
                    : metric.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming appointments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Appointments
            </h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Property Showing</p>
                <p className="text-sm text-gray-600">123 Main St</p>
              </div>
              <p className="text-sm font-medium text-gray-900">Today, 2:00 PM</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Client Meeting</p>
                <p className="text-sm text-gray-600">John Smith</p>
              </div>
              <p className="text-sm font-medium text-gray-900">Tomorrow, 10:00 AM</p>
            </div>
          </div>
        </div>

        {/* Recent leads */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {leads?.slice(0, 3).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{lead.source || 'Direct'}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    lead.status === 'new'
                      ? 'bg-green-100 text-green-800'
                      : lead.status === 'contacted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
            {!leads || leads.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No leads yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
