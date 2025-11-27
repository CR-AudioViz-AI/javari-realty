import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, MapPin, Bed, Bath, Square, TrendingUp, Shield, Zap, Users } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = createClient()
  
  // Get featured properties
  const { data: featuredProperties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  // Get property stats
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: totalRealtors } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'agent')
    .eq('active', true)

  async function handleSearch(formData: FormData) {
    'use server'
    const location = formData.get('location')
    const propertyType = formData.get('propertyType')
    const priceMin = formData.get('priceMin')
    const priceMax = formData.get('priceMax')
    
    const params = new URLSearchParams()
    if (location) params.set('location', location.toString())
    if (propertyType && propertyType !== 'any') params.set('type', propertyType.toString())
    if (priceMin) params.set('min', priceMin.toString())
    if (priceMax) params.set('max', priceMax.toString())
    
    redirect(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CR</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CR Realtor Platform
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Search Homes
              </Link>
              <Link href="/agents" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Find Agents
              </Link>
              <Link href="/mortgage-calculator" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Calculators
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Resources
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup?role=realtor" 
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Join as Realtor
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Home in Florida
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10">
              {totalProperties?.toLocaleString() || '1000+'} properties • {totalRealtors || '50+'} expert agents • AI-powered search
            </p>

            {/* Search Form */}
            <form action={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Location Input */}
                <div className="md:col-span-5 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    placeholder="City, neighborhood, or ZIP code"
                    className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                  />
                </div>

                {/* Property Type */}
                <div className="md:col-span-3">
                  <select
                    name="propertyType"
                    className="w-full px-4 py-4 text-gray-900 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition appearance-none"
                  >
                    <option value="any">Any Type</option>
                    <option value="single_family">Single Family</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="multi_family">Multi-Family</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <select
                    name="priceMax"
                    className="w-full px-4 py-4 text-gray-900 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition appearance-none"
                  >
                    <option value="">Any Price</option>
                    <option value="250000">$250K</option>
                    <option value="500000">$500K</option>
                    <option value="750000">$750K</option>
                    <option value="1000000">$1M</option>
                    <option value="2000000">$2M+</option>
                  </select>
                </div>

                {/* Search Button */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Link href="/search?type=single_family" className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  Single Family Homes
                </Link>
                <Link href="/search?type=condo" className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  Condos
                </Link>
                <Link href="/search?location=Naples" className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  Naples
                </Link>
                <Link href="/search?location=Fort Myers" className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  Fort Myers
                </Link>
                <Link href="/search?location=Cape Coral" className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  Cape Coral
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Search</h3>
              <p className="text-gray-600">
                Our Javari AI helps you find the perfect property faster with intelligent recommendations
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Realtors</h3>
              <p className="text-gray-600">
                Connect with top-rated local agents who know your market inside and out
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Transparent</h3>
              <p className="text-gray-600">
                Complete transparency, no hidden fees, and your data is always protected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties && featuredProperties.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
                <p className="text-gray-600">Handpicked listings from trusted realtors</p>
              </div>
              <Link 
                href="/search" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property: any) => (
                <Link 
                  key={property.id} 
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                >
                  {/* Property Image */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    {property.photos && property.photos[0] ? (
                      <img 
                        src={property.photos[0]} 
                        alt={property.address}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      {property.status === 'active' ? 'For Sale' : property.status}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ${property.price?.toLocaleString()}
                      {property.listing_type === 'rent' && <span className="text-base text-gray-500">/mo</span>}
                    </div>

                    <div className="text-gray-900 font-semibold mb-1">{property.address}</div>
                    <div className="text-gray-600 text-sm mb-4">
                      {property.city}, {property.state} {property.zip_code}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {property.bedrooms && (
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center space-x-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                      )}
                      {property.square_feet && (
                        <div className="flex items-center space-x-1">
                          <Square className="w-4 h-4" />
                          <span>{property.square_feet.toLocaleString()} sqft</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* For Realtors CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Are You a Realtor?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the platform built FOR realtors. AI-powered tools, no lead theft, and complete data ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup?role=realtor"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:shadow-2xl transition-all"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/for-realtors"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
                <span className="text-white font-bold">CR Realtor Platform</span>
              </div>
              <p className="text-sm">
                The future of real estate. AI-powered, realtor-first, and built for success.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Buyers</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search" className="hover:text-white transition">Search Homes</Link></li>
                <li><Link href="/agents" className="hover:text-white transition">Find an Agent</Link></li>
                <li><Link href="/mortgage-calculator" className="hover:text-white transition">Mortgage Calculator</Link></li>
                <li><Link href="/resources/buyers-guide" className="hover:text-white transition">Buyer's Guide</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Realtors</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/for-realtors" className="hover:text-white transition">Why Join Us</Link></li>
                <li><Link href="/auth/signup?role=realtor" className="hover:text-white transition">Sign Up</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2025 CR AudioViz AI, LLC. All rights reserved. | Fort Myers, Florida</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

