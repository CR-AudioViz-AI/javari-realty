import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Calendar, DollarSign, Home, Phone, Mail, Share2, Heart, ChevronLeft } from 'lucide-react'

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      profiles:realtor_id (
        full_name,
        email,
        phone,
        avatar_url
      )
    `)
    .eq('id', params.id)
    .single()
  
  if (error || !property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/search" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Photo Gallery */}
      <div className="bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-4 gap-2 h-[600px]">
            {property.photos && property.photos.length > 0 ? (
              <>
                <div className="col-span-2 row-span-2">
                  <img src={property.photos[0]} alt="Main" className="w-full h-full object-cover" />
                </div>
                {property.photos.slice(1, 5).map((photo: string, i: number) => (
                  <div key={i} className={i < 2 ? "col-span-1" : "col-span-1"}>
                    <img src={photo} alt={`Photo ${i+2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-4 flex items-center justify-center bg-gray-200">
                <MapPin className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    ${property.price?.toLocaleString()}
                    {property.listing_type === 'rent' && <span className="text-2xl text-gray-500">/mo</span>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.address}</h1>
                  <p className="text-gray-600">{property.city}, {property.state} {property.zip_code}</p>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {property.status === 'active' ? 'For Sale' : property.status}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold">{property.bedrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold">{property.bathrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                    <Square className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold">{property.square_feet?.toLocaleString() || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-1">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold">{property.property_type?.replace('_', ' ') || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">About This Property</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.year_built && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-semibold">{property.year_built}</span>
                  </div>
                )}
                {property.lot_size && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Lot Size</span>
                    <span className="font-semibold">{property.lot_size} sqft</span>
                  </div>
                )}
                {property.parking_spaces && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Parking</span>
                    <span className="font-semibold">{property.parking_spaces} spaces</span>
                  </div>
                )}
                {property.hoa_fee && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">HOA Fee</span>
                    <span className="font-semibold">${property.hoa_fee}/mo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
              
              {property.profiles && (
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center space-x-3 mb-4">
                    {property.profiles.avatar_url ? (
                      <img src={property.profiles.avatar_url} alt={property.profiles.full_name} className="w-16 h-16 rounded-full" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {property.profiles.full_name?.charAt(0) || 'A'}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{property.profiles.full_name || 'Real Estate Agent'}</div>
                      <div className="text-sm text-gray-600">Licensed Realtor</div>
                    </div>
                  </div>
                  
                  {property.profiles.phone && (
                    <a href={`tel:${property.profiles.phone}`} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 mb-2">
                      <Phone className="w-4 h-4" />
                      <span>{property.profiles.phone}</span>
                    </a>
                  )}
                  
                  {property.profiles.email && (
                    <a href={`mailto:${property.profiles.email}`} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                      <Mail className="w-4 h-4" />
                      <span>{property.profiles.email}</span>
                    </a>
                  )}
                </div>
              )}

              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="tel" placeholder="Your Phone" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <textarea placeholder="Message (optional)" rows={4} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  Request Information
                </button>
                <button type="button" className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">
                  Schedule Tour
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
