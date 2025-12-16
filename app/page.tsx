'use client'

import Link from 'next/link'
import {
  Home, Search, TrendingUp, Users, Award, Star, ChevronRight,
  MapPin, Phone, Mail, Building2, Shield, Clock, CheckCircle,
  ArrowRight, Play, Sparkles
} from 'lucide-react'

const FEATURED_PROPERTIES = [
  {
    id: '1',
    address: '2850 Winkler Ave',
    city: 'Fort Myers',
    price: 425000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    image: null
  },
  {
    id: '2',
    address: '1420 SE 47th St',
    city: 'Cape Coral',
    price: 389000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: null
  },
  {
    id: '3',
    address: '3500 Oasis Blvd',
    city: 'Cape Coral',
    price: 459000,
    beds: 4,
    baths: 2.5,
    sqft: 2650,
    image: null
  }
]

const STATS = [
  { label: 'Properties Sold', value: '500+', icon: Home },
  { label: 'Happy Clients', value: '1,200+', icon: Users },
  { label: 'Years Experience', value: '15+', icon: Award },
  { label: 'Markets Served', value: '7', icon: MapPin },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    text: 'Found our dream home in Cape Coral within 2 weeks. The team was incredibly responsive and knowledgeable about the area.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    text: 'Sold our house above asking price in just 5 days. The marketing strategy and photography were top-notch.',
    rating: 5
  },
  {
    name: 'Lisa Rodriguez',
    text: 'As first-time buyers, we appreciated the patience and guidance throughout the entire process. Highly recommend!',
    rating: 5
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Find Your Perfect Home in{' '}
              <span className="text-amber-400">Southwest Florida</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover exceptional properties in Fort Myers, Cape Coral, and surrounding areas. 
              Your dream home is just a search away.
            </p>
            
            {/* Search Box */}
            <div className="bg-white rounded-xl p-4 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter city, ZIP, or address..."
                    className="w-full pl-10 pr-4 py-3 border rounded-lg text-gray-800"
                  />
                </div>
                <Link
                  href="/search"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold"
                >
                  <Search size={20} />
                  Search Homes
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/search?type=sale" className="text-blue-200 hover:text-white flex items-center gap-1">
                <ChevronRight size={16} /> Homes for Sale
              </Link>
              <Link href="/search?waterfront=true" className="text-blue-200 hover:text-white flex items-center gap-1">
                <ChevronRight size={16} /> Waterfront Properties
              </Link>
              <Link href="/search?new=true" className="text-blue-200 hover:text-white flex items-center gap-1">
                <ChevronRight size={16} /> New Construction
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="mx-auto mb-3 text-blue-600" size={32} />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600 mt-2">Hand-picked homes in prime locations</p>
            </div>
            <Link href="/search" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_PROPERTIES.map(property => (
              <div key={property.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Home className="text-blue-300" size={64} />
                </div>
                <div className="p-5">
                  <p className="text-2xl font-bold text-green-600">${property.price.toLocaleString()}</p>
                  <p className="font-semibold mt-1">{property.address}</p>
                  <p className="text-sm text-gray-500">{property.city}, FL</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                  <Link
                    href={`/search?property=${property.id}`}
                    className="mt-4 block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            <p className="text-gray-600 mt-2">Experience the difference with our premium services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-blue-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Market Expertise</h3>
              <p className="text-gray-600">Deep knowledge of Southwest Florida real estate trends and neighborhoods</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Trusted Service</h3>
              <p className="text-gray-600">Transparent, honest guidance throughout your buying or selling journey</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-amber-600" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Fast Results</h3>
              <p className="text-gray-600">Average 18 days on market for listings with our proven marketing strategy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Clients Say</h2>
            <p className="text-blue-200 mt-2">Real stories from real homeowners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-amber-400" size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-blue-100 mb-4">{testimonial.text}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you are buying, selling, or just exploring, we are here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <Search size={20} /> Search Properties
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 flex items-center justify-center gap-2"
              >
                <Building2 size={20} /> Agent Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">RealtorPro</h3>
              <p className="text-gray-400 text-sm">
                Your trusted partner in Southwest Florida real estate. Powered by CR AudioViz AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/search" className="block hover:text-white">Search Homes</Link>
                <Link href="/dashboard" className="block hover:text-white">Agent Dashboard</Link>
                <Link href="/dashboard/education" className="block hover:text-white">Education Center</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Areas We Serve</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Fort Myers, FL</p>
                <p>Cape Coral, FL</p>
                <p>Naples, FL</p>
                <p>Bonita Springs, FL</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2"><Phone size={14} /> (239) 555-0100</p>
                <p className="flex items-center gap-2"><Mail size={14} /> info@realtorpro.com</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> Fort Myers, FL 33916</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            2024 RealtorPro by CR AudioViz AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
