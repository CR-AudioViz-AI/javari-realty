import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit, MapPin, Bed, Bath, Square, Calendar, DollarSign,
  Home, Building2, Thermometer, Droplets, Car, Trees, CheckCircle
} from 'lucide-react'

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !property) notFound()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/dashboard/properties" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft size={20} /> Back to Properties
          </Link>
          <h1 className="text-2xl font-bold">{property.title || property.address}</h1>
          <p className="text-gray-600 flex items-center gap-1 mt-1">
            <MapPin size={16} /> {property.address}, {property.city}, {property.state} {property.zip_code}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/dashboard/properties/${params.id}/edit`}>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Edit size={18} /> Edit Property
            </button>
          </Link>
        </div>
      </div>

      {/* Price & Status */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-green-600">
              {property.listing_type === 'for_rent' || property.listing_type === 'for_lease'
                ? `${formatPrice(property.rent_amount || 0)}/mo`
                : formatPrice(property.price || 0)}
            </p>
            {property.listing_type !== 'for_sale' && property.security_deposit && (
              <p className="text-gray-600">Security Deposit: {formatPrice(property.security_deposit)}</p>
            )}
          </div>
          <div className="flex gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              property.status === 'active' ? 'bg-green-100 text-green-800' :
              property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              property.status === 'sold' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {property.listing_type?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Stats */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Property Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Bed className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Bath className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Square className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sq Ft</p>
                    <p className="font-semibold">{property.sqft.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {property.year_built && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year Built</p>
                    <p className="font-semibold">{property.year_built}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-lg mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
            </div>
          )}

          {/* Property Details */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Property Type</span>
                <span className="font-medium">{property.property_type?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{property.category}</span>
              </div>
              {property.lot_size && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Lot Size</span>
                  <span className="font-medium">{property.lot_size} acres</span>
                </div>
              )}
              {property.garage_spaces && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Garage</span>
                  <span className="font-medium">{property.garage_spaces} spaces</span>
                </div>
              )}
              {property.stories && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Stories</span>
                  <span className="font-medium">{property.stories}</span>
                </div>
              )}
              {property.construction && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Construction</span>
                  <span className="font-medium">{property.construction}</span>
                </div>
              )}
              {property.roof_type && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Roof</span>
                  <span className="font-medium">{property.roof_type}</span>
                </div>
              )}
              {property.cooling && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Cooling</span>
                  <span className="font-medium">{property.cooling}</span>
                </div>
              )}
              {property.heating && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Heating</span>
                  <span className="font-medium">{property.heating}</span>
                </div>
              )}
              {property.mls_id && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">MLS #</span>
                  <span className="font-medium">{property.mls_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          {(property.exterior_features?.length > 0 || property.interior_features?.length > 0) && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-lg mb-4">Features</h2>
              {property.exterior_features?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Exterior</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.exterior_features.map((f: string) => (
                      <span key={f} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        <CheckCircle size={14} /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {property.interior_features?.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Interior</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.interior_features.map((f: string) => (
                      <span key={f} className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                        <CheckCircle size={14} /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rooms */}
          {property.rooms?.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-lg mb-4">Room Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.rooms.map((room: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{room.type}</p>
                    {room.dimensions && <p className="text-sm text-gray-500">{room.dimensions}</p>}
                    {room.features && <p className="text-xs text-gray-400">{room.features}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href={`/dashboard/properties/${params.id}/edit`} className="block">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Edit size={18} /> Edit Property
                </button>
              </Link>
              <Link href={`/dashboard/share-listings?property=${params.id}`} className="block">
                <button className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50">
                  Share Listing
                </button>
              </Link>
              <Link href={`/dashboard/calendar?property=${params.id}`} className="block">
                <button className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50">
                  Schedule Showing
                </button>
              </Link>
            </div>
          </div>

          {/* Rental Info */}
          {(property.listing_type === 'for_rent' || property.listing_type === 'for_lease') && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-lg mb-4">Rental Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Rent</span>
                  <span className="font-medium">{formatPrice(property.rent_amount || 0)}/{property.rent_frequency || 'month'}</span>
                </div>
                {property.security_deposit && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Deposit</span>
                    <span className="font-medium">{formatPrice(property.security_deposit)}</span>
                  </div>
                )}
                {property.lease_term_months && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lease Term</span>
                    <span className="font-medium">{property.lease_term_months} months</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Pets</span>
                  <span className="font-medium">{property.pets_allowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Furnished</span>
                  <span className="font-medium">{property.furnished ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

          {/* HOA Info */}
          {property.hoa_fee && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-lg mb-4">HOA Information</h2>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">HOA Fee</span>
                <span className="font-medium">{formatPrice(property.hoa_fee)}/{property.hoa_frequency || 'month'}</span>
              </div>
            </div>
          )}

          {/* Listing Info */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p>Listed: {formatDate(property.created_at)}</p>
            {property.updated_at && property.updated_at !== property.created_at && (
              <p>Updated: {formatDate(property.updated_at)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
