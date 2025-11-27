import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Eye, Building2, MapPin, DollarSign } from 'lucide-react'

export default async function PropertiesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get user profile to check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin' || profile?.is_admin

  // Admin sees all properties, agents see only their own
  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (!isAdmin) {
    query = query.eq('listing_agent_id', user.id)
  }

  const { data: properties } = await query

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'All Properties' : 'My Properties'}
          </h1>
          <p className="text-gray-600 mt-1">
            {properties?.length || 0} {properties?.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Properties Grid */}
      {!properties || properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first listing</p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => {
            const photos = property.photos as string[] | null
            const imageUrl = photos?.[0] || null

            return (
              <div
                key={property.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title || property.address}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : property.status === 'sold'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {property.status || 'draft'}
                    </span>
                  </div>
                  {property.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center text-blue-600 font-bold text-xl mb-2">
                    <DollarSign className="w-5 h-5" />
                    {property.price?.toLocaleString() || 'Price TBD'}
                    {property.transaction_type === 'rent' && (
                      <span className="text-sm font-normal text-gray-500">/mo</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {property.title || property.address}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {property.city}, {property.state} {property.zip_code}
                    </span>
                  </div>

                  {/* Property details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {property.bedrooms && (
                      <span>{property.bedrooms} beds</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} baths</span>
                    )}
                    {property.square_feet && (
                      <span>{property.square_feet.toLocaleString()} sqft</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
