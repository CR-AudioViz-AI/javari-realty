import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { 
  Building2, Users, FileText, Wrench, DollarSign, 
  TrendingUp, AlertTriangle, CheckCircle, Clock, Plus
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PropertyManagementDashboard() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()

  let stats = {
    totalProperties: 0,
    rentalProperties: 0,
    activeTenants: 0,
    activeLeases: 0,
    openMaintenance: 0,
    urgentMaintenance: 0,
    monthlyIncome: 0,
    expiringLeases: 0
  }

  if (user) {
    // Get properties count
    const { data: properties } = await supabase
      .from('properties')
      .select('id, listing_type')
      .eq('agent_id', user.id)
    
    stats.totalProperties = properties?.length || 0
    stats.rentalProperties = properties?.filter(p => ['for_rent', 'for_lease'].includes(p.listing_type)).length || 0

    // Get tenants count
    const { data: tenants } = await supabase
      .from('tenants')
      .select('id, status')
      .eq('agent_id', user.id)
    
    stats.activeTenants = tenants?.filter(t => t.status === 'active').length || 0

    // Get leases
    const { data: leases } = await supabase
      .from('leases')
      .select('id, status, monthly_rent, end_date')
      .eq('agent_id', user.id)
    
    stats.activeLeases = leases?.filter(l => l.status === 'active').length || 0
    stats.monthlyIncome = leases?.filter(l => l.status === 'active').reduce((sum, l) => sum + (l.monthly_rent || 0), 0) || 0
    
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    stats.expiringLeases = leases?.filter(l => {
      if (l.status !== 'active' || !l.end_date) return false
      return new Date(l.end_date) <= thirtyDaysFromNow
    }).length || 0

    // Get maintenance requests
    const { data: maintenance } = await supabase
      .from('maintenance_requests')
      .select('id, status, priority')
      .eq('agent_id', user.id)
    
    stats.openMaintenance = maintenance?.filter(m => ['submitted', 'in_progress', 'scheduled'].includes(m.status)).length || 0
    stats.urgentMaintenance = maintenance?.filter(m => m.priority === 'urgent' && m.status !== 'completed').length || 0
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  const sections = [
    {
      title: 'Tenants',
      description: 'Manage tenant profiles and information',
      icon: Users,
      href: '/dashboard/property-management/tenants',
      addHref: '/dashboard/property-management/tenants/new',
      stats: [
        { label: 'Active Tenants', value: stats.activeTenants }
      ],
      color: 'blue'
    },
    {
      title: 'Leases',
      description: 'Track lease agreements and renewals',
      icon: FileText,
      href: '/dashboard/property-management/leases',
      addHref: '/dashboard/property-management/leases/new',
      stats: [
        { label: 'Active Leases', value: stats.activeLeases },
        { label: 'Expiring Soon', value: stats.expiringLeases, alert: stats.expiringLeases > 0 }
      ],
      color: 'purple'
    },
    {
      title: 'Maintenance',
      description: 'Handle repair requests and work orders',
      icon: Wrench,
      href: '/dashboard/property-management/maintenance',
      addHref: '/dashboard/property-management/maintenance/new',
      stats: [
        { label: 'Open Requests', value: stats.openMaintenance },
        { label: 'Urgent', value: stats.urgentMaintenance, alert: stats.urgentMaintenance > 0 }
      ],
      color: 'orange'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <p className="text-gray-600">Manage your rental properties, tenants, and maintenance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rental Properties</p>
              <p className="text-2xl font-bold">{stats.rentalProperties}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tenants</p>
              <p className="text-2xl font-bold">{stats.activeTenants}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Income</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.monthlyIncome)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wrench className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Open Maintenance</p>
              <p className="text-2xl font-bold">{stats.openMaintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${section.color}-100 rounded-lg`}>
                    <section.icon className={`text-${section.color}-600`} size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {section.stats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className={`font-semibold ${stat.alert ? 'text-red-600' : ''}`}>
                      {stat.value}
                      {stat.alert && <AlertTriangle className="inline ml-1" size={14} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t bg-gray-50 px-6 py-3 flex justify-between">
              <Link href={section.href}>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All →
                </button>
              </Link>
              <Link href={section.addHref}>
                <button className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium">
                  <Plus size={16} />
                  Add New
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/property-management/tenants/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Users size={18} />
              Add Tenant
            </button>
          </Link>
          <Link href="/dashboard/property-management/leases/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <FileText size={18} />
              Create Lease
            </button>
          </Link>
          <Link href="/dashboard/property-management/maintenance/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              <Wrench size={18} />
              New Maintenance Request
            </button>
          </Link>
          <Link href="/dashboard/properties/new">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Building2 size={18} />
              Add Property
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
