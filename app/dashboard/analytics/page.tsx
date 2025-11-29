'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, TrendingUp, Users, Building2, DollarSign, Target } from 'lucide-react'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalLeads: 0,
    activeListings: 0,
    pendingDeals: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      let teamIds = [user.id]
      if (profile?.organization_id) {
        const { data: team } = await supabase
          .from('profiles')
          .select('id')
          .eq('organization_id', profile.organization_id)
        if (team) teamIds = team.map(m => m.id)
      }

      const { data: properties } = await supabase
        .from('properties')
        .select('id, status')
        .in('listing_agent_id', teamIds)

      const { data: leads } = await supabase
        .from('leads')
        .select('id')
        .in('agent_id', teamIds)

      setStats({
        totalProperties: properties?.length || 0,
        totalLeads: leads?.length || 0,
        activeListings: properties?.filter(p => p.status === 'active').length || 0,
        pendingDeals: properties?.filter(p => p.status === 'pending').length || 0,
      })
      setLoading(false)
    }
    loadStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Track your performance metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Listings</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeListings}</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingDeals}</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Total Leads</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-500">
          More detailed analytics, charts, and insights will be available here soon.
        </p>
      </div>
    </div>
  )
}
