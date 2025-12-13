'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Building2, Users, FileText, Wrench, DollarSign, 
  Plus, Home, Factory, Store,
  TrendingUp, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import Link from 'next/link'

interface PropertyStats {
  totalProperties: number
  forSale: number
  forRent: number
  forLease: number
  residential: number
  commercial: number
  industrial: number
  activeTenants: number
  activeLeases: number
  pendingMaintenance: number
  monthlyRentRoll: number
}

export default function PropertyManagementPage() {
  const [stats, setStats] = useState<PropertyStats>({
    totalProperties: 0, forSale: 0, forRent: 0, forLease: 0,
    residential: 0, commercial: 0, industrial: 0,
    activeTenants: 0, activeLeases: 0, pendingMaintenance: 0, monthlyRentRoll: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', user.id)

      if (properties) {
        const forSale = properties.filter(p => p.listing_type === 'for_sale' || !p.listing_type).length
        const forRent = properties.filter(p => p.listing_type === 'for_rent').length
        const forLease = properties.filter(p => p.listing_type === 'for_lease').length
        const residential = properties.filter(p => p.category === 'residential' || !p.category).length
        const commercial = properties.filter(p => p.category === 'commercial').length
        const industrial = properties.filter(p => p.category === 'industrial').length

        setStats({
          totalProperties: properties.length,
          forSale, forRent, forLease,
          residential, commercial, industrial,
          activeTenants: 0, activeLeases: 0, pendingMaintenance: 0, monthlyRentRoll: 0
        })
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-500">Manage rentals, leases, tenants, and maintenance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/properties/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />Add Property
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">For Sale</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.forSale}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">For Rent</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.forRent}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-500">For Lease</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.forLease}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Residential</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.residential}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-5 h-5 text-indigo-600" />
            <span className="text-sm text-gray-500">Commercial</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.commercial}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Factory className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-500">Industrial</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.industrial}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-emerald-100">Monthly Rent Roll</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.monthlyRentRoll)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-blue-100">Active Tenants</span>
          </div>
          <p className="text-3xl font-bold">{stats.activeTenants}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5" />
            <span className="text-purple-100">Active Leases</span>
          </div>
          <p className="text-3xl font-bold">{stats.activeLeases}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-5 h-5" />
            <span className="text-amber-100">Pending Maintenance</span>
          </div>
          <p className="text-3xl font-bold">{stats.pendingMaintenance}</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {['overview', 'tenants', 'leases', 'maintenance', 'financials'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm mt-2">Tenant and lease activity will appear here</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/properties/new" className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Add Property</span>
              </Link>
              <Link href="/dashboard/leads/new" className="p-4 bg-emerald-50 rounded-xl text-center hover:bg-emerald-100 transition">
                <Users className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Add Lead</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">Coming Soon</p>
            <p className="text-sm">Full {activeTab} management will be available after database migration</p>
          </div>
        </div>
      )}
    </div>
  )
}
