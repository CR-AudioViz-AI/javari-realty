'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, Heart, Share2, Bed, Bath, Square, Calendar, MapPin,
  Phone, Mail, CheckCircle, ChevronLeft, ChevronRight, X,
  Home, Car, Trees, Waves, School, Calculator
} from 'lucide-react'

// Sample properties with real photos - in production, this comes from MLS API
const PROPERTIES: Record<string, {
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
}> = {
  '1': {
    id: '1',
    address: '2850 Winkler Ave',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33916',
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    yearBuilt: 2018,
    status: 'Active',
    mlsNumber: 'NAPLES-001',
    description: 'Beautiful 4-bedroom, 3-bathroom home in desirable Fort Myers neighborhood. This stunning property features an open floor plan, modern kitchen with granite countertops and stainless steel appliances, spacious master suite with walk-in closet, and a sparkling pool. The home has been meticulously maintained and is move-in ready. Located near top-rated schools, shopping, and beaches.',
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop'
    ],
    features: ['Pool', 'Updated Kitchen', 'Walk-in Closets', 'Granite Countertops', 'Stainless Appliances', 'Tile Floors', 'Hurricane Shutters', 'Covered Lanai'],
    schools: [
      { name: 'Sunshine Elementary', rating: 'A', type: 'Elementary' },
      { name: 'Fort Myers Middle', rating: 'B+', type: 'Middle' },
      { name: 'Fort Myers High', rating: 'A-', type: 'High' }
    ],
    daysOnMarket: 12,
    propertyType: 'Single Family',
    lotSize: '0.25 acres',
    garage: '2-car attached',
    pool: true,
    waterfront: false
  },
  '2': {
    id: '2',
    address: '1540 SW 52nd Terrace',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33914',
    price: 389000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    yearBuilt: 2015,
    status: 'Active',
    mlsNumber: 'CAPE-002',
    description: 'Charming 3-bedroom home in prime Cape Coral location with Gulf access canal. Perfect for boating enthusiasts. Features modern finishes throughout, updated kitchen, and a private dock. Low HOA fees and close to shopping and dining.',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop'
    ],
    features: ['Gulf Access', 'Private Dock', 'Updated Kitchen', 'Tile Floors', 'Impact Windows', 'Boat Lift'],
    schools: [
      { name: 'Cape Elementary', rating: 'A', type: 'Elementary' },
      { name: 'Cape Middle', rating: 'A-', type: 'Middle' },
      { name: 'Cape Coral High', rating: 'B+', type: 'High' }
    ],
    daysOnMarket: 8,
    propertyType: 'Single Family',
    lotSize: '0.20 acres',
    garage: '2-car attached',
    pool: false,
    waterfront: true
  },
  '3': {
    id: '3',
    address: '8745 Coastline Ct Unit 201',
    city: 'Naples',
    state: 'FL',
    zip: '34108',
    price: 1250000,
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    yearBuilt: 2020,
    status: 'Active',
    mlsNumber: 'NAP-003',
    description: 'Stunning luxury residence in prestigious Naples community. This exceptional home features marble floors, gourmet kitchen with Viking appliances, wine cellar, and resort-style pool with water features. Minutes to Vanderbilt Beach.',
    photos: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop'
    ],
    features: ['Marble Floors', 'Viking Appliances', 'Wine Cellar', 'Pool', 'Smart Home', 'Impact Glass', 'Gated Community'],
    schools: [
      { name: 'North Naples Middle', rating: 'A+', type: 'Middle' },
      { name: 'Barron Collier High', rating: 'A', type: 'High' }
    ],
    daysOnMarket: 21,
    propertyType: 'Single Family',
    lotSize: '0.45 acres',
    garage: '3-car attached',
    pool: true,
    waterfront: false
  }
}

// Agent info - configurable per deployment
const LISTING_AGENT = {
  name: 'Tony Harvey',
  brokerage: 'Premiere Plus Realty',
  phone: '(239) 777-0155',
  email: 'tonyharvey@listorbuyrealestate.com',
  // Using a professional placeholder - in production, upload actual headshot
  photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face'
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const propertyId = params.id as string
  const property = PROPERTIES[propertyId] || PROPERTIES['1']
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Mortgage calculation
  const calculateMortgage = () => {
    const principal = property.price * 0.8 // 20% down
    const monthlyRate = 0.065 / 12 // 6.5% annual rate
    const numberOfPayments = 30 * 12 // 30 years
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    const propertyTax = Math.round(property.price * 0.0115 / 12) // 1.15% annual
    const insurance = Math.round(property.price * 0.003 / 12) // 0.3% annual
    const hoa = 150
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      propertyTax,
      insurance,
      hoa,
      total: Math.round(monthlyPayment + propertyTax + insurance + hoa)
    }
  }

  const mortgage = calculateMortgage()

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
          <Image
            src={property.photos[currentPhoto]}
            alt={`${property.address} - Photo ${currentPhoto + 1}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
            {currentPhoto + 1} / {property.photos.length} Photos
          </div>
        </div>
        
        {/* Thumbnails */}
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
      </div>

      {/* Full Screen Gallery */}
      {showGallery && (
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
                <div className="text-2xl font-bold">{property.sqft.toLocaleString()}</div>
                <div className="text-gray-500">Sq Ft</div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{property.yearBuilt}</div>
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
                <div className="flex items-center gap-3">
                  <Trees className="w-5 h-5 text-gray-400" />
                  <span>{property.lotSize}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-400" />
                  <span>{property.garage}</span>
                </div>
                {property.waterfront && (
                  <div className="flex items-center gap-3">
                    <Waves className="w-5 h-5 text-blue-500" />
                    <span>Waterfront</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
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

            {/* Schools */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={LISTING_AGENT.photo}
                    alt={LISTING_AGENT.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">{LISTING_AGENT.name}</div>
                  <div className="text-gray-500">{LISTING_AGENT.brokerage}</div>
                </div>
              </div>
              
              <a 
                href={`tel:${LISTING_AGENT.phone.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 mb-3"
              >
                <Phone className="w-5 h-5" />
                {LISTING_AGENT.phone}
              </a>
              
              <a
                href={`mailto:${LISTING_AGENT.email}`}
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
                  <span className="font-medium">{property.daysOnMarket}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per Sq Ft</span>
                  <span className="font-medium">${Math.round(property.price / property.sqft)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Views This Week</span>
                  <span className="font-medium">124</span>
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
    </div>
  )
}
