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

  const isAdmin = profile.role === 'admin' || profile.is_admin
  const isAgentOrRealtor = ['agent', 'realtor'].includes(profile.role)

  if (isAdmin) {
    redirect('/dashboard/admin')
  }

  if (isAgentOrRealtor) {
    redirect('/dashboard/realtor')
  }

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
        <p className="text-blue-100">Your account dashboard</p>
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
          <div className="text-sm text-gray-600">Transactions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/properties/new" className="block">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Add New Property</h3>
                <p className="text-sm text-gray-500">List a new property</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/leads" className="block">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-500 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">View Leads</h3>
                <p className="text-sm text-gray-500">Manage your leads</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
