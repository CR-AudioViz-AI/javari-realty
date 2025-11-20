import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export default async function PropertiesPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('realtor_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Link href="/dashboard/properties/new" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Property</span>
        </Link>
      </div>

      {!properties || properties.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="text-xl font-bold mb-2">No Properties Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first listing</p>
          <Link href="/dashboard/properties/new" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">${property.price?.toLocaleString()}</div>
                <div className="font-semibold mb-1">{property.address}</div>
                <div className="text-sm text-gray-600 mb-4">{property.city}, {property.state}</div>
                <div className="flex space-x-2">
                  <Link href={`/properties/${property.id}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </Link>
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-50 text-sm">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}