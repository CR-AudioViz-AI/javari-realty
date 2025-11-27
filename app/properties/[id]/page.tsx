import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Calendar, DollarSign, Home, Phone, Mail, Share2, Heart, ChevronLeft, Building2, Factory, Check } from 'lucide-react'

export const revalidate = 60

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      agent:profiles!listing_agent_id (
        id,
        first_name,
        last_name,
        email,
        phone,
        avatar_url,
        bio,
        license_number,
        specialties
      )
    `)
    .eq('id', params.id)
    .single()
  
  if (error || !property) {
    notFound()
  }

  const agent = property.agent as {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    avatar_url: string | null
    bio: string | null
    license_number: string | null
    specialties: string[] | null
  } | null

  const agentName = agent ? `${agent.first_name} ${agent.last_name}` : 'Unknown Agent'
  const photos = property.photos as string[] | null
  const features = property.features as string[] | null
  const amenities = property.amenities as string[] | null

  const formatPrice = (price: number, transactionType: string) => {
    if (transactionType === 'rent') {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/properties" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Listings</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Photo Gallery */}
      <div className="bg-black">
        <div className="container mx-auto">
          {photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-[500px] overflow-hidden">
              <div className="md:row-span-2">
                <img
                  src={photos[0]}
                  alt={property.title || property.address}
                  className="w-full h-full object-cover"
                />
              </div>
              {photos.slice(1, 3).map((photo, i) => (
                <div key={i} className="hidden md:block">
                  <img
                    src={photo}
                    alt={`${property.title || property.address} - ${i + 2}`}
                    className="w-full h-[249px] object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <Home className="w-24 h-24 text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  property.transaction_type === 'rent' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {property.transaction_type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {property.category}
                </span>
                {property.featured && (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.title || property.address}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.address}, {property.city}, {property.state} {property.zip_code}</span>
              </div>
              
              <div className="text-4xl font-bold text-blue-600">
                {formatPrice(property.price, property.transaction_type)}
              </div>
            </div>

            {/* Quick Stats */}
            {property.category === 'residential' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-xl border border-gray-200">
                {property.bedrooms && (
                  <div className="text-center">
                    <Bed className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <Bath className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                  </div>
                )}
                {property.square_feet && (
                  <div className="text-center">
                    <Square className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900">{property.square_feet.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Sq Ft</p>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900">{property.year_built}</p>
                    <p className="text-sm text-gray-500">Year Built</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Features */}
            {features && features.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.property_type && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Property Type</span>
                    <span className="font-medium text-gray-900 capitalize">{property.property_type.replace('_', ' ')}</span>
                  </div>
                )}
                {property.mls_number && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">MLS #</span>
                    <span className="font-medium text-gray-900">{property.mls_number}</span>
                  </div>
                )}
                {property.lot_size && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Lot Size</span>
                    <span className="font-medium text-gray-900">{property.lot_size} acres</span>
                  </div>
                )}
                {property.county && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">County</span>
                    <span className="font-medium text-gray-900">{property.county}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Agent Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Listed By</h2>
              
              {agent ? (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {agent.first_name?.[0]}{agent.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{agentName}</p>
                      {agent.license_number && (
                        <p className="text-sm text-gray-500">License: {agent.license_number}</p>
                      )}
                    </div>
                  </div>

                  {agent.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{agent.bio}</p>
                  )}

                  <div className="space-y-3 mb-6">
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                      >
                        <Phone className="w-5 h-5" />
                        <span>{agent.phone}</span>
                      </a>
                    )}
                    {agent.email && (
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="truncate">{agent.email}</span>
                      </a>
                    )}
                  </div>

                  <div className="space-y-3">
                    <a
                      href={`tel:${agent.phone || ''}`}
                      className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                    <a
                      href={`mailto:${agent.email || ''}?subject=Inquiry about ${property.title || property.address}`}
                      className="w-full py-3 px-4 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Send Email
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Agent information not available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} CR AudioViz AI, LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
