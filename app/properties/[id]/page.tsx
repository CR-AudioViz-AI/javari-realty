import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Home,
  Phone,
  Mail,
  Share2,
  Heart,
  Edit,
  DollarSign,
} from 'lucide-react'

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: property, error } = await supabase
    .from('properties')
    .select('*, profiles!listing_agent_id(first_name, last_name, phone, email, avatar_url, bio)')
    .eq('id', params.id)
    .single()

  if (error || !property) {
    notFound()
  }

  const agent = property.profiles

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const pricePerSqFt = property.square_feet 
    ? Math.round(property.price / property.square_feet)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listings
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">
                <Share2 className="w-5 h-5" />
              </button>
              <Link
                href={`/dashboard/properties/${params.id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos */}
            <div className="bg-white rounded-2xl overflow-hidden border">
              {property.photos?.length > 0 ? (
                <div className="aspect-video relative">
                  <img
                    src={property.photos[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.photos.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-lg">
                      +{property.photos.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Home className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="bg-white rounded-2xl p-6 border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatPrice(property.price)}
                  </p>
                  {pricePerSqFt && (
                    <p className="text-sm text-gray-500">${pricePerSqFt}/sqft</p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <Bed className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold">{property.bedrooms || '-'}</p>
                  <p className="text-xs text-gray-500">Beds</p>
                </div>
                <div className="text-center">
                  <Bath className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold">{property.bathrooms || '-'}</p>
                  <p className="text-xs text-gray-500">Baths</p>
                </div>
                <div className="text-center">
                  <Square className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold">{property.square_feet?.toLocaleString() || '-'}</p>
                  <p className="text-xs text-gray-500">Sq Ft</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold">{property.year_built || '-'}</p>
                  <p className="text-xs text-gray-500">Built</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="text-lg font-semibold mb-4">About This Property</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Features */}
            {property.features?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border">
                <h2 className="text-lg font-semibold mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-6 border">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Property Type</span>
                  <span className="font-medium">{property.property_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium capitalize">{property.status}</span>
                </div>
                {property.mls_number && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">MLS #</span>
                    <span className="font-medium">{property.mls_number}</span>
                  </div>
                )}
                {property.listed_date && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Listed</span>
                    <span className="font-medium">
                      {new Date(property.listed_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            {agent && (
              <div className="bg-white rounded-2xl p-6 border sticky top-24">
                <h3 className="font-semibold mb-4">Listed By</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {agent.first_name?.[0]}{agent.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {agent.first_name} {agent.last_name}
                    </p>
                    <p className="text-sm text-gray-500">Harvey Team - Premiere Plus</p>
                  </div>
                </div>

                {agent.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {agent.bio}
                  </p>
                )}

                <div className="space-y-2">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{agent.phone}</span>
                    </a>
                  )}
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 truncate">{agent.email}</span>
                    </a>
                  )}
                </div>

                <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
                  Request Showing
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-3">Interested?</h3>
              <p className="text-sm text-slate-300 mb-4">
                Schedule a private showing or get more information about this property.
              </p>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-white text-slate-900 font-medium rounded-lg hover:bg-gray-100 transition">
                  Schedule Tour
                </button>
                <button className="w-full px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition border border-white/20">
                  Ask a Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
