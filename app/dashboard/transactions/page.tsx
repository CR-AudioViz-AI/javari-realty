import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  DollarSign,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  TrendingUp,
} from 'lucide-react'

export default async function TransactionsPage() {
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

  // Get team properties for transaction simulation
  let teamMemberIds: string[] = [user.id]
  if (profile.organization_id) {
    const { data: team } = await supabase
      .from('profiles')
      .select('id')
      .eq('organization_id', profile.organization_id)
    teamMemberIds = team?.map(m => m.id) || [user.id]
  }

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .in('listing_agent_id', teamMemberIds)

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
    return `$${(price / 1000).toFixed(0)}K`
  }

  const totalVolume = properties?.reduce((sum, p) => sum + (p.price || 0), 0) || 0
  const activeListings = properties?.filter(p => p.status === 'active').length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">Track deals from contract to close</p>
        </div>
        <Link
          href="/dashboard/transactions/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-xl font-bold">{activeListings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Closed YTD</p>
              <p className="text-xl font-bold">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Volume YTD</p>
              <p className="text-xl font-bold">$0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Pipeline */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Transaction Pipeline</h2>
        </div>
        
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Transactions</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            When you go under contract on a property, transactions will appear here to track through closing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              <Building2 className="w-4 h-4 mr-2" />
              View Listings ({activeListings})
            </Link>
            <Link
              href="/dashboard/leads"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Work Leads
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {properties?.slice(0, 5).map((property) => (
            <div key={property.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{property.title}</p>
                <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatPrice(property.price)}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  {property.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
