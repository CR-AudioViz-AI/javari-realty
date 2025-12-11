import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, DollarSign, TrendingUp, Plus, MessageSquare, Building2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) {
    redirect('/auth/login')
  }

  // Check role and redirect appropriately
  const isAdmin = profile.role === 'admin' || profile.is_admin
  const isAgent = profile.role === 'agent'

  // Redirect admin to admin dashboard
  if (isAdmin) {
    redirect('/dashboard/admin')
  }

  // Redirect agents to realtor dashboard
  if (isAgent) {
    redirect('/dashboard/realtor')
  }

  // For any other role, show basic dashboard
  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'User'

  const { count: myProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('listing_agent_id', user.id)
  
  const { count: myLeads } = await supabase
    .from('realtor_leads')
    .select('*', { count: 'exact', head: true })
    .eq('realtor_id', user.id)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {displayName}!</h1>
        <p className="text-blue-100">Here&apos;s what&apos;s happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">{myProperties || 0}</span>
          </div>
          <div className="text-sm text-gray-600">Properties</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold">{myLeads || 0}</span>
          </div>
          <div className="text-sm text-gray-600">Leads</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold">0</span>
          </div>
          <div className="text-sm text-gray-600">Active Transactions</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/properties" className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-center">
            <Building2 className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium text-sm">View Properties</div>
          </Link>
          <Link href="/dashboard/leads" className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium text-sm">View Leads</div>
          </Link>
          <Link href="/search" className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-center">
            <Home className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium text-sm">Browse Listings</div>
          </Link>
          <Link href="/dashboard/properties/new" className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition text-center">
            <Plus className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium text-sm">Add Property</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
