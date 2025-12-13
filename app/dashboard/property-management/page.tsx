'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Building2, Users, FileText, Wrench, DollarSign, 
  Plus, Search, Filter, Home, Factory, Store,
  TrendingUp, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import Link from 'next/link'

interface Tenant {
  id: string
  full_name: string
  email: string
  phone: string
  status: string
  property_id: string
  move_in_date: string
}

interface Lease {
  id: string
  tenant_id: string
  property_id: string
  monthly_rent: number
  start_date: string
  end_date: string
  status: string
}

interface MaintenanceRequest {
  id: string
  title: string
  property_id: string
  priority: string
  status: string
  created_at: string
}

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
    totalProperties: 0,
    forSale: 0,
    forRent: 0,
    forLease: 0,
    residential: 0,
    commercial: 0,
    industrial: 0,
    activeTenants: 0,
    activeLeases: 0,
    pendingMaintenance: 0,
    monthlyRentRoll: 0
  })
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load properties with categories
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', user.id)

      // Load tenants
      const { data: tenantsData } = await supabase
        .from('tenants')
        .select('*')
        .eq('agent_id', user.id)
        .eq('status', 'active')
        .limit(10)

      // Load leases
      const { data: leasesData } = await supabase
        .from('leases')
        .select('*')
        .eq('agent_id', user.id)
        .eq('status', 'active')

      // Load maintenance requests
      const { data: maintenanceData } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('agent_id', user.id)
        .in('status', ['submitted', 'acknowledged', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(10)

      if (properties) {
        const forSale = properties.filter(p => p.listing_type === 'for_sale' || !p.listing_type).length
        const forRent = properties.filter(p => p.listing_type === 'for_rent').length
        const forLease = properties.filter(p => p.listing_type === 'for_lease').length
        const residential = properties.filter(p => p.category === 'residential' || !p.category).length
        const commercial = properties.filter(p => p.category === 'commercial').length
        const industrial = properties.filter(p => p.category === 'industrial').length

        setStats({
          totalProperties: properties.length,
          forSale,
          forRent,
          forLease,
          residential,
          commercial,
          industrial,
          activeTenants: tenantsData?.length || 0,
          activeLeases: leasesData?.length || 0,
          pendingMaintenance: maintenanceData?.length || 0,
          monthlyRentRoll: leasesData?.reduce((sum, l) => sum + (l.monthly_rent || 0), 0) || 0
        })
      }

      setTenants(tenantsData || [])
      setLeases(leasesData || [])
      setMaintenance(maintenanceData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-500">Manage rentals, leases, tenants, and maintenance</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Link>
          <Link
            href="/dashboard/property-management/tenants/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            <Users className="w-4 h-4" />
            Add Tenant
          </Link>
        </div>
      </div>

      {/* Category Stats */}
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

      {/* Financial Overview */}
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {['overview', 'tenants', 'leases', 'maintenance', 'financials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tenants */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Tenants</h3>
              <Link href="/dashboard/property-management/tenants" className="text-sm text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            {tenants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No tenants yet</p>
                <Link href="/dashboard/property-management/tenants/new" className="text-blue-600 hover:underline text-sm">
                  Add your first tenant
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tenants.slice(0, 5).map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {tenant.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tenant.full_name}</p>
                        <p className="text-sm text-gray-500">{tenant.phone}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Requests */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Maintenance Requests</h3>
              <Link href="/dashboard/property-management/maintenance" className="text-sm text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            {maintenance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No pending maintenance</p>
              </div>
            ) : (
              <div className="space-y-3">
                {maintenance.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        request.priority === 'emergency' ? 'bg-red-100' :
                        request.priority === 'urgent' ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        {request.priority === 'emergency' ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : request.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{request.title}</p>
                        <p className="text-sm text-gray-500">{request.status}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                      request.priority === 'urgent' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {request.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tenants' && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">All Tenants</h3>
            <Link
              href="/dashboard/property-management/tenants/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Tenant
            </Link>
          </div>
          {tenants.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No tenants yet</p>
              <p className="text-sm">Add your first tenant to start managing your rental properties</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Tenant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Move-in Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{tenant.full_name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600">{tenant.email}</p>
                        <p className="text-sm text-gray-500">{tenant.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {tenant.move_in_date ? new Date(tenant.move_in_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-blue-600 hover:underline text-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'leases' && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">All Leases</h3>
            <Link
              href="/dashboard/property-management/leases/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              New Lease
            </Link>
          </div>
          {leases.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No leases yet</p>
              <p className="text-sm">Create your first lease agreement to track rental income</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leases.map((lease) => (
                <div key={lease.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{formatCurrency(lease.monthly_rent)}/month</p>
                      <p className="text-sm text-gray-500">
                        {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lease.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {lease.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Maintenance Requests</h3>
            <Link
              href="/dashboard/property-management/maintenance/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Link>
          </div>
          {maintenance.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Wrench className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">No maintenance requests</p>
              <p className="text-sm">All caught up! No pending maintenance issues.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {maintenance.map((request) => (
                <div key={request.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        request.priority === 'emergency' ? 'bg-red-100' :
                        request.priority === 'urgent' ? 'bg-amber-100' : 'bg-blue-100'
                      }`}>
                        <Wrench className={`w-5 h-5 ${
                          request.priority === 'emergency' ? 'text-red-600' :
                          request.priority === 'urgent' ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{request.title}</p>
                        <p className="text-sm text-gray-500">
                          Submitted {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'completed' ? 'bg-green-100 text-green-700' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <h4 className="font-medium text-gray-700 mb-4">Income Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent Roll</span>
                  <span className="font-bold text-green-600">{formatCurrency(stats.monthlyRentRoll)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Projected</span>
                  <span className="font-bold text-green-600">{formatCurrency(stats.monthlyRentRoll * 12)}</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h4 className="font-medium text-gray-700 mb-4">Portfolio Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Leases</span>
                  <span className="font-bold text-blue-600">{stats.activeLeases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupancy Rate</span>
                  <span className="font-bold text-blue-600">
                    {stats.forRent > 0 ? Math.round((stats.activeLeases / (stats.forRent + stats.activeLeases)) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
