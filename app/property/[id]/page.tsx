'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Square, Calendar,
  Car, Waves, Trees, Home, Phone, Mail, Clock, TrendingUp,
  ChevronLeft, ChevronRight, X, Check, Building2, Ruler
} from 'lucide-react'

// Same properties data
const PROPERTIES: Record<string, any> = {
  '1': {
    id: '1', mlsId: 'NAPLES-001',
    address: { full: '2850 Winkler Ave', city: 'Fort Myers', state: 'FL', zip: '33916' },
    price: 425000, beds: 4, baths: 3, sqft: 2400, yearBuilt: 2018, lotSize: '0.25 acres',
    propertyType: 'Single Family', status: 'Active', daysOnMarket: 14,
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80'
    ],
    description: 'Beautiful 4-bedroom, 3-bathroom home in desirable Fort Myers neighborhood. This stunning property features an open floor plan, modern kitchen with granite countertops and stainless steel appliances, spacious master suite with walk-in closet, and a sparkling pool. The home has been meticulously maintained and is move-in ready. Located near top-rated schools, shopping, and beaches.',
    features: ['Pool', 'Updated Kitchen', '2-Car Garage', 'Open Floor Plan', 'Granite Countertops', 'Stainless Appliances', 'Walk-in Closet', 'Impact Windows', 'Tile Flooring', 'Covered Lanai'],
    pricePerSqft: 177,
    agent: { name: 'Tony Harvey', phone: '(239) 777-0155', email: 'tony@listorbuyrealestate.com', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200' },
    school: { elementary: 'Orangewood Elementary', middle: 'Cypress Lake Middle', high: 'Cypress Lake High' },
    taxes: 4850, hoa: 0, source: 'MLS', virtualTour: null
  }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params?.id as string || '1'
  const property = PROPERTIES[id] || PROPERTIES['1']
  
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  const nextPhoto = () => setCurrentPhoto((prev) => (prev + 1) % property.photos.length)
  const prevPhoto = () => setCurrentPhoto((prev) => (prev - 1 + property.photos.length) % property.photos.length)

  // Mortgage Calculator
  const calculateMortgage = (price: number, downPercent: number = 20, rate: number = 6.5, years: number = 30) => {
    const principal = price * (1 - downPercent / 100)
    const monthlyRate = rate / 100 / 12
    const numPayments = years * 12
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    return Math.round(payment)
  }

  const monthlyPayment = calculateMortgage(property.price)
  const monthlyTax = Math.round(property.taxes / 12)
  const monthlyInsurance = Math.round(property.price * 0.003 / 12)
  const totalMonthly = monthlyPayment + monthlyTax + monthlyInsurance + (property.hoa || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/search" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={property.photos[currentPhoto]}
              alt={`Property photo ${currentPhoto + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowGallery(true)}
            />
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
              {currentPhoto + 1} / {property.photos.length} Photos
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 p-4 overflow-x-auto">
            {property.photos.map((photo: string, i: number) => (
              <img
                key={i}
                src={photo}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setCurrentPhoto(i)}
                className={`w-24 h-16 object-cover rounded cursor-pointer ${i === currentPhoto ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price & Address */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  property.status === 'Active' ? 'bg-green-100 text-green-800' :
                  property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {property.status}
                </span>
                <span className="text-gray-500">MLS# {property.mlsId}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                ${property.price.toLocaleString()}
              </h1>
              <p className="text-xl text-gray-600 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {property.address.full}, {property.address.city}, {property.address.state} {property.address.zip}
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-4 gap-4 bg-white rounded-xl p-6 shadow">
              <div className="text-center">
                <Bed className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{property.beds}</div>
                <div className="text-gray-500">Bedrooms</div>
              </div>
              <div className="text-center">
                <Bath className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{property.baths}</div>
                <div className="text-gray-500">Bathrooms</div>
              </div>
              <div className="text-center">
                <Square className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{property.sqft.toLocaleString()}</div>
                <div className="text-gray-500">Sq Ft</div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{property.yearBuilt}</div>
                <div className="text-gray-500">Year Built</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold mb-4">About This Home</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schools */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-bold mb-4">Nearby Schools</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{property.school.elementary}</div>
                    <div className="text-sm text-gray-500">Elementary School</div>
                  </div>
                  <div className="text-green-600 font-bold">A</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{property.school.middle}</div>
                    <div className="text-sm text-gray-500">Middle School</div>
                  </div>
                  <div className="text-green-600 font-bold">B+</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{property.school.high}</div>
                    <div className="text-sm text-gray-500">High School</div>
                  </div>
                  <div className="text-green-600 font-bold">A-</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent Card */}
            <div className="bg-white rounded-xl p-6 shadow sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-lg">{property.agent.name}</div>
                  <div className="text-gray-500">Premiere Plus Realty</div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <a href={`tel:${property.agent.phone}`} className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <Phone className="w-5 h-5" />
                  {property.agent.phone}
                </a>
                <a href={`mailto:${property.agent.email}`} className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
                  <Mail className="w-5 h-5" />
                  Email Agent
                </a>
              </div>

              <button
                onClick={() => setShowContactForm(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Request a Tour
              </button>
            </div>

            {/* Mortgage Calculator */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-bold text-lg mb-4">Monthly Payment Estimate</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ${totalMonthly.toLocaleString()}/mo
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Principal & Interest</span>
                  <span>${monthlyPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Property Tax</span>
                  <span>${monthlyTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Insurance</span>
                  <span>${monthlyInsurance.toLocaleString()}</span>
                </div>
                {property.hoa > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">HOA</span>
                    <span>${property.hoa}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Based on 20% down, 6.5% rate, 30-year fixed
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-bold text-lg mb-4">Market Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{property.daysOnMarket} days</div>
                    <div className="text-sm text-gray-500">on market</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">${property.pricePerSqft}/sqft</div>
                    <div className="text-sm text-gray-500">price per sqft</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/40"
          >
            <X className="w-8 h-8 text-white" />
          </button>
          <button onClick={prevPhoto} className="absolute left-4 p-3 bg-white/20 rounded-full hover:bg-white/40">
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <img
            src={property.photos[currentPhoto]}
            alt={`Photo ${currentPhoto + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button onClick={nextPhoto} className="absolute right-4 p-3 bg-white/20 rounded-full hover:bg-white/40">
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
          <div className="absolute bottom-4 text-white">
            {currentPhoto + 1} / {property.photos.length}
          </div>
        </div>
      )}
    </div>
  )
}
