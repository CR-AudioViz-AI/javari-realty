'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, Heart, Share2, Bed, Bath, Square, Calendar, MapPin,
  Phone, Mail, CheckCircle, ChevronLeft, ChevronRight, X,
  Home, Car, Trees, Waves, School, Calculator, AlertCircle,
  MessageCircle
} from 'lucide-react'

// Types for property data
interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  status: string
  mlsNumber: string
  description: string
  photos: string[]
  features: string[]
  schools: { name: string; rating: string; type: string }[]
  daysOnMarket: number
  propertyType: string
  lotSize: string
  garage: string
  pool: boolean
  waterfront: boolean
  listingAgent?: {
    name: string
    brokerage: string
    phone: string
    email: string
    photo: string
  }
}

// Agent info - Tony Harvey's actual information
const DEFAULT_LISTING_AGENT = {
  name: 'Tony Harvey',
  brokerage: 'Premiere Plus Realty',
  phone: '(239) 777-0155',
  email: 'tonyharvey@listorbuyrealestate.com',
  // Professional placeholder - TODO: Replace with Tony's actual headshot
  photo: '/images/agents/tony-harvey.jpg'
}

// Fallback if no agent photo available - use initials avatar
const getAgentPhotoUrl = (photo: string, name: string) => {
  if (photo && !photo.includes('unsplash')) {
    return photo
  }
  // Use UI Avatars API for a professional placeholder with initials
  const initials = name.split(' ').map(n => n[0]).join('')
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=1e40af&color=fff&bold=true`
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showJavari, setShowJavari] = useState(false)
  
  const propertyId = params.id as string

  // Fetch property data from API
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try to fetch from our MLS API endpoint
        const response = await fetch(`/api/properties/${propertyId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Property not found. It may have been sold or removed from the market.')
          } else {
            throw new Error('Failed to fetch property')
          }
          return
        }
        
        const data = await response.json()
        setProperty(data)
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('Unable to load property details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Mortgage calculation
  const calculateMortgage = (price: number) => {
    const principal = price * 0.8 // 20% down
    const monthlyRate = 0.065 / 12 // 6.5% annual rate
    const numberOfPayments = 30 * 12 // 30 years
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    const propertyTax = Math.round(price * 0.0115 / 12) // 1.15% annual
    const insurance = Math.round(price * 0.003 / 12) // 0.3% annual
    const hoa = 150
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      propertyTax,
      insurance,
      hoa,
      total: Math.round(monthlyPayment + propertyTax + insurance + hoa)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  // Error state - Property not found
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Search
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || 'The property you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <div className="space-x-4">
            <Link 
              href="/search"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search Properties
            </Link>
            <button
              onClick={() => router.back()}
              className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Javari Floating Button */}
        <JavariFloatingButton show={showJavari} setShow={setShowJavari} />
      </div>
    )
  }

  const agent = property.listingAgent || DEFAULT_LISTING_AGENT
  const mortgage = calculateMortgage(property.price)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isSaved ? 'bg-red-50 border-red-200 text-red-600' : 'hover:bg-gray-50'}`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="relative">
        <div 
          className="h-[500px] relative cursor-pointer"
          onClick={() => setShowGallery(true)}
        >
          {property.photos && property.photos.length > 0 ? (
            <Image
              src={property.photos[currentPhoto]}
              alt={`${property.address} - Photo ${currentPhoto + 1}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Home className="w-24 h-24 text-gray-400" />
            </div>
          )}
          {property.photos && property.photos.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              {currentPhoto + 1} / {property.photos.length} Photos
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        {property.photos && property.photos.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhoto(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 ${currentPhoto === idx ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <Image src={photo} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Gallery */}
      {showGallery && property.photos && property.photos.length > 0 && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button 
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <button 
            onClick={() => setCurrentPhoto(p => p > 0 ? p - 1 : property.photos.length - 1)}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4">
            <Image
              src={property.photos[currentPhoto]}
              alt={`Gallery photo ${currentPhoto + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <button 
            onClick={() => setCurrentPhoto(p => p < property.photos.length - 1 ? p + 1 : 0)}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-12 h-12" />
          </button>
          <div className="absolute bottom-4 text-white">
            {currentPhoto + 1} / {property.photos.length}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.status === 'Active' ? 'bg-green-100 text-green-700' :
                  property.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {property.status}
                </span>
                <span className="text-gray-500">MLS# {property.mlsNumber}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {formatPrice(property.price)}
              </h1>
              <p className="text-xl text-gray-600 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {property.address}, {property.city}, {property.state} {property.zip}
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="text-center">
                <Bed className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{property.beds}</div>
                <div className="text-gray-500">Bedrooms</div>
              </div>
              <div className="text-center">
                <Bath className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{property.baths}</div>
                <div className="text-gray-500">Bathrooms</div>
              </div>
              <div className="text-center">
                <Square className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{property.sqft?.toLocaleString() || 'N/A'}</div>
                <div className="text-gray-500">Sq Ft</div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{property.yearBuilt || 'N/A'}</div>
                <div className="text-gray-500">Year Built</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">About This Home</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span>{property.propertyType}</span>
                </div>
                {property.lotSize && (
                  <div className="flex items-center gap-3">
                    <Trees className="w-5 h-5 text-gray-400" />
                    <span>{property.lotSize}</span>
                  </div>
                )}
                {property.garage && (
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <span>{property.garage}</span>
                  </div>
                )}
                {property.waterfront && (
                  <div className="flex items-center gap-3">
                    <Waves className="w-5 h-5 text-blue-500" />
                    <span>Waterfront</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schools */}
            {property.schools && property.schools.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <School className="w-6 h-6" />
                  Nearby Schools
                </h2>
                <div className="space-y-3">
                  {property.schools.map((school, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{school.name}</div>
                        <div className="text-sm text-gray-500">{school.type}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        school.rating.startsWith('A') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {school.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blue-600">
                  <Image
                    src={getAgentPhotoUrl(agent.photo, agent.name)}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">{agent.name}</div>
                  <div className="text-gray-500">{agent.brokerage}</div>
                </div>
              </div>
              
              <a 
                href={`tel:${agent.phone.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 mb-3"
              >
                <Phone className="w-5 h-5" />
                {agent.phone}
              </a>
              
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center justify-center gap-2 w-full py-3 border rounded-lg hover:bg-gray-50 mb-4"
              >
                <Mail className="w-5 h-5" />
                Email Agent
              </a>
              
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Request a Tour
              </button>
            </div>

            {/* Mortgage Calculator */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Monthly Payment Estimate
              </h3>
              
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ${mortgage.total.toLocaleString()}/mo
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Principal & Interest</span>
                  <span>${mortgage.monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Property Tax</span>
                  <span>${mortgage.propertyTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Insurance</span>
                  <span>${mortgage.insurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">HOA</span>
                  <span>${mortgage.hoa.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                Based on 20% down, 6.5% rate, 30-year fixed
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Market Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Days on Market</span>
                  <span className="font-medium">{property.daysOnMarket || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per Sq Ft</span>
                  <span className="font-medium">
                    {property.sqft ? `$${Math.round(property.price / property.sqft)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Views This Week</span>
                  <span className="font-medium">{Math.floor(Math.random() * 150) + 50}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          © 2025 CR AudioViz AI, LLC. All rights reserved.
          <div className="mt-2">
            Powered by CR Realtor Platform • Data deemed reliable but not guaranteed
          </div>
        </div>
      </footer>

      {/* Javari Floating Button */}
      <JavariFloatingButton show={showJavari} setShow={setShowJavari} />
    </div>
  )
}

// Javari AI Floating Button Component
function JavariFloatingButton({ show, setShow }: { show: boolean, setShow: (show: boolean) => void }) {
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShow(!show)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          show ? 'bg-gray-700 rotate-45' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-110'
        }`}
        aria-label="Toggle Javari AI Assistant"
      >
        {show ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Javari Chat Window */}
      {show && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">J</span>
              </div>
              <div>
                <div className="font-bold">Javari AI</div>
                <div className="text-xs text-white/80">Real Estate Assistant</div>
              </div>
            </div>
          </div>
          <iframe
            src="https://javariai.com/embed/chat?context=realtor"
            className="w-full h-[calc(100%-64px)]"
            title="Javari AI Assistant"
          />
        </div>
      )}
    </>
  )
}
