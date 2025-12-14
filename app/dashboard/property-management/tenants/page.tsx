import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Users, Plus, Phone, Mail, Home, CheckCircle, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TenantsListPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()

  let tenants: any[] = []
  let propertiesMap: Record<string, any> = {}

  if (user) {
    const { data: tenantsData } = await supabase
      .from('tenants')
      .select('*')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })

    tenants = tenantsData || []

    if (tenants.length > 0) {
      const propertyIds = [...new Set(tenants.map(t => t.property_id).filter(Boolean))]
      if (propertyIds.length > 0) {
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id, address')
          .in('id', propertyIds)
        propertiesData?.forEach(p => { propertiesMap[p.id] = p })
      }
    }
  }

  const activeTenants = tenants.filter(t => t.status === 'active').length
  const pendingTenants = tenants.filter(t => t.status === 'pending').length

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tenants</h1>
          <p className="text-gray-600">Manage your rental tenants</p>
        </div>
        <Link href="/dashboard/property-management/tenants/new">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            Add Tenant
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tenants</p>
              <p className="text-2xl font-bold">{tenants.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tenants</p>
              <p className="text-2xl font-bold">{activeTenants}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{pendingTenants}</p>
            </div>
          </div>
        </div>
      </div>

      {tenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow border p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants yet</h3>
          <p className="text-gray-500 mb-4">Add your first tenant to get started</p>
          <Link href="/dashboard/property-management/tenants/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add Tenant
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{tenant.full_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {tenant.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail size={14} />
                          {tenant.email}
                        </div>
                      )}
                      {tenant.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone size={14} />
                          {tenant.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {tenant.property_id && propertiesMap[tenant.property_id] ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Home size={14} className="text-gray-400" />
                        {propertiesMap[tenant.property_id].address}
                      </div>
                    ) : (
                      <span className="text-gray-400">No property</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {tenant.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/property-management/tenants/${tenant.id}`}>
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
