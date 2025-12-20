'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Bed, Bath, Square, MapPin, Calendar, Home, 
  Heart, Share2, Phone, Mail, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Car, Waves, Trees
} from 'lucide-react'

interface PropertyDetail {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt?: number
  propertyType: string
  status: string
  photos: string[]
  description?: string
  mlsNumber?: string
  daysOnMarket?: number
  lotSize?: string
  garage?: number
  pool?: boolean
  waterfront?: boolean
  source: string
  features?: string[]
  listingAgent?: {
    name: string
    phone?: string
    email?: string
    brokerage?: string
    photo?: string
  }
  schools?: Array<{
    name: string
    type: string
    rating: number
    distance: string
  }>
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
]

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params?.id as string
  
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (!propertyId) return

    const fetchProperty = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/mls/property/${propertyId}`)
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setProperty(null)
        } else {
          setProperty(data.property)
        }
      } catch (err) {
        console.error('Property fetch error:', err)
        setError('Failed to load property details')
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getPhotos = () => {
    if (property?.photos && property.photos.length > 0) {
      return property.photos.filter(p => p && p.length > 0)
    }
    return PLACEHOLDER_IMAGES
  }

  const photos = property ? getPhotos() : PLACEHOLDER_IMAGES

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </Link>
          
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h1>
            <p className="text-gray-500 mb-6">
              {error || 'Property not found. It may have been sold or removed from the market.'}
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/search"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search Properties
              </Link>
              <button 
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/search" className="inline-flex items-center text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="relative bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={photos[currentImageIndex] || PLACEHOLDER_IMAGES[0]}
              alt={`${property.address} - Photo ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </>
            )}

            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 text-sm font-medium rounded ${
                property.status === 'for_sale' || property.status?.toLowerCase() === 'active'
                  ? 'bg-green-500 text-white'
                  : property.status?.toLowerCase() === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {property.status === 'for_sale' ? 'For Sale' : property.status}
              </span>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              <button className="p-2 bg-white/90 rounded-full hover:bg-white shadow-lg">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {photos.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-gray-900">
              {photos.slice(0, 10).map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-14 flex-shrink-0 rounded overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={photo || PLACEHOLDER_IMAGES[0]}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
              {photos.length > 10 && (
                <div className="w-20 h-14 flex-shrink-0 rounded bg-gray-700 flex items-center justify-center text-white text-sm">
                  +{photos.length - 10} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-green-600 mb-2">
                    {formatPrice(property.price)}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">
                      {property.address}, {property.city}, {property.state} {property.zip}
                    </span>
                  </div>
                </div>
                
                {property.mlsNumber && (
                  <div className="text-right text-sm text-gray-500">
                    MLS# {property.mlsNumber}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-800">{property.beds}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bath className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-800">{property.baths}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Square className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-800">{property.sqft?.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-800">{property.yearBuilt || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Year Built</div>
                </div>
              </div>
            </div>

            {property.description && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{property.propertyType}</span>
                </div>
                {property.lotSize && (
                  <div className="flex items-center gap-2">
                    <Trees className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Lot: {property.lotSize}</span>
                  </div>
                )}
                {property.garage && (
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{property.garage} Car Garage</span>
                  </div>
                )}
                {property.pool && (
                  <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-600">Pool</span>
                  </div>
                )}
                {property.waterfront && (
                  <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-600">Waterfront</span>
                  </div>
                )}
                {property.daysOnMarket && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{property.daysOnMarket} Days on Market</span>
                  </div>
                )}
              </div>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.schools && property.schools.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Nearby Schools</h2>
                <div className="space-y-3">
                  {property.schools.map((school, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-800">{school.name}</div>
                        <div className="text-sm text-gray-500">{school.type}</div>
                      </div>
                      <div className="text-right">
                        {school.rating && (
                          <div className="text-blue-600 font-medium">{school.rating}/10</div>
                        )}
                        {school.distance && (
                          <div className="text-sm text-gray-500">{school.distance}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Listing Agent</h2>
              <div className="flex items-center gap-4 mb-4">
                {property.listingAgent?.photo ? (
                  <Image
                    src={property.listingAgent.photo}
                    alt={property.listingAgent.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {property.listingAgent?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-800">
                    {property.listingAgent?.name || 'Listing Agent'}
                  </div>
                  {property.listingAgent?.brokerage && (
                    <div className="text-sm text-gray-500">{property.listingAgent.brokerage}</div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {property.listingAgent?.phone && (
                  <a
                    href={`tel:${property.listingAgent.phone}`}
                    className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 justify-center"
                  >
                    <Phone className="w-5 h-5" />
                    Call Agent
                  </a>
                )}
                {property.listingAgent?.email && (
                  <a
                    href={`mailto:${property.listingAgent.email}`}
                    className="flex items-center gap-3 p-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 justify-center"
                  >
                    <Mail className="w-5 h-5" />
                    Email Agent
                  </a>
                )}
                <button className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Schedule Tour
                </button>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Data provided by</div>
              <div className="font-medium text-gray-700">{property.source}</div>
              <div className="text-xs text-gray-400 mt-2">
                Information deemed reliable but not guaranteed
              </div>
            </div>

            {property.sqft > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-2">Price per Sq Ft</h3>
                <div className="text-2xl font-bold text-green-600">
                  ${Math.round(property.price / property.sqft)}/sqft
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
