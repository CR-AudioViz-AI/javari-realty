import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { FileText, Plus, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LeasesListPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()

  let leases: any[] = []
  let tenantsMap: Record<string, any> = {}
  let propertiesMap: Record<string, any> = {}

  if (user) {
    const { data: leasesData } = await supabase
      .from('leases')
      .select('*')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })

    leases = leasesData || []

    if (leases.length > 0) {
      const tenantIds = [...new Set(leases.map(l => l.tenant_id).filter(Boolean))]
      const propertyIds = [...new Set(leases.map(l => l.property_id).filter(Boolean))]

      if (tenantIds.length > 0) {
        const { data: tenantsData } = await supabase
          .from('tenants')
          .select('id, full_name')
          .in('id', tenantIds)
        tenantsData?.forEach(t => { tenantsMap[t.id] = t })
      }

      if (propertyIds.length > 0) {
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id, address')
          .in('id', propertyIds)
        propertiesData?.forEach(p => { propertiesMap[p.id] = p })
      }
    }
  }

  const activeLeases = leases.filter(l => l.status === 'active').length
  const expiringLeases = leases.filter(l => {
    if (!l.end_date) return false
    const endDate = new Date(l.end_date)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return endDate <= thirtyDaysFromNow && l.status === 'active'
  }).length
  const totalMonthlyRent = leases.filter(l => l.status === 'active').reduce((sum, l) => sum + (l.monthly_rent || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leases</h1>
          <p className="text-gray-600">Manage your rental lease agreements</p>
        </div>
        <Link href="/dashboard/property-management/leases/new">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            New Lease
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Leases</p>
              <p className="text-2xl font-bold">{leases.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold">{activeLeases}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-bold">{expiringLeases}</p>
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
              <p className="text-2xl font-bold">{formatCurrency(totalMonthlyRent)}</p>
            </div>
          </div>
        </div>
      </div>

      {leases.length === 0 ? (
        <div className="bg-white rounded-lg shadow border p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leases yet</h3>
          <p className="text-gray-500 mb-4">Create your first lease agreement to get started</p>
          <Link href="/dashboard/property-management/leases/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create Lease
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leases.map((lease) => (
                <tr key={lease.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {propertiesMap[lease.property_id]?.address || 'Unknown Property'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {tenantsMap[lease.tenant_id]?.full_name || 'Unknown Tenant'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar size={14} />
                      {formatDate(lease.start_date)} - {formatDate(lease.end_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(lease.monthly_rent)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lease.status === 'active' ? 'bg-green-100 text-green-800' : 
                      lease.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      lease.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lease.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/property-management/leases/${lease.id}`}>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
