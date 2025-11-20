import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, DollarSign, TrendingUp, Plus, MessageSquare } from 'lucide-react'

export default async function RealtorDashboard() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: any; error: any }
  
  if (!profile || (profile.role !== 'realtor' && profile.role !== 'broker_admin' && profile.role !== 'platform_admin')) {
    redirect('/dashboard/client')
  }

  const { count: myProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('listing_agent_id', user.id)
  
  const { count: myLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('realtor_id', user.id)
  
  // Transactions query - need to check both buyer_agent_id and seller_agent_id
  const { count: activeTransactions } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .or(`buyer_agent_id.eq.${user.id},seller_agent_id.eq.${user.id}`)
    .in('stage', ['under_contract', 'inspection', 'appraisal', 'financing'])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.full_name || 'Realtor'}!</h1>
          <p className="text-gray-600">Here's what's happening with your business today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Home className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">{myProperties || 0}</span>
            </div>
            <div className="text-sm text-gray-600">My Properties</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold">{myLeads || 0}</span>
            </div>
            <div className="text-sm text-gray-600">Active Leads</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">{activeTransactions || 0}</span>
            </div>
            <div className="text-sm text-gray-600">Active Deals</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold">$0</span>
            </div>
            <div className="text-sm text-gray-600">Pipeline Value</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/properties/new" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div className="font-semibold">Add Property</div>
                </Link>
                <Link href="/dashboard/leads" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div className="font-semibold">View Leads</div>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Javari AI Assistant</h3>
              <p className="text-blue-100 text-sm mb-4">Your AI-powered real estate assistant is ready to help!</p>
              <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition">
                Open Javari
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
